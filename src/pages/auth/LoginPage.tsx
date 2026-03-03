import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Cloud, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Shield, User } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';

// This Is The Secure Login Page Component
const LoginPage: React.FC = () => {
    // This Hook Handles Application Navigation
    const navigate = useNavigate();
    // This Hook Accesses The Global Authentication State
    const { login } = useAuth();

    // This State Handles Password Visibility Transitions
    const [showPassword, setShowPassword] = useState(false);
    // This State Tracks The Email Input
    const [email, setEmail] = useState('');
    // This State Tracks The Password Input
    const [password, setPassword] = useState('');
    // This State Tracks Local Error Messages
    const [error, setError] = useState<string | null>(null);
    // This State Tracks The API Request Status
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Helper function to pre-fill credentials for reviewers
    const fillGuestCredentials = (role: 'ADMIN' | 'USER') => {
        if (role === 'ADMIN') {
            setEmail('admin@nestdrive.vercel.app');
            setPassword('Password@23');
        } else {
            setEmail('test@nestdrive.vercel.app');
            setPassword('Password@23');
        }
    };

    // This Function Handles The Form Submission Logic
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            // This Calls The Backend Authentication Service
            await login({ email, password });
            // This Redirects The Authenticated User To The Dashboard
            navigate('/dashboard');
        } catch (err: any) {
            // This Handles And Displays API Level Failures
            setError(err.response?.data?.message || 'Invalid Credentials. Please Try Again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // This Wrapper Provides A Centered Card For The Login Form
        <div className="glass-card p-8 w-full max-w-md border-slate-200 dark:border-slate-800 shadow-2xl transition-all">

            {/* This Section Displays The Iconic Branding */}
            <div className="flex flex-col items-center mb-8">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4 transform hover:rotate-6 transition-transform">
                    <Cloud className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    Welcome Back To NestDrive
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Enter Your Credentials To Access Your Workspace
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Quick Access Credentials For Evaluators */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                        type="button"
                        onClick={() => fillGuestCredentials('ADMIN')}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-amber-50 dark:hover:bg-amber-900/10 hover:border-amber-200 dark:hover:border-amber-800 transition-all group"
                    >
                        <Shield className="w-5 h-5 text-slate-400 group-hover:text-amber-500 mb-1" />
                        <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-amber-600">Admin Entry</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => fillGuestCredentials('USER')}
                        className="flex flex-col items-center justify-center p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                    >
                        <User className="w-5 h-5 text-slate-400 group-hover:text-blue-500 mb-1" />
                        <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-blue-600">User Entry</span>
                    </button>
                </div>

                {/* This Component Displays Login Errors If Any Occur */}
                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}

                {/* This Field Is For User Email Access */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                        Email Address
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm outline-none text-slate-900 dark:text-slate-100"
                            placeholder="mizukiokada@mizukiokada.com"
                        />
                    </div>
                </div>

                {/* This Field Is For Secure Password Entry */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <Link to="/forgot-password" title="Recover Your Secure Password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="block w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm outline-none text-slate-900 dark:text-slate-100"
                            placeholder="••••••••"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                {/* This Submit Button Triggers The Authentication Flow */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-3 rounded-xl flex items-center gap-2 group shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                >
                    <span>{isSubmitting ? 'Authenticating Workspace...' : 'Sign In To Your Drive'}</span>
                    {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </button>

            </form>

            {/* This Footer Links To The Registration Interface */}
            <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Don't Have An Account Yet?{" "}
                    <Link to="/register" title="Create Your Free NestDrive Account" className="text-blue-600 hover:text-blue-700 font-bold ml-1">
                        Join NestDrive
                    </Link>
                </p>
            </div>

        </div>
    );
};

export default LoginPage;
