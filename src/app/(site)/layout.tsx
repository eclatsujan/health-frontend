import QueryProvider from '@/components/providers/QueryProvider';
import MobileBottomNav from '@/components/site/MobileBottomNav';
import RouteMetaManager from '@/components/site/RouteMetaManager';
import SiteFooter from '@/components/site/SiteFooter';
import SiteHeader from '@/components/site/SiteHeader';

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <div className="flex min-h-screen flex-col">
        <RouteMetaManager />
        <SiteHeader />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileBottomNav />
      </div>
    </QueryProvider>
  );
}
