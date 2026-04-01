// @ts-nocheck
'use client';

import Link from 'next/link'

export default function RegisterSuccessPage() {
    return (
        <div className="bg-surface font-body text-on-surface">
            <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-primary-container to-secondary opacity-10 pointer-events-none" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary-container rounded-full blur-3xl opacity-20 pointer-events-none" />

                <div className="w-full max-w-3xl z-10 flex flex-col items-center">
                    <header className="mb-12 text-center">
                        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-container/10">
                            <span className="material-symbols-outlined text-6xl text-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>
                                check_circle
                            </span>
                        </div>
                        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-primary tracking-tight mb-4">
                            Application Submitted Successfully!
                        </h1>
                        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                            Thank you for joining the MediHub network. Our medical compliance team will review your credentials within 2-3 business days.
                        </p>
                    </header>

                    <div className="w-full grid grid-cols-1 gap-8 mb-12">
                        <section className="bg-surface-container-low rounded-xl p-8 border border-outline-variant/20 shadow-sm">
                            <h2 className="font-headline text-xl font-bold text-on-surface mb-8 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">clinical_notes</span>
                                Your Onboarding Journey
                            </h2>
                            <div className="relative flex flex-col gap-10">
                                <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-outline-variant/30" />
                                <div className="relative flex items-start gap-6 group">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center z-10 shadow-lg shadow-primary-container/20">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="font-headline font-bold text-primary mb-1">Check your email to verify your account</h3>
                                        <p className="text-on-surface-variant text-sm">We sent a verification link to your registered email address.</p>
                                        <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-tertiary-container/10 text-tertiary border border-tertiary/20">
                                            <span className="material-symbols-outlined text-xs">pending</span>
                                            ACTION REQUIRED
                                        </div>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-6 opacity-60">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center z-10">
                                        <span className="material-symbols-outlined">person_add</span>
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="font-headline font-semibold text-on-surface mb-1">Complete your professional profile</h3>
                                        <p className="text-on-surface-variant text-sm">Fill specialties, availability, and clinical preferences once verified.</p>
                                    </div>
                                </div>
                                <div className="relative flex items-start gap-6 opacity-60">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center z-10">
                                        <span className="material-symbols-outlined">patient_list</span>
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="font-headline font-semibold text-on-surface mb-1">Start receiving patient requests</h3>
                                        <p className="text-on-surface-variant text-sm">After verification, your profile becomes visible to patients.</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
                        <div className="group relative w-full">
                            <button
                                className="w-full py-4 px-8 rounded-full bg-surface-container-highest text-outline font-headline font-bold flex items-center justify-center gap-2 cursor-not-allowed border border-outline-variant/30"
                                disabled
                            >
                                <span className="material-symbols-outlined">lock</span>
                                Go to Dashboard
                            </button>
                        </div>
                        <Link href="/" className="text-primary font-semibold hover:underline flex items-center gap-2 transition-all">
                            <span className="material-symbols-outlined text-lg">arrow_back</span>
                            Return to Homepage
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}

