import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '@/core/api/api';

// This Is The Authentication Context Definition For Global State
const AuthContext = createContext<any>(null);

// This Is The Provider Component For Global Identity And Session State
const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // This State Holds The Current Authenticated User Identity
    const [user, setUser] = useState<null | any>(null);
    // This State Records The Current Authentication Loading Status
    const [loading, setLoading] = useState(true);

    // This Side Effect Restores The User Session Across Refresh Cycles
    useEffect(() => {
        const fetchCurrentUser = async () => {
            // This Logic Restores User Data If A Valid Token Is Found
            const token = localStorage.getItem('nestdrive-token');
            const savedUser = localStorage.getItem('nestdrive-user');

            if (token && savedUser) {
                try {
                    // We Restore The User Object To Maintain State Persistence
                    setUser(JSON.parse(savedUser));
                    console.log("Restored Secure Session For:", JSON.parse(savedUser).email);
                } catch (error) {
                    localStorage.removeItem('nestdrive-token');
                    localStorage.removeItem('nestdrive-user');
                }
            }
            setLoading(false);
        };
        fetchCurrentUser();
    }, []);

    // This Function Handles The Registration API Interaction
    const register = async (userData: any) => {
        // This Submits A New User Creation Request To The V1 API
        const response = await api.post('/auth/register', userData);
        // The Server Wraps The Result In A Data Root Object
        const { user: registeredUser, tokens } = response.data.data;

        // This Persists The Secure Session Artifacts Locally
        localStorage.setItem('nestdrive-token', tokens.accessToken);
        localStorage.setItem('nestdrive-refresh-token', tokens.refreshToken);
        localStorage.setItem('nestdrive-user', JSON.stringify(registeredUser));

        setUser(registeredUser);
        return response.data;
    };

    // This Function Handles The Login Logic Flow
    const login = async (credentials: any) => {
        // This Exchanges Credentials For A Secure Access Token Pair
        const response = await api.post('/auth/login', credentials);
        // The Server Wraps The Result In A Data Root Object
        const { user: authenticatedUser, tokens } = response.data.data;

        // This Stores The Auth State Globally And Locally
        localStorage.setItem('nestdrive-token', tokens.accessToken);
        localStorage.setItem('nestdrive-refresh-token', tokens.refreshToken);
        localStorage.setItem('nestdrive-user', JSON.stringify(authenticatedUser));

        setUser(authenticatedUser);
        return response.data;
    };

    const logout = () => {
        // This Clears Both Memory And Persistent Storage State
        localStorage.removeItem('nestdrive-token');
        localStorage.removeItem('nestdrive-refresh-token');
        localStorage.removeItem('nestdrive-user');
        setUser(null);
    };

    // This Function Contacts The Server To Validate A Confirmation Link
    const verifyEmail = async (token: string) => {
        const response = await api.get(`/auth/verify-email?token=${token}`);
        return response.data;
    };

    // This Function Starts The Password Recovery Cycle
    const requestPasswordReset = async (email: string) => {
        const response = await api.post('/auth/request-password-reset', { email });
        return response.data;
    };

    // This Function Completes The Password Restoration Logic
    const resetPassword = async (token: string, newPassword: string) => {
        const response = await api.post('/auth/reset-password', { token, newPassword });
        return response.data;
    };

    // This Object Aggregates All Auth Methods And Value Accessors
    const authInfo = {
        user,
        loading,
        register,
        login,
        logout,
        verifyEmail,
        requestPasswordReset,
        resetPassword
    };

    return (
        // This Provides The Auth Context Values For The Application Tree
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

// This Is A Custom Hook To Access Auth Logic Everywhere
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
