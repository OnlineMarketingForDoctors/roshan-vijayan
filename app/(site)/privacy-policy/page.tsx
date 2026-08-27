import Link from 'next/link'
import type {Metadata} from 'next'
import {pageMetadata} from '@/lib/meta'
import LegalPage from '@/components/LegalPage'

const PATH = '/privacy-policy/'
const DESCRIPTION =
  'How Leonie Grace Limited, trading as RV Plastic Surgery, handles the personal information you share through this website — what is collected, why, who it reaches, and the rights you hold over it.'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Privacy Policy | RV Plastic Surgery',
  description: DESCRIPTION,
})

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      standfirst="What we do with the information you give us, and the rights you have over it."
      updated="27 August 2026"
      path={PATH}
      description={DESCRIPTION}
    >
      <h2>Who we are</h2>
      <p>
        This website is operated by Leonie Grace Limited, trading as RV Plastic Surgery, the private
        practice of Mr Roshan Vijayan, Consultant Plastic Surgeon (GMC number 7020524). For the
        information described below, Leonie Grace Limited is the data controller — the organisation
        that decides why and how it is used.
      </p>
      <p>
        If you have a question about this policy, or want to exercise any of the rights set out
        further down, write to <a href="mailto:enquiries@vijayan.co.uk">enquiries@vijayan.co.uk</a>{' '}
        or call <a href="tel:01727221799">01727 221799</a>.
      </p>

      <h2>What this policy covers</h2>
      <p>
        This policy is about the information collected through this website — principally the
        enquiry form and the analytics that measure how the site is used.
      </p>
      <p>
        It does not cover your medical records. If you are seen or treated, your clinical records
        are created and held by the hospital where that happens — One Hatfield Hospital, One Stop
        Healthcare, London Skin Clinic or Lister Hospital — under that hospital&rsquo;s own privacy
        notice and its own duties of medical confidentiality. Mr Vijayan is bound by the same duty
        of confidentiality in his own right, and by the General Medical Council&rsquo;s guidance on
        confidentiality.
      </p>

      <h2>What we collect</h2>
      <dl>
        <dt>What you tell us</dt>
        <dd>
          When you complete the enquiry form or write to us, we receive your name, email address,
          telephone number, the location you prefer, and whatever you choose to put in your message.
          You decide what goes in that message. If you describe a symptom, a diagnosis or a
          procedure you are considering, that is information about your health, and the law treats
          it as a special category needing extra care. Please share only what you need to in order
          to be helped — there is no need to set out your medical history before you have spoken to
          anyone.
        </dd>

        <dt>What your browser tells us</dt>
        <dd>
          Pages you viewed, roughly where in the world you are, the type of device and browser you
          used, and how you arrived at the site. This is collected through Google Analytics, loaded
          by Google Tag Manager, and <strong>only if you accept the cookie banner</strong> — refuse
          it and nothing is collected or sent. It is described in our{' '}
          <Link href="/cookies-policy">Cookies Policy</Link>.
        </dd>

        <dt>Correspondence</dt>
        <dd>
          If we exchange emails or speak on the telephone, we keep a record of that so we can pick
          up the conversation where it left off.
        </dd>
      </dl>
      <p>
        We do not ask for payment details through this website, and this website does not take
        payments.
      </p>

      <h2>Why we use it, and on what legal basis</h2>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">What for</th>
              <th scope="col">Lawful basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Answering your enquiry and arranging a consultation</td>
              <td>
                Steps taken at your request before entering into a contract, and our legitimate
                interest in running the practice
              </td>
            </tr>
            <tr>
              <td>Health information you include in an enquiry</td>
              <td>
                Your explicit consent, given by choosing to send it; or, once you are a patient, the
                provision of healthcare under Article 9(2)(h) of the UK GDPR
              </td>
            </tr>
            <tr>
              <td>Keeping a record of correspondence</td>
              <td>Our legitimate interest in continuity of care and in defending legal claims</td>
            </tr>
            <tr>
              <td>Measuring how the website is used</td>
              <td>
                Your consent, given through the cookie banner and withdrawable at any time from{' '}
                <Link href="/cookies-policy">Cookie settings</Link> at the foot of any page
              </td>
            </tr>
            <tr>
              <td>Meeting legal, regulatory and insurance obligations</td>
              <td>Compliance with a legal obligation</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Where we rely on consent, you can withdraw it at any time. That does not affect anything
        done before you withdrew it.
      </p>

      <h2>Who else sees it</h2>
      <p>
        We do not sell your information, and we do not share it for anyone else&rsquo;s marketing.
        It reaches the following organisations, each of which acts on our instructions:
      </p>
      <ul>
        <li>
          <strong>LeadConnector (HighLevel)</strong> — the enquiry form on this site is theirs, and
          submissions pass through and are stored in their system before reaching us.
        </li>
        <li>
          <strong>Google</strong> — Google Tag Manager and Google Analytics, for the usage
          measurement described above.
        </li>
        <li>
          <strong>Vercel</strong> — hosts the website and serves its pages.
        </li>
        <li>
          <strong>Sanity</strong> — stores the site&rsquo;s own content, such as the articles and
          procedure pages. It holds nothing about you.
        </li>
      </ul>
      <p>
        If you go on to be treated, information will be shared with the hospital providing your
        care, with your GP where that is appropriate, and with your insurer if you are using
        insurance. We will tell you when that happens.
      </p>
      <p>
        We will also disclose information where the law requires it, or where there is an
        overriding duty to protect someone.
      </p>

      <h2>Where it goes</h2>
      <p>
        Some of the organisations above are based in the United States. Where information is
        transferred outside the United Kingdom, that transfer is made under the safeguards the law
        provides for it — the UK Government&rsquo;s adequacy regulations, or the International Data
        Transfer Addendum to the European Commission&rsquo;s standard contractual clauses.
      </p>

      <h2>How long we keep it</h2>
      <p>
        An enquiry that does not lead to a consultation is kept for up to two years, so that we can
        recognise you if you come back to us, and is then deleted.
      </p>
      <p>
        Where you become a patient, records relating to your care are retained for the periods set
        out in the Department of Health and Social Care&rsquo;s Records Management Code of Practice
        — for adults, normally eight years after the conclusion of treatment. Analytics data is
        retained for the period configured in Google Analytics.
      </p>

      <h2>Your rights</h2>
      <p>Over the information we hold about you, you have the right to:</p>
      <ul>
        <li>ask for a copy of it;</li>
        <li>have it corrected if it is wrong;</li>
        <li>ask us to delete it, where there is no continuing reason for us to hold it;</li>
        <li>ask us to restrict what we do with it while a question about it is resolved;</li>
        <li>object to our using it where we rely on legitimate interests;</li>
        <li>
          ask for it in a portable form, where we hold it by consent or under a contract and process
          it by automated means; and
        </li>
        <li>withdraw consent, where consent is what we rely on.</li>
      </ul>
      <p>
        Write to <a href="mailto:enquiries@vijayan.co.uk">enquiries@vijayan.co.uk</a> and we will
        respond within one month. There is no charge. We may ask you to confirm who you are before
        we release anything, which is a protection for you.
      </p>
      <p>
        No decision about you is made by automated means, and we do not profile you.
      </p>

      <h2>Keeping it safe</h2>
      <p>
        Information sent through this site travels over an encrypted connection, and access to it is
        limited to the people in the practice who need it. No system is perfect, and we cannot
        guarantee the security of information while it is in transit across the internet, but we
        take the care the law requires of us and expect the same of the organisations listed above.
      </p>

      <h2>Cookies</h2>
      <p>
        Set out separately, in our <Link href="/cookies-policy">Cookies Policy</Link>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If this policy changes, the new version appears here and the date at the top changes with
        it. Where a change materially affects you, we will say so more prominently.
      </p>

      <h2>Complaints</h2>
      <p>
        If something has gone wrong, please tell us first — most things are resolved quickly that
        way. You also have the right to complain to the Information Commissioner&rsquo;s Office, the
        UK&rsquo;s supervisory authority for data protection, at{' '}
        <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="nofollow noopener noreferrer">
          ico.org.uk
        </a>{' '}
        or on 0303 123 1113.
      </p>
      <p>
        A complaint about clinical care is handled differently: raise it with us, or with the
        hospital where you were treated, and we will explain the process that applies.
      </p>
    </LegalPage>
  )
}
