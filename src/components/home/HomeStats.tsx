const stats = [
  { label: 'Listed providers', value: '500+' },
  { label: 'Hospitals & clinics', value: '120+' },
  { label: 'Districts covered', value: '60+' },
  { label: 'Avg. response', value: '< 24h' },
];

export default function HomeStats() {
  return (
    <section className="border-b border-slate-100 bg-[#f8fafc] py-0">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-slate-100 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-6 text-center sm:px-6">
                <p className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
                  {s.value}
                </p>
                <p className="font-ui mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
