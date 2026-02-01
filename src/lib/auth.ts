import { ethers } from "ethers";
import { SiweMessage } from "siwe";

export interface SessionData {
    address?: string;
    chainId?: number;
    isLoggedIn: boolean;
}

export const DATA_LABEL = "siwe-session";

/**
 * Creates a SIWE message instance
 */
export function createSiweMessage(
    address: string,
    chainId: number,
    nonce: string,
    statement: string = "Sign in to Security Playground"
): string {
    const message = new SiweMessage({
        domain: window.location.host,
        address: ethers.getAddress(address),
        statement,
        uri: window.location.origin,
        version: "1",
        chainId,
        nonce,
    });

    return message.prepareMessage();
}
