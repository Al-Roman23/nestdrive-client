import React from 'react';
import { NavLink, Link } from 'react-router';
import {
    LayoutDashboard, Folder, HardDrive,
    Share2, Settings, Users,
    Package, LogOut, User
} from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';

// This Navigation Link Style Utility Ensures Consistent Active Highlighting
const navItemClass = ({ isActive }: { isActive: boolean }) => `
  flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 group
  ${isActive
        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30 translate-x-1'
        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'}
`;

const Sidebar: React.FC = () => {
    // This Hook Accesses The Authenticated Identity For RBAC Visualization
    const { user, logout } = useAuth();

    return (
        <aside className="w-72 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen transition-all">
            {/* Professional Hub Branding Section */}
            <div className="p-8">
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg">
                        <HardDrive className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">NestDrive</span>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">V1.0 Platform</span>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Main Primary Navigation Menu Links */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                <div className="px-4 mb-2">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Main Workspace</span>
                </div>

                <NavLink to="/dashboard" end className={navItemClass}>
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Portal Overview</span>
                </NavLink>

                <NavLink to="/dashboard/files" className={navItemClass}>
                    <Folder className="w-5 h-5" />
                    <span>My Files Registry</span>
                </NavLink>

                <NavLink to="/dashboard/shared" className={navItemClass}>
                    <Share2 className="w-5 h-5" />
                    <span>Shared Links</span>
                </NavLink>

                <NavLink to="/dashboard/subscriptions" className={navItemClass}>
                    <Settings className="w-5 h-5" />
                    <span>Subscription Plan</span>
                </NavLink>

                {/* Secure Administrative Access Console - Protected By Permission Check */}
                {user?.role === 'ADMIN' && (
                    <div className="pt-8 space-y-2">
                        <div className="px-4 mb-2">
                            <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Administrative Control</span>
                        </div>
                        <NavLink to="/dashboard/admin/users" className={navItemClass}>
                            <Users className="w-5 h-5" />
                            <span>User Management</span>
                        </NavLink>
                        <NavLink to="/dashboard/admin/packages" className={navItemClass}>
                            <Package className="w-5 h-5" />
                            <span>Subscription Package Management</span>
                        </NavLink>
                    </div>
                )}
            </nav>

            {/* Bottom Footer User Panel And Global Interactions */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-800">
                    <span className="text-[10px] font-black text-slate-400 uppercase">Principal Role</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${user?.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {user?.role || 'Guest'}
                    </span>
                </div>
                <NavLink to="/dashboard/profile" className={navItemClass}>
                    <User className="w-5 h-5" />
                    <span>Personal Profile</span>
                </NavLink>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all mt-1"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Exit Portal</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
