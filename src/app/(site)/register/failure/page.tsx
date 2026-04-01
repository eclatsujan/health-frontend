// @ts-nocheck
'use client';

import Link from 'next/link'

export default function RegisterFailurePage() {
    return (
        <div className="bg-background text-on-background font-body selection:bg-primary-fixed selection:text-on-primary-fixed">
            <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center">
                <div className="w-full text-center space-y-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-tertiary-container/10">
                        <span className="material-symbols-outlined text-tertiary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            warning
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight leading-tight">
                        Action Required: <br />
                        <span className="text-primary-container">Your Application Was Not Successful</span>
                    </h1>
                    <p className="text-lg text-on-surface-variant max-w-2xl mx-auto">
                        We encountered an issue while processing your provider credentials. To maintain our clinical standards, we require further information to
                        complete your activation.
                    </p>
                </div>

                <section className="mt-12 w-full bg-surface-container-lowest rounded-xl p-8 md:p-12 transition-all duration-300">
                    <h2 className="text-xl font-headline font-bold text-on-surface mb-6">Identified Requirements</h2>
                    <div className="space-y-6">
                        {[
                            ['Missing professional license verification', 'The uploaded license document is currently expired or unreadable.'],
                            ['Invalid document format', 'Please upload board certification as clear PDF or high-resolution JPEG.'],
                            ['Identity mismatch', 'The name in your uploaded proof does not match your registration profile.'],
                        ].map(([title, msg]) => (
                            <div key={title} className="flex items-start gap-4">
                                <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-error-container/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-error text-sm">close</span>
                                </div>
                                <div>
                                    <p className="font-semibold text-on-surface">{title}</p>
                                    <p className="text-on-surface-variant text-sm mt-1">{msg}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/register"
                            className="bg-gradient-to-br from-primary-container to-secondary text-white font-headline font-bold px-10 py-4 rounded-full w-full sm:w-auto hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            Try Again
                            <span className="material-symbols-outlined text-sm">refresh</span>
                        </Link>
                        <Link href="/contact"
                            className="border-2 border-outline-variant/30 text-on-surface font-headline font-bold px-10 py-4 rounded-full w-full sm:w-auto hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2"
                        >
                            Contact Support
                            <span className="material-symbols-outlined text-sm">chat_bubble</span>
                        </Link>
                    </div>
                </section>

                <div className="mt-8 w-full bg-surface-container-low rounded-lg p-6 flex items-center gap-6">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-secondary-container">medical_services</span>
                    </div>
                    <p className="text-on-surface-variant font-medium">
                        Don&apos;t worry. Your data has been saved, and you can resume the process at any time.
                    </p>
                </div>

                <footer className="mt-20 border-t border-[#bec9c9]/20 bg-background w-full">
                    <div className="flex flex-col md:flex-row justify-between items-center w-full px-8 py-12 max-w-7xl mx-auto space-y-6 md:space-y-0">
                        <div className="flex flex-col items-center md:items-start space-y-2">
                            <span className="text-lg font-bold text-[#0d7377] font-headline">MediHub</span>
                            <p className="text-sm text-[#3e4949] font-body">© 2024 MediHub Portal. All rights reserved.</p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 text-sm font-body text-[#3e4949]">
                            <Link className="hover:underline hover:text-[#0d7377] transition-colors" href="/contact">
                                Support Center
                            </Link>
                            <Link className="hover:underline hover:text-[#0d7377] transition-colors" href="/about">
                                Privacy Policy
                            </Link>
                            <Link className="hover:underline hover:text-[#0d7377] transition-colors" href="/about">
                                Terms of Service
                            </Link>
                            <Link className="hover:underline hover:text-[#0d7377] transition-colors" href="/contact">
                                Contact Systems
                            </Link>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}

