import React, { useState, useRef, useEffect } from 'react';
import { Cloud, Search, Menu, Sun, Moon, LogIn, LogOut, User, LayoutDashboard, Shield, File as FileIcon, Folder as FolderIcon, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useTheme } from '@/core/ThemeContext';
import { useAuth } from '@/core/auth/AuthProvider';
import api from '@/core/api/api';
import userImg from '@/assets/user.png';

// This Is The Shared Navigation Bar Component
const NavBar: React.FC = () => {
    // This Hook Accesses The Theme State
    const { theme, toggleTheme } = useTheme();
    // This Hook Accesses The Global Auth State And Logout Action
    const { user, logout } = useAuth();
    // This Hook Enables Dynamic Navigation Between Protocol Layers
    const navigate = useNavigate();

    // This State Manages The Visibility Of The User Profile Dropdown
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // This Ref Helps Detect Clicks Outside The Dropdown
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Global Search Engine States
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ files: any[], folders: any[] }>({ files: [], folders: [] });
    const [isSearching, setIsSearching] = useState(false);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    // This Effect Handles Closing The Dropdown When Clicking Outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // This Effect Orchestrates The Global Multi-Layer Asset Search
    useEffect(() => {
        if (!searchQuery.trim() || !user) {
            setSearchResults({ files: [], folders: [] });
            setShowSearchResults(false);
            return;
        }

        const fetchResults = async () => {
            setIsSearching(true);
            try {
                const [folderRes, fileRes] = await Promise.all([
                    api.get(`/folders?search=${searchQuery}`),
                    api.get(`/files?search=${searchQuery}`)
                ]);
                setSearchResults({
                    folders: folderRes.data.data.slice(0, 5),
                    files: (fileRes.data.data.files || []).slice(0, 5)
                });
                setShowSearchResults(true);
            } catch (err) {
                console.error("Global Search Operation Fault.");
            } finally {
                setIsSearching(false);
            }
        };

        const timeoutId = setTimeout(fetchResults, 400);
        return () => clearTimeout(timeoutId);
    }, [searchQuery, user]);

    // This Handler Executes Navigation To A Specific Resource Segment
    const handleResultClick = (type: 'FILE' | 'FOLDER', id: string) => {
        setShowSearchResults(false);
        setSearchQuery('');
        if (type === 'FOLDER') {
            navigate(`/dashboard/files?folderId=${id}`);
        } else {
            // For Files, We Navigate To The Files View (Future: Open Preview)
            navigate(`/dashboard/files`);
        }
    };

    return (
        // This Container Handles The Fixed Top Position And Glassmorphism
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-50 px-4">
            {/* This Wrapper Centrally Aligns The Content In A Fixed Max Width */}
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between">

                {/* This Section Contains The Logo And Brand Name */}
                <Link to="/" className="flex items-center gap-2">
                    <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                        <Cloud className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent hidden sm:block">
                        NestDrive
                    </span>
                </Link>

                {/* This Is The Global Search Pulse Engine */}
                <div className="hidden md:flex flex-1 max-w-xl mx-8 relative" ref={searchRef}>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {isSearching ? (
                            <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                        ) : (
                            <Search className="h-5 w-5 text-slate-400" />
                        )}
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                        placeholder={user ? "Search your cloud vault..." : "Sign in to search assets..."}
                        disabled={!user}
                        className="block w-full pl-10 pr-3 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700 rounded-xl leading-5 focus:outline-none focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40 transition-all text-sm text-slate-900 dark:text-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {/* Integrated Search Results Portal */}
                    {showSearchResults && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-[70] animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-2 max-h-[400px] overflow-y-auto">

                                {/* Folders Matched */}
                                {searchResults.folders.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Workspace Folders</div>
                                        {searchResults.folders.map(folder => (
                                            <button
                                                key={folder.id}
                                                onClick={() => handleResultClick('FOLDER', folder.id)}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group text-left"
                                            >
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/40 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                                    <FolderIcon className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{folder.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Files Matched */}
                                {searchResults.files.length > 0 && (
                                    <div>
                                        <div className="px-3 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Resource Assets</div>
                                        {searchResults.files.map(file => (
                                            <button
                                                key={file.id}
                                                onClick={() => handleResultClick('FILE', file.id)}
                                                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group text-left"
                                            >
                                                <div className="p-2 bg-orange-50 dark:bg-orange-900/40 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-all">
                                                    <FileIcon className="w-4 h-4" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{file.name}</span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-black">{file.mimeType}</span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {searchResults.folders.length === 0 && searchResults.files.length === 0 && (
                                    <div className="p-8 text-center">
                                        <Search className="w-8 h-8 text-slate-300 mx-auto mb-2 opacity-20" />
                                        <p className="text-sm font-bold text-slate-400 uppercase tracking-tight">Zero Matches Found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* This Section Contains Action Icons And User Profile Interface */}
                <div className="flex items-center gap-1 sm:gap-2">
                    {/* This Is The Theme Toggle Button */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors"
                        title="Toggle Dark Mode"
                    >
                        {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

                    {/* This Section Handles User Authentication State Display */}
                    {user ? (
                        <div className="relative" ref={dropdownRef}>
                            {/* This Trigger Opens The Profile Dropdown Menu */}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all group border-2 border-transparent active:border-blue-100"
                            >
                                <img
                                    src={userImg}
                                    alt="User Profile"
                                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                                />
                            </button>

                            {/* This Is The Actual Dropdown Menu Content */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-[60] animate-in fade-in zoom-in-95 duration-100">
                                    {/* User Specific Identification Area */}
                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-2">
                                        <p className="text-sm font-bold text-slate-900 dark:text-slate-50">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                                    </div>

                                    {/* Accessible Dashboard Action Links */}
                                    <Link
                                        to="/dashboard"
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        <span>User Dashboard</span>
                                    </Link>

                                    {/* This Administrative Access Portal Appears Only For Privileged Users */}
                                    {user.role === 'ADMIN' && (
                                        <Link
                                            to="/dashboard/admin/users"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors font-bold"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <Shield className="w-4 h-4" />
                                            <span>Admin Command Center</span>
                                        </Link>
                                    )}

                                    <Link
                                        to="/dashboard/profile"
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        <span>Personal Profile</span>
                                    </Link>

                                    {/* Final Logout Action Area */}
                                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 px-2">
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors group font-medium"
                                        >
                                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                            <span>Logout From NestDrive</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all active:scale-95 text-sm"
                        >
                            <LogIn className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign In</span>
                        </Link>
                    )}

                    {/* Mobile Menu Interface Trigger */}
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400 transition-colors md:hidden">
                        <Menu className="w-5 h-5" />
                    </button>
                </div>

            </div>
        </nav>
    );
};

export default NavBar;
