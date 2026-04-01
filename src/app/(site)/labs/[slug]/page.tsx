import LaboratoryDetailView from '@/components/pages/LaboratoryDetailView';

export default async function LaboratoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <LaboratoryDetailView slug={slug} />;
}
