'use client';

import { useEffect, useState } from 'react';

const FALLBACK = process.env.NEXT_PUBLIC_APP_NAME ?? 'MediHub';

/** Resolves app display name from `window.__APP_NAME__` after mount (Laravel parity) or env. */
export function useAppName() {
  const [name, setName] = useState(FALLBACK);
  useEffect(() => {
    if (typeof window !== 'undefined' && window.__APP_NAME__) {
      setName(window.__APP_NAME__);
    }
  }, []);
  return name;
}
