// @ts-nocheck
'use client';

import Link from 'next/link'

export default function EmergencyPage() {
    const hospitals = [
        { name: 'TU Teaching Hospital', state: 'FULL', wait: '120m wait', distance: '1.2km', tone: 'error' },
        { name: 'Bir Hospital', state: 'BUSY', wait: '45m wait', distance: '3.5km', tone: 'tertiary' },
        { name: 'Mediciti Hospital', state: 'AVAILABLE', wait: '5m wait', distance: '5.1km', tone: 'secondary' },
        { name: 'Norvic International', state: 'BUSY', wait: '30m wait', distance: '4.0km', tone: 'tertiary' },
    ];

    const guides = [
        ['CPR', ['Check scene safety and responsiveness.', 'Push hard and fast in center of chest.', 'Give 2 rescue breaths and repeat.']],
        ['Choking', ['Give 5 back blows between shoulder blades.', 'Give 5 abdominal thrusts.', 'Alternate until object is forced out.']],
        ['Burns', ['Cool burn with cool running water.', 'Remove rings or tight items gently.', 'Cover loosely with sterile gauze.']],
        ['Bleeding', ['Apply direct pressure with clean cloth.', 'Elevate wounded limb if possible.', 'Do not remove soaked bandages.']],
    ];

    return (
        <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container">
            <header className="sticky top-0 z-[100] w-full bg-white/80 backdrop-blur-md dark:bg-slate-900/80">
                <div className="mx-auto flex w-[90%] max-w-8xl items-center justify-between py-3">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2 rounded-full border border-secondary/10 bg-secondary-container/30 px-3 py-1.5">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-secondary opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-secondary"></span>
                            </span>
                            <span className="text-xs font-bold uppercase tracking-wider text-on-secondary-container">Ambulance Dispatch: Active</span>
                        </div>
                        <div className="hidden items-center space-x-2 text-sm font-medium text-on-surface-variant md:flex">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span>Central Zone - 4 Units Nearby</span>
                        </div>
                    </div>
                    <a
                        href="tel:102"
                        className="flex items-center space-x-3 rounded-full bg-error px-6 py-2.5 text-white shadow-lg shadow-error/20 transition-all hover:brightness-95 active:scale-95"
                    >
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            call
                        </span>
                        <span className="text-lg font-extrabold tracking-tight">EMERGENCY: CALL 102</span>
                    </a>
                </div>
            </header>

            <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col bg-surface-container-low py-8 lg:flex dark:bg-slate-900">
                <div className="mb-10 px-6">
                    <h2 className="text-xl font-bold tracking-tight text-primary-container">Emergency Portal</h2>
                    <p className="text-xs font-medium text-on-surface-variant">Priority Access</p>
                </div>
                <nav className="flex-1 space-y-1">
                    <Link className="ml-2 flex items-center space-x-3 rounded-l-full bg-white px-6 py-3 text-sm font-semibold text-primary-container shadow-sm dark:bg-slate-800" href="/emergency">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                            emergency
                        </span>
                        <span>Urgent Care</span>
                    </Link>
                    {['ambulance', 'local_hospital', 'contact_phone', 'description'].map((icon) => (
                        <Link
                            key={icon}
                            className="flex items-center space-x-3 px-6 py-3 text-sm font-semibold text-on-surface-variant transition-all hover:translate-x-1 hover:bg-surface-container-highest dark:hover:bg-slate-800"
                            href={icon === 'local_hospital' ? '/hospitals' : icon === 'contact_phone' ? '/contact' : icon === 'description' ? '/about' : '/emergency'}
                        >
                            <span className="material-symbols-outlined">{icon}</span>
                            <span>{icon === 'local_hospital' ? 'ER Status' : icon === 'contact_phone' ? 'Contacts' : icon === 'description' ? 'Protocol' : 'Ambulance'}</span>
                        </Link>
                    ))}
                </nav>
                <div className="mt-auto px-6">
                    <button className="w-full rounded-xl bg-primary-container py-3 text-sm font-bold text-white shadow-md transition-opacity hover:opacity-90">
                        Request Dispatch
                    </button>
                </div>
            </aside>

            <main className="min-h-screen lg:ml-64">
                <section className="relative flex h-[480px] w-full items-center justify-center overflow-hidden">
                    <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr_j8z0mOdg_SKB7n5V1sIoh6gUSl-Ykg9LZbYTHvedGP2Bw8bvkV71g0xzLxa5k5ki4FN9VUqOZCyRoJjx4h1W3Cd0rN5pIO6EioVeTg0zDZr7Xro1YWQXCAFENP64NK5kt5SE7wFHQ_A33dyc4cxXMujWqdYobyxfshZfinVlBTxBcWgdAjTrKVjHL87EzyIBk6VCOJlWPMlSxC587cVjd7-2jW4saqVkCTojnQ-KbW5A_3Z_w1Vk2KpiBz1cC8-usKauZUMYng"
                        alt="Emergency hospital entrance"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-container/90 to-secondary/80"></div>
                    <div className="relative z-10 w-full max-w-3xl px-6 text-center text-white">
                        <h1 className="mb-6 text-4xl font-black leading-tight tracking-tighter md:text-6xl">Emergency Services - Help is One Tap Away</h1>
                        <div className="relative mx-auto max-w-xl">
                            <input
                                className="h-16 w-full rounded-full border border-white/30 bg-white/20 pl-14 pr-6 text-lg font-medium text-white placeholder:text-white/70 transition-all focus:bg-white focus:text-on-surface focus:outline-none focus:ring-4 focus:ring-primary/30"
                                placeholder="Search for Emergency Blood/Oxygen/Pharmacy"
                                type="text"
                            />
                            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-white/70">search</span>
                        </div>
                    </div>
                </section>

                <section className="relative z-20 mx-auto -mt-16 w-[90%] max-w-8xl pb-20">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        <div className="flex h-full flex-col items-start rounded-3xl border border-white bg-white p-8 shadow-xl shadow-on-surface/5 dark:border-slate-700 dark:bg-slate-800">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-container/10 text-primary-container">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    ambulance
                                </span>
                            </div>
                            <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-primary-container">Request Ambulance</h3>
                            <p className="mb-6 font-medium leading-relaxed text-on-surface-variant">Automated GPS routing to your coordinates. Estimated arrival within 12 mins.</p>
                            <div className="mt-auto w-full">
                                <div className="mb-4 flex items-center justify-between rounded-xl bg-surface-container-low p-3 dark:bg-slate-700">
                                    <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Live ETA</span>
                                    <span className="text-sm font-black uppercase text-secondary">08:45 Mins</span>
                                </div>
                                <button className="w-full rounded-full bg-gradient-to-r from-primary-container to-secondary py-4 text-lg font-bold text-white">Dispatch Now</button>
                            </div>
                        </div>
                        <div className="flex h-full flex-col items-start rounded-3xl border border-white bg-white p-8 shadow-xl shadow-on-surface/5 dark:border-slate-700 dark:bg-slate-800">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-error-container/10 text-error">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    bloodtype
                                </span>
                            </div>
                            <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-on-surface">Blood Bank</h3>
                            <p className="mb-6 font-medium leading-relaxed text-on-surface-variant">Check real-time availability across central hospitals for critical types.</p>
                            <div className="mb-6 grid w-full grid-cols-4 gap-2">
                                <button className="rounded-lg bg-surface-container-low py-2 text-xs font-bold text-on-surface">A+</button>
                                <button className="rounded-lg bg-error py-2 text-xs font-bold text-white">O-</button>
                                <button className="rounded-lg bg-surface-container-low py-2 text-xs font-bold text-on-surface">B+</button>
                                <button className="rounded-lg bg-surface-container-low py-2 text-xs font-bold text-on-surface">AB-</button>
                            </div>
                            <button className="mt-auto w-full rounded-full bg-surface-container-highest py-4 text-lg font-bold text-on-surface dark:bg-slate-700">
                                Check Live Stocks
                            </button>
                        </div>
                        <div className="flex h-full flex-col items-start rounded-3xl border border-white bg-white p-8 shadow-xl shadow-on-surface/5 dark:border-slate-700 dark:bg-slate-800">
                            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary-fixed/30 text-tertiary">
                                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    medical_services
                                </span>
                            </div>
                            <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-on-surface">24/7 Pharmacy</h3>
                            <p className="mb-6 font-medium leading-relaxed text-on-surface-variant">Nearest licensed outlets open for emergency medical supplies.</p>
                            <ul className="mb-6 w-full space-y-3">
                                <li className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-on-surface">Central Care Pharmacy</span>
                                    <span className="text-xs font-bold text-secondary">0.8km</span>
                                </li>
                                <li className="flex items-center justify-between text-sm">
                                    <span className="font-semibold text-on-surface">LifeLine Meds</span>
                                    <span className="text-xs font-bold text-secondary">2.1km</span>
                                </li>
                            </ul>
                            <button className="mt-auto w-full rounded-full bg-surface-container-highest py-4 text-lg font-bold text-on-surface dark:bg-slate-700">
                                Find Open Nearest
                            </button>
                        </div>
                    </div>
                </section>

                <section className="bg-surface-container-low px-6 py-20 dark:bg-slate-900">
                    <div className="mx-auto w-[90%] max-w-8xl">
                        <div className="mb-10 flex flex-col items-end justify-between gap-4 md:flex-row">
                            <div>
                                <span className="mb-2 block text-xs font-bold uppercase tracking-widest text-primary">Real-time Capacity</span>
                                <h2 className="text-4xl font-black tracking-tight text-on-surface">Kathmandu ER Status Map</h2>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl lg:grid-cols-3 dark:border-slate-700 dark:bg-slate-800">
                            <div className="max-h-[600px] overflow-y-auto border-r border-surface-container-high p-8 dark:border-slate-700">
                                <h4 className="mb-6 flex items-center justify-between text-lg font-black text-on-surface">
                                    Nearest Hospitals
                                    <span className="rounded bg-surface-container-highest px-2 py-1 text-xs text-on-surface-variant dark:bg-slate-700">5 Closest</span>
                                </h4>
                                <div className="space-y-6">
                                    {hospitals.map((h) => (
                                        <div key={h.name} className="group cursor-pointer">
                                            <div className="mb-2 flex items-start justify-between">
                                                <h5 className="font-bold text-on-surface transition-colors group-hover:text-primary">{h.name}</h5>
                                                <span
                                                    className={`rounded px-2 py-0.5 text-[10px] font-black ${
                                                        h.tone === 'error'
                                                            ? 'bg-error/10 text-error'
                                                            : h.tone === 'secondary'
                                                              ? 'bg-secondary/10 text-secondary'
                                                              : 'bg-tertiary/10 text-tertiary'
                                                    }`}
                                                >
                                                    {h.state}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-on-surface-variant">
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">timer</span>
                                                    {h.wait}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <span className="material-symbols-outlined text-[14px]">directions_car</span>
                                                    {h.distance}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative min-h-[400px] lg:col-span-2">
                                <img
                                    className="absolute inset-0 h-full w-full object-cover opacity-40 grayscale"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPgCtMv5LXMMbZI7F6ytHUCo62CMPAZdY292jRy80d-Jj29p7OyN5efsDv7PRoEhH_NR1Uj7XWTzCblI08Oi27LGrUGeipAB7zSlQTtRRR4TaLuR0m4jZ2qrSZAKR0uP5M4g0q2odXpBIm21dIBRq1qQSLluR45gVIjdHyjojpcOOOvLIISW9j5_pk__2FfNek9aZmU4RCtbOAlyp7dvob6BNH42b1Bx72slSEeEySSadZG5ELoorvtI12m1ckMGrvYyy1X_BS2LQ"
                                    alt="Kathmandu map"
                                />
                                <div className="absolute inset-0 bg-primary/10"></div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-[90%] max-w-8xl px-2 py-20">
                    <h2 className="mb-12 text-center text-3xl font-black tracking-tight text-on-surface">Primary Emergency Contacts</h2>
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                        {[
                            ['local_police', 'Police', '100', 'text-primary'],
                            ['fire_truck', 'Fire', '101', 'text-error'],
                            ['skull', 'Poison', '104', 'text-tertiary'],
                            ['woman', 'Women', '1145', 'text-secondary'],
                        ].map(([icon, label, no, color]) => (
                            <Link
                                key={label}
                                href={label === 'Police' ? '/contact' : label === 'Fire' ? '/contact' : label === 'Poison' ? '/contact' : '/contact'}
                                className="group rounded-[2rem] border border-transparent bg-white p-8 text-center transition-all hover:border-primary-container hover:shadow-xl dark:bg-slate-800"
                            >
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-container-low transition-colors group-hover:bg-primary-container group-hover:text-white dark:bg-slate-700">
                                    <span className="material-symbols-outlined text-3xl">{icon}</span>
                                </div>
                                <span className="block text-lg font-black tracking-tight text-on-surface">{label}</span>
                                <span className={`font-bold ${color}`}>{no}</span>
                            </Link>
                        ))}
                    </div>
                </section>

                <section className="border-t border-surface-container-high bg-white px-6 py-20 dark:border-slate-700 dark:bg-slate-800">
                    <div className="mx-auto w-[90%] max-w-8xl">
                        <h2 className="mb-10 text-3xl font-black tracking-tight text-on-surface">First Aid Quick Guides</h2>
                        <div className="flex snap-x gap-6 overflow-x-auto pb-10">
                            {guides.map(([title, steps], idx) => (
                                <div key={title} className="min-w-[320px] snap-start rounded-3xl border border-transparent bg-surface-container-low p-8 transition-all hover:border-primary-container/20 dark:bg-slate-700">
                                    <h4 className="mb-6 flex items-center gap-3 text-xl font-black text-on-surface">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary-container shadow-sm dark:bg-slate-800">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        {title}
                                    </h4>
                                    <ul className="space-y-4 text-sm">
                                        {steps.map((s, i) => (
                                            <li key={s} className="flex gap-3">
                                                <span className="font-black text-primary">{i + 1}.</span>
                                                <span className="font-medium text-on-surface-variant">{s}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}

