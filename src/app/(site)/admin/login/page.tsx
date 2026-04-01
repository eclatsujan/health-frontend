// @ts-nocheck
'use client';

import Link from 'next/link'

export default function AdminLoginPage() {
    return (
        <div className="bg-surface font-body text-on-background min-h-screen flex flex-col">
            <main className="flex-grow flex items-center justify-center px-4 py-20 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-br from-primary-container to-secondary opacity-10" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-fixed opacity-20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary-fixed opacity-20 rounded-full blur-3xl" />

                <div className="w-full max-w-[480px] relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center p-4 rounded-xl bg-surface-container-lowest mb-6">
                            <span className="material-symbols-outlined text-primary text-4xl">shield_person</span>
                        </div>
                        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-primary mb-2">MediHub Portal</h1>
                        <p className="font-body text-on-surface-variant text-sm font-medium tracking-wide">ADMINISTRATIVE ACCESS ONLY</p>
                    </div>

                    <div className="bg-surface-container-lowest rounded-xl p-8 md:p-12 border border-outline-variant/10">
                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-1" htmlFor="admin-id">
                                    Admin ID / Email
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">badge</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all outline-none text-on-surface"
                                        id="admin-id"
                                        placeholder="Enter your credentials"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant px-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">lock</span>
                                    <input
                                        className="w-full pl-12 pr-12 py-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all outline-none text-on-surface"
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors" type="button">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant" htmlFor="twofa">
                                        2FA Code
                                    </label>
                                    <span className="text-[10px] text-outline font-bold uppercase tracking-widest bg-surface-container px-2 py-0.5 rounded">
                                        Secondary
                                    </span>
                                </div>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">key</span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-surface-container-low border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all outline-none text-on-surface tracking-[0.5em]"
                                        id="twofa"
                                        placeholder="6-digit code (if enabled)"
                                        type="text"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0 bg-surface-container-low" type="checkbox" />
                                    <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors">Remember this device</span>
                                </label>
                                <Link className="text-sm font-semibold text-primary hover:underline underline-offset-4" href="/contact">
                                    Forgot Password?
                                </Link>
                            </div>

                            <button className="w-full bg-gradient-to-br from-primary-container to-secondary text-on-primary font-headline font-bold py-4 rounded-full flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all" type="submit">
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    verified_user
                                </span>
                                <span>Secure Login</span>
                            </button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-outline-variant/20 flex flex-col space-y-4 items-center">
                            <Link className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium" href="/">
                                <span className="material-symbols-outlined text-lg">arrow_back</span>
                                <span>Back to Main Portal</span>
                            </Link>
                            <Link className="flex items-center space-x-2 text-on-surface-variant hover:text-primary transition-colors text-sm font-medium" href="/login">
                                <span className="material-symbols-outlined text-lg">medical_services</span>
                                <span>Provider Access</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                        {[
                            ['health_and_safety', 'HIPAA Compliant'],
                            ['encrypted', '256-bit SSL Encryption'],
                            ['gpp_good', 'Enterprise Verified'],
                        ].map(([icon, txt]) => (
                            <div key={txt} className="flex items-center space-x-2">
                                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    {icon}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{txt}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <footer className="flex flex-col md:flex-row justify-between items-center px-12 py-6 w-full bg-[#f7fafa] dark:bg-slate-950 font-['Inter'] text-sm antialiased border-t border-[#bec9c9]/20">
                <div className="text-[#3e4949] dark:text-slate-500 mb-4 md:mb-0">© 2024 Clinical Sanctuary. Secure Administrative Environment.</div>
                <div className="flex space-x-8">
                    <Link className="text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-teal-400 transition-colors duration-200" href="/about">
                        Privacy Policy
                    </Link>
                    <Link className="text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-teal-400 transition-colors duration-200" href="/about">
                        HIPAA Compliance
                    </Link>
                    <Link className="text-[#3e4949] dark:text-slate-500 hover:text-[#0d7377] dark:hover:text-teal-400 transition-colors duration-200" href="/about">
                        Terms of Service
                    </Link>
                </div>
            </footer>
        </div>
    );
}

