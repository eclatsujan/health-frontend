// @ts-nocheck
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import HospitalDetailStitchBody from '@/components/directory/HospitalDetailStitchBody';
import { hospitalBySlugUrl } from '@/api/publicApi';
import { usePublicSlugResource } from '@/hooks/usePublicSlugResource';
import { useAppName } from '@/hooks/useAppName';

export default function HospitalDetailView({ slug }: { slug: string }) {
  const appName = useAppName();
  const { data: h, loading, notFound, loadError } = usePublicSlugResource<any>(hospitalBySlugUrl(slug));

  useEffect(() => {
    if (h?.name) {
      document.title = `${h.name} — ${appName}`;
    }
    return () => {
      document.title = appName;
    };
  }, [h, appName]);

  if (loading) {
    return (
      <div className="bg-[#f8fafc] py-20 text-center">
        <p className="font-ui text-slate-600">Loading hospital…</p>
      </div>
    );
  }

  if (loadError && !notFound) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <p className="font-ui text-red-700">{loadError}</p>
        <Link href="/hospitals" className="font-ui mt-4 inline-block text-[#0d9488] hover:underline">
          Back to hospitals
        </Link>
      </div>
    );
  }

  if (notFound || !h) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-slate-900">Hospital not found</h1>
        <Link href="/hospitals" className="font-ui mt-6 inline-block text-[#0d9488] hover:underline">
          Back to hospitals
        </Link>
      </div>
    );
  }

  const cover = h.cover_image_url;
  const photo = h.profile_photo_url;
  const doctors = h.doctors || [];
  const lines = h.phone_lines || [];

  return (
    <HospitalDetailStitchBody h={h} cover={cover} photo={photo} doctors={doctors} lines={lines} />
  );
}
