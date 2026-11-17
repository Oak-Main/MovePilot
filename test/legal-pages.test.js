import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
// test/legal-pages.test.js — /privacy and /terms exist everywhere a route has to be known.
//
// The site is a client-rendered SPA: Cloudflare Pages answers every path with the same
// shell (public/_redirects), and an unregistered path draws the "Page not found" view from
// src/App.tsx. So "the page exists" means four things, each asserted here:
//   (1) the route is in the registry (src/routes.tsx) and the app renders the legal page,
//       not the 404 view — rendered through the real <AppRoutes> with react-dom/server;
//   (2) the rendered page carries the operating entity, postal address, contact email and
//       governing law, plus the legal-kit wording;
//   (3) the edge-layer Worker (cloudflare/src/worker.js) gives the route its own
//       <title>/description/canonical instead of the homepage's;
//   (4) the sitemap lists it, and the footer links to it.
// No network is touched: the edge Worker's upstream fetch is mocked.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { LazyMotion, domAnimation } from 'framer-motion';
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';

const ENTITY = 'Oak and Main Developers LLC';
const ADDRESS = '1223 Cleveland Ave, Suite 200, San Diego, CA 92103';
const EMAIL = 'admin@oakandmain.dev';
const NOT_FOUND = 'Page not found';

const read = (rel) => readFileSync(fileURLToPath(new URL(`../${rel}`, import.meta.url)), 'utf8');

/** Visible text of rendered markup: tags dropped, entities decoded, whitespace collapsed. */
function textOf(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .replace(/ ([.,;:)])/g, '$1')
    .trim();
}

let AppRoutes;
let routes;
let ThemeProvider;
let LEGAL;

/** Server-render one URL through the app's real route table and chrome. */
function renderPath(path) {
  return renderToStaticMarkup(
    h(
      ThemeProvider,
      null,
      h(
        LazyMotion,
        { features: domAnimation, strict: true },
        h(StaticRouter, { location: path }, h(AppRoutes, { list: routes })),
      ),
    ),
  );
}

