"use client"

import { MotionConfig } from "framer-motion";
import { useTheme } from "next-themes";
import * as React from "react";

export function MotionProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);
    const { theme } = useTheme();

    // Handle hydration mismatch
    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isMinimalist = mounted && theme?.startsWith("minimalist-");

    return (
        <MotionConfig
            reducedMotion={isMinimalist ? "always" : "never"}
            transition={isMinimalist ? { duration: 0 } : undefined}
        >
            {children}
        </MotionConfig>
    );
}
