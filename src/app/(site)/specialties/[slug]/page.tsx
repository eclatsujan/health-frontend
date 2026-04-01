import SpecialtyPageView from '@/components/pages/SpecialtyPageView';

export default async function SpecialtyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <SpecialtyPageView slug={slug} />;
}
