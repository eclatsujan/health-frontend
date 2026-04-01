const stats = [
  { label: 'Listed providers', value: '500+' },
  { label: 'Hospitals & clinics', value: '120+' },
  { label: 'Districts covered', value: '60+' },
  { label: 'Avg. response', value: '< 24h' },
];

export default function HomeStats() {
  return (
    <section className="border-b border-outline-variant/20 bg-surface py-0">
      <div className="mx-auto w-[90%] max-w-8xl px-0 sm:px-4 py-8">
        <div className="overflow-hidden rounded-xl border border-outline-variant/30 bg-surface-container-lowest shadow-sm">
          <div className="grid grid-cols-2 divide-x divide-outline-variant/20 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-6 text-center sm:px-6">
                <p className="font-headline text-2xl font-bold text-on-surface sm:text-3xl">{s.value}</p>
                <p className="font-body mt-1 text-xs font-medium uppercase tracking-wide text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
