"use client";

import { useWallet } from "@/context/WalletContext";

export function ConnectButton() {
    const { isConnected, isAuthenticated, address, isWrongNetwork, isLoading, connect, login, switchNetwork } = useWallet();

    const buttonBaseClass = "relative px-6 py-2 font-mono text-sm transition-all duration-300 uppercase tracking-widest overflow-hidden group border rounded-none";

    // 1. Not Connected
    if (!isConnected) {
        return (
            <button
                onClick={connect}
                disabled={isLoading}
                className={`${buttonBaseClass} bg-primary text-primary-foreground border-primary hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.3)]`}
            >
                <span className="relative z-10 flex items-center gap-2">
                    {isLoading ? "Connecting..." : "Connect Wallet"}
                </span>
                {/* Scanline Effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent h-1 w-full -translate-y-full group-hover:animate-scanline" />
            </button>
        );
    }

    // 2. Connected but Wrong Network
    if (isWrongNetwork) {
        return (
            <button
                onClick={switchNetwork}
                disabled={isLoading}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 px-6 py-2 rounded-none font-mono text-sm transition-all border border-destructive/50 uppercase tracking-wider"
            >
                {isLoading ? "Switching..." : "Switch to Sepolia"}
            </button>
        );
    }

    // 3. Connected but Not Authenticated (SIWE)
    if (!isAuthenticated) {
        return (
            <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] px-2 py-1 bg-white/5 border border-white/10 text-muted-foreground">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
                <button
                    onClick={login}
                    disabled={isLoading}
                    className={`${buttonBaseClass} bg-primary text-primary-foreground border-primary hover:shadow-[0_0_20px_rgba(168,85,247,0.5)]`}
                >
                    <span className="relative z-10">{isLoading ? "Signing..." : "Sign In"}</span>
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-white/20 group-hover:h-full transition-all duration-300" />
                </button>
            </div>
        );
    }

    // 4. Fully Connected and Authenticated
    return (
        <div className="flex items-center gap-2">
            <div className="flex flex-col items-end">
                <span className="text-[10px] text-primary font-mono leading-none mb-1 animate-pulse">
                    ● AUTHENTICATED
                </span>
                <span className="font-mono text-xs text-muted-foreground text-foreground">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
            </div>
            <button
                onClick={() => { }} // Could be logout
                className="p-2 border border-white/10 hover:border-primary/50 transition-colors group"
            >
                <div className="w-4 h-4 rounded-none border-2 border-primary group-hover:scale-110 transition-transform" />
            </button>
        </div>
    );
}
