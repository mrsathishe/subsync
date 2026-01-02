import { useState } from "react";

/**
 * Hook for clipboard operations
 */
export function useClipboard() {
    const [copied, setCopied] = useState(false);

    const copy = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            return true;
        } catch (err) {
            console.error('Failed to copy text: ', err);
            setCopied(false);
            return false;
        }
    };

    return { copied, copy };
}