// @ts-nocheck
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
    const router = useRouter();
    const [agreed, setAgreed] = useState(false);
    const [practiceType, setPracticeType] = useState('doctor');

    const practiceConfig = {
        doctor: {
            fullNameLabel: 'Full Name',
            fullNamePlaceholder: 'Dr. Sarah Mitchell',
            licenseLabel: 'Medical License Number',
            licensePlaceholder: 'e.g., NMC ID 90210',
            emailPlaceholder: 'doctor@clinic.com',
            phonePlaceholder: '+977 98XXXXXXXX',
            cityPlaceholder: 'Kathmandu',
            addressLabel: 'Clinic Address',
            addressPlaceholder: '123 Medical Plaza, Ward 10',
        },
        nurse: {
            fullNameLabel: 'Full Name',
            fullNamePlaceholder: 'Ms. Anita Sharma',
            licenseLabel: 'Nursing Registration Number',
            licensePlaceholder: 'e.g., NNC REG 112233',
            emailPlaceholder: 'nurse@provider.com',
            phonePlaceholder: '+977 98XXXXXXXX',
            cityPlaceholder: 'Lalitpur',
            addressLabel: 'Current Practice Address',
            addressPlaceholder: 'Nursing Care Center, Jawalakhel',
        },
        pharmacy: {
            fullNameLabel: 'Pharmacy Name',
            fullNamePlaceholder: 'LifeCare Pharmacy Pvt. Ltd.',
            licenseLabel: 'Drug Retail License Number',
            licensePlaceholder: 'e.g., DDA-PH-8891',
            emailPlaceholder: 'contact@lifecarepharmacy.com',
            phonePlaceholder: '+977 01-XXXXXXX',
            cityPlaceholder: 'Bhaktapur',
            addressLabel: 'Pharmacy Address',
            addressPlaceholder: 'Main Road, Suryabinayak',
        },
        lab: {
            fullNameLabel: 'Laboratory Name',
            fullNamePlaceholder: 'Precision Diagnostics Lab',
            licenseLabel: 'Lab Registration / Accreditation ID',
            licensePlaceholder: 'e.g., NABL-NP-4580',
            emailPlaceholder: 'hello@precisionlab.com',
            phonePlaceholder: '+977 01-XXXXXXX',
            cityPlaceholder: 'Pokhara',
            addressLabel: 'Laboratory Address',
            addressPlaceholder: 'New Road, Lakeside',
        },
    };

    const cfg = practiceConfig[practiceType];

    function handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const fullName = String(fd.get('full_name') || '').trim();
        const license = String(fd.get('license_number') || '').trim();
        const email = String(fd.get('email') || '').trim();
        const phone = String(fd.get('phone') || '').trim();
        const city = String(fd.get('city') || '').trim();
        const address = String(fd.get('address') || '').trim();
        const password = String(fd.get('password') || '');
        const confirmPassword = String(fd.get('confirm_password') || '');

        const isValid =
            agreed &&
            fullName &&
            license &&
            email &&
            phone &&
            city &&
            address &&
            password.length >= 6 &&
            password === confirmPassword;

        router.push(isValid ? '/register/success' : '/register/failure');
    }

    return (
        <div className="bg-surface font-body text-on-surface min-h-screen">
            <main className="min-h-screen flex flex-col items-center">
                <section className="w-full bg-gradient-to-br from-primary-container to-secondary pt-20 pb-40 px-6 text-center text-white relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none">
                        <div className="w-full h-full bg-[radial-gradient(ellipse_70%_60%_at_50%_-20%,rgba(255,255,255,0.4),transparent)]" />
                    </div>
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="flex justify-center mb-6">
                            <span className="text-3xl font-black tracking-tighter text-on-primary-container font-headline">MediHub Portal</span>
                        </div>
                        <h1 className="font-headline font-extrabold text-5xl md:text-6xl tracking-tight mb-4">Join the MediHub Network</h1>
                        <p className="text-xl md:text-2xl text-on-primary-container font-medium max-w-2xl mx-auto">
                            Empowering care through digital excellence. Register your practice today.
                        </p>
                    </div>
                </section>

                <div className="max-w-6xl w-full px-6 -mt-32 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
                    <aside className="lg:col-span-4 order-2 lg:order-1">
                        <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-xl space-y-8 sticky top-8">
                            <h2 className="font-headline font-bold text-2xl text-primary-container">Why Join MediHub?</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-on-secondary-container">groups</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-on-surface">Reach more patients</h3>
                                        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                                            Expand your reach with intelligent matching that connects you to local and remote patients.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-on-secondary-container">prescriptions</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-on-surface">Digital prescriptions</h3>
                                        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                                            Streamline care with encrypted e-prescriptions integrated with trusted pharmacies.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-12 w-12 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined text-on-secondary-container">encrypted</span>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-on-surface">Secure health records</h3>
                                        <p className="text-on-surface-variant text-sm mt-1 leading-relaxed">
                                            Maintain secure records and continuity of care across the MediHub ecosystem.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-8 mt-8 border-t border-outline-variant/20">
                                <p className="text-on-surface-variant text-sm mb-4">Already have an account?</p>
                                <a className="inline-flex items-center text-primary font-bold hover:underline gap-2" href="/login">
                                    Sign In to Portal
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </a>
                            </div>
                        </div>
                    </aside>

                    <form className="lg:col-span-8 order-1 lg:order-2 space-y-8" onSubmit={handleSubmit}>
                        <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white text-xs font-bold">
                                    1
                                </span>
                                <h2 className="font-headline font-bold text-2xl">Practice Type Selection</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    ['medical_services', 'Doctor', 'doctor'],
                                    ['monitor_heart', 'Nurse', 'nurse'],
                                    ['medication', 'Pharmacy', 'pharmacy'],
                                    ['biotech', 'Lab', 'lab'],
                                ].map(([icon, label, value]) => (
                                    <label key={label} className="group relative cursor-pointer">
                                        <input
                                            className="peer sr-only"
                                            name="practice_type"
                                            type="radio"
                                            value={value}
                                            checked={practiceType === value}
                                            onChange={() => setPracticeType(value)}
                                        />
                                        <div className="p-6 rounded-xl border-2 border-transparent bg-surface text-center transition-all peer-checked:border-primary peer-checked:bg-primary-fixed/20 group-hover:bg-surface-container-high">
                                            <span className="material-symbols-outlined text-3xl text-primary block mb-2">{icon}</span>
                                            <span className="text-sm font-bold text-on-surface block">{label}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white text-xs font-bold">
                                    2
                                </span>
                                <h2 className="font-headline font-bold text-2xl">Basic Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">{cfg.fullNameLabel}</label>
                                    <input
                                        name="full_name"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder={cfg.fullNamePlaceholder}
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">{cfg.licenseLabel}</label>
                                    <input
                                        name="license_number"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder={cfg.licensePlaceholder}
                                        type="text"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">Email</label>
                                    <input
                                        name="email"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder={cfg.emailPlaceholder}
                                        type="email"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">Phone</label>
                                    <input
                                        name="phone"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder={cfg.phonePlaceholder}
                                        type="tel"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white text-xs font-bold">
                                    3
                                </span>
                                <h2 className="font-headline font-bold text-2xl">Location</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-1 space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">City</label>
                                    <input
                                        name="city"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder={cfg.cityPlaceholder}
                                        type="text"
                                    />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">{cfg.addressLabel}</label>
                                    <input
                                        name="address"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder={cfg.addressPlaceholder}
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest/80 backdrop-blur-xl p-8 rounded-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <span className="h-8 w-8 rounded-full bg-gradient-to-br from-primary-container to-secondary flex items-center justify-center text-white text-xs font-bold">
                                    4
                                </span>
                                <h2 className="font-headline font-bold text-2xl">Security</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">Password</label>
                                    <input
                                        name="password"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-on-surface-variant ml-1">Confirm Password</label>
                                    <input
                                        name="confirm_password"
                                        className="w-full h-12 bg-surface border-none rounded-lg px-4 focus:ring-2 focus:ring-primary transition-all text-on-surface placeholder:text-outline-variant"
                                        placeholder="••••••••"
                                        type="password"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    className="mt-1 h-5 w-5 rounded border-none bg-surface-container-highest text-primary focus:ring-primary"
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                />
                                <span className="text-on-surface-variant text-sm select-none">
                                    I agree to the <Link className="text-primary font-semibold hover:underline" href="/about">Clinical Standards</Link> and{' '}
                                    <Link className="text-primary font-semibold hover:underline" href="/about">Terms of Service</Link>. I understand that my credentials will be
                                    verified by the MediHub Compliance Team.
                                </span>
                            </label>
                            <button className="w-full bg-gradient-to-br from-primary-container to-secondary text-white font-headline font-bold text-lg py-4 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-3" type="submit">
                                Submit Application
                                <span className="material-symbols-outlined">send</span>
                            </button>
                            <p className="text-center text-on-surface-variant text-sm">Registration process usually takes 2-3 business days for license verification.</p>
                        </div>
                    </form>
                </div>
            </main>

            <footer className="bg-surface-container-low">
                <div className="w-full py-12 px-6 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
                    <div className="flex flex-col items-center md:items-start">
                        <span className="text-lg font-bold text-on-surface font-headline">MediHub</span>
                        <p className="font-body text-sm text-on-surface-variant mt-1">© 2024 MediHub Clinical Sanctuary. Secure & Encrypted.</p>
                    </div>
                    <nav className="flex flex-wrap justify-center gap-6">
                        <Link className="font-body text-sm text-on-surface-variant hover:text-primary transition-all" href="/about">Clinical Standards</Link>
                        <Link className="font-body text-sm text-on-surface-variant hover:text-primary transition-all" href="/contact">Provider Support</Link>
                        <Link className="font-body text-sm text-on-surface-variant hover:text-primary transition-all" href="/about">Privacy Policy</Link>
                        <Link className="font-body text-sm text-on-surface-variant hover:text-primary transition-all" href="/about">HIPAA Compliance</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

