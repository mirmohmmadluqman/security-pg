"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { BrowserProvider } from "ethers";
import { createSiweMessage } from "@/lib/auth";
import {
    connectWallet,
    getAddress,
    getChainId,
    switchToSepolia,
    subscribeToWalletEvents,
    SEPOLIA_CHAIN_ID,
} from "@/lib/wallet";

// ==================== TYPES ====================
interface WalletContextType {
    isConnected: boolean;
    isAuthenticated: boolean;
    address: string | null;
    chainId: number | null;
    isWrongNetwork: boolean;
    isLoading: boolean;
    completedModules: string[];
    connect: () => Promise<void>;
    login: () => Promise<void>;
    switchNetwork: () => Promise<void>;
    completeModule: (id: string) => void;
}

// ==================== CONTEXT ====================
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// ==================== PROVIDER ====================
export function WalletProvider({ children }: { children: ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [chainId, setChainId] = useState<number | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [completedModules, setCompletedModules] = useState<string[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);

    const isConnected = address !== null;
    const isWrongNetwork = chainId !== null && chainId !== SEPOLIA_CHAIN_ID;

    // Load progress and session from localStorage/API on mount
    useEffect(() => {
        const saved = localStorage.getItem("security_pg_progress");
        if (saved) {
            try {
                setCompletedModules(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse progress:", e);
            }
        }
        setIsInitialized(true);

        const checkSession = async () => {
            try {
                const res = await fetch("/api/auth/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated) {
                        setIsAuthenticated(true);
                        setAddress(data.address);
                    }
                }
            } catch (err) {
                console.error("Session check failed:", err);
            }
        };
        checkSession();
    }, []);

    // Robust Persistence: Sync to localStorage
    useEffect(() => {
        if (isInitialized && completedModules.length > 0) {
            localStorage.setItem("security_pg_progress", JSON.stringify(completedModules));
        }
    }, [completedModules, isInitialized]);

    const completeModule = useCallback((id: string) => {
        setCompletedModules(prev => {
            if (prev.includes(id)) return prev;
            return [...prev, id];
        });
    }, []);

    const checkWallet = useCallback(async () => {
        const addr = await getAddress();
        const chain = await getChainId();
        setAddress(addr);
        setChainId(chain);
    }, []);

    useEffect(() => {
        checkWallet();
        const unsubscribe = subscribeToWalletEvents(checkWallet);
        return unsubscribe;
    }, [checkWallet]);

    const connect = async () => {
        setIsLoading(true);
        try {
            const addr = await connectWallet();
            setAddress(addr);
            setChainId(SEPOLIA_CHAIN_ID);
        } catch (err) {
            console.error("Wallet connect failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async () => {
        if (!address || !chainId) return;
        setIsLoading(true);
        try {
            // 1. Get Nonce
            const nonceRes = await fetch("/api/auth/nonce");
            const nonce = await nonceRes.text();

            // 2. Sign Message
            const message = createSiweMessage(address, chainId, nonce);
            const provider = new BrowserProvider(window.ethereum as any);
            const signer = await provider.getSigner();
            const signature = await signer.signMessage(message);

            // 3. Verify
            const verifyRes = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message, signature }),
            });

            if (!verifyRes.ok) throw new Error("Verification failed");

            setIsAuthenticated(true);
        } catch (error) {
            console.error("Login failed:", error);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const switchNetwork = async () => {
        setIsLoading(true);
        try {
            await switchToSepolia();
            await checkWallet();
        } catch (err) {
            console.error("Network switch failed:", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <WalletContext.Provider value={{
            isConnected, isAuthenticated, address, chainId, isWrongNetwork, isLoading, completedModules,
            connect, login, switchNetwork, completeModule
        }}>
            {children}
        </WalletContext.Provider>
    );
}

// ==================== HOOK ====================
export function useWallet(): WalletContextType {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error("useWallet must be used inside WalletProvider");
    }
    return context;
}
