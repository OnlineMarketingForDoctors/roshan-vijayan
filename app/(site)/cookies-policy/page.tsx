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
        Almost nothing. There is no login, no basket and nothing to remember about you, so the site
        sets no cookies of its own. It does keep one thing on your device: your answer to the cookie
        question, so you are not asked again on every page. That is stored in your browser&rsquo;s
        own storage rather than in a cookie, it is never sent to us, and it holds only the word
        &ldquo;granted&rdquo; or &ldquo;denied&rdquo; and the date you chose.
      </p>
      <p>Everything below is set by a third party whose service is used on the site.</p>

      <h2>What third parties set</h2>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Set by</th>
              <th scope="col">Name</th>
              <th scope="col">What for</th>
              <th scope="col">Expires</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Google Analytics</td>
              <td>
                <code>_ga</code>
              </td>
              <td>
                Tells one browser apart from another, so a person who reads three pages is counted
                once rather than three times.
              </td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>Google Analytics</td>
              <td>
                <code>_ga_&hellip;</code>
              </td>
              <td>
                Keeps track of the current visit — which pages, in which order, and how the visitor
                arrived. The rest of the name is the identifier of this site&rsquo;s Analytics
                property.
              </td>
              <td>2 years</td>
            </tr>
            <tr>
              <td>LeadConnector (HighLevel)</td>
              <td>Varies</td>
              <td>
                The enquiry form is theirs, displayed within our page. It sets what it needs to
                present the form and to submit it once, without losing what you typed.
              </td>
              <td>Session</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Google Analytics is loaded through Google Tag Manager, which is a container rather than a
        tag: it sets no cookies of its own, and Analytics is the only thing in it. Analytics reports
        on patterns — how many people read a page, roughly where in the world they were, how they
        found the site — not on you by name.
      </p>
      <p>
        We do not use advertising cookies. This site carries no advertising, and nothing here
        follows you to other websites.
      </p>

      <h2>Your choices</h2>
      <p>
        The first time you visit, a banner asks whether the analytics cookies may be used. Nothing
        is loaded from Google until you accept — if you refuse, or simply ignore the banner, no
        request is made to them at all. Refusing is one click, in a button the same size as the one
        that accepts.
      </p>
      <p>
        Your answer is remembered in this browser for a year. It is stored on your own device and
        never sent to us, which means it does not follow you to another browser or another device,
        and you will be asked again there. To change your mind, use <strong>Cookie settings</strong>{' '}
        at the foot of any page.
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
