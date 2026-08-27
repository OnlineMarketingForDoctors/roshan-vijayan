import Link from 'next/link'
import type {Metadata} from 'next'
import {pageMetadata} from '@/lib/meta'
import LegalPage from '@/components/LegalPage'

const PATH = '/cookies-policy/'
const DESCRIPTION =
  'The cookies and similar technologies this website uses, what each is for, who sets it, and how to control them from your browser.'

export const metadata: Metadata = pageMetadata({
  path: PATH,
  title: 'Cookies Policy | RV Plastic Surgery',
  description: DESCRIPTION,
})

export default function CookiesPolicyPage() {
  return (
    <LegalPage
      title="Cookies Policy"
      standfirst="What this site stores on your device, what it is for, and how to turn it off."
      updated="27 August 2026"
      path={PATH}
      description={DESCRIPTION}
    >
      <h2>What cookies are</h2>
      <p>
        A cookie is a small file a website asks your browser to keep. It lets a site recognise the
        same browser on a later page or a later visit. Similar things can be done with other storage
        your browser provides, and where this policy says &ldquo;cookies&rdquo; it means those too.
      </p>

      <h2>What this site sets by itself</h2>
      <p>
        Nothing. This site has no login, no basket and no preferences to remember, so it sets no
        cookies of its own. Everything below is set by a third party whose service is used on the
        site.
      </p>

      <h2>What third parties set</h2>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Set by</th>
              <th scope="col">What for</th>
              <th scope="col">Kind</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Tag Manager</td>
              <td>
                Loads the measurement tags the practice has configured. Tag Manager itself is a
                container; the cookies that result are those of the tags it loads.
              </td>
              <td>Analytics</td>
            </tr>
            <tr>
              <td>Google Analytics</td>
              <td>
                Counts visits and pages, roughly where visitors are, and how they reached the site,
                so we can see which pages are useful. It reports on patterns, not on you by name.
              </td>
              <td>Analytics</td>
            </tr>
            <tr>
              <td>LeadConnector (HighLevel)</td>
              <td>
                The enquiry form is theirs, displayed within our page. It sets what it needs to
                present the form and to submit it once, without losing what you typed.
              </td>
              <td>Functional</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We do not use advertising cookies, and this site carries no advertising.
      </p>

      <h2>Your choices</h2>
      <p>
        The analytics tags above load when you arrive, and this site does not currently present a
        cookie banner asking you first. You can refuse or remove what they set at any time, and
        nothing on this site stops working if you do.
      </p>
      <p>
        Every browser lets you see the cookies a site has set, delete them, and refuse new ones —
        usually under Settings, then Privacy. Refusing them will not stop you reading this site.
      </p>
      <p>
        To opt out of Google Analytics across every site you visit, Google publishes a browser
        add-on at{' '}
        <a
          href="https://tools.google.com/dlpage/gaoptout"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          tools.google.com/dlpage/gaoptout
        </a>
        .
      </p>

      <h2>Do Not Track</h2>
      <p>
        Browsers can send a &ldquo;Do Not Track&rdquo; signal. There is no agreed standard for what
        a site should do in response, and this one does not currently act on it.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        If the tags on this site change, this page changes with them and the date at the top moves.
      </p>

      <h2>More</h2>
      <p>
        What we do with the information itself is set out in our{' '}
        <Link href="/privacy-policy">Privacy Policy</Link>. The Information Commissioner&rsquo;s
        Office publishes plain guidance on cookies at{' '}
        <a
          href="https://ico.org.uk/for-the-public/online/cookies/"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          ico.org.uk
        </a>
        .
      </p>
    </LegalPage>
  )
}
