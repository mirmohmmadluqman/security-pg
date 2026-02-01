import { ethers, JsonRpcProvider, BrowserProvider, Contract } from "ethers";

// ==================== ABI IMPORTS ====================
// After running `forge build`, copy ABI arrays from:
//   security-pg-core-contracts/out/ChallengeRegistry.sol/ChallengeRegistry.json
//   security-pg-core-contracts/out/ChallengeValidator.sol/ChallengeValidator.json
//   security-pg-core-contracts/out/ProgressTracker.sol/ProgressTracker.json
//
// Each JSON has an "abi" key. Copy ONLY that array into:
//   src/abi/ChallengeRegistry.json
//   src/abi/ChallengeValidator.json
//   src/abi/ProgressTracker.json

import REGISTRY_ABI from "@/abi/ChallengeRegistry.json";
import VALIDATOR_ABI from "@/abi/ChallengeValidator.json";
import TRACKER_ABI from "@/abi/ProgressTracker.json";

// ==================== ADDRESSES ====================
const REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_REGISTRY_ADDRESS!;
const VALIDATOR_ADDRESS = process.env.NEXT_PUBLIC_VALIDATOR_ADDRESS!;
const TRACKER_ADDRESS = process.env.NEXT_PUBLIC_TRACKER_ADDRESS!;
const RPC_URL = process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL!;

// ==================== PROVIDERS ====================
function getReadProvider(): JsonRpcProvider {
    return new JsonRpcProvider(RPC_URL);
}

async function getSignerProvider(): Promise<BrowserProvider> {
    if (!window.ethereum) throw new Error("No wallet detected.");
    return new BrowserProvider(window.ethereum);
}

// ==================== CONTRACT INSTANCES ====================
function getRegistryContract(provider: JsonRpcProvider | ethers.Signer): Contract {
    return new Contract(REGISTRY_ADDRESS, REGISTRY_ABI, provider);
}

function getValidatorContract(provider: JsonRpcProvider | ethers.Signer): Contract {
    return new Contract(VALIDATOR_ADDRESS, VALIDATOR_ABI, provider);
}

function getTrackerContract(provider: JsonRpcProvider): Contract {
    return new Contract(TRACKER_ADDRESS, TRACKER_ABI, provider);
}

// ==================== PUBLIC FUNCTIONS ====================

/**
 * Get all active challenges (READ — no gas)
 */
export async function getAllChallenges(): Promise<any[]> {
    const provider = getReadProvider();
    const registry = getRegistryContract(provider);

    const activeIds: bigint[] = await registry.getAllActiveIds();
    const challenges = [];

    for (const id of activeIds) {
        const challenge = await registry.getChallenge(id);
        challenges.push({
            id: Number(id),
            titleHash: challenge.titleHash,
            difficulty: challenge.difficulty,
            category: challenge.category,
            active: challenge.active,
        });
    }

    return challenges;
}

/**
 * Submit a solution (WRITE — costs gas, requires wallet)
 */
export async function submitSolution(
    challengeId: number,
    expectedHash: string,
    userAnswer: string
): Promise<{ success: boolean; txHash: string }> {
    const provider = await getSignerProvider();
    const signer = await provider.getSigner();
    const validator = getValidatorContract(signer);

    const userAnswerHash = ethers.keccak256(ethers.toUtf8Bytes(userAnswer));

    const encodedInput = ethers.AbiCoder.defaultAbiCoder().encode(
        ["bytes32", "bytes32"],
        [expectedHash, userAnswerHash]
    );

    const tx = await validator.submitSolution(challengeId, encodedInput);
    const receipt = await tx.wait();

    const success = receipt.status === 1;

    return { success, txHash: tx.hash };
}

/**
 * Get result for a user + challenge (READ — no gas)
 */
export async function getResult(userAddress: string, challengeId: number): Promise<number> {
    const provider = getReadProvider();
    const validator = getValidatorContract(provider);
    return await validator.getResult(userAddress, challengeId);
}

/**
 * Get user progress (READ — no gas)
 */
export async function getUserProgress(userAddress: string): Promise<{
    totalCompleted: number;
    completedIds: number[];
}> {
    const provider = getReadProvider();
    const tracker = getTrackerContract(provider);

    const total: bigint = await tracker.getTotalCompleted(userAddress);
    const ids: bigint[] = await tracker.getChallengesCompleted(userAddress);

    return {
        totalCompleted: Number(total),
        completedIds: ids.map(Number),
    };
}
