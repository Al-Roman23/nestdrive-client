import React, { useEffect, useState } from 'react';
import {
    HardDrive, Folder, File,
    Share2, Shield, Zap,
    Activity, Clock, ChevronRight, Cloud,
    AlertCircle, Mail, Phone
} from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';
import api from '@/core/api/api';
import { Link } from 'react-router';

// This Utility Component Visualizes Platform Metrics And User Status
const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const [usage, setUsage] = useState<any>(null);
    const [recentFiles, setRecentFiles] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usageRes, filesRes] = await Promise.all([
                    api.get('/subscription/usage'),
                    api.get('/files?limit=5')
                ]);
                setUsage(usageRes.data.data);
                setRecentFiles(filesRes.data.data.files);
            } catch (err) {
                console.error('Failed To Sync Dashboard Intelligence.');
            }
        };
        fetchData();
    }, []);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Operational Restriction Protocol - High Sensitivity Alert */}
            {user?.isSuspended && (
                <div className="bg-red-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-red-500/20 border-4 border-white dark:border-slate-900 border-opacity-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center shrink-0 border border-white/20">
                            <AlertCircle className="w-10 h-10 text-white animate-pulse" />
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-2">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Vault Suspension Active</h2>
                            <p className="text-sm font-bold opacity-90 italic">
                                "Your account has been restricted to Read-Only mode. All file mutations, uploads, and sharing capabilities are temporarily disabled."
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest">
                                    <Mail className="w-4 h-4" />
                                    admin@nestdrive.vercel.app
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl text-xs font-black uppercase tracking-widest">
                                    <Phone className="w-4 h-4" />
                                    01319694957
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 bg-white/10 px-6 py-4 rounded-3xl border border-white/10 text-center">
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">Incident Profile</p>
                            <p className="text-sm font-black uppercase tracking-widest">Protocol V1.0</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Professional Welcome Greeting With Intelligence Context */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        Greetings, {user?.name.split(' ')[0]}!
                        <Zap className="w-6 h-6 text-amber-500 fill-amber-500/20" />
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">
                        "Your workspace is secure and synchronized."
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/dashboard/files" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2">
                        <HardDrive className="w-5 h-5" />
                        Launch Explorer
                    </Link>
                </div>
            </div>

            {/* Core Resource Metrics Orchestration Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="glass-card p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <HardDrive className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Storage Consumed</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {usage ? formatBytes(Number(usage.storageUsedBytes)) : '0.00 MB'}
                    </h3>
                </div>

                <div className="glass-card p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <Folder className="w-6 h-6 text-emerald-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Directories Managed</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {usage ? usage.foldersUsed : 0}
                    </h3>
                </div>

                <div className="glass-card p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <File className="w-6 h-6 text-amber-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Assets</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {usage ? usage.filesUsed : 0}
                    </h3>
                </div>

                <div className="glass-card p-6 border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
                    <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-4">
                        <Share2 className="w-6 h-6 text-indigo-600" />
                    </div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Live Shared Assets</p>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                        {usage ? usage.sharedLinksUsed : 0}
                    </h3>
                </div>
            </div>

            {/* Recent Asset Intelligence Section */}
            <div className="glass-card p-8 border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-5 h-5 text-amber-500" />
                        Recent Asset Clusters
                    </h3>
                    <Link to="/dashboard/files" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Explore Registry</Link>
                </div>

                {recentFiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {recentFiles.map((file) => (
                            <div key={file.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/30 transition-all cursor-pointer group">
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 mb-3 w-fit group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                                    <File className="w-5 h-5" />
                                </div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate mb-1" title={file.name}>{file.name}</h4>
                                <p className="text-[10px] font-black text-slate-400 uppercase">{formatBytes(Number(file.sizeBytes))}</p>
                                <div className="mt-3 flex items-center justify-between">
                                    <span className="text-[9px] font-black text-slate-300 uppercase">{new Date(file.createdAt).toLocaleDateString()}</span>
                                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 dark:bg-slate-950/50 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center mb-4 shadow-sm">
                            <Cloud className="w-8 h-8 text-slate-300" />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">No Recent Activity</h4>
                        <p className="text-xs text-slate-500 mt-2 max-w-xs px-4 font-bold">Your hierarchical registry is currently idle. Upload assets in the explorer to see them here.</p>
                    </div>
                )}
            </div>

            {/* Platform Insights And Activity Feed Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass-card p-8 border-slate-200 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-blue-600" />
                            Security & Resource Intelligence
                        </h3>
                        <Link to="/dashboard/subscriptions" className="text-xs font-bold text-blue-600 hover:underline">Manage Limits</Link>
                    </div>

                    <div className="space-y-6">
                        {/* Storage Usage Progress Visualization */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-bold">
                                <span className="text-slate-500 uppercase tracking-tighter">Capacity Allocation</span>
                                <span className="text-blue-600">
                                    {usage?.plan ? Math.round((Number(usage.storageUsedBytes) / (usage.plan.maxFileSizeMB * 1024 * 1024)) * 100) : 0}%
                                </span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-600 rounded-full shadow-lg shadow-blue-500/20 transition-all duration-1000"
                                    style={{ width: `${usage?.plan ? Math.min(100, (Number(usage.storageUsedBytes) / (usage.plan.maxFileSizeMB * 1024 * 1024)) * 100) : 0}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Hierarchical Progress Indicators */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <Folder className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Folder Quota</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{usage?.foldersUsed || 0} / {usage?.plan?.maxFolders || '∞'}</p>
                                    <p className="text-[10px] font-bold text-blue-500 leading-none pb-1 font-mono">
                                        REMAINING: {(usage?.plan?.maxFolders || 0) - (usage?.foldersUsed || 0)}
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-center gap-2 text-slate-400 mb-2">
                                    <File className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Asset Capacity</span>
                                </div>
                                <div className="flex items-end justify-between">
                                    <p className="text-xl font-black text-slate-900 dark:text-white">
                                        {usage?.filesUsed || 0} / {usage?.plan?.maxFiles || '∞'}
                                    </p>
                                    <p className="text-[10px] font-bold text-emerald-500 leading-none pb-1 font-mono">
                                        REMAINING: {(usage?.plan?.maxFiles || 0) - (usage?.filesUsed || 0)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Secure Vault & Account Status Intelligence Section */}
                <div className="glass-card p-8 border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6">
                            <Shield className="w-7 h-7 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">Security Vault</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                            Your identity is protected with multi-regional encryption. All assets are currently synchronized across 3 secure nodes.
                        </p>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Plan</span>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                {usage?.plan?.name || 'FREE TIER'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Logs</span>
                            <span className="text-xs font-bold text-slate-900 dark:text-white">Operational</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
