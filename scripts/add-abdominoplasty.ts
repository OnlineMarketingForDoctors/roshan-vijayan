/**
 * Creates (or updates) the Abdominoplasty procedure from the old vijayan.co.uk
 * page, preserving its copy and metadata so the existing SEO value carries over.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/add-abdominoplasty.ts --with-user-token
 *
 * Section images are generated art; the script downloads them once and uploads
 * them into Sanity, so they end up on Sanity's CDN like any other asset. Images
 * already set on the document are left alone, so re-running is safe.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const SLUG = 'abdominoplasty'
const DOC_ID = 'procedure.abdominoplasty'

const para = (key: string, text: string) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: `${key}s`, text, marks: []}],
})

const keyed = <T extends object>(prefix: string, items: T[]) =>
  items.map((item, i) => ({...item, _key: `${prefix}${i}`}))

/** Generated section art, uploaded to Sanity on first run. */
const IMAGES: Record<string, string> = {
  heroImage:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/hf_20260809_230837_cc9ec438-1378-4016-acac-dc26815d84d0.png',
  overviewImage:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/hf_20260809_230837_26a5ffb7-1560-4461-b643-6025edd0cd80.png',
  candidatesImage:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/hf_20260809_230837_4917a36c-33b2-41b3-8cf6-72e7aeb4a904.png',
  benefitsImage:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/hf_20260809_230837_426011aa-6bc4-475b-8533-2ccc1cb7c484.png',
  techniquesImage:
    'https://d8j0ntlcm91z4.cloudfront.net/user_3Ary2g06ZSWzxFoVWIP644Wm9ZG/hf_20260809_230837_22f8abf6-d996-4661-b611-7ab527b1fba2.png',
}

