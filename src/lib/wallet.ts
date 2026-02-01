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
    if (!window.ethereum) {
        throw new Error("MetaMask is not installed.");
    }

    const accounts: string[] = await window.ethereum.request({
        method: "eth_requestAccounts",
    });

    if (!accounts || accounts.length === 0) {
        throw new Error("No account selected.");
    }

    await switchToSepolia();

    return accounts[0];
}

/**
 * Switch to Sepolia network
 */
export async function switchToSepolia(): Promise<void> {
    if (!window.ethereum) return;

    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: SEPOLIA_CHAIN_ID_HEX }],
        });
    } catch (error: any) {
        if (error.code === 4902) {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [SEPOLIA_PARAMS],
            });
        } else {
            throw error;
        }
    }
}

/**
 * Get current chain ID
 */
export async function getChainId(): Promise<number> {
    if (!window.ethereum) return 0;

    const chainId: string = await window.ethereum.request({
        method: "eth_chainId",
    });

    return parseInt(chainId, 16);
}

/**
 * Get current connected address
 */
export async function getAddress(): Promise<string | null> {
    if (!window.ethereum) return null;

    const accounts: string[] = await window.ethereum.request({
        method: "eth_accounts",
    });

    return accounts?.length > 0 ? accounts[0] : null;
}

/**
 * Subscribe to wallet events
 */
export function subscribeToWalletEvents(callback: () => void): () => void {
    if (!window.ethereum) return () => { };

    window.ethereum.on("accountsChanged", callback);
    window.ethereum.on("chainChanged", callback);

    return () => {
        window.ethereum?.removeListener("accountsChanged", callback);
        window.ethereum?.removeListener("chainChanged", callback);
    };
}
