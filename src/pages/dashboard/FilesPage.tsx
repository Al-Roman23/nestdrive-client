import React, { useEffect, useState } from 'react';
import {
    Cloud, File as FileIcon, Folder as FolderIcon,
    Plus, ArrowUpCircle,
    ChevronRight, MoreVertical, Trash2, Download,
    LayoutGrid, List, Search, Eye, X, Share2, Clock
} from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';
import api from '@/core/api/api';

// This Utility Formats Digital Storage Size Into Human Readable Fragments
const formatBytes = (bytes: string | number) => {
    const b = typeof bytes === 'string' ? parseInt(bytes) : bytes;
    if (b === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(b) / Math.log(k));
    return parseFloat((b / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

interface Folder {
    id: string;
    name: string;
    parentId: string | null;
}

interface File {
    id: string;
    name: string;
    sizeBytes: string;
    mimeType: string;
    folderId: string;
    createdAt: string;
}

// This Is The High Performance File Explorer Dashboard
const FilesPage: React.FC = () => {
    const { user } = useAuth();

    // Core Navigation And Resource States
    const [folders, setFolders] = useState<Folder[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [currentPath, setCurrentPath] = useState<Folder[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'GRID' | 'LIST'>('GRID');

    // Modal States For Asset Creation
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Sharing Orchestration States
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedFileForShare, setSelectedFileForShare] = useState<File | null>(null);
    const [shareYear, setShareYear] = useState(new Date().getFullYear());
    const [shareMonth, setShareMonth] = useState(new Date().getMonth());
    const [shareDay, setShareDay] = useState(new Date().getDate());
    const [shareHour, setShareHour] = useState(new Date().getHours() % 12 || 12);
    const [shareMinute, setShareMinute] = useState(Math.ceil(new Date().getMinutes() / 5) * 5 % 60);
    const [sharePeriod, setSharePeriod] = useState(new Date().getHours() >= 12 ? 'PM' : 'AM');

    // Preview Engine States
    const [previewFile, setPreviewFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // This Side Effect Synchronizes The View With The Current Folder Navigation Depth
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchWorkspaceResources();
        }, searchTerm ? 400 : 0);
        return () => clearTimeout(timeoutId);
    }, [currentPath, searchTerm]);

    // This Function Orchestrates The Retrieval Of Hierarchical Assets
    const fetchWorkspaceResources = async () => {
        setLoading(true);
        const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
        try {
            const [folderRes, fileRes] = await Promise.all([
                searchTerm
                    ? api.get(`/folders?search=${searchTerm}`)
                    : api.get(`/folders${parentId ? `?parentId=${parentId}` : ''}`),
                searchTerm
                    ? api.get(`/files?search=${searchTerm}`)
                    : parentId
                        ? api.get(`/files?folderId=${parentId}`)
                        : Promise.resolve({ data: { data: { files: [] } } })
            ]);
            setFolders(folderRes.data.data);
            setFiles(fileRes.data.data.files || []);
        } catch (err) {
            console.error('Failed To Synchronize Workspace Resources.');
        } finally {
            setLoading(false);
        }
    };

    // This Function Authorizes And Persists A New Directory Segment
    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
        try {
            await api.post('/folders', { name: newFolderName, parentId });
            setNewFolderName('');
            setIsFolderModalOpen(false);
            fetchWorkspaceResources();
        } catch (err: any) {
            alert(err.response?.data?.message || 'Policy Engine Denied Folder Creation.');
        }
    };

    // This Function Orchestrates Multi Part File Transmission
    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
        const formData = new FormData();
        formData.append('file', file);
        if (parentId) formData.append('folderId', parentId);

        try {
            await api.post('/files', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchWorkspaceResources();
        } catch (err: any) {
            alert(err.response?.data?.message || 'File Transmission Failed By Policy Check.');
        }
    };

    // This Helper Manages The Navigation Into Deep Nested Sub Directories
    const navigateIntoFolder = (folder: Folder) => {
        setCurrentPath([...currentPath, folder]);
    };

    // This Helper Resets The View To A Specific Level In The Breadcrumb Tree
    const navigateToBreadcrumb = (index: number) => {
        if (index === -1) setCurrentPath([]);
        else setCurrentPath(currentPath.slice(0, index + 1));
    };

    // This Function Removes An Asset From The Cloud Repository
    const handleDeleteFolder = async (id: string) => {
        if (!confirm('Destroy This Folder And Root Its Contents?')) return;
        try {
            await api.delete(`/folders/${id}`);
            fetchWorkspaceResources();
        } catch (err) {
            alert('Failed To Finalize Deletion.');
        }
    };

    const handleDeleteFile = async (id: string) => {
        if (!confirm('Permanent Assets Deletion Required?')) return;
        try {
            await api.delete(`/files/${id}`);
            fetchWorkspaceResources();
        } catch (err) {
            alert('Resource Locking Prevented Deletion.');
        }
    };

    const handleDownload = async (file: File) => {
        try {
            const res = await api.get(`/files/download/${file.id}`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
        } catch (err) {
            alert('Secure Asset Retrieval Failed.');
        }
    };

    const handlePreview = async (file: File) => {
        setLoading(true);
        try {
            const res = await api.get(`/files/download/${file.id}`, { responseType: 'blob' });
            const blob = new Blob([res.data], { type: file.mimeType });
            const url = window.URL.createObjectURL(blob);
            setPreviewUrl(url);
            setPreviewFile(file);
        } catch (err) {
            console.error('Preview Generation Interrupted.');
        } finally {
            setLoading(false);
        }
    };

    const closePreview = () => {
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(null);
        setPreviewFile(null);
    };

    const handleRenameFolder = async (id: string, currentName: string) => {
        const newName = prompt('Enter New Segment Alias:', currentName);
        if (!newName || newName === currentName) return;
        try {
            await api.put(`/folders/${id}`, { name: newName });
            fetchWorkspaceResources();
        } catch (err) {
            alert('Name Resolution Protocol Failed.');
        }
    };

    const handleRenameFile = async (id: string, currentName: string) => {
        const newName = prompt('Enter New Asset Alias:', currentName);
        if (!newName || newName === currentName) return;
        try {
            await api.put(`/files/${id}`, { name: newName });
            fetchWorkspaceResources();
        } catch (err) {
            alert('Asset Renaming Registry Error.');
        }
    };

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFileForShare) return;
        try {
            // Reconstruct Precise Temporal Threshold From Discrete Selection Nodes
            let finalHour = shareHour;
            if (sharePeriod === 'PM' && finalHour !== 12) finalHour += 12;
            if (sharePeriod === 'AM' && finalHour === 12) finalHour = 0;

            const expiresAt = new Date(shareYear, shareMonth, shareDay, finalHour, shareMinute);

            const res = await api.post('/files/share', {
                fileId: selectedFileForShare.id,
                expiresAt: expiresAt.toISOString()
            });
            const link = `${import.meta.env.VITE_API_BASE_URL}/share/${res.data.data.token}`;
            await navigator.clipboard.writeText(link);
            alert(`Outbound Access Securely Established!\nLink Copied To Registry Clipboard:\n${link}`);
            setIsShareModalOpen(false);
            setSelectedFileForShare(null);
        } catch (err: any) {
            alert(err.response?.data?.message || 'Secure Tunnel Generation Error.');
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Global Suspension Policy Enforcement Banner */}
            {user?.isSuspended && (
                <div className="flex items-center gap-4 p-4 mb-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-3xl animate-in slide-in-from-top-4 duration-500">
                    <div className="p-2 bg-orange-500 rounded-2xl">
                        <ArrowUpCircle className="w-6 h-6 text-white rotate-180" />
                    </div>
                    <div>
                        <h4 className="font-bold text-orange-900 dark:text-orange-100 uppercase tracking-tight text-sm">Read-Only Vault Mode Active</h4>
                        <p className="text-orange-700 dark:text-orange-400 text-xs">Your account has been restricted by administrators. You can view and download existing assets, but creation, modification, and sharing are temporarily disabled.</p>
                    </div>
                </div>
            )}

            {/* Visual Branding and Action Bar Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
                        Hello, {user?.name.split(' ')[0]} ⚡
                    </h1>
                    {/* Breadcrumb Navigation Hierarchy */}
                    <div className="flex items-center gap-2 text-sm font-bold">
                        <button
                            onClick={() => navigateToBreadcrumb(-1)}
                            className={`hover:text-blue-600 transition-colors ${currentPath.length === 0 ? 'text-blue-600' : 'text-slate-400'}`}
                        >
                            Root
                        </button>
                        {currentPath.map((folder, i) => (
                            <React.Fragment key={folder.id}>
                                <ChevronRight className="w-4 h-4 text-slate-300" />
                                <button
                                    onClick={() => navigateToBreadcrumb(i)}
                                    className={`hover:text-blue-600 transition-colors ${i === currentPath.length - 1 ? 'text-blue-600' : 'text-slate-400'}`}
                                >
                                    {folder.name}
                                </button>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group/search hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within/search:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Inter-Directory Search..."
                            className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 text-sm font-medium transition-all w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-800 shadow-sm mr-2">
                        <button
                            onClick={() => setViewMode('GRID')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'GRID' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('LIST')}
                            className={`p-1.5 rounded-lg transition-all ${viewMode === 'LIST' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>

                    <label className={`btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all cursor-pointer ${user?.isSuspended ? 'opacity-50 grayscale cursor-not-allowed pointer-events-none' : ''}`}>
                        <ArrowUpCircle className="w-5 h-5" />
                        <span className="font-bold">Dispatch Assets</span>
                        <input type="file" className="hidden" onChange={handleUploadFile} disabled={user?.isSuspended} />
                    </label>
                    <button
                        onClick={() => !user?.isSuspended && setIsFolderModalOpen(true)}
                        disabled={user?.isSuspended}
                        className={`p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm ${user?.isSuspended ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>
            </div>

            {/* Resource Grid Visualization Area */}
            {
                loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse"></div>
                        ))}
                    </div>
                ) : folders.length === 0 && files.length === 0 ? (
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-3xl p-20 flex flex-col items-center justify-center text-center">
                        <Cloud className="w-16 h-16 text-slate-300 dark:text-slate-700 mb-6" />
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Workspace Segment Empty</h2>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                            This Logical Directory Contains No Secure Data Or Nested Folders.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Folder Registry Group */}
                        {folders.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Hierarchical Segments ({folders.length})</h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {folders.map(folder => (
                                        <div
                                            key={folder.id}
                                            onDoubleClick={() => navigateIntoFolder(folder)}
                                            className="glass-card p-4 border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/30 transition-all hover:shadow-xl group cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600">
                                                    <FolderIcon className="w-6 h-6 fill-current opacity-70" />
                                                </div>
                                                <div className="relative group/menu">
                                                    <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <MoreVertical className="w-4 h-4 text-slate-400" />
                                                    </button>
                                                    <div className="hidden group-hover/menu:block absolute right-0 top-6 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden">
                                                        {!user?.isSuspended ? (
                                                            <>
                                                                <button onClick={() => handleRenameFolder(folder.id, folder.name)} className="w-full text-left px-4 py-2 text-[10px] font-black text-blue-600 hover:bg-blue-50 flex items-center gap-2 uppercase tracking-tighter">
                                                                    <Plus className="w-3.5 h-3.5 rotate-45" /> Refactor Alias
                                                                </button>
                                                                <button onClick={() => handleDeleteFolder(folder.id)} className="w-full text-left px-4 py-2 text-[10px] font-black text-red-500 hover:bg-red-50 flex items-center gap-2 uppercase tracking-tighter border-t border-slate-100 dark:border-slate-800">
                                                                    <Trash2 className="w-3.5 h-3.5" /> Decommission
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <div className="px-4 py-2 text-[9px] font-black text-orange-600 uppercase italic">Policy Restricted</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm truncate">{folder.name}</h3>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* File Registry Group */}
                        {files.length > 0 && (
                            <div className="space-y-4">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest pl-1">Authorized Asset Clusters ({files.length})</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {files.map(file => (
                                        <div
                                            key={file.id}
                                            className="glass-card p-4 border-slate-200/60 dark:border-slate-800/60 hover:shadow-xl transition-all group"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 transition-colors">
                                                    <FileIcon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-2" title={file.name}>{file.name}</h3>
                                                        <div className="relative group/menu">
                                                            <button className="p-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                                                <MoreVertical className="w-4 h-4 text-slate-400" />
                                                            </button>
                                                            <div className="hidden group-hover/menu:block absolute right-0 top-6 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 overflow-hidden">
                                                                <button
                                                                    onClick={() => handlePreview(file)}
                                                                    className="w-full text-left px-4 py-2 text-[10px] font-black text-emerald-600 hover:bg-emerald-50 flex items-center gap-2 uppercase tracking-tighter"
                                                                >
                                                                    <Eye className="w-3.5 h-3.5" /> Inspect
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDownload(file)}
                                                                    className="w-full text-left px-4 py-2 text-[10px] font-black text-blue-600 hover:bg-blue-50 flex items-center gap-2 uppercase tracking-tighter border-t border-slate-100 dark:border-slate-800"
                                                                >
                                                                    <Download className="w-3.5 h-3.5" /> Acquire
                                                                </button>
                                                                {!user?.isSuspended && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => {
                                                                                setSelectedFileForShare(file);
                                                                                setIsShareModalOpen(true);
                                                                            }}
                                                                            className="w-full text-left px-4 py-2 text-[10px] font-black text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 uppercase tracking-tighter border-t border-slate-100 dark:border-slate-800"
                                                                        >
                                                                            <Share2 className="w-3.5 h-3.5" /> Delegate Access
                                                                        </button>
                                                                        <button onClick={() => handleRenameFile(file.id, file.name)} className="w-full text-left px-4 py-2 text-[10px] font-black text-amber-600 hover:bg-amber-50 flex items-center gap-2 uppercase tracking-tighter border-t border-slate-100 dark:border-slate-800">
                                                                            <Plus className="w-3.5 h-3.5 rotate-45" /> Mutate Alias
                                                                        </button>
                                                                        <button onClick={() => handleDeleteFile(file.id)} className="w-full text-left px-4 py-2 text-[10px] font-black text-red-500 hover:bg-red-50 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800 uppercase tracking-tighter">
                                                                            <Trash2 className="w-3.5 h-3.5" /> Purge
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-black text-slate-400">{formatBytes(file.sizeBytes)}</span>
                                                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                                        <span className="text-[10px] font-black text-blue-500/70 uppercase">{file.mimeType.split('/')[1] || 'Asset'}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
            }

            {/* Logical Directory Creation Modal */}
            {
                isFolderModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95">
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                    <FolderIcon className="w-6 h-6 text-blue-600" />
                                    Partition Segment
                                </h2>
                            </div>
                            <form onSubmit={handleCreateFolder} className="p-6 space-y-6">
                                <div>
                                    <label className="text-xs font-black text-slate-400 uppercase mb-2 block">Segment Alias</label>
                                    <input
                                        autoFocus
                                        required
                                        type="text"
                                        placeholder="Enter Directory Name..."
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-bold"
                                        value={newFolderName}
                                        onChange={e => setNewFolderName(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={() => setIsFolderModalOpen(false)} className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl font-bold text-slate-500">Abort</button>
                                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20">Authorize</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {/* Asset Intelligence Preview Engine */}
            {
                previewUrl && previewFile && (
                    <div className="fixed inset-0 z-[100] flex flex-col bg-slate-950/95 backdrop-blur-xl animate-in fade-in duration-300">
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                                    <FileIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-white font-black text-sm uppercase tracking-widest">{previewFile.name}</h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tighter">{previewFile.mimeType} • {formatBytes(previewFile.sizeBytes)}</p>
                                </div>
                            </div>
                            <button
                                onClick={closePreview}
                                className="p-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden relative group">
                            {previewFile.mimeType.startsWith('image/') ? (
                                <div className="absolute inset-0 flex items-center justify-center p-8">
                                    <img
                                        src={previewUrl}
                                        alt={previewFile.name}
                                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95"
                                    />
                                </div>
                            ) : previewFile.mimeType === 'application/pdf' ? (
                                <iframe
                                    src={`${previewUrl}#toolbar=0`}
                                    className="w-full h-full border-none"
                                    title="Secure Asset Preview"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                                    <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center border border-white/10 mb-2">
                                        <Cloud className="w-10 h-10 text-slate-500" />
                                    </div>
                                    <h3 className="text-white font-black uppercase tracking-widest">Preview Restricted</h3>
                                    <p className="text-slate-400 text-xs font-bold px-8 text-center max-w-sm">This asset class requires localized processing. Please acquire the payload for direct interaction.</p>
                                    <button
                                        onClick={() => handleDownload(previewFile)}
                                        className="mt-4 px-8 py-3 bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl shadow-lg shadow-blue-500/20"
                                    >
                                        Acquire Payload
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            {/* Outbound Access Management Popup (Secure Share Modal) */}
            {
                isShareModalOpen && selectedFileForShare && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
                        <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                                        <Share2 className="w-6 h-6 text-indigo-600" />
                                        Secure Delegation
                                    </h2>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold italic">Establishing Outbound Tunnel For: <span className="text-indigo-600 font-black">"{selectedFileForShare.name}"</span></p>
                                </div>
                                <button
                                    onClick={() => {
                                        setIsShareModalOpen(false);
                                        setSelectedFileForShare(null);
                                    }}
                                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleShare} className="space-y-6">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-indigo-600" />
                                        Tunnel Expiration Protocol
                                    </label>
                                    <div className="space-y-3">
                                        {/* Primary Calendar Selection Nodes */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <select
                                                value={shareMonth}
                                                onChange={(e) => setShareMonth(parseInt(e.target.value))}
                                                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            >
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                                    <option key={m} value={i}>{m}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={shareDay}
                                                onChange={(e) => setShareDay(parseInt(e.target.value))}
                                                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            >
                                                {[...Array(31)].map((_, i) => (
                                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={shareYear}
                                                onChange={(e) => setShareYear(parseInt(e.target.value))}
                                                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            >
                                                {[2026, 2027, 2028, 2029, 2030].map(y => (
                                                    <option key={y} value={y}>{y}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Chronological Precision Selection Nodes */}
                                        <div className="grid grid-cols-3 gap-2">
                                            <select
                                                value={shareHour}
                                                onChange={(e) => setShareHour(parseInt(e.target.value))}
                                                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            >
                                                {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(h => (
                                                    <option key={h} value={h}>{h < 10 ? `0${h}` : h}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={shareMinute}
                                                onChange={(e) => setShareMinute(parseInt(e.target.value))}
                                                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                            >
                                                {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map(m => (
                                                    <option key={m} value={m}>{m < 10 ? `0${m}` : m}</option>
                                                ))}
                                            </select>
                                            <select
                                                value={sharePeriod}
                                                onChange={(e) => setSharePeriod(e.target.value)}
                                                className="px-3 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black focus:ring-4 focus:ring-indigo-500/10 outline-none uppercase transition-all"
                                            >
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-slate-400 font-bold italic px-1">"Select the precise temporal threshold for automatic tunnel purging."</p>
                                </div>

                                <div className="flex flex-col gap-3 pt-2">
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-500/20 transition-all active:scale-95"
                                    >
                                        Activate Secure Tunnel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsShareModalOpen(false);
                                            setSelectedFileForShare(null);
                                        }}
                                        className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all"
                                    >
                                        Abort Operation
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >
    );
};

export default FilesPage;
