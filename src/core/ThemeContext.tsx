import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// This Is The Theme Context Definition
const ThemeContext = createContext<any>(null);

// This Is The Provider Component For Theme State
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // This Is The State For The Current Theme Mode
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // This Checks For Saved Theme In Local Storage
        const savedTheme = localStorage.getItem('nestdrive-theme');
        return (savedTheme as 'light' | 'dark') || 'light';
    });

    // This Side Effect Updates The Document Class And Storage
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('nestdrive-theme', theme);
    }, [theme]);

    // This Function Toggles Between Light And Dark Themes
    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        // This Provides The Theme Context To The Component Tree
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// This Is A Custom Hook To Access Theme Context Easily
export const useTheme = () => useContext(ThemeContext);
