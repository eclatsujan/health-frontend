import DoctorDetailView from '@/components/pages/DoctorDetailView';

export default async function DoctorDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <DoctorDetailView slug={slug} />;
}