beforeAll(async () => {
  // The theme provider reads <html data-theme> and localStorage while rendering. Give
  // Node the two browser globals it touches; nothing else in the render path needs a DOM.
  vi.stubGlobal('document', {
    documentElement: { getAttribute: () => 'dark', setAttribute: () => {} },
  });
  vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
  ({ AppRoutes } = await import('../src/App.tsx'));
  ({ routes } = await import('../src/routes.tsx'));
  ({ ThemeProvider } = await import('../src/lib/theme.tsx'));
  ({ LEGAL } = await import('../src/lib/legal.ts'));
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('legal facts (src/lib/legal.ts)', () => {
  it('holds the owner-supplied entity, address, email, law and effective date', () => {
    expect(LEGAL.entity).toBe(ENTITY);
    expect(LEGAL.postalAddress).toBe(ADDRESS);
    expect(LEGAL.contactEmail).toBe(EMAIL);
    expect(LEGAL.governingLaw).toBe('California');
    expect(LEGAL.effectiveDate).toBe('November 17, 2026');
    expect(LEGAL.siteUrl).toBe('https://relocationstation.app');
  });
});

describe('route registry', () => {
  it('registers /privacy and /terms exactly once each, with the global chrome', () => {
    for (const path of ['/privacy', '/terms']) {
      const matches = routes.filter((r) => r.path === path);
      expect(matches, path).toHaveLength(1);
      expect(matches[0].bare, path).toBeFalsy();
    }
  });

  it('still draws the 404 view for a path that is not registered (the check is real)', () => {
    const text = textOf(renderPath('/definitely-not-a-route'));
    expect(text).toContain(NOT_FOUND);
    expect(text).not.toContain('Privacy Policy');
  });
});

describe.each([
  { path: '/privacy', title: 'Privacy Policy' },
  { path: '/terms', title: 'Terms of Use' },
])('$path', ({ path, title }) => {
  let html;
  let text;
  beforeAll(() => {
    html = renderPath(path);
    text = textOf(html);
  });

  it('renders the legal page, not the 404 view', () => {
    expect(text).not.toContain(NOT_FOUND);
    expect(html).toMatch(new RegExp(`<h1[^>]*>${title}</h1>`));
    expect(html.match(/<h1[\s>]/g)).toHaveLength(1);
  });

  it('names the operating entity, postal address, contact email and California', () => {
    expect(text).toContain(ENTITY);
    expect(text).toContain(ADDRESS);
    expect(text).toContain(EMAIL);
    expect(text).toContain('California');
    expect(text).toContain(`${ENTITY}, ${ADDRESS}. Email: ${EMAIL}.`);
    expect(html).toContain(`href="mailto:${EMAIL}"`);
  });

  it('states the effective date and the site it covers', () => {
    expect(text).toContain('Effective November 17, 2026.');
    expect(text).toContain('MovePilot (https://relocationstation.app), operated by Oak and Main Developers LLC');
  });

  it('ships no unfilled template token', () => {
    expect(html).not.toMatch(/\{\{[A-Z_]+\}\}/);
    expect(text).not.toMatch(/\bundefined\b|\[object Object\]/);
  });

  it('says no payment is taken and names no payment processor', () => {
    expect(text).toContain(
      'No payment is taken on this site today: the pricing page shows a price for the Project Pass, but no payment processor is connected and the site does not ask for or store card details.',
    );
    expect(text).not.toMatch(/Stripe|PayPal/i);
  });

  it('is linked from the footer on every page', () => {
    expect(html).toMatch(new RegExp(`<footer[\\s\\S]*href="${path}"[\\s\\S]*</footer>`));
  });
});

describe('/privacy wording', () => {
  let text;
  beforeAll(() => {
    text = textOf(renderPath('/privacy'));
  });

  it('carries the legal-kit sentences verbatim', () => {
    for (const sentence of [
      'When you visit, our hosting and security provider (Cloudflare) processes technical data such as your IP address, browser type and the pages you request, to deliver and protect the site.',
      'We use the following analytics tools to understand which pages are read:',
      'These tools may set cookies or similar identifiers and collect usage data such as pages viewed, approximate location derived from IP address, device type and referring site.',
      'This site carries no affiliate links. If that changes, this policy will say so before any such link appears.',
      'We use this information to run, secure and improve the site and to understand which content is useful. We do not sell your personal information.',
      'Depending on where you live, including California under the CCPA as amended by the CPRA, you may have the right to know what personal information we hold about you, to ask us to delete or correct it, and to opt out of its sale or sharing. We do not sell personal information. To make a request, contact us at the address below; we will not discriminate against you for exercising these rights.',
      'This site is not directed to children under 13, and we do not knowingly collect personal information from them.',
      'We may update this policy. The effective date above shows when it last changed.',
    ]) {
      expect(text).toContain(sentence);
    }
  });

  it('lists the analytics tools that run on the live site', () => {
    expect(text).toContain('Cloudflare Web Analytics (Cloudflare, Inc.)');
    expect(text).toContain('Google Analytics 4 (Google LLC)');
  });

  it('does not use the kit sentence that is false for a site with accounts', () => {
    expect(text).not.toContain('We do not ask you to create an account.');
    // No partner link renders anywhere (2026-11-17: the only one, "Packing supplies", pointed
    // at a placeholder domain and was removed), so the kit's no-affiliate variant applies.
    expect(text).not.toContain('Some pages contain affiliate links.');
  });

  it('describes accounts, sessions and deletion as the code implements them', () => {
    expect(text).toContain('we store your email address and a salted hash of your password; we do not store the password itself');
    expect(text).toContain('Sign-in is by email address and password only.');
    expect(text).toContain('local storage, not in a cookie');
    expect(text).toContain(`To ask us to delete your account and everything saved under it, email ${EMAIL}.`);
    expect(text).toContain('it does not delete the account itself, timelines, Vault quotes or reminders');
  });
});

describe('/terms wording', () => {
  let text;
  beforeAll(() => {
    text = textOf(renderPath('/terms'));
  });

  it('carries the legal-kit sentences verbatim', () => {
    for (const sentence of [
      'By using the site you agree to them.',
      'Content on this site is provided for general information. It is not professional advice. Prices, availability and product details change, and you should confirm them with the seller before you buy.',
      'Some links take you to other websites. We are not responsible for the content, products or practices of other websites.',
      'You may read and share links to our pages for personal, non-commercial use. You may not copy substantial parts of the site, scrape it in a way that disrupts it, or use it unlawfully.',
      'The site is provided "as is" without warranties of any kind, to the fullest extent permitted by law.',
      'To the fullest extent permitted by law, Oak and Main Developers LLC is not liable for any indirect, incidental or consequential damages arising from your use of the site.',
      'These terms are governed by the laws of the State of California, without regard to its conflict-of-law rules.',
      'We may update these terms. The effective date above shows when they last changed.',
    ]) {
      expect(text).toContain(sentence);
    }
  });

  it('links to the privacy policy', () => {
    expect(renderPath('/terms')).toMatch(/<article[\s\S]*href="\/privacy"[\s\S]*<\/article>/);
  });
});

describe('edge-layer Worker (cloudflare/src/worker.js)', () => {
  const SHELL =
    '<!doctype html><html lang="en"><head><meta name="description" content="Homepage pitch." />' +
    '<title>MovePilot — Real math. No spam.</title></head><body><div id="root"></div></body></html>';

  afterEach(() => {
    vi.unstubAllGlobals();
    // Re-stub the two globals the render tests above rely on.
    vi.stubGlobal('document', {
      documentElement: { getAttribute: () => 'dark', setAttribute: () => {} },
    });
    vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {}, removeItem: () => {} });
  });

  it.each([
    { path: '/privacy', title: 'Privacy Policy | MovePilot' },
    { path: '/terms', title: 'Terms of Use | MovePilot' },
  ])('answers $path with 200, its own title and a canonical', async ({ path, title }) => {
    const upstream = vi.fn(
      async () =>
        new Response(SHELL, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }),
    );
    vi.stubGlobal('fetch', upstream);
    const { default: edge } = await import('../cloudflare/src/worker.js');

    const res = await edge.fetch(
      new Request(`https://relocationstation.app${path}`, { headers: { accept: 'text/html' } }),
    );
    const out = await res.text();

    expect(res.status).toBe(200);
    expect(String(upstream.mock.calls[0][0].url)).toBe(`https://movepilot.pages.dev${path}`);
    expect(out).toContain(`<title>${title}</title>`);
    expect(out).not.toContain('<title>MovePilot — Real math. No spam.</title>');
    expect(out).not.toContain('Homepage pitch.');
    expect(out).toContain(`<link rel="canonical" href="https://relocationstation.app${path}">`);
    expect(out).toMatch(/<meta name="description" content="[^"]*Oak and Main Developers LLC[^"]*"/);
  });
});

