import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { useAuth } from '@/core/auth/AuthProvider';
import { Lock, Eye, EyeOff, Loader2, CheckCircle, Key } from 'lucide-react';

// This Component Handles The Final Update To User Credentials
const ResetPasswordPage: React.FC = () => {
    // This Hook Accesses The URL Search Parameters For The Recovery Token
    const [searchParams] = useSearchParams();
    // This Hook Provides Programmatic Navigation Actions
    const navigate = useNavigate();
    // This Hook Accesses The Global Authentication Actions
    const { resetPassword } = useAuth();
    // This State Values Handle Form Security And Interactions 
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    // This Function Handles The Secure Credential Update Logic
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = searchParams.get('token');

        if (!token) {
            setError('Missing Security Recovery Token.');
            return;
        }

        if (password !== confirmPassword) {
            setError('System Access Keywords Must Match.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await resetPassword(token, password);
            setIsSuccess(true);
            // Securely Redirect To Entrance After 3 Seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Access Restoration Failure.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // This Layout Maintains The Glassmorphism Aesthetics Of The Auth Suite
        <div className="glass-card p-8 w-full max-w-md border-slate-200 dark:border-slate-800 shadow-2xl transition-all">

            {!isSuccess ? (
                <>
                    {/* Access Verification Branding Section */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4 transform hover:scale-110 transition-transform">
                            <Key className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                            Reset Access Key
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Establish New Secure Credentials For Your Workspace
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        {/* Security Error Feedback Section */}
                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* This Field Is For Secure Key Entry */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                New Strong Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* This Field Validates Secure Key Integrity */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                Confirm Key Ownership
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary !py-3 font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                "Update Access Credentials"
                            )}
                        </button>
                    </form>
                </>
            ) : (
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 text-green-600 animate-in zoom-in duration-300">
                        <CheckCircle className="w-16 h-16" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                        Success!
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                        Secure Workspace Credentials Have Been Restored. Please Wait For Portal Redirect...
                    </p>
                    <Link to="/login" className="btn-primary w-full shadow-lg shadow-blue-500/20 py-3">
                        Proceed To Portal
                    </Link>
                </div>
            )}
        </div>
    );
};

export default ResetPasswordPage;
