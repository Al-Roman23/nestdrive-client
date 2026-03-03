import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '@/core/auth/AuthProvider';
import { Mail, ArrowRight, ArrowLeft, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';

// This Component Handles Recovery Code Initiation Requests
const ForgotPasswordPage: React.FC = () => {
    // This Hook Accesses The Global Authentication Actions
    const { requestPasswordReset } = useAuth();
    // This State Values Ensure Form Persistence And Interaction
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState('');

    // This Function Handles The Secure Submission Process
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await requestPasswordReset(email);
            setIsSent(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Request Process Failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // This Layout Maintains The Glassmorphism Aesthetics Of The Auth Suite
        <div className="glass-card p-8 w-full max-w-md border-slate-200 dark:border-slate-800 shadow-2xl transition-all">

            {!isSent ? (
                <>
                    {/* This Section Explains The Recovery Process To The User */}
                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4 transform hover:scale-110 transition-transform">
                            <ShieldAlert className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                            Forgot Password?
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Provide Account Email To Secure Recovery Link
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Feedback Section */}
                        {error && (
                            <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* This Field Is For User Email Access Verification */}
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
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm text-slate-900 dark:text-slate-100"
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary !py-3 font-bold shadow-lg shadow-blue-500/20 gap-2 disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <span>Send Recovery Link</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
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
                        Check Your Inbox
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                        Secure Instructions Have Been Dispatched. Check System Console For Link Path Simulation.
                    </p>
                    <Link to="/login" className="btn-primary w-full gap-2">
                        <span>Proceed To Login</span>
                    </Link>
                </div>
            )}

            {/* Accessible Navigation Path Back To Dashboard Entry */}
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                <Link to="/login" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors font-medium group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span>Back To Entry Portal</span>
                </Link>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
