/**
 * Base URL for server-side fetch to same-origin API (RSC/ISR cannot use relative URLs).
 */
export function getSiteOrigin(): string {
  return 'http://localhost:8080';
}
