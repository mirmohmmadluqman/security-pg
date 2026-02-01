"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@/context/WalletContext";
import { submitSolution, getResult, getUserProgress } from "@/lib/contracts";

// ==================== TYPES ====================
export enum ChallengeResult {
    NotAttempted = 0,
    Passed = 1,
    Failed = 2,
}

interface UseChallengeReturn {
    isLoading: boolean;
    error: string | null;
    result: ChallengeResult;
    txHash: string | null;
    submit: (expectedHash: string, userAnswer: string) => Promise<void>;
    progress: { totalCompleted: number; completedIds: number[] } | null;
    loadProgress: () => Promise<void>;
}

// ==================== HOOK ====================
export function useChallenge(challengeId: number): UseChallengeReturn {
    const { isConnected, address, isWrongNetwork } = useWallet();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ChallengeResult>(ChallengeResult.NotAttempted);
    const [txHash, setTxHash] = useState<string | null>(null);
    const [progress, setProgress] = useState<{ totalCompleted: number; completedIds: number[] } | null>(null);

    const submit = useCallback(async (expectedHash: string, userAnswer: string) => {
        if (!isConnected || !address) {
            setError("Connect your wallet first.");
            return;
        }
        if (isWrongNetwork) {
            setError("Switch to Sepolia network first.");
            return;
        }
        if (result === ChallengeResult.Passed) {
            setError("Already completed this challenge.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setTxHash(null);

        try {
            const { success, txHash: hash } = await submitSolution(challengeId, expectedHash, userAnswer);
            setTxHash(hash);
            setResult(success ? ChallengeResult.Passed : ChallengeResult.Failed);
        } catch (err: any) {
            setError(err?.message || "Transaction failed.");
            setResult(ChallengeResult.Failed);
        } finally {
            setIsLoading(false);
        }
    }, [challengeId, isConnected, address, isWrongNetwork, result]);

    const loadProgress = useCallback(async () => {
        if (!address) return;

        try {
            const data = await getUserProgress(address);
            const currentResult = await getResult(address, challengeId);
            setProgress(data);
            setResult(currentResult);
        } catch (err) {
            console.error("Failed to load progress:", err);
        }
    }, [address, challengeId]);

    return { isLoading, error, result, txHash, submit, progress, loadProgress };
}
