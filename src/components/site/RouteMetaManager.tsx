'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { useAppName } from '@/hooks/useAppName';

function setMetaByName(name: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setMetaByProperty(property: string, content: string) {
  if (typeof document === 'undefined') return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }
  link.setAttribute('href', url);
}

function setJsonLd(id: string, value: unknown) {
  if (typeof document === 'undefined') return;
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(value);
}

function titleFromPath(pathname: string) {
  const cleaned = pathname.split('/').filter(Boolean);
  if (!cleaned.length) return 'Home';
  const last = cleaned[cleaned.length - 1];
  return last
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function buildBreadcrumb(pathname: string, origin: string) {
  const segments = pathname.split('/').filter(Boolean);
  const itemListElement: Record<string, unknown>[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: `${origin}/`,
    },
  ];

  let currentPath = '';
  segments.forEach((seg, i) => {
    currentPath += `/${seg}`;
    itemListElement.push({
      '@type': 'ListItem',
      position: i + 2,
      name: titleFromPath(seg),
      item: origin + currentPath,
    });
  });

  return {
    '@type': 'BreadcrumbList',
    '@id': `${origin}${pathname}#breadcrumb`,
    itemListElement,
  };
}

function buildSchema(pathname: string, appName: string) {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const url = `${origin}${pathname}`;
  const pageTitle = titleFromPath(pathname);

  const baseWebSite = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: `${origin}/`,
    name: appName,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${origin}/doctors?search={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  const baseOrg = {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: appName,
    url: `${origin}/`,
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: `${pageTitle} — ${appName}`,
    isPartOf: { '@id': `${origin}/#website` },
    about: { '@type': 'Thing', name: pageTitle },
    breadcrumb: { '@id': `${url}#breadcrumb` },
    inLanguage: 'en',
  };

  const graph: unknown[] = [baseWebSite, baseOrg, webPage, buildBreadcrumb(pathname, origin)];

  if (
    pathname === '/doctors' ||
    pathname === '/hospitals' ||
    pathname === '/nurses' ||
    pathname === '/labs' ||
    pathname === '/pharmacies' ||
    pathname === '/colleges'
  ) {
    graph.push({
      '@type': 'CollectionPage',
      '@id': `${url}#collection`,
      name: `${pageTitle} Directory`,
      url,
      isPartOf: { '@id': `${origin}/#website` },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

function routeMatches(pattern: string, pathname: string): boolean {
  if (pattern === '/') return pathname === '/';
  const pa = pattern.split('/').filter(Boolean);
  const pb = pathname.split('/').filter(Boolean);
  if (pa.length !== pb.length) return false;
  for (let i = 0; i < pa.length; i++) {
    if (pa[i].startsWith(':')) continue;
    if (pa[i] !== pb[i]) return false;
  }
  return true;
}

function resolveMeta(pathname: string, appName: string) {
  const routes: { path: string; title: string; description: string }[] = [
    { path: '/', title: `${appName} — Find doctors & hospitals`, description: 'Find verified doctors, hospitals, labs, pharmacies, and nurses across Nepal.' },
    { path: '/about', title: `About — ${appName}`, description: `Learn about ${appName} and our healthcare directory platform.` },
    { path: '/doctors', title: `Doctors — ${appName}`, description: 'Browse doctors by specialty, location, and availability.' },
    { path: '/hospitals', title: `Hospitals — ${appName}`, description: 'Explore hospitals and clinics with key services and care options.' },
    { path: '/nurses', title: `Nurses — ${appName}`, description: 'Find qualified nurses for home and clinical care support.' },
    { path: '/labs', title: `Laboratories — ${appName}`, description: 'Search diagnostic labs by location and service availability.' },
    { path: '/pharmacies', title: `Pharmacies — ${appName}`, description: 'Locate pharmacies with delivery, discounts, and operating hours.' },
    { path: '/colleges', title: `Colleges — ${appName}`, description: 'Browse medical and nursing colleges by city and district.' },
    { path: '/contact', title: `Contact — ${appName}`, description: `Contact ${appName} for support, partnerships, and general queries.` },
    { path: '/blog', title: `Blog — ${appName}`, description: `Health articles, tips, and updates from ${appName}.` },
    { path: '/news', title: `News — ${appName}`, description: `Latest announcements and updates from ${appName}.` },
    { path: '/register', title: `Register — ${appName}`, description: 'Join the MediHub network and create your provider account.' },
    { path: '/register/sucess', title: `Registration Success — ${appName}`, description: 'Your registration was submitted successfully.' },
    { path: '/register/success', title: `Registration Success — ${appName}`, description: 'Your registration was submitted successfully.' },
    { path: '/register/failure', title: `Registration Required Action — ${appName}`, description: 'Additional information is required to complete registration.' },
    { path: '/login', title: `User Login — ${appName}`, description: 'Sign in to your MediHub provider account.' },
    { path: '/admin/login', title: `Admin Login — ${appName}`, description: 'Secure administrative login for MediHub portal.' },
    { path: '/emergency', title: `Emergency Services — ${appName}`, description: 'Emergency contacts, ER status, and rapid-care resources.' },
    { path: '/specialties/:slug', title: `Specialty Doctors — ${appName}`, description: 'Browse doctors by specialty and location.' },
    { path: '/doctors/:slug', title: `Doctor Profile — ${appName}`, description: 'Doctor profile, availability, and appointment details.' },
    { path: '/hospitals/:slug', title: `Hospital Profile — ${appName}`, description: 'Hospital profile, departments, facilities, and contact details.' },
    { path: '/nurses/:slug', title: `Nurse Profile — ${appName}`, description: 'Nurse profile, experience, and service information.' },
    { path: '/labs/:slug', title: `Laboratory Profile — ${appName}`, description: 'Laboratory profile, tests, and booking details.' },
    { path: '/pharmacies/:slug', title: `Pharmacy Profile — ${appName}`, description: 'Pharmacy profile, services, and contact details.' },
    { path: '/colleges/:slug', title: `College Profile — ${appName}`, description: 'College profile, programs, and overview information.' },
    { path: '/blog/:slug', title: `Blog Article — ${appName}`, description: 'Read the latest health article on MediHub.' },
    { path: '/news/:slug', title: `News Article — ${appName}`, description: 'Read the latest MediHub news and announcements.' },
  ];

  for (const route of routes) {
    if (routeMatches(route.path, pathname)) return route;
  }

  return {
    title: `${appName} — Healthcare Directory`,
    description: 'Discover trusted healthcare providers, hospitals, and services.',
  };
}

export default function RouteMetaManager() {
  const pathname = usePathname();
  const appName = useAppName();

  const stableApp = useMemo(() => appName, [appName]);

  useEffect(() => {
    const meta = resolveMeta(pathname, stableApp);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const canonicalUrl = `${origin}${pathname}`;
    document.title = meta.title;
    setCanonical(canonicalUrl);
    setMetaByName('description', meta.description);
    setMetaByProperty('og:title', meta.title);
    setMetaByProperty('og:description', meta.description);
    setMetaByProperty('og:url', canonicalUrl);
    setMetaByProperty('og:type', 'website');
    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:title', meta.title);
    setMetaByName('twitter:description', meta.description);
    setJsonLd('route-jsonld', buildSchema(pathname, stableApp));
  }, [pathname, stableApp]);

  return null;
}
