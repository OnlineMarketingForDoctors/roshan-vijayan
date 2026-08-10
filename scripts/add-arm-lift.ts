/**
 * Creates (or updates) the Arm Lift procedure from the old vijayan.co.uk page,
 * preserving its copy and metadata so the existing search value carries over.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/add-arm-lift.ts --with-user-token
 *
 * Section art is generated; the script downloads it once and uploads it into
 * Sanity. Images already set on the document are left alone, so re-running is
 * safe. US spellings in the original are corrected to UK.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const SLUG = 'arm-lift'
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
const faq = (question: string, answer: string) => ({_type: 'faq', question, answer})

const IMAGES: Record<string, string> = {
  heroImage: `${CDN}hf_20260810_004538_0ca6bc25-7a6e-4174-9f08-bab97bda18a8.png`,
  overviewImage: `${CDN}hf_20260810_004538_fbcb8e02-4471-444b-97b6-c4cddaa2070f.png`,
  candidatesImage: `${CDN}hf_20260810_004538_e5d31637-e541-491e-830c-35f9cf11f840.png`,
  benefitsImage: `${CDN}hf_20260810_004538_512b529d-20b5-4863-a582-8be9bf25ee47.png`,
}

const fields = {
  title: 'Arm Lift',
  category: 'Body',
  surgical: true,

  heroHeading: 'Arm Lift',
  heroPromise:
    'An Arm Lift, also known as brachioplasty, is a specialised cosmetic procedure that tightens and improves the contour of the upper arms by removing excess skin and fat.',
  heroBullets: [
    'A firmer, more defined upper-arm contour',
    'Loose, redundant skin removed',
    'Incisions placed along the inside or back of the arm',
    'Consultant-led care from consultation to final review',
  ],

  showIntro: true,
  introHeading: 'Toned, Better-Defined Upper Arms',
  introBody: [
    para(
      'i1',
      'An Arm Lift is offered by Consultant Plastic Surgeon Mr Roshan Vijayan, and aims to tighten and improve the contour of the upper arms by removing excess skin and fat.',
    ),
    para(
      'i2',
      'Below you will find a guide to the procedure, its benefits, suitability, the recovery process, and the reasons for choosing Mr Vijayan for arm lift surgery.',
    ),
  ],

  showResults: false,

  showOverview: true,
  overviewHeading: 'What is an Arm Lift?',
  overviewBody: [
    para(
      'o1',
      'An Arm Lift (brachioplasty) involves the removal of excess skin and fat from the upper arms to create a more toned and contoured appearance.',
    ),
    para(
      'o2',
      'It is most often considered when skin has lost its elasticity after weight loss or with age, and no longer retracts on its own.',
    ),
  ],

  showGlance: true,
  atAGlance: keyed('g', [
    glance('clock', 'Surgery time', '1–3 hours'),
    glance('briefcase', 'Time off work', '1–2 weeks'),
    glance('home', 'Hospital stay', 'Day case'),
    glance('droplet', 'Showering', 'After 2 days'),
    glance('walk', 'Light activity', 'After 1–2 weeks'),
    glance('shield', 'Compression garment', '4–6 weeks'),
    glance('activity', 'Exercise', 'After 4–6 weeks'),
    glance('navigation', 'Driving', 'After 1–2 weeks'),
    glance('check', 'Full recovery', '4–6 weeks'),
    glance('moon', 'Final results', '3–6 months'),
  ]),

  showConditions: true,
  conditionsHeading: 'What Can an Arm Lift Address?',
  conditionsIntro:
    'Loose upper-arm skin is usually the result of weight loss or the natural loss of elasticity with age, and exercise alone cannot tighten it. An arm lift can address:',
  conditions: [
    'Loose or hanging skin along the upper arm',
    'Skin that did not retract after significant weight loss',
    'Loss of firmness and elasticity with age',
    'An upper-arm contour that exercise cannot improve',
    'Excess fat across the upper arm',
    'Chafing or irritation where skin folds rub',
    'Difficulty finding sleeves that fit comfortably',
    'Self-consciousness about wearing sleeveless clothing',
  ],

  showBenefits: true,
  benefitsHeading: 'Benefits of an Arm Lift',
  benefitsIntro:
    'The most noticeable benefit is the improved shape and contour of the upper arms, resulting in a more toned and youthful appearance. An arm lift can achieve:',
  benefitsList: [
    'Improved shape and contour of the upper arms',
    'A more toned and youthful appearance',
    'Greater comfort wearing sleeveless clothing',
    'More confidence in social situations',
    'Better fitting clothes and improved overall comfort',
    'Lasting results, maintained with a stable weight and healthy lifestyle',
  ],

  showCandidates: true,
  candidatesHeading: 'Who is a Good Candidate?',
  candidatesIntro:
    'Ideal candidates for an arm lift are individuals experiencing excess skin and fat in the upper arm area, typically due to weight loss or ageing. Suitable candidates are typically:',
  candidates: [
    'Troubled by excess skin and fat on the upper arms',
    'At a stable weight, often following significant weight loss',
    'In good overall health and non-smokers',
    'Prepared for the scar an arm lift involves',
    'Realistic about the surgical outcomes',
  ],
  candidatesOutro:
    'Because an arm lift exchanges loose skin for a scar along the arm, Mr Vijayan will discuss scar position and healing carefully so you can weigh that trade-off before deciding.',

  showTechniques: false,

  showProcedure: true,
  procedureHeading: 'About the Procedure',
  procedureBody: [
    para(
      'p1',
      'The procedure is performed under general anaesthesia and normally takes 1 to 3 hours.',
    ),
    para(
      'p2',
      'Incisions are typically made along the inside or back of the arm, allowing for removal of surplus tissue and tightening of the underlying supportive tissue to deliver a smooth and defined arm shape.',
    ),
  ],

  showJourney: false,

  showRecovery: true,
  recoveryHeading: 'Recovery Process',
  recoveryIntro:
    'Recovery from an arm lift usually involves a few weeks of downtime. Swelling and bruising are common initially but subside gradually, and wearing a compression garment as advised can aid recovery and improve results.',
  recovery: keyed('r', [
    stage(
      'The first few days',
      'Swelling and bruising are expected and settle gradually. A compression garment supports the arms as they heal.',
    ),
    stage(
      'Week one to two',
      'Patients can generally return to work and light activities within one to two weeks.',
    ),
    stage(
      'Weeks three to six',
      'Strenuous activities and heavy lifting are avoided for at least four to six weeks to allow proper healing.',
    ),
    stage(
      'Three to six months',
      'Swelling settles and the final contour becomes clear. Scars soften and fade, and regular follow-up appointments monitor your healing progress.',
    ),
  ]),

  showRisks: true,
  risksHeading: 'Risks and Complications',
  risksIntro:
    'As with any surgery, there are risks. These are rare and can be minimised by following the detailed pre- and post-operative care instructions provided by Mr Vijayan and his team. Risks may include:',
  risks: [
    'Infection',
    'Bleeding',
    'Adverse reactions to anaesthesia',
    'Changes in skin sensation',
    'Prominent or widened scarring',
    'Asymmetry or the need for further surgery',
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
      'Restoring the body after significant weight loss is a particular focus of his practice. Each arm lift is planned individually, with careful thought given to where the scar sits and how discreet it can be kept for the correction required.',
    ),
  ],

  showWhy: true,
  whyHeading: 'Why Choose Mr Roshan Vijayan?',
  whyIntro:
    'Mr Roshan Vijayan has extensive experience as a Consultant Plastic Surgeon and is known for delivering exceptional patient care. His customised approach ensures each patient receives a tailored treatment plan focused on their specific needs and goals. His care is based on:',
  whyPoints: [
    'Extensive consultant experience in body contouring',
    'A tailored treatment plan focused on your specific goals',
    'Open discussion of scar position, healing and realistic results',
    'Care from consultation through to post-operative review',
    'A second consultation before treatment, included as standard',
    'The highest standard of care in a supportive, professional environment',
  ],

  showCost: true,
  costHeading: 'How Much Does an Arm Lift Cost?',
  costIntro:
    'The cost of an arm lift depends on the extent of the correction required and whether it is combined with another body-contouring procedure.',
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
      'Is an Arm Lift surgery painful?',
      'The procedure is performed under general anaesthesia, ensuring you do not feel pain during the surgery. Post-operative discomfort is normal but can be managed with prescribed pain medications, with most discomfort subsiding within a few days to a week.',
    ),
    faq(
      'How long does the surgery take?',
      'The surgery usually takes about 1 to 3 hours, depending on the extent of the correction needed and specific techniques used.',
    ),
    faq(
      'Will there be visible scars?',
      'Incisions are typically made on the inner or back side of the arm to minimise visible scarring. Over time, the scars tend to fade and become less noticeable. Advanced surgical techniques are used to achieve the best possible aesthetic outcome.',
    ),
    faq(
      'Are there any risks or complications?',
      'As with any surgery, there are risks such as infection, bleeding, adverse reactions to anaesthesia, and changes in skin sensation. These risks are rare and can be minimised by following the detailed pre- and post-operative care instructions provided by Mr Vijayan and his team.',
    ),
    faq(
      'When can I resume normal activities?',
      'Most patients can return to normal activities, including work, within 1 to 2 weeks. However, it is crucial to avoid strenuous activities and heavy lifting for at least 4 to 6 weeks to facilitate proper healing and achieve optimal results.',
    ),
    faq(
      'How long do the results last?',
      'The results of an arm lift are generally long-lasting, particularly when maintaining a stable weight and healthy lifestyle. However, the natural ageing process will continue to affect your skin’s elasticity over time.',
    ),
  ]),

  showRelated: true,
  ctaHeading: 'Book Your Arm Lift Consultation',
  ctaBody:
    'If weight loss or time has left you with loose skin on the upper arms, a consultation can clarify whether an arm lift is the right procedure. Mr Vijayan will assess your arms, explain where the scar would sit and give you an honest view of the result. Contact us today to arrange your consultation.',

  seoTitle: 'Arm Lift | Roshan Vijayan',
  seoDescription:
    'Discover expert arm lift treatments with Consultant Plastic Surgeon Mr Roshan Vijayan for toned, youthful arms. Book your consultation today!',
}

async function uploadImage(field: string, url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed (HTTP ${res.status})`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {
    filename: `arm-lift-${field.replace(/Image$/, '').toLowerCase()}.png`,
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
