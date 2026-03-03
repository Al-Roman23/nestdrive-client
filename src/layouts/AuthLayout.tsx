import React from 'react';
import { Outlet, Link } from 'react-router';
import { ChevronLeft } from 'lucide-react';

// This Is The Dedicated Layout For Authentication Pages
const AuthLayout: React.FC = () => {
    return (
        // This Container Centrally Aligns The Auth Forms With Theme Support
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 transition-colors duration-300">

            {/* This Section Provides A Quick Return Path To The Home Page */}
            <div className="absolute top-8 left-8">
                <Link to="/" className="flex items-center gap-1 text-slate-500 hover:text-blue-600 transition-colors font-medium">
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back To Home</span>
                </Link>
            </div>

            {/* This Container Holds The Child Authentication Forms */}
            <div className="w-full max-w-lg flex flex-col items-center">
                {/* This Is Where Login Or Register Content Appears Dynamically */}
                <Outlet />
            </div>

            {/* This Generic Footer Provides Legal Transparency */}
            <footer className="mt-8 text-xs text-slate-400 dark:text-slate-600">
                &copy; {new Date().getFullYear()} NestDrive Cloud Storage Services. All Rights Reserved.
            </footer>
        </div>
    );
};

export default AuthLayout;
