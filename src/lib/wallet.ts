/**
 * wallet.ts
 * All wallet connection logic lives here.
 * Nothing else in the app touches the wallet directly.
 */

// ============================================================
// CORRECTED: Ethereum Sepolia chain ID is 11155111 (0xaa36a7)
// The previous version had 0x14a34 which is Base Sepolia — WRONG.
// ============================================================
export const SEPOLIA_CHAIN_ID = 11155111;
export const SEPOLIA_CHAIN_ID_HEX = "0xaa36a7";

export const SEPOLIA_PARAMS = {
    chainId: SEPOLIA_CHAIN_ID_HEX,
    chainName: "Sepolia Testnet",
    nativeCurrency: {
        name: "Ether",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: [process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || ""],
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

export interface WalletState {
    isConnected: boolean;
    address: string | null;
    chainId: number | null;
    isWrongNetwork: boolean;
}

/**
 * Connect MetaMask wallet
 */
export async function connectWallet(): Promise<string> {
    try {
        if (typeof window === 'undefined' || !window.ethereum) {
            throw new Error("Wallet not found. Please use a Web3-compatible browser.");
        }

        const accounts: string[] = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (!accounts || accounts.length === 0) {
            throw new Error("No account selected.");
        }

        await switchToSepolia();

        return accounts[0];
    } catch (error) {
        console.error("connectWallet error:", error);
        throw error;
    }
}

/**
 * Switch to Sepolia network
 */
export async function switchToSepolia(): Promise<void> {
    if (typeof window === 'undefined' || !window.ethereum || !window.ethereum.request) return;

    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
    } catch (error: any) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [SEPOLIA_PARAMS],
                });
            } catch (addError) {
                console.error("Failed to add Sepolia network:", addError);
            }
        } else {
            console.error("Failed to switch to Sepolia network:", error);
        }
    }
}

/**
 * Get current chain ID
 */
export async function getChainId(): Promise<number> {
    if (typeof window === 'undefined' || !window.ethereum || !window.ethereum.request) return 0;

    try {
        const chainId: string = await window.ethereum.request({
            method: "eth_chainId",
        });

        return parseInt(chainId, 16);
    } catch (error) {
        console.error("getChainId error:", error);
        return 0;
    }
}

/**
 * Get current connected address
 */
export async function getAddress(): Promise<string | null> {
    if (typeof window === 'undefined' || !window.ethereum || !window.ethereum.request) return null;

    try {
        const accounts: string[] = await window.ethereum.request({
            method: "eth_accounts",
        });

        return accounts?.length > 0 ? accounts[0] : null;
    } catch (error) {
        console.error("getAddress error:", error);
        return null;
    }
}

/**
 * Subscribe to wallet events
 */
export function subscribeToWalletEvents(callback: () => void): () => void {
    if (typeof window === 'undefined' || !window.ethereum || !window.ethereum.on) return () => { };

    try {
        window.ethereum.on("accountsChanged", callback);
        window.ethereum.on("chainChanged", callback);

        return () => {
            try {
                window.ethereum?.removeListener("accountsChanged", callback);
                window.ethereum?.removeListener("chainChanged", callback);
            } catch (e) {
                console.error("Error removing wallet listeners:", e);
            }
        };
    } catch (error) {
        console.error("Error subscribing to wallet events:", error);
        return () => { };
    }
}
