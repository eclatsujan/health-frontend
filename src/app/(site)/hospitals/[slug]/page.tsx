import HospitalDetailView from '@/components/pages/HospitalDetailView';

export default async function HospitalDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <HospitalDetailView slug={slug} />;
}
