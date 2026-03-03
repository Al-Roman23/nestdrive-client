import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
    ArrowRight, Shield, Zap, Globe, Smartphone, Lock,
    Sparkles, Crown, Check, Folder, Layers, HardDrive, File
} from 'lucide-react';
import api from '@/core/api/api';
import Footer from '@/components/Footer';
import heroImg from '@/assets/hero.png';

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

// This Is The Public Facing Home Page Component
const HomePage: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const res = await api.get('/subscription/packages');
                setPackages(res.data.data);
            } catch (err) {
                console.error('Failed To Synchronize Public Pricing Registry.');
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 rounded-2xl mt-5 mb-5 px-4 lg:px-0">

            {/* Primary Hero Section Design - Ultra Premium V2 */}
            <section className="relative pt-20 pb-16 md:pt-32 md:pb-40 overflow-hidden">
                {/* Decorative Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-950/20 pointer-events-none opacity-50"></div>
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[150px] rounded-full -z-10 animate-pulse-slow"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[150px] rounded-full -z-10 animate-pulse-slow delay-1000"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                        {/* Text Content And Call To Actions */}
                        <div className="flex flex-col gap-10 text-center lg:text-left items-center lg:items-start max-w-3xl mx-auto lg:mx-0">

                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-inner animate-in slide-in-from-top duration-700">
                                <Sparkles className="w-4 h-4" />
                                Next-Generation Cloud Registry
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tight animate-in slide-in-from-left duration-700 delay-100">
                                Your Vault. <br />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent italic">
                                    Simplified.
                                </span>
                            </h1>

                            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl font-medium animate-in slide-in-from-left duration-700 delay-200">
                                Experience The Industrial-Grade Cloud Registry. Securely Orchestrate, Share, And Synchronize Your Legacy In Real-Time.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto animate-in slide-in-from-left duration-700 delay-300">
                                <Link to="/register" className="group relative px-12 py-6 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-500/40 hover:scale-105 active:scale-95 transition-all overflow-hidden flex items-center justify-center gap-3">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative z-10">Deploy Explorer</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                                </Link>
                                <a href="#pricing" className="px-12 py-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3">
                                    Strategic Tiers
                                </a>
                            </div>

                            <div className="flex items-center gap-10 mt-6 grayscale opacity-40 dark:opacity-20 animate-in fade-in duration-1000 delay-500">
                                <Shield className="w-10 h-10" />
                                <Lock className="w-10 h-10" />
                                <Smartphone className="w-10 h-10" />
                                <Globe className="w-10 h-10" />
                            </div>
                        </div>

                        {/* Interactive Hero Visual Mockup - Enhanced V2 */}
                        <div className="relative hidden lg:block perspective-2000 animate-in slide-in-from-right duration-1000 delay-200">
                            <div className="relative z-10 p-1 bg-gradient-to-br from-white/40 to-white/5 dark:from-white/10 dark:to-transparent backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] transition-all duration-1000 [transform:rotateX(5deg)_rotateY(-15deg)] hover:[transform:rotateX(0deg)_rotateY(0deg)] hover:scale-[1.05] group">
                                <img
                                    src={heroImg}
                                    alt="NestDrive Premium Interface"
                                    className="rounded-[4.8rem] shadow-inner object-cover w-full h-auto aspect-[4/5] xl:aspect-video"
                                />
                                {/* Dynamic Scanner Effect Line */}
                                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/0 via-blue-500/20 to-blue-500/0 h-1/2 rounded-[4.8rem] animate-scan pointer-events-none"></div>

                                {/* Floating Badge Nodes */}
                                <div className="absolute -top-10 -right-10 p-6 bg-white dark:bg-slate-900 shadow-2xl rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-float">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tunnel Status</div>
                                            <div className="text-sm font-black text-slate-900 dark:text-white uppercase">Secured</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Massive Blur Nodes for Volumetric Depth */}
                            <div className="absolute -bottom-20 -left-20 w-[150%] h-[150%] bg-blue-600/10 dark:bg-blue-500/5 blur-[150px] -z-10 animate-pulse-slow"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-500"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Premium Feature Grid Highlight */}
            <section className="py-24 bg-white dark:bg-slate-900/50 border-y border-slate-100 dark:border-slate-800/50 transition-colors rounded-[3rem]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature One: Security First */}
                        <div className="glass-card p-12 group hover:border-blue-500/30 transition-all hover:bg-white dark:hover:bg-slate-900 flex flex-col items-center md:items-start text-center md:text-left h-full border-none shadow-none hover:shadow-2xl">
                            <div className="p-5 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-[2rem] mb-10 group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-4 uppercase tracking-tighter">Enterprise Vault</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-bold">
                                Military Grade Encryption Protects Your Data Around The Clock. Total Privacy By Design.
                            </p>
                        </div>

                        {/* Feature Two: Performance Oriented */}
                        <div className="glass-card p-12 group hover:border-orange-500/30 transition-all hover:bg-white dark:hover:bg-slate-900 flex flex-col items-center md:items-start text-center md:text-left h-full border-none shadow-none hover:shadow-2xl">
                            <div className="p-5 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-[2rem] mb-10 group-hover:bg-orange-500 group-hover:text-white transition-all transform group-hover:scale-110">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-4 uppercase tracking-tighter">Instant Sync</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-bold">
                                Upload And Stream Large Media Files Without Interruption Or Speed Degradation.
                            </p>
                        </div>

                        {/* Feature Three: Global Collaboration */}
                        <div className="glass-card p-12 group hover:border-green-500/30 transition-all hover:bg-white dark:hover:bg-slate-900 flex flex-col items-center md:items-start text-center md:text-left h-full border-none shadow-none hover:shadow-2xl">
                            <div className="p-5 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-[2rem] mb-10 group-hover:bg-green-600 group-hover:text-white transition-all transform group-hover:-rotate-12">
                                <Globe className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-slate-50 mb-4 uppercase tracking-tighter">Global Relay</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed font-bold">
                                Access Your Secure Work Environment From Any Device, Anywhere On Planet Earth.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Tiers (Pricing) Section - Synchronized With Admin Core */}
            <section id="pricing" className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[12px] font-black uppercase tracking-[0.2em]">
                        <Sparkles className="w-5 h-5" />
                        Strategic Infrastructure
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">
                        Select Your Tier
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 font-bold max-w-3xl mx-auto leading-relaxed">
                        Mapped To Your Professional Trajectory. Scale From Private Individual To Global Enterprise Effortlessly.
                    </p>
                </div>

                {loading ? (
                    <div className="py-20 flex justify-center">
                        <Zap className="w-16 h-16 text-blue-500 animate-pulse" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {packages.map((pkg) => (
                            <div key={pkg.id} className="glass-card p-10 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all hover:scale-[1.05] hover:shadow-3xl hover:shadow-blue-500/20 rounded-[3rem]">
                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{pkg.name}</h3>
                                        <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                            <Crown className="w-6 h-6 text-amber-500" />
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-full inline-block">Digital Protocol Alpha</span>
                                </div>

                                <div className="space-y-8 flex-grow">
                                    <ul className="space-y-5">
                                        {[
                                            { label: `${pkg.maxFolders} Workspace Folders`, icon: Folder },
                                            { label: `Level ${pkg.maxNestingLevel} Depth Architecture`, icon: Layers },
                                            { label: `${pkg.maxFileSizeMB}MB Atomic File Cap`, icon: HardDrive },
                                            { label: `${pkg.totalFileLimit} Maximum Asset Total`, icon: File },
                                        ].map((feature, i) => (
                                            <li key={i} className="flex items-start gap-4 group">
                                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center transition-all group-hover:scale-125">
                                                    <Check className="w-3.5 h-3.5 text-blue-600" />
                                                </div>
                                                <span className="text-sm font-black text-slate-700 dark:text-slate-300">
                                                    {feature.label}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <div className="flex flex-wrap gap-2.5">
                                            {pkg.allowedTypes.map(t => (
                                                <span key={t.category} className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm">
                                                    {t.category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <Link to="/register" className="mt-12 group relative px-8 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] text-center overflow-hidden transition-all hover:shadow-2xl active:scale-95 shadow-lg">
                                    <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <span className="relative z-10">Activate {pkg.name} Tier</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Newsletter CTA For Engagement */}
            <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-700 mx-4 lg:mx-20 rounded-[5rem] mb-32 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(37,99,235,0.4)]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,white,transparent_50%)] opacity-20 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto text-center px-4 space-y-12 relative z-10">
                    <h2 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
                        Claim Your Legacy.
                    </h2>
                    <p className="text-blue-100 text-xl font-black max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
                        Join The Global Elite Synchronizing Their Private Ecosystem On NestDrive V1.0 Connectivity.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
                        <input
                            type="email"
                            placeholder="registry@protocol.v1"
                            className="flex-1 px-10 py-6 bg-white/10 border border-white/20 rounded-[2.5rem] text-white placeholder:text-blue-200 focus:outline-none focus:bg-white/20 font-black uppercase tracking-widest text-xs transition-all ring-offset-4 ring-offset-blue-600 focus:ring-4 focus:ring-white/20"
                        />
                        <button className="px-12 py-6 bg-white text-blue-600 rounded-[2.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-white hover:scale-105 transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.2)]">
                            Synchronize
                        </button>
                    </div>
                    <div className="flex items-center justify-center gap-8 text-[11px] font-black text-blue-200 uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-3"><Lock className="w-4 h-4" /> End-To-End</span>
                        <span className="flex items-center gap-3"><Shield className="w-4 h-4" /> ISO-9001 Certified</span>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default HomePage;
