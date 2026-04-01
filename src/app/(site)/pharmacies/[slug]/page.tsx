import PharmacyDetailView from '@/components/pages/PharmacyDetailView';

export default async function PharmacyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PharmacyDetailView slug={slug} />;
}
