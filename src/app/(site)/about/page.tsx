import PageShell from '@/components/site/PageShell';

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About Us"
      title="Care listings built for Nepal"
      subtitle="MediHub brings verified directory data together — hospitals, clinicians, labs, and pharmacies — so patients can compare options in one place."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
          <h2 className="font-ui text-lg font-semibold text-slate-900">Our focus</h2>
          <p className="font-ui mt-3 text-sm leading-relaxed text-slate-600">
            Clear information on who practices where, what facilities offer, and how to reach them — for quick search and informed visits.
          </p>
        </div>
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-6">
          <h2 className="font-ui text-lg font-semibold text-slate-900">For partners</h2>
          <p className="font-ui mt-3 text-sm leading-relaxed text-slate-600">
            Hospitals maintain profiles, media, and affiliations in admin. Public APIs connect your data to apps when you are ready.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
