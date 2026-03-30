import HomeHero from '@/components/home/HomeHero';
import HomeCategoryRow from '@/components/home/HomeCategoryRow';
import HomeStats from '@/components/home/HomeStats';
import HomeDirectoryPreview from '@/components/home/HomeDirectoryPreview';
import HomeNewsAndBlogs from '@/components/home/HomeNewsAndBlogs';

/** Hero → Categories → Stats → Featured directory → Blog & news */
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeCategoryRow />
      <HomeStats />
      <HomeDirectoryPreview />
      <HomeNewsAndBlogs />
    </>
  );
}
