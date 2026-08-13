/**
 * Creates (or updates) the Upper and Lower Lid Blepharoplasty procedure from
 * the old vijayan.co.uk page, preserving its copy and metadata so the existing
 * search value carries over. It publishes under
 * /procedures/face/upper-and-lower-lid-blepharoplasty/, matching the old path.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/add-blepharoplasty.ts --with-user-token
 *
 * Section art is generated; the script downloads it once and uploads it into
 * Sanity. Images already set on the document are left alone, so re-running is
 * safe. The stray markdown fence at the foot of the source page is dropped and
 * US spellings are corrected to UK.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const SLUG = 'upper-and-lower-lid-blepharoplasty'
const CDN = 'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/'

const para = (key: string, text: string) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: `${key}s`, text, marks: []}],
})

const keyed = <T extends object>(prefix: string, items: T[]) =>
  items.map((item, i) => ({...item, _key: `${prefix}${i}`}))

const glance = (icon: string, label: string, value: string) => ({_type: 'glanceItem', icon, label, value})
const stage = (s: string, description: string) => ({_type: 'recoveryStage', stage: s, description})
const journeyStage = (s: string, description: string) => ({_type: 'journeyStage', stage: s, description})
const faq = (question: string, answer: string) => ({_type: 'faq', question, answer})

const IMAGES: Record<string, string> = {
  heroImage: `${CDN}hf_20260810_014131_a5ed7a41-19e4-4707-a9d3-86d07e1df4ba.png`,
  overviewImage: `${CDN}hf_20260810_014131_634e0e9b-697f-4633-bac7-230170d092a0.png`,
  candidatesImage: `${CDN}hf_20260810_014131_957415f9-b95c-4ddc-bd65-22e5b7cc19c7.png`,
  benefitsImage: `${CDN}hf_20260810_014131_59b5538f-ae84-4f81-bcfa-81b70ce9bbf2.png`,
}

const fields = {
  title: 'Upper and Lower Lid Blepharoplasty',
  category: 'Face',
  surgical: true,

  heroHeading: 'Upper and Lower Lid Blepharoplasty',
  heroPromise:
    'Upper and Lower Lid Blepharoplasty is a specialised cosmetic procedure aimed at rejuvenating the appearance of the eyes by removing excess skin, fat, and muscle from the upper and lower eyelids.',
  heroBullets: [
    'A more youthful, refreshed appearance',
    'Under-eye bags and puffiness reduced',
    'Improved vision where skin obstructs it',
    'Scars concealed in the natural folds of the eyelid',
  ],

  showIntro: true,
  introHeading: 'Rejuvenated, Refreshed Eyes',
  introBody: [
    para(
      'i1',
      'This surgery not only enhances the aesthetic appeal but also improves the functional aspects of the eyelids, offering a more youthful and refreshed look.',
    ),
    para(
      'i2',
      'The procedure is tailored to meet individual needs, ensuring natural and harmonious results, with Mr Roshan Vijayan dedicated to delivering results shaped around your own features.',
    ),
  ],

  showResults: true,

  showOverview: true,
  overviewHeading: 'What is Blepharoplasty?',
  overviewBody: [
    para(
      'o1',
      'Blepharoplasty, commonly known as eyelid surgery, is a cosmetic procedure that involves the removal of excess skin, fat, and muscle from the upper and lower eyelids.',
    ),
    para(
      'o2',
      'This surgery aims to correct droopy eyelids, reduce puffiness, and eliminate under-eye bags, resulting in a more youthful and refreshed appearance.',
    ),
  ],
  // The render already faces right, toward the copy, so no mirroring.
  // Set explicitly rather than omitted, so a re-run clears the earlier true.
  overviewImageFlip: false,

  showGlance: true,
  atAGlance: keyed('g', [
    glance('clock', 'Surgery time', '1–3 hours'),
    glance('shield', 'Anaesthetic', 'Local with sedation, or general'),
    glance('home', 'Hospital stay', 'Day case'),
    glance('briefcase', 'Time off work', '1–2 weeks'),
    glance('droplet', 'Cold compresses', 'First few days'),
    glance('moon', 'Sleeping elevated', 'First week'),
    glance('check', 'Sutures removed', 'Within a week'),
    glance('activity', 'Exercise', 'After a few weeks'),
    glance('navigation', 'Driving', 'After 1–2 weeks'),
    glance('clipboard', 'Final results', 'Several months'),
  ]),

  showConditions: true,
  conditionsHeading: 'What Can Blepharoplasty Address?',
  conditionsIntro:
    'The skin around the eyes is the thinnest on the face, so it shows age early. Blepharoplasty can address:',
  conditions: [
    'Droopy or hooded upper eyelids',
    'Excess skin that obstructs the field of vision',
    'Under-eye bags and puffiness',
    'A tired appearance that rest does not change',
    'Fine, crêped skin on the lower lids',
    'Fat that has become prominent around the eye',
    'Asymmetry between the two eyelids',
    'Difficulty applying make-up to a hooded lid',
  ],

  showBenefits: true,
  benefitsHeading: 'Benefits of Blepharoplasty',
  benefitsIntro: 'Blepharoplasty offers numerous benefits, including:',
  benefitsList: [
    'Enhanced aesthetic appearance of the eyes',
    'Improved vision by removing obstructive excess skin',
    'Reduction of under-eye bags and puffiness',
    'A more youthful and rejuvenated look',
    'Boosted self-confidence and self-esteem',
  ],

  showCandidates: true,
  candidatesHeading: 'Who is a Good Candidate?',
  candidatesIntro:
    'Eyelid surgery suits people troubled by heaviness, puffiness or a persistently tired look around the eyes. Suitable candidates are typically:',
  candidates: [
    'Troubled by hooded upper lids or under-eye bags',
    'In good general health and non-smokers',
    'Free of untreated eye conditions such as dry eye or glaucoma',
    'Realistic about what eyelid surgery can change',
    'Looking for a rested appearance rather than a different face',
  ],
  candidatesOutro:
    'At your consultation Mr Vijayan will assess your medical history, discuss your goals and confirm whether the upper lids, the lower lids or both would benefit.',

  showTechniques: false,

  showProcedure: true,
  procedureHeading: 'The Procedure',
  procedureBody: [
    para(
      'p1',
      'The surgery is usually performed under local anaesthesia with sedation or general anaesthesia, depending on the complexity of the case. For upper eyelid surgery, an incision is made along the natural crease of the eyelid to remove excess skin, fat, and muscle.',
    ),
    para(
      'p2',
      'For lower eyelid surgery, the incision is made just below the lash line or inside the lower eyelid to address under-eye bags and puffiness. After the necessary adjustments are made, the incisions are carefully closed with sutures, and the scars are well-concealed within the natural folds of the eyelids, ensuring minimal visibility.',
    ),
  ],

  showJourney: true,
  journeyHeading: 'Your Blepharoplasty Journey',
  journeyIntro: 'The blepharoplasty procedure typically involves the following steps:',
  journey: keyed('j', [
    journeyStage(
      'Consultation',
      'During the initial consultation, Mr Vijayan will assess your medical history, discuss your goals, and determine if you are a suitable candidate for the surgery. He will also explain the procedure in detail and answer any questions you may have.',
    ),
    journeyStage(
      'Surgery',
      'The surgery is usually performed under local anaesthesia with sedation or general anaesthesia, depending on the complexity of the case. Excess skin, fat and muscle are removed through incisions placed in the eyelid crease and below the lash line.',
    ),
    journeyStage(
      'Closure',
      'After the necessary adjustments are made, the incisions are carefully closed with sutures. The scars are well-concealed within the natural folds of the eyelids, ensuring minimal visibility.',
    ),
    journeyStage(
      'Results',
      'Swelling settles over the following weeks and the eyes look progressively more rested. Follow-up appointments monitor healing and confirm the result as it refines.',
    ),
  ]),

  showRecovery: true,
  recoveryHeading: 'Recovery and Aftercare',
  recoveryIntro:
    'Recovery from blepharoplasty varies from patient to patient. It is crucial to follow the aftercare instructions provided by Mr Vijayan to ensure a smooth and successful recovery.',
  recovery: keyed('r', [
    stage(
      'The first few days',
      'Swelling and bruising around the eyes are expected. Cold compresses reduce swelling, and keeping the head elevated helps further.',
    ),
    stage(
      'The first week',
      'Discomfort and tightness in the eyelids are normal and can be managed with prescribed medications. Sutures are usually removed at a follow-up appointment.',
    ),
    stage(
      'A few weeks',
      'Strenuous activities and heavy lifting are avoided while the eyelids heal, and bruising fades.',
    ),
    stage(
      'Follow-up',
      'Follow-up appointments with Mr Vijayan monitor healing and confirm the result as swelling continues to settle.',
    ),
  ]),

  showRisks: true,
  risksHeading: 'Potential Risks and Complications',
  risksIntro:
    'As with any surgical procedure, blepharoplasty carries certain risks and potential complications. Mr Vijayan will discuss these risks with you during the consultation and take all necessary precautions to minimise them. They include:',
  risks: [
    'Infection',
    'Bleeding',
    'Scarring',
    'Dry eyes',
    'Temporary or permanent changes in vision',
    'Difficulty closing the eyes completely',
    'Asymmetry in the appearance of the eyelids',
  ],

  showSurgeon: true,
  surgeonHeading: 'Meet Mr Roshan Vijayan',
  surgeonBody: [
    para(
      's1',
      'Mr Roshan Vijayan is a GMC-registered Consultant Plastic Surgeon and Fellow of the Royal College of Surgeons. He trained extensively in plastic, reconstructive and aesthetic surgery across major UK teaching hospitals and continues to contribute to surgical education, academic work and the training of other doctors.',
    ),
    para(
      's2',
      'Eyelid surgery is measured in millimetres, and taking too much is far worse than taking too little. Mr Vijayan aims for eyes that look rested rather than operated on, preserving the natural shape and expression that make them yours.',
    ),
  ],

  showWhy: true,
  whyHeading: 'Why Choose Mr Roshan Vijayan for Eyelid Surgery?',
  whyIntro:
    'The eyes are the first thing anyone looks at, and eyelid surgery leaves very little margin for error. Mr Vijayan is a highly experienced Consultant Plastic Surgeon dedicated to delivering exceptional results tailored to your unique needs. His care is based on:',
  whyPoints: [
    'A careful assessment of the upper lids, lower lids and brow together',
    'Incisions placed in the natural folds of the eyelid',
    'Conservative removal that protects eyelid function',
    'Honest discussion of what surgery will and will not change',
    'A second consultation before treatment, included as standard',
    'Consultant-led follow-up and direct postoperative support',
  ],

  showCost: true,
  costHeading: 'How Much Does Blepharoplasty Cost?',
  costIntro:
    'The cost of eyelid surgery depends on whether the upper lids, the lower lids or both are being treated, and on the anaesthetic required.',
  costLead:
    'Every procedure is planned individually. Once Mr Vijayan has assessed you and agreed a surgical plan, you will receive a complete written quotation covering the relevant surgical, hospital and anaesthetic costs.',
  costIncludes: [
    'Your consultation with Mr Vijayan',
    'A second consultation, included',
    'Surgeon’s and anaesthetist’s fees',
    'Hospital and theatre fees',
    'All follow-up and aftercare',
    'A personal day-one call',
  ],

  showFaqs: true,
  faqHeading: 'Frequently Asked Questions',
  faqs: keyed('f', [
    faq(
      'How long does the blepharoplasty procedure take?',
      'The duration of the blepharoplasty procedure varies depending on the complexity of the case, but it typically takes between 1 to 3 hours.',
    ),
    faq(
      'Is blepharoplasty painful?',
      'Most patients experience minimal pain during the procedure due to the use of anaesthesia. Post-operative discomfort can be managed with prescribed pain medications.',
    ),
    faq(
      'How long do the results of blepharoplasty last?',
      'The results of blepharoplasty are long-lasting, with many patients enjoying the benefits for several years. However, the natural ageing process will continue, and some changes may occur over time.',
    ),
    faq(
      'Can blepharoplasty be combined with other procedures?',
      'Yes, blepharoplasty can be combined with other cosmetic procedures such as facelifts, brow lifts, or laser resurfacing to achieve more comprehensive facial rejuvenation.',
    ),
    faq(
      'Will there be visible scars after blepharoplasty?',
      'The incisions made during blepharoplasty are strategically placed within the natural folds of the eyelids, resulting in minimal visible scarring. Over time, the scars will fade and become less noticeable.',
    ),
  ]),

  showRelated: true,
  ctaHeading: 'Book Your Eyelid Surgery Consultation',
  ctaBody:
    'If heavy upper lids or under-eye bags are making you look tired when you are not, a consultation can clarify what eyelid surgery would change. Mr Vijayan will assess your eyes and give you an honest, expert view. Contact us today to arrange your consultation.',

  seoTitle: 'Upper and Lower Lid Blepharoplasty | Roshan Vijayan',
  seoDescription:
    'Discover expert upper and lower lid blepharoplasty by Consultant Plastic Surgeon Mr. Roshan Vijayan for rejuvenated, youthful eyes.',
}

async function uploadImage(field: string, url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed (HTTP ${res.status})`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {
    filename: `blepharoplasty-${field.replace(/Image$/, '').toLowerCase()}.png`,
  })
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function run() {
  const existing = await client.fetch<Record<string, unknown> | null>(
    `*[_type=="procedure" && slug.current==$slug][0]`,
    {slug: SLUG},
  )
  const id = (existing?._id as string) || `procedure.${SLUG}`

  const images: Record<string, unknown> = {}
  for (const [field, url] of Object.entries(IMAGES)) {
    if (existing?.[field]) continue
    try {
      images[field] = await uploadImage(field, url)
      console.log(`✓ ${field}: uploaded`)
    } catch (err) {
      console.warn(`! ${field}: ${(err as Error).message} — falls back to the default image`)
    }
  }

  const doc = {...fields, ...images}

  if (!existing) {
    await client.createOrReplace({
      _id: id,
      _type: 'procedure',
      slug: {_type: 'slug', current: SLUG},
      ...doc,
    })
    console.log(`\nCreated procedure ${id} (${SLUG}).`)
    return
  }

  await client.patch(id).set(doc).unset(['surgeonQuote', 'costFrom', 'benefits']).commit()
  console.log(`\nUpdated procedure ${id} (${SLUG}).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
