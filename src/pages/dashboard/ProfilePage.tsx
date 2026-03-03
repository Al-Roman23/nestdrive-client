import React from 'react';
import { User, Shield, Mail, Calendar, Key, BadgeCheck, Activity, Award, AlertCircle } from 'lucide-react';
import { useAuth } from '@/core/auth/AuthProvider';
import userImg from '@/assets/user.png';

// This Component Visualizes The Authenticated User's Secure Identity Profile
const ProfilePage: React.FC = () => {
    // This Hook Accesses The Centralized Identity Context
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Critical Suspension Alert Protocol */}
            {user.isSuspended && (
                <div className="flex items-center gap-6 p-6 bg-red-600 rounded-[2.5rem] text-white shadow-2xl shadow-red-500/30 border-4 border-white dark:border-slate-900 border-opacity-20 animate-bounce-subtle">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
                        <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-tighter">Operational Restriction Detected</h4>
                        <p className="text-sm font-bold opacity-90 italic">
                            "Your vault access has been transitioned to Read-Only mode by administrative protocol. No file mutations or sharing actions are permitted at this time."
                        </p>
                    </div>
                </div>
            )}

            {/* Professional Identity Header Area */}
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/5 rounded-full -ml-32 -mb-32 blur-3xl"></div>

                <div className="relative">
                    <div className="w-32 h-32 rounded-[2.5rem] p-1 bg-gradient-to-tr from-blue-600 to-indigo-600">
                        <img
                            src={userImg}
                            alt="Principal Identity Photo"
                            className="w-full h-full rounded-[2.2rem] object-cover border-4 border-white dark:border-slate-900"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl shadow-lg border-4 border-white dark:border-slate-900">
                        <BadgeCheck className="w-5 h-5" />
                    </div>
                </div>

                <div className="space-y-4 text-center md:text-left flex-1">
                    <div className="space-y-1">
                        <div className="flex items-center justify-center md:justify-start gap-3">
                            <h1 className="text-4xl font-black text-slate-900 dark:text-slate-50 uppercase tracking-tighter">
                                {user.name}
                            </h1>
                            <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                {user.role} PRINCIPAL
                            </span>
                            {user.isSuspended && (
                                <span className="px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest bg-red-600 text-white animate-pulse">
                                    Account Suspended
                                </span>
                            )}
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 font-bold italic">
                            "Managing secure cloud assets since {new Date().getFullYear()}!"
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300">
                            <Mail className="w-4 h-4 text-blue-600" />
                            {user.email}
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300">
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Secure Session Active
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Metadata Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Core Account Intelligence Card */}
                <div className="lg:col-span-2 glass-card p-8 border-slate-200 dark:border-slate-800 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-3">
                            <User className="w-6 h-6 text-blue-600" />
                            Identity Registry
                        </h2>
                        <Award className="w-6 h-6 text-amber-500" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Primary Alias</label>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
                                {user.name}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Communication Channel</label>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200">
                                {user.email}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Temporal Creation Baseline</label>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                                <Calendar className="w-4 h-4 text-indigo-500" />
                                {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">System Authorization Authority</label>
                            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 font-bold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                                <Key className="w-4 h-4 text-emerald-500" />
                                {user.role === 'ADMIN' ? 'Root Administrative Access' : 'Standard Workspace Access'}
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-[2rem] border border-blue-100 dark:border-blue-900/30">
                            <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-sm">
                                <Activity className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-blue-900 dark:text-blue-100 uppercase tracking-tight">Security Protocol Verification</h4>
                                <p className="text-xs text-blue-700 dark:text-blue-400 font-bold">Your account is currently protected by full JWT encryption and silent-refresh sessions.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Account Status Card */}
                <div className="glass-card p-8 border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center space-y-6">
                    <div className="w-24 h-24 bg-gradient-to-tr from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/40 rounded-[2rem] flex items-center justify-center">
                        <Shield className="w-12 h-12 text-emerald-600" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Account Integrity</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-bold italic px-4">
                            "Verified User Identity Within The NestDrive V1.0 Ecosystem."
                        </p>
                    </div>

                    <div className="w-full space-y-3 pt-4">
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Verification</span>
                            <span className="text-[10px] font-black text-emerald-500 uppercase">Certified</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800">
                            <span className="text-[10px] font-black text-slate-400 uppercase">Status</span>
                            <span className={`text-[10px] font-black uppercase ${user.isSuspended ? 'text-red-500' : 'text-blue-500'}`}>
                                {user.isSuspended ? 'Vault Restricted' : 'Operational'}
                            </span>
                        </div>
                    </div>

                    <button className="w-full py-4 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:scale-105 active:scale-95">
                        Refresh Credentials
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
