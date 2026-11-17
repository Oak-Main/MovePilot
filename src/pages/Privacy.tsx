import {
  LegalContact,
  LegalEmail,
  LegalHeading,
  LegalList,
  LegalPage,
  LegalText,
} from '@/components/legal/LegalPage';
import { LEGAL } from '@/lib/legal';

/* ==========================================================================
   /privacy — Privacy Policy.

   Wording source: the owner's legal kit v2 (privacy template, no-affiliate
   variant since 2026-11-17), used verbatim wherever it applies. Paragraphs marked NON-KIT are
   additions for a site with accounts. Each one states only what the code and
   the live site do today (see the pull request that added this page for the
   evidence) and is awaiting owner review. If the behaviour changes — a payment
   processor, an email or SMS provider, account deletion in the app — change
   the matching sentence here and move LEGAL.effectiveDate.
   ========================================================================== */

export function Privacy() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalText>
        {`Effective ${LEGAL.effectiveDate}. This policy explains what ${LEGAL.siteName} (${LEGAL.siteUrl}), operated by ${LEGAL.entity}, collects when you visit, and what you can do about it.`}
      </LegalText>

      <LegalHeading>What we collect</LegalHeading>
      <LegalText>
        {/* NON-KIT (first sentence; replaces the kit's "We do not ask you to create an account.") */}
        You can use the calculators and the carrier check without an account. When you visit, our
        hosting and security provider (Cloudflare) processes technical data such as your IP address,
        browser type and the pages you request, to deliver and protect the site. We use the
        following analytics tools to understand which pages are read:
      </LegalText>
      <LegalList items={[...LEGAL.analytics]} />
      <LegalText>
        These tools may set cookies or similar identifiers and collect usage data such as pages
        viewed, approximate location derived from IP address, device type and referring site.
      </LegalText>
      {/* NON-KIT */}
      <LegalText>
        Google Analytics 4 is loaded through Cloudflare Zaraz, which sets a cookie named
        cf_zaraz_client.
      </LegalText>

      {/* NON-KIT section */}
      <LegalHeading>Accounts</LegalHeading>
      <LegalText>
        An account is optional. If you create one, we store your email address and a salted hash of
        your password; we do not store the password itself. Sign-in is by email address and password
        only.
      </LegalText>
      <LegalText>
        When you sign in, the site issues a random session token. Your browser keeps it in local
        storage, not in a cookie, and sends it with each request; we store a hash of the token, when
        it was created and when it was last used. The token has no set expiry and stays valid until
        you sign out.
      </LegalText>
      <LegalText>
        If you save an inventory without an account, the site issues the same kind of token with no
        email address attached. Your browser&apos;s local storage also holds your theme choice and
        whether the Project Pass is unlocked.
      </LegalText>

      {/* NON-KIT section */}
      <LegalHeading>What you save</LegalHeading>
      <LegalText>If you choose to save your work, we store what you enter:</LegalText>
      <LegalList
        items={[
          'Inventories: the name of the inventory, the items and quantities in it, and the calculated volume totals.',
          'Timelines: your move date and the task list generated from it.',
          'Relocation Vault quotes: the mover’s name, its USDOT number if you enter one, the quoted price, weight and volume, and any quote text you paste in.',
          'Reminders: the reminder text, the phone number you enter and the time you choose.',
          'Project Pass: whether the pass is unlocked on your account and when it was unlocked.',
        ]}
      />

      {/* NON-KIT section */}
      <LegalHeading>Who processes it</LegalHeading>
      <LegalText>
        Account data and saved items are stored with Cloudflare, Inc., which hosts the site and its
        database.
      </LegalText>
      <LegalText>
        The site does not send email or text messages today, and no email or text-message provider
        receives your data.
      </LegalText>
      <LegalText>
        No payment is taken on this site today: the pricing page shows a price for the Project Pass,
        but no payment processor is connected and the site does not ask for or store card details.
      </LegalText>

      <LegalHeading>Affiliate links</LegalHeading>
      <LegalText>
        This site carries no affiliate links. If that changes, this policy will say so before any
        such link appears.
      </LegalText>
      {/* NON-KIT */}
      <LegalText>
        If you follow a partner link, we record which partner, the destination address, the page you
        were on and the time, and then send you to the partner&apos;s site.
      </LegalText>

      <LegalHeading>How we use information</LegalHeading>
      <LegalText>
        We use this information to run, secure and improve the site and to understand which content
        is useful. We do not sell your personal information.
      </LegalText>

      <LegalHeading>Your rights</LegalHeading>
      <LegalText>
        Depending on where you live, including California under the CCPA as amended by the CPRA, you
        may have the right to know what personal information we hold about you, to ask us to delete
        or correct it, and to opt out of its sale or sharing. We do not sell personal information.
        To make a request, contact us at the address below; we will not discriminate against you for
        exercising these rights.
      </LegalText>

      {/* NON-KIT section */}
      <LegalHeading>Deleting your data</LegalHeading>
      <LegalText>
        To ask us to delete your account and everything saved under it, email <LegalEmail />.
      </LegalText>
      <LegalText>
        In the app you can delete saved inventories from the dashboard and quotes from the
        Relocation Vault. The &ldquo;Delete my data&rdquo; control in Settings deletes your saved
        inventories and signs you out; it does not delete the account itself, timelines, Vault
        quotes or reminders.
      </LegalText>

      <LegalHeading>Children</LegalHeading>
      <LegalText>
        This site is not directed to children under 13, and we do not knowingly collect personal
        information from them.
      </LegalText>

      <LegalHeading>Changes</LegalHeading>
      <LegalText>
        We may update this policy. The effective date above shows when it last changed.
      </LegalText>

      <LegalContact />
    </LegalPage>
  );
}
