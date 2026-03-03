import React, { useEffect, useState } from 'react';
import {
    Check, ArrowUpCircle, Crown,
    Shield, HardDrive, Folder, Layers,
    File, Zap, History
} from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';
import api from '@/core/api/api';

// This Interface Represents The Plan Details Defined By Admins
interface Package {
    id: string;
    name: string;
    maxFolders: number;
    maxNestingLevel: number;
    maxFileSizeMB: number;
    totalFileLimit: number;
    filesPerFolder: number;
    allowedTypes: { category: string }[];
}

// This Interface Tracks The Specific Activation Cycles For A User
interface SubscriptionHistory {
    id: string;
    packageName: string;
    startDate: string;
    endDate: string | null;
    isActive: boolean;
}

// This View Realizes The SaaS Subscription Orchestration For Users
const SubscriptionsPage: React.FC = () => {
    // These Hooks Manage Identity And Data State Synchronization
    const { user } = useAuth();
    const [packages, setPackages] = useState<Package[]>([]);
    const [history, setHistory] = useState<SubscriptionHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [activePackageId, setActivePackageId] = useState<string | null>(null);

    // This Side Effect Orchestrates The Retrieval Of Platform Tiers And Personal History
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [pkgRes, histRes] = await Promise.all([
                    api.get('/subscription/packages'),
                    api.get('/subscription/history')
                ]);
                setPackages(pkgRes.data.data);
                setHistory(histRes.data.data);

                // Establish The Currently Active Identity Based On History Records
                const active = histRes.data.data.find((h: any) => h.isActive);
                if (active) setActivePackageId(active.packageId);
            } catch (err) {
                console.error('Failed To Synchronize Subscription Data Layers.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // This Function Initiates The Logic To Mutate User Subscription Tiers
    const handleUpgrade = async (packageId: string) => {
        try {
            await api.post('/subscription/select', { packageId });
            // This Triggers A Full Revalidation Of Locally Cached Data
            window.location.reload();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Transaction Security Protocol Failed.');
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Zap className="w-12 h-12 text-blue-500 animate-pulse" />
        </div>
    );

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Professional Value Proposition Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-black uppercase tracking-widest">
                    <Crown className="w-4 h-4" />
                    Premium Cloud Architecture
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                    Scale Your Private Digital Ecosystem
                </h1>
                <p className="text-lg text-slate-500 dark:text-slate-400">
                    Select The Strategic Tier That Empowers Your Workflow Requirements
                </p>
            </div>

            {/* Matrix View For Tier Comparison And Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {packages.map((pkg) => {
                    const isActive = pkg.id === activePackageId;
                    return (
                        <div key={pkg.id} className={`glass-card flex flex-col p-8 transition-all duration-300 relative overflow-hidden ${isActive ? 'ring-2 ring-blue-600 scale-[1.05] z-10 shadow-2xl shadow-blue-500/20' : 'hover:scale-[1.02]'}`}>
                            {isActive && (
                                <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-tighter">
                                    Current Directive
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">{pkg.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tier Efficiency</span>
                                </div>
                            </div>

                            <div className="space-y-6 flex-grow">
                                <ul className="space-y-4">
                                    {[
                                        { label: `${pkg.maxFolders} Workspace Folders`, icon: Folder },
                                        { label: `Level ${pkg.maxNestingLevel} Depth Architecture`, icon: Layers },
                                        { label: `${pkg.maxFileSizeMB}MB Single File Cap`, icon: HardDrive },
                                        { label: `${pkg.totalFileLimit} Maximum Asset Count`, icon: File },
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 group">
                                            <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                                                <Check className="w-3 h-3 text-blue-600" />
                                            </div>
                                            <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover:text-slate-900 transition-colors">
                                                {feature.label}
                                            </span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Authorized Content</span>
                                    <div className="flex flex-wrap gap-2">
                                        {pkg.allowedTypes.map(t => (
                                            <span key={t.category} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md text-[10px] font-bold">
                                                {t.category}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                disabled={isActive || user?.isSuspended}
                                onClick={() => handleUpgrade(pkg.id)}
                                className={`mt-10 w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 ${isActive || user?.isSuspended ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-blue-600 hover:text-white hover:scale-95 active:scale-90 shadow-xl'}`}
                            >
                                {isActive ? <Shield className="w-4 h-4" /> : <ArrowUpCircle className="w-4 h-4" />}
                                {isActive ? 'Active Plan' : user?.isSuspended ? 'Plan Switch Restricted' : `Activate ${pkg.name}`}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Historical Audit Log Section For Lifecycle Tracking */}
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center gap-3">
                    <History className="w-6 h-6 text-slate-400" />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Subscription Lifecycle History</h2>
                </div>

                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Architecture Tier</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Activation Timestamp</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Termination Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Operational Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {history.length > 0 ? history.map((h) => (
                                <tr key={h.id} className="hover:bg-slate-50/30 dark:hover:bg-slate-800/20 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{h.packageName}</span>
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                        {new Date(h.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-slate-500">
                                        {h.endDate ? new Date(h.endDate).toLocaleDateString() : 'Active Directive'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase ${h.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                            <div className={`w-1 h-1 rounded-full ${h.isActive ? 'bg-green-600' : 'bg-slate-400'}`}></div>
                                            {h.isActive ? 'Live' : 'Deactivated'}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium italic">
                                        No Subscription Cycles Recorded In Global Core Database.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default SubscriptionsPage;
