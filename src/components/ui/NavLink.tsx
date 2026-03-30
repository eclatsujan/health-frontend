'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ComponentProps, ReactNode } from 'react';

type NavLinkProps = Omit<ComponentProps<typeof Link>, 'className'> & {
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
  children?: ReactNode;
};

function pathMatches(pathname: string, href: string, end?: boolean): boolean {
  if (end) return pathname === href;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({
  href,
  className,
  end,
  children,
  ...rest
}: NavLinkProps) {
  const pathname = usePathname();
  const path = typeof href === 'string' ? href : (href.pathname ?? '/');
  const isActive = pathMatches(pathname, path, end);
  const cn =
    typeof className === 'function' ? className({ isActive }) : className;

  return (
    <Link href={href} className={cn} {...rest}>
      {children}
    </Link>
  );
}
