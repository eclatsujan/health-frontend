import HomeCategoryRow from '@/components/home/HomeCategoryRow';
import HomeDirectoryPreview from '@/components/home/HomeDirectoryPreview';
import HomeHero from '@/components/home/HomeHero';
import HomeNewsAndBlogs from '@/components/home/HomeNewsAndBlogs';
import HomeStats from '@/components/home/HomeStats';
import { getHomePageInitialData } from '@/lib/homeData';

/** ISR (seconds). Must match `HOME_REVALIDATE_SECONDS` in `@/lib/homeConstants`. */
export const revalidate = 3600;

/** Hero → Categories → Stats → Featured directory → Blog & news */
export default async function HomePage() {
  const initial = await getHomePageInitialData();

  return (
    <>
      <HomeHero />
      <HomeCategoryRow />
      <HomeStats />
      <HomeDirectoryPreview
        initialDoctorsRaw={initial.doctorsRaw}
        initialHospitalsRaw={initial.hospitalsRaw}
      />
      <HomeNewsAndBlogs initialBlogs={initial.blogs} initialNews={initial.news} />
    </>
  );
}
