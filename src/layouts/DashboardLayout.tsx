import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { Menu, X } from 'lucide-react';
import Sidebar from './components/Sidebar';

// This Is The Main Shell For The User Dashboard
const DashboardLayout: React.FC = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        // This Wrapper Handles The Sidebar And Main Content Area
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
            {/* Mobile Header Visibility Toggle */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl text-slate-600 dark:text-slate-400"
                >
                    {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* This Is Where The Dynamic Sidebar Resides */}
            <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:block fixed inset-0 lg:static z-40 lg:z-auto bg-white/40 dark:bg-slate-900/40 backdrop-blur-md lg:backdrop-blur-none`}>
                <div className="w-72 h-full lg:h-screen lg:sticky lg:top-0 shadow-2xl lg:shadow-none bg-white lg:bg-transparent dark:bg-slate-900 lg:dark:bg-transparent overflow-hidden">
                    <Sidebar />
                </div>
            </div>

            {/* This Is The Dynamic Content Area For Dashboard Pages */}
            <main className="flex-1 p-8 pt-20 lg:pt-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
