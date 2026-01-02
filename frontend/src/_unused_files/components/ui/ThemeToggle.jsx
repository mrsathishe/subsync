import React from 'react';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/providers/ThemeProvider';

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            aria-label="Toggle theme"
        >
            {theme === "light" ? "🌙" : "☀️"}
        </Button>
    );
}