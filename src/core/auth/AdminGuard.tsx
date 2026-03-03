import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/core/auth/AuthProvider';

// This Guard Component Ensures Only Administrators Can Access Specific Routes
const AdminGuard: React.FC = () => {
    // This Hook Accesses The User Object From Global Auth State
    const { user, loading } = useAuth();
    // This Hook Accesses The Current Navigation Location
    const location = useLocation();

    // While The Identity Status Is Being Resolved, We Render Nothing
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // This Logic Verifies Both Authentication And Elevated Privilege Status
    const isAuthorized = user && user.role === 'ADMIN';

    // If Not Authorized, We Redirect To The Home Page Or Login
    if (!isAuthorized) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    // If Authorized, We Render The Nested Child Components
    return <Outlet />;
};

export default AdminGuard;
