import { isValidElement } from "react";

/**
 * Check if a value is a React component
 */
export function isReactComponent(value) {
    return (
        typeof value === "function" ||
        (typeof value === "object" && value !== null && isValidElement(value))
    );
}