describe('sitemap', () => {
  it('lists both legal pages on the canonical origin', () => {
    const xml = read('public/sitemap.xml');
    expect(xml).toContain('<loc>https://relocationstation.app/privacy</loc>');
    expect(xml).toContain('<loc>https://relocationstation.app/terms</loc>');
  });
});

describe('footer legal links', () => {
  // Copilot on #9: a footer item labelled "Legal" still opened /trust, the
  // marketing page. Every footer link that names a legal document must open
  // one of the two legal pages.
  it('no footer link labelled Legal, Privacy or Terms leads anywhere but /privacy or /terms', () => {
    const html = renderPath('/');
    const footer = html.match(/<footer[\s\S]*<\/footer>/)?.[0] ?? '';
    expect(footer).not.toBe('');
    // Footer links are plain text, so the label is read as the text between
    // the tags; no tag stripping (and no sanitizer) is involved.
    const links = [...footer.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map((m) => ({
      href: m[1],
      label: m[2].trim(),
    }));
    const legal = links.filter((l) => /^(legal|privacy|terms)$/i.test(l.label));
    expect(legal.map((l) => l.href).sort()).toEqual(['/privacy', '/terms']);
  });
});

describe('site claims match what the code does (2026-11-17)', () => {
  // Owner's call, delegated in chat Tue Nov 17. Each claim below was false on the
  // live site: no account deletion exists in the app, no payment processor is
  // connected, and the only partner link pointed at a placeholder domain.
  const PLACEHOLDER = /example-partner\.com|\.example\//;

  it('/trust promises no one-click account deletion', () => {
    const text = textOf(renderPath('/trust'));
    expect(text).not.toMatch(/one click|one-click/i);
    expect(text).toContain('The \u201cDelete my data\u201d control in Settings deletes your saved inventories and signs you out.');
    expect(text).toContain(`To delete the account itself and everything saved under it, email ${EMAIL}.`);
  });

  it('/pricing says no payment is taken yet, and promises no one-click deletion', () => {
    const text = textOf(renderPath('/pricing'));
    expect(text).not.toMatch(/Pay once|one click|one-click/i);
    expect(text).toContain('No payment is taken yet: the price shown is what the pass will cost once payments open.');
  });

  it('no rendered page links to a placeholder partner domain', () => {
    for (const path of ['/', '/tools', '/trust', '/pricing', '/privacy', '/terms']) {
      const html = renderPath(path);
      expect(html, path).not.toMatch(PLACEHOLDER);
      expect(html, path).not.toContain('/api/affiliate/go');
    }
  });

  it('no page wires a partner link, so "This site carries no affiliate links" stays true', () => {
    // The server render cannot reach links that appear only after client data loads
    // (the old "Packing supplies" link sat in the loaded volume calculator), so the
    // guard reads the page sources. A partner link comes back only together with a
    // real program and the legal pages' affiliate wording.
    const files = [];
    const walk = (dir) => {
      for (const e of readdirSync(dir, { withFileTypes: true })) {
        const full = join(dir, e.name);
        if (e.isDirectory()) walk(full);
        else if (/\.(tsx|ts)$/.test(e.name)) files.push(full);
      }
    };
    walk(join(process.cwd(), 'src', 'pages'));
    walk(join(process.cwd(), 'src', 'components'));
    const wired = files.filter((f) => /affiliate\.(goHref|click)\(/.test(readFileSync(f, 'utf8')));
    expect(wired).toEqual([]);
  });
});
