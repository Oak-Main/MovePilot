import { Link } from 'react-router-dom';
import {
  LegalContact,
  LegalEmail,
  LegalHeading,
  LegalPage,
  LegalText,
  legalLinkClass,
} from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal';

/* ==========================================================================
   /terms — Terms of Use.

   Wording source: the owner's legal kit v2 (terms template, affiliate variant),
   used verbatim wherever it applies. The two sections marked NON-KIT (Accounts,
   Payments) are additions for a site with accounts. Each sentence in them
   states only what the code and the live site do today and is awaiting owner
   review. If the behaviour changes, change the sentence and move
   LEGAL.effectiveDate.
   ========================================================================== */

export function Terms() {
  return (
    <LegalPage title="Terms of Use">
      <LegalText>
        {`Effective ${LEGAL.effectiveDate}. These terms govern your use of ${LEGAL.siteName} (${LEGAL.siteUrl}), operated by ${LEGAL.entity}. By using the site you agree to them.`}
      </LegalText>

      <LegalHeading>Information only</LegalHeading>
      <LegalText>
        Content on this site is provided for general information. It is not professional advice.
        Prices, availability and product details change, and you should confirm them with the seller
        before you buy.
      </LegalText>

      <LegalHeading>Affiliate links and third-party sites</LegalHeading>
      <LegalText>
        Some links take you to other websites, and some are affiliate links. We are not responsible
        for the content, products or practices of other websites.
      </LegalText>

      {/* NON-KIT section */}
      <LegalHeading>Accounts</LegalHeading>
      <LegalText>
        You can use the calculators and the carrier check without an account. An account is
        optional; it is needed for timelines, the Relocation Vault and reminders, and you sign in
        with an email address and a password. What an account stores is set out in the{' '}
        <Link to="/privacy" className={legalLinkClass}>
          Privacy Policy
        </Link>
        . To close your account, email <LegalEmail />.
      </LegalText>

      {/* NON-KIT section */}
      <LegalHeading>Payments</LegalHeading>
      <LegalText>
        No payment is taken on this site today: the pricing page shows a price for the Project Pass,
        but no payment processor is connected and the site does not ask for or store card details.
      </LegalText>

      <LegalHeading>Use of the site</LegalHeading>
      <LegalText>
        You may read and share links to our pages for personal, non-commercial use. You may not copy
        substantial parts of the site, scrape it in a way that disrupts it, or use it unlawfully.
      </LegalText>

      <LegalHeading>No warranty</LegalHeading>
      <LegalText>
        The site is provided &quot;as is&quot; without warranties of any kind, to the fullest extent
        permitted by law.
      </LegalText>

      <LegalHeading>Limitation of liability</LegalHeading>
      <LegalText>
        {`To the fullest extent permitted by law, ${LEGAL.entity} is not liable for any indirect, incidental or consequential damages arising from your use of the site.`}
      </LegalText>

      <LegalHeading>Governing law</LegalHeading>
      <LegalText>
        {`These terms are governed by the laws of the State of ${LEGAL.governingLaw}, without regard to its conflict-of-law rules.`}
      </LegalText>

      <LegalHeading>Changes</LegalHeading>
      <LegalText>
        We may update these terms. The effective date above shows when they last changed.
      </LegalText>

      <LegalContact />
    </LegalPage>
  );
}
