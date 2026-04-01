import NurseDetailView from '@/components/pages/NurseDetailView';

export default async function NurseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <NurseDetailView slug={slug} />;
}
