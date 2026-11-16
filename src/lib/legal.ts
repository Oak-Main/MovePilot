/**
 * Legal facts shared by /privacy and /terms — the single place the operating entity,
 * postal address, contact email, governing law and effective date are written down.
 * These are owner-supplied facts: change them here only on the owner's instruction,
 * and move EFFECTIVE_DATE whenever the wording of either page changes.
 */
export const LEGAL = {
  siteName: 'MovePilot',
  siteUrl: 'https://relocationstation.app',
  entity: 'Oak and Main Developers LLC',
  postalAddress: '1223 Cleveland Ave, Suite 200, San Diego, CA 92103',
  contactEmail: 'admin@oakandmain.dev',
  governingLaw: 'California',
  effectiveDate: 'November 16, 2026',
  /** Analytics tools observed on the live site (Cloudflare RUM beacon + Zaraz config). */
  analytics: ['Cloudflare Web Analytics (Cloudflare, Inc.)', 'Google Analytics 4 (Google LLC)'],
} as const;
