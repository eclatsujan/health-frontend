// @ts-nocheck
'use client';

import Link from 'next/link'

export default function UserLoginPage() {
    return (
        <div className="font-body bg-surface text-on-surface selection:bg-secondary-container min-h-screen">
            <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-[#f7fafa] bg-opacity-90 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-[#0d7377] tracking-tighter font-headline">MediHub</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <Link className="text-[#3e4949] font-medium hover:text-[#00595c] transition-colors duration-200" href="/about">
                        Solutions
                    </Link>
                    <Link className="text-[#3e4949] font-medium hover:text-[#00595c] transition-colors duration-200" href="/about">
                        Security
                    </Link>
                    <Link className="text-[#3e4949] font-medium hover:text-[#00595c] transition-colors duration-200" href="/about">
                        Network
                    </Link>
                </div>
                <div className="flex items-center gap-4">
                    <a href="/admin/login" className="px-5 py-2 rounded-full font-semibold text-primary hover:bg-surface-container-low transition-all">
                        Partner Login
                    </a>
                </div>
            </header>

            <main className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-[#f7fafa] to-[#e5e9e8]">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full bg-secondary-container/20 blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-primary-fixed/30 blur-3xl" />

                <div className="w-full max-w-xl px-6 relative z-10">
                    <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 shadow-2xl shadow-primary-container/5 border border-white/40">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-container text-white mb-6">
                                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    medical_services
                                </span>
                            </div>
                            <h1 className="font-headline text-3xl font-extrabold text-on-surface tracking-tight leading-tight">Welcome Back, Provider</h1>
                            <p className="text-on-surface-variant mt-2 font-medium">Select your account type to continue</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                            {[
                                ['stethoscope', 'Doctor', true],
                                ['medical_information', 'Nurse', false],
                                ['vaccines', 'Pharmacy', false],
                                ['biotech', 'Lab', false],
                            ].map(([icon, label, active]) => (
                                <button
                                    key={label}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all transform hover:scale-105 active:scale-95 ${
                                        active
                                            ? 'bg-primary-container text-white shadow-lg shadow-primary-container/20'
                                            : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-highest'
                                    }`}
                                    type="button"
                                >
                                    <span className="material-symbols-outlined">{icon}</span>
                                    <span className="text-xs font-bold font-label">{label}</span>
                                </button>
                            ))}
                        </div>

                        <form className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="provider-id">
                                    Professional ID / Email
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                                        badge
                                    </span>
                                    <input
                                        className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest rounded-xl border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all outline-none"
                                        id="provider-id"
                                        placeholder="Dr. Jane Smith or ID-99201"
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative group">
                                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline-variant group-focus-within:text-primary transition-colors">
                                        lock
                                    </span>
                                    <input
                                        className="w-full pl-12 pr-12 py-4 bg-surface-container-lowest rounded-xl border-none ring-1 ring-outline-variant/20 focus:ring-2 focus:ring-primary focus:bg-surface-bright transition-all outline-none"
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                    <button className="absolute right-4 top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors" type="button">
                                        <span className="material-symbols-outlined">visibility</span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center">
                                        <input
                                            className="peer appearance-none w-5 h-5 rounded-md border-2 border-outline-variant/40 checked:bg-primary checked:border-primary focus:ring-0 transition-all"
                                            type="checkbox"
                                        />
                                        <span className="material-symbols-outlined absolute text-white text-sm opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none">
                                            check
                                        </span>
                                    </div>
                                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                                </label>
                                <Link className="text-sm font-bold text-primary hover:underline decoration-2 underline-offset-4" href="/contact">
                                    Forgot Password?
                                </Link>
                            </div>
                            <button className="w-full py-4 bg-gradient-to-br from-primary-container to-secondary text-white rounded-full font-bold text-lg shadow-xl shadow-primary-container/30 transform hover:translate-y-[-2px] hover:shadow-2xl hover:shadow-primary-container/40 active:scale-[0.98] transition-all" type="submit">
                                Sign In
                            </button>
                        </form>

                        <div className="mt-12 pt-8 text-center">
                            <div className="inline-block px-6 py-3 rounded-2xl bg-surface-container-low">
                                <p className="text-sm text-on-surface-variant font-medium">
                                    New to MediHub? <span className="text-on-surface">Join our network</span>
                                    <Link href="/register" className="ml-2 inline-flex items-center font-bold text-secondary hover:text-primary transition-colors">
                                        Apply Now
                                        <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xl">verified_user</span>
                            <span className="text-xs font-bold font-label tracking-widest uppercase">HIPAA Compliant</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-xl">shield</span>
                            <span className="text-xs font-bold font-label tracking-widest uppercase">256-Bit SSL</span>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-[#f1f4f4] w-full py-12 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col items-center md:items-start gap-2">
                        <span className="text-lg font-bold text-[#181c1c]">MediHub Clinical Sanctuary</span>
                        <p className="font-['Inter'] text-sm text-[#3e4949]">© 2024 MediHub Clinical Sanctuary. Secure &amp; Encrypted.</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-6">
                        <Link className="font-['Inter'] text-sm text-[#3e4949] hover:text-[#0d7377] transition-all" href="/about">
                            Clinical Standards
                        </Link>
                        <Link className="font-['Inter'] text-sm text-[#3e4949] hover:text-[#0d7377] transition-all" href="/contact">
                            Provider Support
                        </Link>
                        <Link className="font-['Inter'] text-sm text-[#3e4949] hover:text-[#0d7377] transition-all underline text-[#00595c]" href="/about">
                            Privacy Policy
                        </Link>
                        <Link className="font-['Inter'] text-sm text-[#3e4949] hover:text-[#0d7377] transition-all" href="/about">
                            HIPAA Compliance
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

