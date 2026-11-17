import { type ReactNode } from 'react';
import { Eyebrow } from '@/components/ui';
import { LEGAL } from '@/lib/legal';

/* ==========================================================================
   LegalPage — the shared shell for /privacy and /terms. Reuses the site's
   existing editorial pattern (the /trust hero: container-mp, the 68ch prose-mp
   measure, Eyebrow, Fraunces headings, muted body copy). Static text only: no
   fetch, no client state, nothing that mounts after first paint.
   ========================================================================== */

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative">
      <section className="container-mp py-16 md:py-24">
        <article className="prose-mp mx-auto">
          <Eyebrow>Legal</Eyebrow>
          <h1 className="mt-3 font-display text-h1 font-medium text-text">{title}</h1>
          {children}
        </article>
      </section>
    </div>
  );
}

export function LegalHeading({ children }: { children: ReactNode }) {
  return <h2 className="mt-10 font-display text-h4 font-medium text-text">{children}</h2>;
}

export function LegalText({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-body text-text-muted">{children}</p>;
}

export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="mt-3 list-disc space-y-1.5 pl-6 text-body text-text-muted">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

const linkClass = 'text-accent-ink underline-offset-4 hover:underline dark:text-accent';

/** mailto link to the legal contact address. */
export function LegalEmail() {
  return (
    <a href={`mailto:${LEGAL.contactEmail}`} className={linkClass}>
      {LEGAL.contactEmail}
    </a>
  );
}

/** The closing "Contact" block, identical on both pages (legal kit v2 wording). */
export function LegalContact() {
  return (
    <>
      <LegalHeading>Contact</LegalHeading>
      <LegalText>
        {LEGAL.entity}, {LEGAL.postalAddress}. Email: <LegalEmail />.
      </LegalText>
    </>
  );
}

export { linkClass as legalLinkClass };
