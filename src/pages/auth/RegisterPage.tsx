import React, { useState } from 'react';
import { Link } from 'react-router';
import { Cloud, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';

// This Is The User Registration Page Component
const RegisterPage: React.FC = () => {
    // This Hook Accesses The Global Authentication State
    const { register } = useAuth();

    // This Handles The Password Visibility Toggle
    const [showPassword, setShowPassword] = useState(false);
    // These Items Store The Form Control States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // This State Tracks Local Error Messages
    const [error, setError] = useState<string | null>(null);
    // This State Tracks The API Request Status
    const [isSubmitting, setIsSubmitting] = useState(false);
    // This State Tracks If The Verification Email Was Dispatched
    const [isRegistered, setIsRegistered] = useState(false);

    // This Handles The Registration Submit Flow
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // This Safety Check Ensures Passwords Are Synchronized
        if (password !== confirmPassword) {
            setError("Passwords Do Not Match. Please Verify Your Entries.");
            return;
        }

        setIsSubmitting(true);

        try {
            // This Dispatches The Account Creation Data To The Server
            await register({ name, email, password });
            // This Triggers The Final Confirmation View
            setIsRegistered(true);
        } catch (err: any) {
            // This Manages Backend Validation Errors In The UI
            setError(err.response?.data?.message || 'Registration Failed. Please Check Your Details.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        // This Wrapper Forms The Visual Foundation For The Sign Up Card
        <div className="glass-card p-8 w-full max-w-lg border-slate-200 dark:border-slate-800 shadow-2xl transition-all">

            {!isRegistered ? (
                <>
                    {/* This Header Displays The Welcome Branding And Context */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4 transform hover:scale-105 transition-transform">
                            <Cloud className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                            Join The NestDrive Ecosystem
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                            Sign Up Now To Claim Your Personal Cloud Storage Workspace
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* This Section Renders Validation Failures Or Server Mistakes */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Full Name Input Interface */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm outline-none text-slate-900 dark:text-slate-100"
                                    placeholder="Mizuki Okada"
                                />
                            </div>
                        </div>

                        {/* Email Account Input Interface */}
                        <div className="space-y-1">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                Professional Email
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
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

                        {/* Secure Password Setup Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                    Secure Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm outline-none text-slate-900 dark:text-slate-100"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                    Verify Password
                                </label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <ShieldCheck className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl leading-5 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 focus:border-blue-500 transition-all text-sm outline-none text-slate-900 dark:text-slate-100"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Final Submission Button For New User Registration */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full btn-primary py-3 mt-4 rounded-xl flex items-center gap-2 group shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
                        >
                            <span>{isSubmitting ? 'Creating Personal Drive...' : 'Create My Free Account'}</span>
                            {!isSubmitting && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        </button>

                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800 pt-6">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Already Part Of The NestDrive Community?{" "}
                            <Link to="/login" title="Navigate To Your Existing Secure Drive login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">
                                Log In Now
                            </Link>
                        </p>
                    </div>
                </>
            ) : (
                <div className="flex flex-col items-center text-center py-10">
                    <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-6 text-green-600 animate-in zoom-in duration-500">
                        <Mail className="w-16 h-16" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-3">
                        Verifying Your Inbox
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
                        Registration Complete! We've Sent A Secure Confirmation Link To <span className="text-blue-600 font-bold">{email}</span>. Please Check Your Mailbox To Activate Your Workspace.
                    </p>
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 rounded-2xl text-blue-700 dark:text-blue-300 text-sm mb-8 flex items-start gap-3 text-left">
                        <div className="p-1 bg-blue-600 rounded mt-0.5">
                            <AlertCircle className="w-3 h-3 text-white" />
                        </div>
                        <p>
                            During This Assessment Period, Confirmation Emails Are Simulated. You Can Find Your Activation Link In The <strong>System Server Console</strong>.
                        </p>
                    </div>
                    <Link to="/login" className="btn-primary w-full shadow-lg shadow-blue-500/20 py-3">
                        Proceed To Portal Entrance
                    </Link>
                </div>
            )}

        </div>
    );
};

export default RegisterPage;
