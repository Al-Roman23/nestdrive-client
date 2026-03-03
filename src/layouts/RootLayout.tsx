import React from 'react';
import { Outlet } from 'react-router';
import NavBar from '@/components/NavBar';
import { useTheme } from '@/core/ThemeContext';

// This Is The Root Layout For Public Facing Pages
const RootLayout: React.FC = () => {
    // This Hook Accesses The Theme State For Debugging
    const { theme } = useTheme();

    // This Side Effect Logs The Current Theme Mode
    React.useEffect(() => {
        console.log("Current Application Theme:", theme);
    }, [theme]);

    return (
        // This Main Wrapper Ensures The Full Height Of The App
        <div className={`min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}`}>
            {/* This Is The Persistent Header Across Root Pages */}
            <NavBar />
            {/* This Section Renders The Child Routes Dynamically */}
            <main className="pt-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default RootLayout;
