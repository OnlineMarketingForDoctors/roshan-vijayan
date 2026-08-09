/**
 * Applies the Aug-26 content-optimisation copy to the Breast Lift procedure.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/update-breast-lift.ts --with-user-token
 *
 * It finds the existing Breast Lift document by slug and patches it in place,
 * so the document id, history and any uploaded images are preserved. Re-running
 * it is safe — the result is the same every time.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

const SLUG = 'breast-lift'

/** Portable-text paragraph helper. Keys must be stable and unique. */
const para = (key: string, text: string) => ({
  _type: 'block',
  _key: key,
  style: 'normal',
  markDefs: [],
  children: [{_type: 'span', _key: `${key}s`, text, marks: []}],
})

const keyed = <T extends object>(prefix: string, items: T[]) =>
  items.map((item, i) => ({...item, _key: `${prefix}${i}`}))

const fields = {
  // ---- Identity ----
  title: 'Breast Lift',
  category: 'Body',
  surgical: true,

  // ---- Hero ----
  heroHeading: 'Breast Lift (Mastopexy)',
  heroPromise:
    'A breast lift, or mastopexy, raises and reshapes the breast to restore a firmer, more youthful contour, naturally and in proportion with your frame, by Consultant Plastic Surgeon Mr Roshan Vijayan.',
  heroBullets: [
    'A naturally lifted, more youthful shape',
    'Repositioned, re-centred nipple and areola',
    'Restored firmness after pregnancy or weight loss',
    'Consultant-led care, with two-surgeon safety on complex cases',
  ],

  // ---- Intro ----
  showIntro: true,
  introHeading: 'Restoring Breast Position, Shape and Proportion',
  introBody: [
    para(
      'intro1',
      'A breast lift raises and reshapes breasts that have dropped or lost definition after pregnancy, breastfeeding, weight change or ageing. Also known as mastopexy, breast lift surgery removes loose skin, reorganises the breast tissue and repositions the nipple to create a firmer, better-supported shape.',
    ),
    para(
      'intro2',
      'Mastopexy does not automatically increase breast volume. Some people have enough existing tissue to achieve the required shape through a lift alone, while others need to consider breast implants or a reduction alongside the procedure. The recommended approach depends on existing breast volume, skin quality, nipple position and the intended result.',
    ),
  ],

  // ---- Before & After ----
  // Hidden for now: the published cases are not procedure-specific yet.
  showResults: false,

  // ---- Overview ----
  showOverview: true,
  overviewHeading: 'What Is a Breast Lift?',
  overviewBody: [
    para(
      'ov1',
      'A breast lift is a surgical procedure for breast ptosis, the medical term for breasts that have descended from their previous position. It removes excess skin and reshapes the internal tissue so the breast sits higher on the chest.',
    ),
    para(
      'ov2',
      'The nipples and areolae can also be repositioned, and stretched areolae can be reduced when appropriate. A mastopexy changes breast position and contour, but it cannot prevent future effects from gravity, pregnancy, weight fluctuation or ageing.',
    ),
    para(
      'ov3',
      'Pregnancy, weight change and ageing can all affect the position and shape of the breasts.',
    ),
  ],

  // ---- At a glance (unchanged) ----
  showGlance: true,
  atAGlance: keyed('glance', [
    {_type: 'glanceItem', icon: 'clock', label: 'Surgery time', value: '2–3 hours'},
    {_type: 'glanceItem', icon: 'briefcase', label: 'Time off work', value: '1–2 weeks'},
    {_type: 'glanceItem', icon: 'home', label: 'Hospital stay', value: 'Day case or 1 night'},
    {_type: 'glanceItem', icon: 'droplet', label: 'Showering', value: 'After 2 days'},
    {_type: 'glanceItem', icon: 'walk', label: 'Reasonable mobility', value: 'After 2 days'},
    {_type: 'glanceItem', icon: 'activity', label: 'Exercise', value: 'After 6 weeks'},
    {_type: 'glanceItem', icon: 'heart', label: 'Sexual activity', value: 'After 4–6 weeks'},
    {_type: 'glanceItem', icon: 'moon', label: 'Sleeping on back', value: '4–6 weeks'},
    {_type: 'glanceItem', icon: 'check', label: 'Full recovery', value: '3–6 months'},
    {_type: 'glanceItem', icon: 'navigation', label: 'Driving', value: 'After 2 weeks'},
  ]),

  // ---- What it addresses ----
  showConditions: true,
  conditionsHeading: 'What Changes Can Breast Lift Surgery Address?',
  conditionsIntro:
    'Breast ptosis develops when the skin and supporting tissues can no longer hold the breast in its previous position. The amount of descent varies, as does the relationship between the nipple and the crease beneath the breast. A breast lift can address:',
  conditions: [
    'Breasts that have dropped or developed a flatter shape',
    'Nipples that sit low or point downwards',
    'Loose skin following pregnancy or weight loss',
    'Loss of breast firmness after breastfeeding',
    'Stretched or enlarged areolae',
    'Differences in position between the breasts',
    'A breast shape that appears deflated despite retaining adequate volume',
    'Difficulty achieving support or shape within clothing',
  ],

  // ---- Benefits (replaces Techniques) ----
  showBenefits: true,
  benefitsHeading: 'Key Benefits of a Breast Lift',
  benefitsIntro:
    'Mastopexy focuses on repositioning and reshaping the existing tissue. The degree of correction depends on the amount of loose skin, existing breast volume and the surgical pattern required. Breast lift surgery can achieve:',
  benefitsList: [
    'A higher and firmer breast position',
    'Improved breast shape and projection',
    'Repositioned nipples and areolae',
    'Better balance between the breasts',
    'Removal of loose and stretched skin',
    'Improved proportion between the breasts and torso',
    'The option to combine lifting with reduction or augmentation when appropriate',
  ],

  // ---- Candidates ----
  showCandidates: true,
  candidatesHeading: 'Am I a Suitable Candidate for Mastopexy?',
  candidatesIntro:
    'A breast lift is suited to people whose breasts have dropped or changed shape but who are broadly comfortable with their existing breast volume. You should be in good general health, at a stable weight and understand the incision pattern and scarring associated with the degree of lift required. A breast assessment considers:',
  candidates: [
    'Existing breast volume',
    'Skin elasticity',
    'Nipple position',
    'The degree of tissue descent',
  ],
  candidatesOutro:
    'If you want substantially larger breasts, a lift alone may not provide enough additional upper-breast fullness. Conversely, heavy breasts may benefit from reduction as well as lifting. Pregnancy and significant weight changes can compromise the result, making the timing of surgery an important part of your consultation.',

  // ---- Techniques ----
  // Hidden on this page: the Aug-26 brief drops it in favour of Benefits. The
  // copy is kept so it can be switched back on from Studio at any time, and so
  // other procedures have a worked example of the section.
  showTechniques: false,
  techniquesIntro:
    'The right technique depends on how much lift is needed and the quality of your skin. The goal is always the best shape with the least scarring for your case, and Mr Vijayan will recommend the approach that suits you at your consultation.',
  techniques: keyed('tech', [
    {
      _type: 'technique',
      name: 'Crescent',
      tier: 'very mild sagging',
      description:
        'A small crescent scar along the upper areola, for the subtlest lift or minor nipple asymmetry.',
    },
    {
      _type: 'technique',
      name: 'Periareolar',
      tier: 'mild sagging',
      description: 'The donut lift — a single, discreet scar around the areola, for a modest lift.',
    },
    {
      _type: 'technique',
      name: 'Vertical',
      tier: 'moderate sagging',
      description:
        'The lollipop lift — around the areola and down to the crease, allowing more reshaping.',
    },
    {
      _type: 'technique',
      name: 'Inverted-T',
      tier: 'significant sagging',
      description: 'The anchor lift — with a discreet crease incision, for the fullest reshaping.',
    },
  ]),

  // ---- The procedure ----
  showProcedure: true,
  procedureHeading: 'What Does Breast Lift Surgery Involve?',
  procedureBody: [
    para(
      'pr1',
      'Breast lift surgery is performed under general anaesthesia and generally takes two to three hours. The incision pattern depends on the amount of skin being removed and the degree of lift required. It can extend around the areola, vertically to the breast crease and, for more extensive correction, along the crease itself.',
    ),
    para(
      'pr2',
      'Mr Vijayan removes excess skin and reshapes the breast tissue to create a firmer internal structure. The nipple and areola are moved into a more balanced position before the incisions are closed, and a supportive surgical bra is fitted.',
    ),
  ],

  // ---- Treatment journey (replaces Recovery) ----
  showJourney: true,
  journeyHeading: 'Your Breast Lift Treatment Journey',
  journeyIntro:
    'The treatment plan must balance the desired breast position with the available tissue, skin quality and incisions required to achieve that change. Each stage is explained before surgery, so you know what the procedure and recovery will involve.',
  journey: keyed('journey', [
    {
      _type: 'journeyStage',
      stage: 'Consultation',
      description:
        'Your consultation includes an assessment of breast volume, skin elasticity, nipple position, symmetry and the degree of ptosis. Mr Vijayan will discuss whether a lift alone is sufficient or whether reduction or augmentation should be considered, together with the likely scar pattern, limitations and risks. Clinical photographs support planning, and a second consultation allows time to review the proposed approach before proceeding.',
    },
    {
      _type: 'journeyStage',
      stage: 'Procedure',
      description:
        'The operation is performed under general anaesthesia using the incision pattern agreed with you. Loose skin is removed, breast tissue is reshaped and supported, and the nipple and areola are repositioned while preserving their connection to the underlying tissue wherever possible. Dressings and a supportive bra help protect the breasts during the early healing process.',
    },
    {
      _type: 'journeyStage',
      stage: 'Recovery and Aftercare',
      description:
        'Bruising, swelling, tenderness and a feeling of tightness are expected initially. Many people resume desk-based work and light activities after one to two weeks, while heavy lifting and strenuous exercise should be avoided for approximately four to six weeks. Mr Vijayan monitors the incisions and breast shape through scheduled reviews and remains available if you have concerns between appointments.',
    },
    {
      _type: 'journeyStage',
      stage: 'Results',
      description:
        'The breasts sit higher after surgery, although swelling and early firmness temporarily affect their appearance. Their shape becomes softer and more settled over the following months. Scars are initially more noticeable but generally become flatter and lighter as they mature.',
    },
  ]),

  // ---- Recovery ----
  // Hidden on this page: the Treatment Journey above covers recovery. Kept for
  // the same reason as Techniques.
  showRecovery: false,
  recovery: keyed('rec', [
    {
      _type: 'recoveryStage',
      stage: 'The first few days',
      description:
        'You will go home in a supportive surgical bra. Some swelling, bruising and tightness is normal. Mr Vijayan calls you personally on day one.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Week one to two',
      description:
        'Most discomfort settles quickly. Many patients return to desk-based work within one to two weeks, avoiding any strenuous activity.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Weeks three to six',
      description:
        'Gentle activity is gradually resumed. The supportive bra is worn day and night while the breasts settle into their new shape.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Six weeks onward',
      description:
        'Most normal activity, including exercise, is comfortably resumed. Swelling continues to settle and the contour refines.',
    },
    {
      _type: 'recoveryStage',
      stage: 'Three to six months',
      description:
        'Scars soften and fade considerably, and the final, natural shape becomes clear. Aftercare with Mr Vijayan is unlimited throughout.',
    },
  ]),

  // ---- Risks ----
  showRisks: true,
  risksHeading: 'Possible Risks and Complications',
  risksIntro:
    'All surgery carries risks, and their relevance depends on factors such as general health, smoking, breast anatomy and the extent of the planned lift. Mr Vijayan will discuss these considerations during your consultation so that you understand the possible complications and how they apply to your procedure. Risks associated with breast lift surgery include:',
  risks: [
    'Bleeding, infection or fluid collection',
    'Delayed wound healing or prominent scarring',
    'Differences in breast shape or nipple position',
    'Temporary or permanent changes in sensation',
    'Changes affecting the blood supply to the nipple or skin',
    'Recurrent drooping or the need for further surgery',
  ],

  // ---- Surgeon ----
  showSurgeon: true,
  surgeonHeading: 'Meet Mr Roshan Vijayan',
  surgeonBody: [
    para(
      'sg1',
      'Mr Roshan Vijayan is a GMC-registered Consultant Plastic Surgeon and Fellow of the Royal College of Surgeons. He trained extensively in plastic, reconstructive and aesthetic surgery across major UK teaching hospitals and continues to contribute to surgical education, academic work and the training of other doctors.',
    ),
    para(
      'sg2',
      'With breast lift surgery, his focus is on creating a balanced shape that works with the patient’s existing tissue and overall proportions. Each procedure is planned individually, with clear discussion of the available techniques, scars, limitations and achievable results.',
    ),
  ],

  // ---- Why choose us ----
  showWhy: true,
  whyHeading: 'Why Choose Mr Roshan Vijayan for Breast Lift Surgery?',
  whyIntro:
    'Breast lift surgery requires careful judgement because breast position, volume, skin quality and scarring must be considered together. Mr Vijayan combines his experience as a Consultant Plastic Surgeon with an individual approach to breast reshaping, prioritising a proportionate outcome that works with the existing anatomy. His care is based on:',
  whyPoints: [
    'Detailed assessment of breast shape, volume and skin quality',
    'A bespoke decision about whether lifting alone is sufficient',
    'Open discussion of scars, limitations and future changes',
    'Established surgical techniques selected for the required correction',
    'A second consultation before treatment',
    'Consultant-led follow-up and direct postoperative support',
  ],

  // ---- Cost (document copy + existing pricing) ----
  showCost: true,
  costHeading: 'How Much Does a Breast Lift Cost?',
  costIntro:
    'The cost of a breast lift depends on the complexity of the mastopexy and whether it is performed alone or combined with another breast procedure. Once Mr Vijayan has assessed your anatomy and recommended a surgical plan, you will receive a complete quotation covering the relevant surgical, hospital and anaesthetic costs.',
  costLead:
    'Every breast lift is planned individually, so the final price depends on the technique and the complexity of your case. Once Mr Vijayan has assessed you and agreed a surgical plan, you will receive a complete written quotation covering the relevant surgical, hospital and anaesthetic costs.',
  costIncludes: [
    'Your consultation with Mr Vijayan',
    'A second consultation, included',
    'Surgeon’s and anaesthetist’s fees',
    'Hospital and theatre fees',
    'All follow-up and aftercare',
    'A personal day-one call',
  ],

  // ---- FAQs ----
  showFaqs: true,
  faqHeading: 'Frequently asked questions',
  faqs: keyed('faq', [
    {
      _type: 'faq',
      question: 'Will a breast lift leave scars?',
      answer:
        'Yes, every surgical breast lift leaves scars. Their position and extent depend on the amount of lifting required, but they are planned around the areola and lower breast so they can be concealed beneath most bras and clothing.',
    },
    {
      _type: 'faq',
      question: 'What is the difference between a breast lift and implants?',
      answer:
        'A breast lift removes loose skin and raises the existing breast tissue, whereas implants increase breast volume. Implants alone do not reliably correct significant drooping, and a lift does not create the same volume increase as augmentation.',
    },
    {
      _type: 'faq',
      question: 'Can a breast lift be combined with implants?',
      answer:
        'Yes, implants can be added when greater breast volume or upper-breast fullness is required alongside lifting. The implant size, existing breast tissue and degree of lift must be considered together to create a balanced and appropriately supported result.',
    },
    {
      _type: 'faq',
      question: 'Can mastopexy be combined with breast reduction?',
      answer:
        'Yes, heavy or disproportionately large breasts can be reduced and lifted during the same operation. The difference is that a breast reduction removes more breast volume, while a standalone mastopexy primarily changes shape and position.',
    },
    {
      _type: 'faq',
      question: 'Can a non-surgical treatment lift sagging breasts?',
      answer:
        'Non-surgical treatments cannot remove substantial loose skin or reposition descended breast tissue in the same way as mastopexy. They can address different concerns in selected cases, but they do not provide an equivalent structural breast lift.',
    },
    {
      _type: 'faq',
      question: 'Does a breast lift change cup size?',
      answer:
        'A lift can make the breasts appear smaller or more compact because the tissue is repositioned and excess skin is removed. It does not produce a predictable cup-size change, and bra sizing varies considerably between manufacturers.',
    },
    {
      _type: 'faq',
      question: 'Can I breastfeed after a breast lift?',
      answer:
        'Breastfeeding may still be possible after a breast lift, but surgery can affect milk production in some patients. If you are planning a future pregnancy or would like to breastfeed, this should be discussed during consultation so it can be considered within the surgical plan.',
    },
    {
      _type: 'faq',
      question: 'Will nipple sensation change?',
      answer:
        'Numbness, tingling or increased sensitivity can occur while the nerves recover. Sensation often improves over time, but a permanent change or loss of sensation remains possible.',
    },
    {
      _type: 'faq',
      question: 'How long do breast lift results last?',
      answer:
        'A breast lift provides a long-lasting change, but it cannot stop the breasts from ageing. Skin quality, breast weight, pregnancy and weight fluctuation all influence how the shape changes in later years.',
    },
    {
      _type: 'faq',
      question: 'Should I wait until after pregnancy to have a breast lift?',
      answer:
        'Breast lift surgery does not prevent a future pregnancy, but pregnancy and breastfeeding can stretch the skin and alter breast volume again. Waiting until your family is complete can help preserve the result for longer.',
    },
  ]),

  // ---- Closing CTA ----
  ctaHeading: 'Book Your Breast Lift Consultation',
  ctaBody:
    'If pregnancy, weight change or ageing has altered the position or shape of your breasts, a consultation can clarify whether mastopexy is the appropriate procedure. Mr Vijayan will assess your existing breast tissue and skin quality, discuss what a lift can achieve and explain whether a breast lift alone or a combined procedure should be considered. Contact us today to arrange your consultation.',

  // ---- SEO ----
  seoTitle: 'Breast Lift Surgery | Mastopexy',
  seoDescription:
    'Considering a breast lift? Learn how mastopexy removes loose skin, reshapes existing tissue and creates a higher, better-supported breast position and shape.',
}

// Retired by this rewrite: the hero bullets moved to `heroBullets`.
// Techniques and Recovery are NOT retired — they stay in the schema for other
// procedures and are simply switched off here (see showTechniques/showRecovery).
const RETIRED = ['benefits', 'surgeonQuote', 'costFrom']

async function run() {
  const existing: {_id: string} | null = await client.fetch(
    `*[_type=="procedure" && slug.current==$slug][0]{_id}`,
    {slug: SLUG},
  )

  if (!existing?._id) {
    const created = await client.create({
      _type: 'procedure',
      slug: {_type: 'slug', current: SLUG},
      ...fields,
    })
    console.log(`Created procedure ${created._id} (${SLUG}).`)
    return
  }

  await client.patch(existing._id).set(fields).unset(RETIRED).commit()
  console.log(`Updated procedure ${existing._id} (${SLUG}) with the new copy.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
