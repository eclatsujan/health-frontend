import CollegeDetailView from '@/components/pages/CollegeDetailView';

export default async function CollegeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CollegeDetailView slug={slug} />;
}
