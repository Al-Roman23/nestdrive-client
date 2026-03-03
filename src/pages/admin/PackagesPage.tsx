import React, { useEffect, useState } from 'react';
import {
    Package, Plus, Edit2, Trash2,
    Layers, HardDrive, File, Folder,
    CheckCircle2, XCircle, Save, X
} from 'lucide-react';
import api from '@/core/api/api';

// This Is The Dto Definition Recieving From The Server Intelligence
interface SubscriptionPackage {
    id: string;
    name: string;
    maxFolders: number;
    maxNestingLevel: number;
    maxFileSizeMB: number;
    totalFileLimit: number;
    filesPerFolder: number;
    allowedTypes: string[];
    updatedAt: string;
}

// This Is The Administrative Interface For Subscription Tiers Management
const PackagesPage: React.FC = () => {
    // These States Manage Data Persistence And Modal UI State
    const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);

    // Form State For Creating Or Updating Packages
    const [formData, setFormData] = useState({
        name: '',
        maxFolders: 5,
        maxNestingLevel: 2,
        maxFileSizeMB: 10,
        totalFileLimit: 50,
        filesPerFolder: 20,
        allowedTypes: ['IMAGE', 'PDF'] as string[]
    });

    // This Side Effect Triggers Initial Data Retrieval
    useEffect(() => {
        fetchPackages();
    }, []);

    // This Function Orchestrates The API Interaction For Package Listing
    const fetchPackages = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/subscription/packages');
            setPackages(response.data.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed To Synchronize Subscription Registry.');
        } finally {
            setLoading(false);
        }
    };

    // This Function Prepares The Modal For Creation Or Editing
    const openModal = (pkg: SubscriptionPackage | null = null) => {
        if (pkg) {
            setEditingPackage(pkg);
            setFormData({
                name: pkg.name,
                maxFolders: pkg.maxFolders,
                maxNestingLevel: pkg.maxNestingLevel,
                maxFileSizeMB: pkg.maxFileSizeMB,
                totalFileLimit: pkg.totalFileLimit,
                filesPerFolder: pkg.filesPerFolder,
                allowedTypes: pkg.allowedTypes
            });
        } else {
            setEditingPackage(null);
            setFormData({
                name: '',
                maxFolders: 5,
                maxNestingLevel: 2,
                maxFileSizeMB: 10,
                totalFileLimit: 50,
                filesPerFolder: 20,
                allowedTypes: ['IMAGE', 'PDF']
            });
        }
        setIsModalOpen(true);
    };

    // This Function Submits The Package Data To The Server
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingPackage) {
                await api.put(`/admin/packages/${editingPackage.id}`, formData);
            } else {
                await api.post('/admin/packages', formData);
            }
            setIsModalOpen(false);
            fetchPackages();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Operation Failed.');
        }
    };

    // This Function Removes A Package From The System
    const handleDelete = async (id: string) => {
        if (!confirm('Are You Sure You Want To Delete This Package?')) return;
        try {
            await api.delete(`/admin/packages/${id}`);
            fetchPackages();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Delete Failed.');
        }
    };

    // This Helper Toggles File Category Selections
    const toggleType = (type: string) => {
        setFormData(prev => ({
            ...prev,
            allowedTypes: prev.allowedTypes.includes(type)
                ? prev.allowedTypes.filter(t => t !== type)
                : [...prev.allowedTypes, type]
        }));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* This Header Section Features Branding And Creation Action */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 flex items-center gap-3">
                        <Package className="w-8 h-8 text-blue-600" />
                        Subscription Package Management
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Define Tiered Limits And Control Resource Consumption Policies
                    </p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 text-sm font-bold"
                >
                    <Plus className="w-5 h-5" />
                    New Package Tier
                </button>
            </div>

            {/* Main Visual Board For Package Tiers */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <div className="p-12 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl text-center">
                    <p className="text-red-700 dark:text-red-400 font-medium">{error}</p>
                    <button onClick={fetchPackages} className="mt-4 text-blue-600 font-bold">Retry Synchronization</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {packages.map(pkg => (
                        <div key={pkg.id} className="glass-card flex flex-col p-6 border-slate-200 dark:border-slate-800 hover:scale-[1.02] transition-all group overflow-hidden relative">
                            {/* Visual Accent For Package Tiers */}
                            <div className="absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 bg-blue-500/5 rounded-full group-hover:bg-blue-500/10 transition-colors"></div>

                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{pkg.name}</h3>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openModal(pkg)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(pkg.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-4 flex-grow">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Folder className="w-4 h-4" />
                                        <span>Max Folders</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{pkg.maxFolders}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Layers className="w-4 h-4" />
                                        <span>Nesting Depth</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">Lvl {pkg.maxNestingLevel}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <HardDrive className="w-4 h-4" />
                                        <span>Single File</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{pkg.maxFileSizeMB} MB</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <File className="w-4 h-4" />
                                        <span>Total Count</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{pkg.totalFileLimit}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2 text-slate-500">
                                        <Layers className="w-4 h-4 rotate-90" />
                                        <span>Files Per Folder</span>
                                    </div>
                                    <span className="font-bold text-slate-900 dark:text-slate-100">{pkg.filesPerFolder}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Permitted Content</span>
                                <div className="flex flex-wrap gap-2">
                                    {pkg.allowedTypes.map(type => (
                                        <span key={type} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold">
                                            {type}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* This Dynamic Modal Handles Package Creation And Mutations */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <Package className="w-6 h-6 text-blue-600" />
                                {editingPackage ? 'Configure Global Tier' : 'Architecture New Tier'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-all">
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Tier Label</label>
                                    <input
                                        required
                                        type="text"
                                        placeholder="E.G. Platinum Plus"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Max Folders</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.maxFolders}
                                        onChange={e => setFormData({ ...formData, maxFolders: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Nesting Level</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.maxNestingLevel}
                                        onChange={e => setFormData({ ...formData, maxNestingLevel: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Max File Size (MB)</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.maxFileSizeMB}
                                        onChange={e => setFormData({ ...formData, maxFileSizeMB: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Total File Limit</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.totalFileLimit}
                                        onChange={e => setFormData({ ...formData, totalFileLimit: parseInt(e.target.value) })}
                                    />
                                </div>

                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Files Per Folder</label>
                                    <input
                                        required
                                        type="number"
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                        value={formData.filesPerFolder}
                                        onChange={e => setFormData({ ...formData, filesPerFolder: parseInt(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-black text-slate-400 uppercase mb-3 block">Supported File Formats</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {['IMAGE', 'VIDEO', 'PDF', 'AUDIO'].map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            onClick={() => toggleType(type)}
                                            className={`flex items-center justify-center gap-2 py-3 rounded-2xl border transition-all text-xs font-bold ${formData.allowedTypes.includes(type) ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                                        >
                                            {formData.allowedTypes.includes(type) ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                                >
                                    Abort Mutation
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingPackage ? 'Push Updates' : 'Authorize Tier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PackagesPage;