const fields = {
  // ---- Identity ----
  title: 'Abdominoplasty',
  category: 'Body',
  surgical: true,

  // ---- Hero (opening sentence of the original intro) ----
  heroHeading: 'Abdominoplasty',
  heroPromise:
    'Abdominoplasty, or tummy tuck surgery, is a cosmetic procedure designed to remove excess skin and fat from the abdomen and tighten the abdominal muscles for a firmer, more toned appearance.',
  heroBullets: [
    'A smoother, flatter abdominal contour',
    'Excess, redundant skin removed',
    'Tightened, better-supported abdominal muscles',
    'Consultant-led care, with two-surgeon safety on complex cases',
  ],

  // ---- Intro (remainder of the original intro paragraph) ----
  showIntro: true,
  introHeading: 'A Firmer, Flatter Abdominal Contour',
  introBody: [
    para(
      'intro1',
      'Ideal for individuals who have loose skin due to weight loss or pregnancy, the procedure helps achieve a smoother, flatter abdomen and boosts confidence.',
    ),
    para(
      'intro2',
      'It is important to understand the risks, recovery process, and expected results before undergoing this surgery.',
    ),
  ],

  // ---- Before & After ----
  showResults: true,

  // ---- Overview (original: "What is Abdominoplasty?") ----
  showOverview: true,
  overviewHeading: 'What is Abdominoplasty?',
  overviewBody: [
    para(
      'ov1',
      'Abdominoplasty, commonly known as a tummy tuck, is a surgical procedure that targets the removal of excess skin and fat from the abdominal area. The procedure also tightens the underlying muscles, creating a more toned and firm abdomen.',
    ),
    para(
      'ov2',
      'This surgery is especially popular among individuals who have undergone significant weight loss or women post-pregnancy, as these situations often leave the abdomen with loose skin that cannot be addressed through exercise alone.',
    ),
  ],

  // ---- At a glance (new) ----
  showGlance: true,
  atAGlance: keyed('glance', [
    {_type: 'glanceItem', icon: 'clock', label: 'Surgery time', value: '2–5 hours'},
    {_type: 'glanceItem', icon: 'briefcase', label: 'Time off work', value: '2–3 weeks'},
    {_type: 'glanceItem', icon: 'home', label: 'Hospital stay', value: '1–2 nights'},
    {_type: 'glanceItem', icon: 'droplet', label: 'Showering', value: 'After 2 days'},
    {_type: 'glanceItem', icon: 'walk', label: 'Light activity', value: 'After 2 weeks'},
    {_type: 'glanceItem', icon: 'shield', label: 'Compression garment', value: '4–6 weeks'},
    {_type: 'glanceItem', icon: 'activity', label: 'Exercise', value: 'After 4–6 weeks'},
    {_type: 'glanceItem', icon: 'navigation', label: 'Driving', value: 'After 2–3 weeks'},
    {_type: 'glanceItem', icon: 'check', label: 'Full recovery', value: 'Up to 6 weeks'},
    {_type: 'glanceItem', icon: 'moon', label: 'Final results', value: '3–6 months'},
  ]),

  // ---- What it addresses (new) ----
  showConditions: true,
  conditionsHeading: 'What Can Abdominoplasty Address?',
  conditionsIntro:
    'Loose abdominal skin and weakened muscles are most often the result of pregnancy, significant weight loss or the natural changes of time, and they rarely respond to diet and exercise alone. Abdominoplasty can address:',
  conditions: [
    'Loose or sagging abdominal skin after significant weight loss',
    'Stretched skin and weakened muscles following pregnancy',
    'A lower abdominal bulge that persists despite diet and exercise',
    'Separation of the abdominal muscles (divarication of the recti)',
    'Excess fat across the lower abdomen and flanks',
    'Stretch marks on the skin below the navel',
    'Skin folds that cause irritation or discomfort',
    'Difficulty finding clothes that fit comfortably at the waist',
  ],

  // ---- Benefits (original: "Results and Benefits") ----
  showBenefits: true,
  benefitsHeading: 'Results and Benefits',
  benefitsIntro:
    'The results of abdominoplasty are long-lasting and provide patients with a flatter, firmer abdomen. Once healed, the surgery can significantly improve body contours, enhance self-confidence, and allow individuals to wear clothes more comfortably. Abdominoplasty can achieve:',
  benefitsList: [
    'A flatter, firmer abdomen',
    'Significantly improved body contours',
    'Removal of excess, redundant skin',
    'Tightened, better-supported abdominal muscles',
    'Greater comfort and confidence in clothing',
    'Long-lasting results, maintained with a stable weight and healthy lifestyle',
  ],

  // ---- Candidates (original: "Who is a Good Candidate?") ----
  showCandidates: true,
  candidatesHeading: 'Who is a Good Candidate?',
  candidatesIntro:
    'Abdominoplasty is suitable for both men and women in good health who have excess skin or fat in the abdominal region that does not respond to diet and exercise. Good candidates for this procedure often include:',
  candidates: [
    'Individuals who have experienced significant weight loss and are left with sagging skin.',
    'Women post-pregnancy with stretched or weakened abdominal muscles.',
    'People who are within a stable weight range but want to enhance their abdominal contour.',
  ],
  candidatesOutro:
    'It is important to note that abdominoplasty is not a weight-loss solution or substitute for a healthy lifestyle. Candidates should also have realistic expectations about the results and understand the recovery process.',

  // ---- Types (original: "Types of Abdominoplasty") ----
  showTechniques: true,
  techniquesHeading: 'Types of Abdominoplasty',
  techniquesIntro:
    'There are different types of abdominoplasty procedures depending on the patient’s needs:',
  techniques: keyed('tech', [
    {
      _type: 'technique',
      name: 'Full Abdominoplasty',
      tier: 'significant excess skin',
      description:
        'A full abdominoplasty is ideal for patients with a large amount of excess skin and weakened muscles. This procedure involves an incision from hip to hip and a second incision around the navel. The surgeon removes excess skin, tightens muscles, and repositions the belly button.',
    },
    {
      _type: 'technique',
      name: 'Mini Abdominoplasty',
      tier: 'minimal excess skin',
      description:
        'A mini abdominoplasty is suitable for individuals with minimal excess skin or fat, typically located below the belly button. The incision is smaller than in a full tummy tuck, and the navel is usually not repositioned.',
    },
    {
      _type: 'technique',
      name: 'Extended Abdominoplasty',
      tier: 'abdomen, flanks and lower back',
      description:
        'Extended abdominoplasty addresses excess skin not only in the abdomen but also around the flanks and lower back. It is often chosen by patients who have undergone major weight loss and require a more extensive contouring procedure.',
    },
  ]),

  // ---- The procedure (original: "Procedure Overview") ----
  showProcedure: true,
  procedureHeading: 'Procedure Overview',
  procedureBody: [
    para(
      'pr1',
      'Abdominoplasty is performed under general anaesthesia and typically takes between 2 to 5 hours, depending on the complexity of the procedure. During the surgery, the surgeon will make an incision along the lower abdomen, remove excess fat and skin, and tighten the abdominal muscles.',
    ),
    para(
      'pr2',
      'In a full abdominoplasty, the surgeon will also reposition the belly button. Once the desired results are achieved, the incisions are closed with sutures, and dressings are applied.',
    ),
  ],

  // ---- Journey: off here, the Recovery section below carries the original copy ----
  showJourney: false,

  // ---- Recovery (original: "Recovery and Aftercare") ----
  showRecovery: true,
  recoveryHeading: 'Recovery and Aftercare',
  recoveryIntro:
    'The recovery process from abdominoplasty can take several weeks. Patients are generally advised to avoid strenuous activities for 4 to 6 weeks and wear a compression garment to support healing and reduce swelling. It is common to experience discomfort, swelling, and bruising during the initial recovery period, but these symptoms will gradually subside.',
  recovery: keyed('rec', [
    {
      _type: 'recoveryStage',
      stage: 'The first few days',
      description:
        'You will be supported in a compression garment. Discomfort, swelling and bruising are normal and are managed with prescribed medication. Keeping the surgical site clean matters from the outset.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Week one to two',
      description:
        'Most patients return to light activities after around two weeks. Gentle movement little and often is encouraged, while anything strenuous is avoided.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Weeks three to six',
      description:
        'The compression garment continues to support healing and reduce swelling. Strenuous activity and heavy lifting are avoided for four to six weeks.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Six weeks onward',
      description:
        'Most normal activity, including exercise, is comfortably resumed. Swelling continues to settle and the abdominal contour refines.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Three to six months',
      description:
        'Full results appear as the body heals and swelling reduces. Scars soften and fade, and follow-up appointments continue for as long as you need them.',
    },
  ]),

  // ---- Risks (original: "Risks and Complications") ----
  showRisks: true,
  risksHeading: 'Risks and Complications',
  risksIntro:
    'Like any surgical procedure, abdominoplasty carries some risks. Choosing a qualified, experienced surgeon and following pre- and post-operative instructions can help minimise these risks, and it is important to discuss any medical conditions or concerns with the surgeon before undergoing surgery. Risks may include:',
  risks: [
    'Infection',
    'Scarring',
    'Bleeding or haematoma',
    'Asymmetry',
    'Delayed wound healing',
    'Blood clots',
  ],

  // ---- Surgeon (new) ----
  showSurgeon: true,
  surgeonHeading: 'Meet Mr Roshan Vijayan',
  surgeonQuote:
    'Body contouring is about restoring proportion, so the result looks like it was always yours.',
  surgeonBody: [
    para(
      'sg1',
      'Mr Roshan Vijayan is a GMC-registered Consultant Plastic Surgeon and Fellow of the Royal College of Surgeons. He trained extensively in plastic, reconstructive and aesthetic surgery across major UK teaching hospitals and continues to contribute to surgical education, academic work and the training of other doctors.',
    ),
    para(
      'sg2',
      'Restoring the body after pregnancy or significant weight loss is a particular focus of his practice. Each abdominoplasty is planned individually around your anatomy and goals, with clear discussion of the type of tummy tuck required, the scar it involves, and the results that are realistically achievable.',
    ),
  ],

  // ---- Why choose (new) ----
  showWhy: true,
  whyHeading: 'Why Choose Mr Roshan Vijayan for Abdominoplasty?',
  whyIntro:
    'Abdominoplasty asks a surgeon to balance skin removal, muscle repair and scar placement against your build and your goals. Mr Vijayan combines his experience as a Consultant Plastic Surgeon with a particular focus on post-pregnancy and post-weight-loss body contouring. His care is based on:',
  whyPoints: [
    'A detailed assessment of skin quality, muscle tone and fat distribution',
    'An honest decision about which type of abdominoplasty is right for you',
    'Open discussion of scar position, limitations and realistic results',
    'A second consultation before treatment, included as standard',
    'Two-surgeon safety on more complex body-contouring cases',
    'Consultant-led follow-up and direct postoperative support',
  ],

  // ---- Cost (new; no figure until a price is confirmed) ----
  showCost: true,
  costHeading: 'How Much Does Abdominoplasty Cost?',
  costIntro:
    'The cost of an abdominoplasty depends on the type of tummy tuck required, the extent of skin and muscle correction, and whether it is combined with liposuction or another procedure.',
  costLead:
    'Every abdominoplasty is planned individually. Once Mr Vijayan has assessed your anatomy and agreed a surgical plan with you, you will receive a complete written quotation covering the relevant surgical, hospital and anaesthetic costs.',
  costIncludes: [
    'Your consultation with Mr Vijayan',
    'A second consultation, included',
    'Surgeon’s and anaesthetist’s fees',
    'Hospital and theatre fees',
    'All follow-up and aftercare',
    'A personal day-one call',
  ],

  // ---- FAQs (original) ----
  showFaqs: true,
  faqHeading: 'Frequently Asked Questions',
  faqs: keyed('faq', [
    {
      _type: 'faq',
      question: 'How long does it take to recover from abdominoplasty?',
      answer:
        'Full recovery from abdominoplasty can take up to 6 weeks, with most patients returning to light activities after 2 weeks. Strenuous exercise should be avoided for at least 4 to 6 weeks.',
    },
    {
      _type: 'faq',
      question: 'Will there be a visible scar after the surgery?',
      answer:
        'Yes, abdominoplasty does leave a scar, typically along the lower abdomen. However, most surgeons place the incision low enough to be concealed by underwear or swimwear.',
    },
    {
      _type: 'faq',
      question: 'Can abdominoplasty be combined with other procedures?',
      answer:
        'Yes, abdominoplasty is often combined with other procedures such as liposuction or breast surgery for a more comprehensive body contouring result.',
    },
    {
      _type: 'faq',
      question: 'Is the procedure permanent?',
      answer:
        'The results of abdominoplasty are long-lasting, but significant weight fluctuations or future pregnancies can impact the results. Maintaining a healthy lifestyle is important to preserve the outcome.',
    },
  ]),

  // ---- Related ----
  showRelated: true,
  related: [{_type: 'reference', _key: 'rel0', _ref: 'procedure.breast-lift'}],

  // ---- Closing CTA (new) ----
  ctaHeading: 'Book Your Abdominoplasty Consultation',
  ctaBody:
    'If weight loss, pregnancy or time has left you with loose abdominal skin or weakened muscles, a consultation can clarify whether abdominoplasty is the right procedure for you. Mr Vijayan will assess your abdomen, explain the options honestly and outline what surgery can realistically achieve. Contact us today to arrange your consultation.',

  // ---- SEO (kept from the old page) ----
  seoTitle: 'Abdominoplasty | Roshan Vijayan',
  seoDescription:
    'Abdominoplasty, or tummy tuck surgery, is a cosmetic procedure designed to remove excess skin and fat from the abdomen and tighten the abdominal muscles for a firmer, more toned appearance.',
}

async function uploadImage(field: string, url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed (HTTP ${res.status})`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {
    filename: `abdominoplasty-${field.replace(/Image$/, '').toLowerCase()}.png`,
  })
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function run() {
  const existing = await client.fetch<Record<string, unknown> | null>(
    `*[_type=="procedure" && slug.current==$slug][0]`,
    {slug: SLUG},
  )
  const id = (existing?._id as string) || DOC_ID

  // Upload only the images this document does not already have, so an editor's
  // own uploads are never overwritten and re-runs stay cheap.
  const images: Record<string, unknown> = {}
  for (const [field, url] of Object.entries(IMAGES)) {
    if (existing?.[field]) {
      console.log(`· ${field}: already set, leaving as is`)
      continue
    }
    try {
      images[field] = await uploadImage(field, url)
      console.log(`✓ ${field}: uploaded`)
    } catch (err) {
      console.warn(`! ${field}: ${(err as Error).message} — section will use its fallback image`)
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

  await client.patch(id).set(doc).commit()
  console.log(`\nUpdated procedure ${id} (${SLUG}).`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
