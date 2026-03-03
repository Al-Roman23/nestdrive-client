import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router';
import { useAuth } from '@/core/auth/AuthProvider';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';

// This Component Handles The Email Confirmation Logic When Landing From A Link
const VerifyEmailPage: React.FC = () => {
    // This Hook Accesses The URL Search Parameters For The Token
    const [searchParams] = useSearchParams();
    // This Hook Provides Programmatic Navigation Actions
    const navigate = useNavigate();
    // This Hook Accesses The Global Authentication Actions
    const { verifyEmail } = useAuth();
    // This State Tracks The Current Validation Status
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    // This State Stores Any Error Messages From The Server
    const [error, setError] = useState('');

    // This Guard Prevents Double Execution In Development Environments (React Strict Mode)
    const hasAttempted = React.useRef(false);

    // This Side Effect Triggers The Verification Logic On Component Mount
    useEffect(() => {
        const performVerification = async () => {
            // Check If Protocol Has Already Been Initiated
            if (hasAttempted.current) return;
            hasAttempted.current = true;

            const token = searchParams.get('token');
            if (!token) {
                setStatus('error');
                setError('Missing Security Token.');
                return;
            }

            try {
                await verifyEmail(token);
                setStatus('success');
                // Transparently Redirect To Login After 3 Seconds On Success
                setTimeout(() => navigate('/login'), 3000);
            } catch (err: any) {
                setStatus('error');
                setError(err.response?.data?.message || 'Verification Process Failed.');
            }
        };
        performVerification();
    }, [searchParams, verifyEmail, navigate]);

    return (
        // This Layout Maintains The Glassmorphism Aesthetics Of The Auth Suite
        <div className="glass-card p-8 w-full max-w-md border-slate-200 dark:border-slate-800 shadow-2xl text-center">
            <div className="flex flex-col items-center">

                {/* Dynamic State Feedback Section */}
                {status === 'loading' && (
                    <>
                        <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-2xl mb-6">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                            Validating Your Identity
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400">
                            Please Wait While We Secure Your Secure Workspace Access...
                        </p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-2xl mb-6">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                            Email Confirmed!
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">
                            Your Identity Has Been Successfully Verified. Redirecting To Login...
                        </p>
                        <Link to="/login" className="btn-primary w-full gap-2">
                            <span>Proceed To Login Now</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6">
                            <XCircle className="w-12 h-12 text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">
                            Verification Failure
                        </h2>
                        <p className="text-red-500 font-medium mb-8">
                            {error}
                        </p>
                        <Link to="/register" className="btn-primary w-full bg-slate-900 hover:bg-black">
                            Return To Registration
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmailPage;
