import React from 'react';
import { Cloud, Github, Twitter, Linkedin, Mail, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router';

// This Is The Professional Footer Component For The NestDrive Platform
const Footer: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 pt-20 pb-10 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* Brand Intelligence Area */}
                    <div className="space-y-6">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="p-2 bg-blue-600 rounded-lg shadow-sm">
                                <Cloud className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
                                NestDrive
                            </span>
                        </Link>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
                            The next generation of private cloud storage. Secure, decentralized, and synchronized for the modern workforce. Projecting digital sovereignty into the future.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-600 transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-600 transition-colors">
                                <Github className="w-5 h-5" />
                            </a>
                            <a href="#" className="p-2 bg-slate-100 dark:bg-slate-900 rounded-full text-slate-500 hover:text-blue-600 transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Platform Navigation Nodes */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-6">Platform Ecosystem</h4>
                        <ul className="space-y-4">
                            <li><Link to="/register" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">Launch Explorer</Link></li>
                            <li><Link to="/login" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">Identity Registry</Link></li>
                            <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">Strategic Tiers</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">Security Vault</a></li>
                        </ul>
                    </div>

                    {/* Technical Governance Information */}
                    <div>
                        <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-6">Technical Protocol</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">API Specification</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">Lifecycle Audit</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">System Uptime</a></li>
                            <li><a href="#" className="text-slate-500 dark:text-slate-400 text-sm font-bold hover:text-blue-600 transition-colors">Open Source Node</a></li>
                        </ul>
                    </div>

                    {/* Contact And Newsletter Intelligence */}
                    <div className="space-y-6">
                        <h4 className="text-slate-900 dark:text-white font-black uppercase text-xs tracking-widest mb-6">Connect In Tunnel</h4>
                        <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <Mail className="w-5 h-5 text-blue-600" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">support@nestdrive.v1</span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <Shield className="w-4 h-4" />
                            Multi-Node Encrypted
                        </div>
                    </div>
                </div>

                {/* Final Legal Baseline */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        © {new Date().getFullYear()} NestDrive V1.0 - Private Sovereignty Protocols
                    </p>
                    <div className="flex items-center gap-8">
                        <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Terms Of Service</a>
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Ops: ACTIVE</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
