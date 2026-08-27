import Link from 'next/link'
import type {Metadata} from 'next'
import {pageMetadata} from '@/lib/meta'
import LegalPage from '@/components/LegalPage'

const PATH = '/terms-and-conditions/'
const DESCRIPTION =
  'The terms on which this website is made available — what the information here is and is not, how enquiries are handled, and the limits of our liability.'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Terms and Conditions | RV Plastic Surgery',
  description: DESCRIPTION,
})

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms and Conditions"
      standfirst="The terms on which this website is made available to you."
      updated="27 August 2026"
      path={PATH}
      description={DESCRIPTION}
    >
      <h2>Who we are</h2>
      <p>
        This website is operated by Leonie Grace Limited, trading as RV Plastic Surgery, the private
        practice of Mr Roshan Vijayan, Consultant Plastic Surgeon, registered with the General
        Medical Council under number 7020524 and on its Specialist Register for Plastic Surgery.
        You can reach us at <a href="mailto:enquiries@vijayan.co.uk">enquiries@vijayan.co.uk</a> or
        on <a href="tel:01727221799">01727 221799</a>.
      </p>

      <h2>Using this site means accepting these terms</h2>
      <p>
        By using this website you accept these terms. If you do not accept them, please do not use
        the site. We may revise them from time to time; the version published here when you visit is
        the one that applies.
      </p>

      <h2>Nothing here is medical advice</h2>
      <p>
        The procedure pages, the journal and everything else on this site are written to inform, and
        are general in nature. They are not a diagnosis, not a recommendation, and not advice about
        your own circumstances. Surgery is a decision that can only sensibly be made after an
        examination and a conversation with a surgeon who knows your history.
      </p>
      <p>
        Reading this site, or sending an enquiry through it, does not make you a patient of Mr
        Vijayan and does not create a doctor&ndash;patient relationship. That begins at a
        consultation.
      </p>
      <p>
        <strong>
          If you have an urgent medical problem, do not use this website. Contact your GP, call NHS
          111, or in an emergency call 999.
        </strong>
      </p>

      <h2>Results vary</h2>
      <p>
        The before-and-after photographs on this site are of Mr Vijayan&rsquo;s own patients, shared
        with their written consent, and have not been retouched to alter the result. They show what
        happened for those individuals. They are not a promise of what will happen for you: outcomes
        depend on your anatomy, your health, how you heal and what is realistic in your case. Any
        surgery carries risk, and the risks that matter in your case will be explained to you before
        you are asked to consent to anything.
      </p>

      <h2>Enquiries, consultations and fees</h2>
      <p>
        An enquiry is an invitation to talk, not a booking, and sending one places no obligation on
        either of us. We will normally reply within one working day, but we do not guarantee a
        response time and cannot guarantee availability.
      </p>
      <p>
        Any prices shown on this site are indicative guides to help you plan. The fee for your
        treatment depends on what is actually involved and is confirmed in writing after your
        consultation. The terms of your treatment, including cancellation, are set out in that
        written quotation and in the hospital&rsquo;s own terms — not here.
      </p>
      <p>
        Treatment takes place at independent hospitals and clinics, each regulated by the Care
        Quality Commission in its own right. Their terms govern your admission and the facilities
        they provide.
      </p>

      <h2>What belongs to us</h2>
      <p>
        The text, photographs, illustrations and design of this site belong to Leonie Grace Limited
        or are used under licence. You may read the site, print pages for your own use, and share
        links to it. You may not republish, sell or systematically copy any part of it without our
        written permission. The clinical photographs in particular must not be copied or reused
        under any circumstances: they are of real people who consented to their appearance here and
        nowhere else.
      </p>

      <h2>Using the site properly</h2>
      <p>
        Please do not misuse this site — no attempting to gain unauthorised access, no introducing
        anything malicious, no automated scraping that places an unreasonable load on it, and
        nothing unlawful. We may withdraw access if you do.
      </p>

      <h2>Links to other sites</h2>
      <p>
        Where we link to another organisation, it is because we think it may be useful. We do not
        control those sites and are not responsible for their content or their handling of your
        information.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep the site available but do not guarantee it. We may suspend, withdraw or
        change any part of it without notice.
      </p>

      <h2>Our liability</h2>
      <p>
        Nothing in these terms limits our liability for death or personal injury caused by
        negligence, for fraud, or for anything else that cannot lawfully be limited — and, to be
        clear, nothing here limits Mr Vijayan&rsquo;s professional and clinical responsibilities to
        his patients, which stand entirely outside these website terms.
      </p>
      <p>
        Subject to that, we are not liable for any loss arising from your relying on the general
        information published here, or from the site being unavailable. If you use this site in the
        course of a business, we are not liable for loss of profit, business or opportunity.
      </p>

      <h2>Concerns and complaints</h2>
      <p>
        If something has gone wrong, please tell us at{' '}
        <a href="mailto:enquiries@vijayan.co.uk">enquiries@vijayan.co.uk</a> and we will look into
        it. Concerns about clinical care can also be raised with the hospital where you were
        treated, and matters of professional conduct with the General Medical Council.
      </p>

      <h2>Your privacy</h2>
      <p>
        How we handle your information is set out in our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link> and{' '}
        <Link href="/cookies-policy">Cookies Policy</Link>.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the law of England and Wales, and the courts of England and
        Wales have exclusive jurisdiction over any dispute arising from them.
      </p>
    </LegalPage>
  )
}
