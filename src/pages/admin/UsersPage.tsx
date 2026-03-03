import React, { useEffect, useState } from 'react';
import {
    Users, Shield, Filter, Search,
    UserCheck, UserX, HardDrive,
    Folder, AlertCircle, RefreshCcw
} from 'lucide-react';
import api from '@/core/api/api';
import { useAuth } from '@/core/auth/AuthProvider';

// This Is The Dto Definition Recieving From The Server Intelligence
interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    isSuspended: boolean;
    createdAt: string;
    subscription: {
        packageName: string;
        isActive: boolean;
    } | null;
    usage: {
        foldersUsed: number;
        filesUsed: number;
        storageUsedBytes: string;
    }
}

// This Is The Administrative Interface For User Lifecycle Management
const AdminUsersPage: React.FC = () => {
    // This Hook Accesses The Platform's Core Authentication Context
    const { user: currentUser } = useAuth();
    // These States Manage Data Persistence And User Interaction
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');

    // This Side Effect Triggers Initial Data Retrieval
    useEffect(() => {
        fetchUsers();
    }, []);

    // This Function Orchestrates The API Interaction For User Listing
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/admin/management/users');
            setUsers(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed To Synchronize Users Registry.');
        } finally {
            setLoading(false);
        }
    };

    // This Method Toggles The Account Activation Status
    const toggleUserStatus = async (id: string, currentStatus: boolean) => {
        try {
            await api.patch(`/admin/management/users/${id}/status`, { isActive: !currentStatus });
            // This Optimistic Update Maintains UI Responsiveness
            setUsers(users.map(u => u.id === id ? { ...u, isActive: !currentStatus } : u));
        } catch (err) {
            alert('Failed To Update Account Status.');
        }
    };

    // This Method Toggles The Functional Suspension Status (Read-Only Mode)
    const toggleUserSuspension = async (id: string, currentSuspension: boolean) => {
        try {
            await api.patch(`/admin/management/users/${id}/suspension`, { isSuspended: !currentSuspension });
            setUsers(users.map(u => u.id === id ? { ...u, isSuspended: !currentSuspension } : u));
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed To Update Suspension Status.');
        }
    };

    // This Logic Filters The Registry Based On Search Input And Role Choices
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === 'ALL' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    // Helper Function To Humanize Storage Units
    const formatBytes = (bytes: string) => {
        const b = parseInt(bytes);
        if (b === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(b) / Math.log(k));
        return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* This Header Section Features Branding And Mass Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                        <Users className="w-8 h-8 text-blue-600" />
                        Identity Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Review Platform Citizens, Resource Consumption, And Permission Tiers
                    </p>
                </div>
                <button
                    onClick={fetchUsers}
                    className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-700 dark:text-slate-300"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh Registry
                </button>
            </div>

            {/* Global Filtering And Global Search Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="md:col-span-2 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Scan By Name Or Registered Email..."
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm appearance-none"
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                    >
                        <option value="ALL">All Authority Roles</option>
                        <option value="ADMIN">System Administrators</option>
                        <option value="USER">Standard Account</option>
                    </select>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold">
                    <Shield className="w-4 h-4" />
                    <span>{filteredUsers.length} Citizens Found</span>
                </div>
            </div>

            {/* These Conditional Views Handle Errors And Loading Cycles */}
            {loading && users.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center p-12 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                    <button onClick={fetchUsers} className="mt-4 text-blue-600 hover:underline font-bold">Retry Synchronization</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredUsers.map(user => (
                        <div key={user.id} className="glass-card p-6 border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors ${user.isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                            {user.name}
                                            {user.role === 'ADMIN' && <Shield className="w-3.5 h-3.5 text-blue-500 fill-blue-500/10" />}
                                        </h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 truncate max-w-[200px]">{user.email}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-slate-100 text-slate-700 dark:bg-slate-800'}`}>
                                        {user.isActive ? 'Active Citizen' : 'Account Disabled'}
                                    </span>
                                    {user.isSuspended && (
                                        <span className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/40 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
                                            Vault Suspended
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-6">
                                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <Folder className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase">Folders</span>
                                    </div>
                                    <p className="text-lg font-black text-slate-700 dark:text-slate-300">{user.usage.foldersUsed}</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                    <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                                        <HardDrive className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase">Files</span>
                                    </div>
                                    <p className="text-lg font-black text-slate-700 dark:text-slate-300">{user.usage.filesUsed}</p>
                                </div>
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100/50 dark:border-blue-900/20">
                                    <div className="flex items-center gap-1.5 text-blue-400 mb-1">
                                        <Shield className="w-3 h-3" />
                                        <span className="text-[10px] font-bold uppercase">Plan</span>
                                    </div>
                                    <p className="text-sm font-black text-blue-600 dark:text-blue-400 truncate">
                                        {user.subscription?.packageName || 'No Plan'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Consumption:</span>
                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{formatBytes(user.usage.storageUsedBytes)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {/* Suspension Toggle - Prevents Self Suspension */}
                                    {currentUser?.id !== user.id && user.role !== 'ADMIN' && (
                                        <button
                                            onClick={() => toggleUserSuspension(user.id, user.isSuspended)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${user.isSuspended
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-400'
                                                }`}
                                            title={user.isSuspended ? 'Restore Vault Permissions' : 'Suspend User Actions'}
                                        >
                                            {user.isSuspended
                                                ? <><UserCheck className="w-3.5 h-3.5" /> Unsuspend</>
                                                : <><AlertCircle className="w-3.5 h-3.5" /> Suspend</>
                                            }
                                        </button>
                                    )}
                                    <button
                                        onClick={() => toggleUserStatus(user.id, user.isActive)}
                                        className={`p-2 rounded-xl transition-all ${user.isActive ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'}`}
                                        title={user.isActive ? 'Disable Account' : 'Enable Account'}
                                    >
                                        {user.isActive ? <UserX className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
