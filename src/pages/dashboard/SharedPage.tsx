import React, { useEffect, useState } from 'react';
import { Share2, Link as LinkIcon, Clock, Shield, Search, Trash2, Copy, ExternalLink, Download } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';
import api from '@/core/api/api';

interface SharedLink {
    id: string;
    token: string;
    fileId: string;
    fileName: string;
    expiresAt: string | null;
    downloads: number;
    createdAt: string;
}

// This Utility Component Orchestrates The Management Of Publicly Accessible Asset Tunnels
const SharedPage: React.FC = () => {
    const { user } = useAuth();
    const [sharedLinks, setSharedLinks] = useState<SharedLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchSharedRegistry();
    }, []);

    const fetchSharedRegistry = async () => {
        setLoading(true);
        try {
            const res = await api.get('/files/share');
            setSharedLinks(res.data.data);
        } catch (err) {
            console.error('Failed To Sync Collaboration Registry.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteLink = async (id: string) => {
        if (!confirm('Permanent Tunnel Deletion Requested. Proceed?')) return;
        try {
            await api.delete(`/files/share/${id}`);
            fetchSharedRegistry();
        } catch (err) {
            alert('Security Protocol Failed To Purge Tunnel.');
        }
    };

    const copyToClipboard = async (token: string) => {
        const link = `http://localhost:3000/api/v1/share/${token}`;
        await navigator.clipboard.writeText(link);
        alert('Access Token Copied To Secure Registry Clipboard.');
    };

    const filteredLinks = sharedLinks.filter(l =>
        l.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.token.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isExpired = (expiresAt: string | null) => {
        if (!expiresAt) return false;
        return new Date() > new Date(expiresAt);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Section With Contextual Intelligence */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 flex items-center gap-3">
                        <Share2 className="w-8 h-8 text-indigo-600" />
                        External Collaboration Hub
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-bold italic">
                        "Review and manage outbound asset tunnels with real-time tracking."
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                    <Shield className="w-4 h-4" />
                    <span>Security Vault Online</span>
                </div>
            </div>

            {/* Global Search Interface For Collaboration Registry */}
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Search Shared Assets, Or Secure Tokens..."
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-700 dark:text-slate-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="py-20 flex justify-center">
                    <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                </div>
            ) : filteredLinks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredLinks.map(link => (
                        <div key={link.id} className={`glass-card p-6 border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:shadow-2xl transition-all group ${isExpired(link.expiresAt) ? 'opacity-60 grayscale' : ''}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <LinkIcon className="w-6 h-6" />
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => copyToClipboard(link.token)}
                                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-colors"
                                        title="Copy Link"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                    {!user?.isSuspended && (
                                        <button
                                            onClick={() => handleDeleteLink(link.id)}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-400 hover:text-red-500 transition-colors"
                                            title="Destroy Tunnel"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white truncate uppercase tracking-tight" title={link.fileName}>
                                        {link.fileName}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Payload Delegation Hub</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Usage</p>
                                        <div className="flex items-center justify-center gap-1.5 mt-0.5">
                                            <Download className="w-3 h-3 text-emerald-500" />
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{link.downloads}</p>
                                        </div>
                                    </div>
                                    <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-lg text-center">
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Status</p>
                                        <p className={`text-[10px] font-black uppercase mt-1 ${isExpired(link.expiresAt) ? 'text-red-500' : 'text-emerald-500'}`}>
                                            {isExpired(link.expiresAt) ? 'Purged' : 'Active'}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                                            {link.expiresAt ? new Date(link.expiresAt).toLocaleDateString() : 'Infinite'}
                                        </span>
                                    </div>
                                    <a
                                        href={`${import.meta.env.VITE_API_BASE_URL}/share/${link.token}`}
                                        target="_blank"
                                        className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest"
                                    >
                                        Inspect <ExternalLink className="w-3 h-3" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-20 bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] text-center space-y-4 flex flex-col items-center justify-center animate-in zoom-in-95 duration-500">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-2">
                        <LinkIcon className="w-10 h-10 text-indigo-600 animate-pulse" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Active Collaborations</h2>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm font-bold">
                        You haven't shared any files yet. Outbound access secure tokens will appear here once generated in the file registry.
                    </p>
                </div>
            )}
        </div>
    );
};

export default SharedPage;
