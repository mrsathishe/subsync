import { useEffect, useState } from "react";

const breakpoints = {
    xs: 600,
    sm: 768,
    md: 1024,
    lg: 1280,
    xl: 1536,
};

/**
 * Hook to get current breakpoint
 */
export function useBreakpoint() {
    const [breakpoint, setBreakpoint] = useState(() => {
        if (typeof window === 'undefined') return 'lg';
        
        const width = window.innerWidth;
        if (width < breakpoints.xs) return 'xs';
        if (width < breakpoints.sm) return 'sm';
        if (width < breakpoints.md) return 'md';
        if (width < breakpoints.lg) return 'lg';
        return 'xl';
    });

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            if (width < breakpoints.xs) setBreakpoint('xs');
            else if (width < breakpoints.sm) setBreakpoint('sm');
            else if (width < breakpoints.md) setBreakpoint('md');
            else if (width < breakpoints.lg) setBreakpoint('lg');
            else setBreakpoint('xl');
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
}