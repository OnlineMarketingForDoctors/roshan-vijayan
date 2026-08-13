/**
 * Creates five Body procedures from their old vijayan.co.uk pages, preserving
 * copy and metadata so the existing search value carries over.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/add-body-procedures.ts --with-user-token
 *
 * Section art is generated; the script downloads it once and uploads it into
 * Sanity. Images already set on a document are left alone, so re-running is
 * safe and never overwrites an editor's own uploads.
 *
 * Source-page notes:
 * - The old Liposuction page carried a full Arm Lift article above its real
 *   content (a drafting artifact). Only the Liposuction copy is used here.
 * - Stray markdown fences at the foot of the Gynaecomastia and Thigh Lift pages
 *   are dropped.
 * - US spellings in the originals are corrected to UK.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient()

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

/** Shared across every procedure: the practice offer and the surgeon's background. */
const COST_INCLUDES = [
  'Your consultation with Mr Vijayan',
  'A second consultation, included',
  'Surgeon’s and anaesthetist’s fees',
  'Hospital and theatre fees',
  'All follow-up and aftercare',
  'A personal day-one call',
]

const COST_LEAD =
  'Every procedure is planned individually. Once Mr Vijayan has assessed you and agreed a surgical plan, you will receive a complete written quotation covering the relevant surgical, hospital and anaesthetic costs.'

const SURGEON_INTRO =
  'Mr Roshan Vijayan is a GMC-registered Consultant Plastic Surgeon and Fellow of the Royal College of Surgeons. He trained extensively in plastic, reconstructive and aesthetic surgery across major UK teaching hospitals and continues to contribute to surgical education, academic work and the training of other doctors.'

type Procedure = {
  slug: string
  images: Record<string, string>
  fields: Record<string, unknown>
}

const PROCEDURES: Procedure[] = [
  // ==================================================================
  // 1. Male Gynaecomastia Reduction
  // ==================================================================
  {
    slug: 'male-gynaecomastia-reduction',
    images: {
      heroImage: `${CDN}hf_20260810_000754_d822b071-716c-48c0-bbde-322d70ccd03f.png`,
      overviewImage: `${CDN}hf_20260810_000754_f1cf4857-932d-4a85-a7b5-909b33200015.png`,
      candidatesImage: `${CDN}hf_20260810_000754_d3718795-d8fc-4cd8-aa84-f8c91ce86ec0.png`,
      benefitsImage: `${CDN}hf_20260810_000754_0158c10e-b23a-4f38-900d-678412ed941e.png`,
    },
    fields: {
      title: 'Male Gynaecomastia Reduction',
      category: 'Body',
      surgical: true,
      heroHeading: 'Male Gynaecomastia Reduction',
      heroPromise:
        'Male Gynaecomastia Reduction is a specialised procedure aimed at reducing the size of enlarged male breasts, commonly known as gynaecomastia.',
      heroBullets: [
        'A flatter, firmer chest contour',
        'Excess breast tissue and fat removed',
        'Relief from physical discomfort',
        'Consultant-led care and post-operative support',
      ],

      showIntro: true,
      introHeading: 'A Flatter, Firmer Chest Contour',
      introBody: [
        para('i1', 'This condition can cause significant emotional and psychological distress.'),
        para(
          'i2',
          'Consultant Plastic Surgeon Mr Roshan Vijayan offers expert surgical solutions, personalised care, and comprehensive post-operative support to help men regain confidence and improve their quality of life.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Gynaecomastia?',
      overviewBody: [
        para(
          'o1',
          'Gynaecomastia is a medical condition characterised by the enlargement of breast tissue in males. This can affect one or both breasts and is often caused by an imbalance of the hormones oestrogen and testosterone.',
        ),
        para(
          'o2',
          'While gynaecomastia is not typically a serious health issue, it can lead to emotional discomfort and self-consciousness.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', '1–2 hours'),
        glance('briefcase', 'Time off work', '1 week'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('droplet', 'Showering', 'After 2 days'),
        glance('walk', 'Light activity', 'After 1 week'),
        glance('shield', 'Compression garment', '4–6 weeks'),
        glance('activity', 'Exercise', 'After 4–6 weeks'),
        glance('navigation', 'Driving', 'After 1–2 weeks'),
        glance('check', 'Full recovery', '4–6 weeks'),
        glance('moon', 'Final results', 'Several months'),
      ]),

      showConditions: true,
      conditionsHeading: 'Causes of Gynaecomastia',
      conditionsIntro:
        'Several factors can contribute to the development of gynaecomastia, including:',
      conditions: [
        'Hormonal imbalances',
        'Use of certain medications',
        'Chronic diseases such as liver or kidney disease',
        'Substance use, including alcohol and anabolic steroids',
        'The natural ageing process',
        'Genetic predisposition',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Gynaecomastia Reduction',
      benefitsIntro:
        'Undergoing male gynaecomastia reduction surgery offers several benefits, including:',
      benefitsList: [
        'Improved chest contour and appearance',
        'Enhanced self-esteem and confidence',
        'Relief from physical discomfort associated with enlarged breasts',
        'Ability to engage in physical activities without self-consciousness',
        'Better fitting clothing',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Gynaecomastia reduction suits men in good general health who are troubled by enlarged breast tissue that has not settled on its own. A consultation considers:',
      candidates: [
        'Enlarged breast tissue that has been stable for at least a year',
        'Good general health and a stable weight',
        'Non-smoker, or willing to stop well before surgery',
        'Realistic expectations about the result and the scars involved',
      ],
      candidatesOutro:
        'Where an underlying cause such as a medication or hormonal condition may be responsible, Mr Vijayan will discuss investigating that first, since treating the cause can sometimes resolve the problem without surgery.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'The Procedure',
      procedureBody: [
        para(
          'p1',
          'Male gynaecomastia reduction surgery typically involves the removal of excess breast tissue and fat. The procedure can be performed using liposuction, excision, or a combination of both techniques.',
        ),
        para(
          'p2',
          'Mr Roshan Vijayan will assess your condition and recommend the most suitable approach for you. The surgery is usually performed under general anaesthesia and takes about 1 to 2 hours to complete.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery and Aftercare',
      recoveryIntro:
        'Post-operative care is crucial for optimal recovery and results. Patients can expect some swelling, bruising, and discomfort in the initial days following surgery. Mr Vijayan will provide detailed aftercare instructions.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'Swelling, bruising and discomfort are expected. A compression garment is worn to minimise swelling and support healing.',
        ),
        stage(
          'Week one to two',
          'Most men return to desk-based work within a week. Strenuous activity and heavy lifting are avoided.',
        ),
        stage(
          'Weeks three to six',
          'The compression garment continues to support the chest as it settles. Strenuous activity and heavy lifting are avoided for a few weeks.',
        ),
        stage(
          'Follow-up and beyond',
          'Follow-up appointments monitor your progress, and maintaining a healthy lifestyle helps sustain the result.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgical procedure, there are potential risks. Mr Vijayan will discuss all potential risks and complications during your consultation so your decision is an informed one. Risks may include:',
      risks: [
        'Infection',
        'Scarring',
        'Changes in nipple sensation',
        'Bleeding or haematoma',
        'Asymmetry or contour irregularity',
        'The need for further surgery',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'With gynaecomastia surgery his focus is a natural, masculine chest contour with the least conspicuous scarring the case allows. Each procedure is planned individually, with a frank discussion of technique, scars and what surgery can realistically achieve.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a highly experienced Consultant Plastic Surgeon with a proven track record in performing male gynaecomastia reduction surgeries. His approach is patient-centred, ensuring personalised care and attention to detail. By choosing Mr Vijayan, you benefit from:',
      whyPoints: [
        'Expert surgical skills and experience',
        'Comprehensive consultation and assessment',
        'Customised treatment plans',
        'Compassionate and supportive care',
        'Excellent post-operative follow-up',
      ],

      showCost: true,
      costHeading: 'How Much Does Gynaecomastia Surgery Cost?',
      costIntro:
        'The cost of the surgery varies based on the complexity of the procedure and individual patient needs. A detailed quote will be provided during your consultation with Mr Roshan Vijayan.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'What is the cost of male gynaecomastia reduction surgery?',
          'The cost of the surgery varies based on the complexity of the procedure and individual patient needs. A detailed quote will be provided during your consultation with Mr Roshan Vijayan.',
        ),
        faq(
          'Is gynaecomastia reduction surgery covered by insurance?',
          'Insurance coverage for gynaecomastia reduction surgery depends on your insurance provider and policy. It is advisable to check with your insurance company to understand your coverage options.',
        ),
        faq(
          'How long does it take to see the final results?',
          'While initial improvements are visible immediately after surgery, final results can take several months to fully manifest as swelling subsides and tissues settle.',
        ),
        faq(
          'Are there any risks associated with the surgery?',
          'As with any surgical procedure, there are potential risks, including infection, scarring, and changes in nipple sensation. Mr Roshan Vijayan will discuss all potential risks and complications during your consultation.',
        ),
        faq(
          'Can gynaecomastia recur after surgery?',
          'Recurrence of gynaecomastia is rare but possible, especially if the underlying causes, such as hormonal imbalances or substance use, are not addressed. Maintaining a healthy lifestyle can help sustain the results.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Gynaecomastia Consultation',
      ctaBody:
        'If enlarged breast tissue is affecting your confidence or comfort, a consultation can clarify whether surgery is the right answer. Mr Vijayan will assess your chest, discuss the cause and explain honestly what surgery can achieve. Contact us today to arrange your consultation.',

      seoTitle: 'Male Gynaecomastia Reduction | Roshan Vijayan',
      seoDescription:
        'Explore expert male gynaecomastia reduction with Consultant Plastic Surgeon Mr. Roshan Vijayan. Achieve a more confident you today.',
    },
  },

  // ==================================================================
  // 2. Liposuction Contouring
  // ==================================================================
  {
    slug: 'liposuction-contouring',
    images: {
      heroImage: `${CDN}hf_20260810_000754_5fccffb7-56ee-4d74-8c38-13c5acf42cd7.png`,
      overviewImage: `${CDN}hf_20260810_000754_9bce4959-7301-43c4-bede-22774dc0b58e.png`,
      candidatesImage: `${CDN}hf_20260810_000754_cbb690e9-e7a9-4668-90e8-1528ef564f89.png`,
      benefitsImage: `${CDN}hf_20260810_000826_f3710499-77d9-44dd-b09b-316dede86183.png`,
    },
    fields: {
      title: 'Liposuction Contouring',
      category: 'Body',
      surgical: true,
      heroHeading: 'Liposuction Contouring',
      heroPromise:
        'Liposuction Contouring is a highly effective surgical procedure designed to remove excess fat deposits and sculpt body contours.',
      heroBullets: [
        'Stubborn fat deposits removed',
        'A more balanced, sculpted silhouette',
        'Small incisions and minimal scarring',
        'Consultant-led care from first consultation to final review',
      ],

      showIntro: true,
      introHeading: 'Sculpted, Balanced Body Contours',
      introBody: [
        para(
          'i1',
          'Liposuction Contouring, offered by Consultant Plastic Surgeon Mr Roshan Vijayan, targets localised fat that has not responded to diet and exercise.',
        ),
        para(
          'i2',
          'Below you will find an in-depth look at the procedure, its benefits, candidate eligibility, the recovery process, and the reasons for choosing Mr Vijayan for your liposuction needs.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Liposuction Contouring?',
      overviewBody: [
        para(
          'o1',
          'Liposuction Contouring is a surgical technique used to remove localised fat deposits that are resistant to diet and exercise.',
        ),
        para(
          'o2',
          'It reshapes rather than reduces weight, refining the areas that hold stubborn fat so the body reads as more balanced and in proportion.',
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
        glance('moon', 'Final results', 'A few months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Liposuction Contouring Address?',
      conditionsIntro:
        'Liposuction is best suited to localised fat rather than general weight loss. It can refine:',
      conditions: [
        'Stubborn fat across the abdomen and waist',
        'Fat deposits on the hips and flanks',
        'Outer and inner thighs',
        'Buttocks and the area beneath them',
        'Upper arms',
        'Fullness under the chin and along the neck',
        'Areas that resist diet and exercise despite a stable weight',
        'Disproportion between one area of the body and another',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Liposuction Contouring',
      benefitsIntro:
        'This procedure can effectively sculpt and contour areas such as the abdomen, thighs, hips, buttocks, arms and neck. Liposuction contouring can achieve:',
      benefitsList: [
        'Enhanced body contours across the treated areas',
        'A more balanced and aesthetically pleasing silhouette',
        'A significant boost to self-esteem and confidence',
        'Lasting results, provided a stable weight and healthy lifestyle are maintained',
        'The versatility to be combined with a tummy tuck or facelift for comprehensive contouring',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Ideal candidates for liposuction contouring are individuals who are within 30% of their ideal weight but have specific areas of stubborn fat that do not respond to diet and exercise. Suitable candidates are typically:',
      candidates: [
        'Within around 30% of their ideal weight',
        'Troubled by specific areas of fat that resist diet and exercise',
        'In good overall health and non-smokers',
        'In possession of good skin elasticity, which helps the contour settle smoothly',
        'Realistic about what the procedure can and cannot achieve',
      ],
      candidatesOutro:
        'Liposuction is a contouring procedure rather than a treatment for obesity, and it is not a substitute for a healthy lifestyle.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'The procedure involves making small incisions in the targeted areas and inserting a thin tube called a cannula to vacuum out the excess fat. Depending on the areas being treated and the amount of fat removal required, the procedure can take from 1 to 3 hours.',
        ),
        para(
          'p2',
          'Liposuction can be performed under local anaesthesia with sedation or general anaesthesia, based on the extent and complexity of the treatment.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from liposuction contouring usually involves some downtime. Bruising, swelling and discomfort are common initially and can be managed with prescribed medications and by wearing a compression garment.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'Bruising, swelling and discomfort are normal and are managed with prescribed medication and a compression garment.',
        ),
        stage(
          'Week one to two',
          'Most patients return to work and lighter activities within one to two weeks.',
        ),
        stage(
          'Weeks three to six',
          'Strenuous activity and heavy lifting are avoided for at least four to six weeks while the tissues settle.',
        ),
        stage(
          'A few months',
          'Full recovery and the final result appear as swelling gradually subsides. Follow-up appointments monitor progress and ensure optimal healing.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgical procedure, there are risks. These are rare and can be minimised by following the pre- and post-operative care instructions provided by Mr Vijayan and his team. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Uneven contours',
        'Adverse reactions to anaesthesia',
        'Changes in skin sensation',
        'Loose skin where elasticity is limited',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'Body contouring is a particular focus of his practice. Each liposuction plan is drawn around your proportions rather than a single problem area, so the treated region sits naturally against everything around it.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a highly experienced Consultant Plastic Surgeon known for his expertise in body contouring procedures, including liposuction. His personalised approach ensures that each patient receives a customised treatment plan tailored to their unique needs and aesthetic goals. His care is based on:',
      whyPoints: [
        'Expertise in body contouring, built over a consultant career',
        'A customised treatment plan for each patient',
        'Meticulous attention to detail and surgical skill',
        'An honest view of what liposuction can and cannot change',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up in a professional and caring environment',
      ],

      showCost: true,
      costHeading: 'How Much Does Liposuction Contouring Cost?',
      costIntro:
        'The cost of liposuction contouring depends on the number of areas being treated, the volume of fat to be removed, and whether it is combined with another procedure.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Liposuction Contouring surgery painful?',
          'The procedure itself is performed under anaesthesia, ensuring you do not feel pain during the surgery. Post-operative discomfort is normal but can be managed with prescribed pain medications. Most discomfort subsides within a few days to a week.',
        ),
        faq(
          'How long does the surgery take?',
          'The duration of the surgery depends on the number of areas being treated and the amount of fat being removed. It typically takes between 1 to 3 hours.',
        ),
        faq(
          'Will there be visible scars?',
          'Small incisions are used for liposuction, resulting in minimal scarring. Incision sites are strategically placed to be as inconspicuous as possible, and any resulting scars tend to fade over time.',
        ),
        faq(
          'Are there any risks or complications?',
          'As with any surgical procedure, there are risks such as infection, bleeding, uneven contours, and adverse reactions to anaesthesia. These risks are rare and can be minimised by following pre- and post-operative care instructions provided by Mr Vijayan and his team.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'Most patients can return to work and light activities within 1 to 2 weeks. However, strenuous activities and heavy lifting should be avoided for at least 4 to 6 weeks to ensure proper healing and optimal results.',
        ),
        faq(
          'How long do the results last?',
          'As long as a stable weight and healthy lifestyle are maintained, the results of liposuction contouring can be long-lasting.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Liposuction Consultation',
      ctaBody:
        'If stubborn fat has not responded to diet and exercise, a consultation can clarify whether liposuction contouring is the right approach. Mr Vijayan will assess the areas concerned and give you an honest, expert view. Contact us today to arrange your consultation.',

      seoTitle: 'Liposuction Contouring | Roshan Vijayan',
      seoDescription:
        'Expert liposuction contouring by Consultant Plastic Surgeon Mr. Roshan Vijayan. Achieve your desired body shape with precision and care.',
    },
  },

  // ==================================================================
  // 3. Breast Reduction
  // ==================================================================
  {
    slug: 'breast-reduction',
    images: {
      heroImage: `${CDN}hf_20260810_000826_6a1b7a3a-4ad7-4ff7-8874-afd146cb0ad1.png`,
      overviewImage: `${CDN}hf_20260810_000826_864aeddf-5e0d-4bb0-8037-ef99baa81aa6.png`,
      candidatesImage: `${CDN}hf_20260810_000826_334a4868-2e9c-4f6e-98d6-61622a70138f.png`,
      benefitsImage: `${CDN}hf_20260810_000826_09b01cbb-2ed7-4589-856a-2249a750c54d.png`,
    },
    fields: {
      title: 'Breast Reduction',
      category: 'Body',
      surgical: true,
      heroHeading: 'Breast Reduction',
      heroPromise:
        'Breast Reduction, or reduction mammoplasty, removes excess breast tissue, fat and skin to achieve a breast size in proportion to your body and alleviate discomfort.',
      heroBullets: [
        'Relief from back, neck and shoulder pain',
        'A breast size in proportion with your frame',
        'Easier movement and exercise',
        'Consultant-led care, with two-surgeon safety on complex cases',
      ],

      showIntro: true,
      introHeading: 'Proportion, Comfort and Confidence',
      introBody: [
        para(
          'i1',
          'Breast Reduction is a surgical procedure offered by Consultant Plastic Surgeon Mr Roshan Vijayan.',
        ),
        para(
          'i2',
          'Below you will find a comprehensive guide covering the procedure, its benefits, candidate suitability, the recovery process, and why Mr Vijayan is an excellent choice for your breast reduction surgery.',
        ),
      ],

      showResults: true,

      showOverview: true,
      overviewHeading: 'What is Breast Reduction?',
      overviewBody: [
        para(
          'o1',
          'Breast Reduction surgery involves the removal of excess breast tissue, fat, and skin to reduce the size of the breasts.',
        ),
        para(
          'o2',
          'The remaining breast tissue is reshaped, and the nipple and areola are repositioned to achieve a natural and more proportionate look.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', '2–4 hours'),
        glance('briefcase', 'Time off work', '1–2 weeks'),
        glance('home', 'Hospital stay', 'Day case or 1 night'),
        glance('droplet', 'Showering', 'After 2 days'),
        glance('walk', 'Light activity', 'After 1–2 weeks'),
        glance('shield', 'Supportive bra', '4–6 weeks'),
        glance('activity', 'Exercise', 'After 4–6 weeks'),
        glance('navigation', 'Driving', 'After 2 weeks'),
        glance('check', 'Full recovery', '4–6 weeks'),
        glance('moon', 'Final results', '3–6 months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Breast Reduction Address?',
      conditionsIntro:
        'Disproportionately large breasts can cause physical symptoms as well as self-consciousness. Breast reduction can address:',
      conditions: [
        'Back, neck and shoulder pain',
        'Grooving and discomfort from bra straps',
        'Skin irritation or rashes beneath the breasts',
        'Posture problems associated with breast weight',
        'Difficulty exercising or taking part in sport',
        'Difficulty finding clothing and underwear that fits',
        'Breasts that feel out of proportion with your frame',
        'Self-consciousness caused by breast size',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Breast Reduction',
      benefitsIntro:
        'The primary benefit of breast reduction is relief from the physical discomfort associated with overly large breasts. The procedure can achieve:',
      benefitsList: [
        'Relief from back, neck and shoulder pain',
        'An end to skin irritation and posture problems caused by breast weight',
        'A significantly improved ability to exercise and move comfortably',
        'A more proportionate breast size and improved overall aesthetics',
        'Better fitting clothing, with more choice of style and comfort',
        'A meaningful boost to self-confidence',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Good candidates for breast reduction are individuals experiencing physical discomfort, emotional distress, or self-consciousness due to the size of their breasts. Suitable candidates are typically:',
      candidates: [
        'Troubled by physical discomfort caused by breast size',
        'Self-conscious or distressed about how their breasts look',
        'In good overall health and non-smokers',
        'At a stable weight',
        'Realistic about the outcomes of surgery and the scars involved',
      ],
      candidatesOutro:
        'Mr Vijayan will discuss the likely scar pattern, the amount of tissue to be removed and the effect on breastfeeding so that your decision is a fully informed one.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'The procedure is performed under general anaesthesia and usually takes 2 to 4 hours. Incisions are commonly made around the areola and vertically down to the breast crease.',
        ),
        para(
          'p2',
          'The remaining breast tissue is reshaped, and the nipple and areola are repositioned to achieve a natural and more proportionate look.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from breast reduction surgery typically involves a few weeks of downtime. Swelling and bruising are common initially but will gradually subside, and wearing a supportive surgical bra as recommended can aid the healing process.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'You will be supported in a surgical bra. Discomfort is managed with prescribed pain relief, and swelling and bruising are expected.',
        ),
        stage(
          'Week one to two',
          'Most patients return to work within one to two weeks, avoiding anything strenuous.',
        ),
        stage(
          'Weeks three to six',
          'Heavy lifting, strenuous exercise and high-impact activity are avoided for at least four to six weeks.',
        ),
        stage(
          'Three to six months',
          'Swelling settles and the final shape becomes clear. Scars soften and fade, and follow-up appointments continue as needed.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgery, there are risks. These are rare and can be minimised by carefully following the pre- and post-operative care instructions provided by Mr Vijayan and his team. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Adverse reactions to anaesthesia',
        'Changes in nipple sensation',
        'Scarring around the areola and breast crease',
        'An effect on the ability to breastfeed',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'With breast reduction his aim is a breast that is comfortable to live with and proportionate to your frame, planned around your build and your goals rather than a target size, with the least conspicuous scarring the case allows.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a distinguished Consultant Plastic Surgeon known for his expertise and personalised approach. His extensive experience with breast reduction surgeries ensures precise, safe and satisfying results. His care is based on:',
      whyPoints: [
        'Extensive experience with breast reduction surgery',
        'A tailored treatment plan for each patient',
        'Compassionate care throughout your surgical journey',
        'Open discussion of scars, breastfeeding and realistic results',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up and direct postoperative support',
      ],

      showCost: true,
      costHeading: 'How Much Does Breast Reduction Cost?',
      costIntro:
        'The cost of a breast reduction depends on the extent of the reduction required and whether it is combined with another breast procedure.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Breast Reduction surgery painful?',
          'The procedure is performed under general anaesthesia, so you will not feel pain during the surgery. Post-operative discomfort is common and can be managed with prescribed pain relief medications. Most discomfort subsides within a few days to a week.',
        ),
        faq(
          'How long does the surgery take?',
          'The surgery typically takes between 2 to 4 hours, depending on the extent of the reduction needed and the surgical techniques used.',
        ),
        faq(
          'Will there be visible scars?',
          'There will be some scarring, usually around the areola and vertically down to the breast crease. However, these scars will fade over time and become less noticeable. Using modern surgical techniques, Mr Vijayan strives to achieve minimal and well-hidden scarring.',
        ),
        faq(
          'Are there any risks or complications?',
          'As with any surgery, there are risks, including infection, bleeding, adverse reactions to anaesthesia, and changes in nipple sensation. However, these risks are rare and can be minimised by carefully following pre- and post-operative care instructions provided by Mr Vijayan and his team.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'Most patients can return to work and light activities within 1 to 2 weeks. However, it is advised to avoid heavy lifting, strenuous exercise, and high-impact activities for at least 4 to 6 weeks to ensure proper healing.',
        ),
        faq(
          'Will I be able to breastfeed after breast reduction?',
          'Breastfeeding can be affected by breast reduction surgery, depending on the surgical technique used and the extent of tissue removal. Mr Vijayan will discuss the potential impact on breastfeeding during your consultation, helping you make an informed decision based on your future plans.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Breast Reduction Consultation',
      ctaBody:
        'If the size of your breasts is causing discomfort or holding you back, a consultation can clarify what breast reduction could change. Mr Vijayan will assess your breasts, discuss the scars involved and give you an honest, expert view. Contact us today to arrange your consultation.',

      seoTitle: 'Breast Reduction | Roshan Vijayan',
      seoDescription:
        'Discover expert breast reduction treatments with Consultant Plastic Surgeon Mr. Roshan Vijayan for a more comfortable and confident you.',
    },
  },

  // ==================================================================
  // 4. Thigh Lift
  // ==================================================================
  {
    slug: 'thigh-lift',
    images: {
      heroImage: `${CDN}hf_20260810_000826_26ded34f-0356-43c9-94b3-98d9a7241cde.png`,
      overviewImage: `${CDN}hf_20260810_000826_bba3dc11-9cda-4932-8633-3d783d430ba0.png`,
      candidatesImage: `${CDN}hf_20260810_000826_73e45d9b-164a-44a8-aedc-5bb5c6b94ccb.png`,
      benefitsImage: `${CDN}hf_20260810_000826_6cc18575-d384-452e-b02c-44e27f5535a6.png`,
    },
    fields: {
      title: 'Thigh Lift',
      category: 'Body',
      surgical: true,
      heroHeading: 'Thigh Lift',
      heroPromise:
        'A thigh lift is a surgical procedure aimed at reshaping and contouring the thighs by removing excess skin and fat.',
      heroBullets: [
        'Smoother, firmer thigh contour',
        'Loose, sagging skin removed',
        'Ideal after significant weight loss',
        'Consultant-led care and aftercare',
      ],

      showIntro: true,
      introHeading: 'Smoother, Firmer, Better-Proportioned Thighs',
      introBody: [
        para(
          'i1',
          'This procedure is ideal for individuals who have experienced significant weight loss or those who wish to improve the appearance of their thighs. The surgery can enhance self-confidence and provide a more toned and youthful look.',
        ),
        para(
          'i2',
          'Below you will find detailed information about the thigh lift procedure, including its benefits, the surgical process, recovery, and frequently asked questions.',
        ),
      ],

      showResults: true,

      showOverview: true,
      overviewHeading: 'What is a Thigh Lift?',
      overviewBody: [
        para(
          'o1',
          'A thigh lift, also known as thighplasty, is a cosmetic surgery designed to improve the appearance of the thighs by removing excess skin and fat.',
        ),
        para(
          'o2',
          'This procedure is particularly beneficial for individuals who have lost a significant amount of weight and are left with loose, sagging skin on their thighs. A thigh lift can also be an option for those who have not achieved their desired thigh contour through diet and exercise alone.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', '2–4 hours'),
        glance('briefcase', 'Time off work', '2–3 weeks'),
        glance('home', 'Hospital stay', '1 night'),
        glance('droplet', 'Showering', 'After 2 days'),
        glance('walk', 'Light activity', 'After 2–3 weeks'),
        glance('shield', 'Compression garment', '4–6 weeks'),
        glance('activity', 'Exercise', 'After 6 weeks'),
        glance('navigation', 'Driving', 'After 2–3 weeks'),
        glance('check', 'Full recovery', '6 weeks'),
        glance('moon', 'Final results', '3–6 months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can a Thigh Lift Address?',
      conditionsIntro:
        'A thigh lift is most often considered after significant weight loss, when skin no longer retracts on its own. It can address:',
      conditions: [
        'Loose, sagging skin on the inner or outer thighs',
        'Skin that did not retract after significant weight loss',
        'A thigh contour that diet and exercise cannot improve',
        'Chafing or irritation where skin folds rub together',
        'Difficulty finding trousers and skirts that fit comfortably',
        'Loss of skin firmness and elasticity with age',
        'Disproportion between the thighs and the rest of the body',
        'Self-consciousness about the appearance of the thighs',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of a Thigh Lift',
      benefitsIntro: 'Undergoing a thigh lift can offer numerous benefits, including:',
      benefitsList: [
        'Enhanced thigh contour and shape',
        'Improved skin elasticity and firmness',
        'Reduction of excess skin and fat',
        'Boost in self-confidence and body image',
        'More comfortable and better-fitting clothing',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'A thigh lift suits people left with loose skin on the thighs that will not improve on its own. Suitable candidates are typically:',
      candidates: [
        'At a stable weight following significant weight loss',
        'Troubled by loose or sagging skin rather than fat alone',
        'In good overall health and non-smokers',
        'Prepared for the scar that a thigh lift involves',
        'Realistic about what the surgery can achieve',
      ],
      candidatesOutro:
        'Because a thigh lift trades loose skin for a scar, Mr Vijayan will discuss scar position and healing carefully so you can weigh that trade-off before deciding.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'The Surgical Procedure',
      procedureBody: [
        para(
          'p1',
          'The surgery is performed under general anaesthesia and can take several hours, depending on the extent of the work required.',
        ),
        para(
          'p2',
          'Incisions are made in strategic locations to minimise visible scarring. Excess skin and fat are removed, and the remaining skin is tightened and sutured in place.',
        ),
      ],

      showJourney: true,
      journeyHeading: 'Your Thigh Lift Treatment Journey',
      journeyIntro: 'The thigh lift procedure typically involves the following steps:',
      journey: keyed('j', [
        journeyStage(
          'Consultation',
          'During the initial consultation, Mr Roshan Vijayan will discuss your goals, examine your thighs, and determine the best approach for your surgery. He will also explain the risks and benefits of the procedure and answer any questions you may have.',
        ),
        journeyStage(
          'Preparation',
          'Prior to the surgery, you will receive detailed instructions on how to prepare, including guidelines on eating, drinking, and medications. It is important to follow these instructions closely to ensure a smooth procedure and recovery.',
        ),
        journeyStage(
          'Surgery',
          'The surgery is performed under general anaesthesia and can take several hours, depending on the extent of the work required. Incisions are made in strategic locations to minimise visible scarring.',
        ),
        journeyStage(
          'Post-Surgery',
          'After the surgery, you will be monitored in a recovery area before being allowed to go home. You will receive specific instructions on how to care for your incisions, manage pain, and reduce swelling.',
        ),
      ]),

      showRecovery: true,
      recoveryHeading: 'Recovery and Aftercare',
      recoveryIntro:
        'Recovery from a thigh lift varies from person to person, but most patients can expect the following. It is crucial to follow all aftercare instructions provided by Mr Roshan Vijayan to ensure a smooth recovery and optimal results.',
      recovery: keyed('r', [
        stage('Swelling and bruising', 'Initial swelling and bruising, which will subside over time.'),
        stage('Compression garments', 'Wearing compression garments to support the healing process.'),
        stage('Activity', 'Avoiding strenuous activities for several weeks.'),
        stage('Follow-up', 'Attending follow-up appointments so progress can be monitored.'),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgery, there are risks, and Mr Vijayan will discuss each of them with you before you decide. Risks may include:',
      risks: [
        'Infection',
        'Bleeding or haematoma',
        'Prominent or widened scarring',
        'Delayed wound healing',
        'Changes in skin sensation',
        'Asymmetry or the need for further surgery',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'Restoring the body after significant weight loss is a particular focus of his practice. Each thigh lift is planned individually, with careful thought given to where the scar sits and how it can be kept as discreet as the correction allows.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan for a Thigh Lift?',
      whyIntro:
        'A thigh lift asks a surgeon to balance how much skin to remove against where the resulting scar will sit. Mr Vijayan plans each case around your build and your priorities. His care is based on:',
      whyPoints: [
        'Particular experience in post-weight-loss body contouring',
        'A careful assessment of skin quality and the correction needed',
        'Open discussion of scar position, healing and realistic results',
        'A bespoke surgical plan rather than a standard approach',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up and direct postoperative support',
      ],

      showCost: true,
      costHeading: 'How Much Does a Thigh Lift Cost?',
      costIntro:
        'The cost of a thigh lift depends on the extent of the correction required and whether it is combined with another body-contouring procedure.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'How long does a thigh lift procedure take?',
          'The duration of a thigh lift procedure can vary, but it typically takes between 2 to 4 hours, depending on the complexity and extent of the surgery.',
        ),
        faq(
          'Will there be visible scars after a thigh lift?',
          'While every effort is made to minimise scarring, some scars are inevitable. However, they are usually strategically placed and will fade over time with proper care.',
        ),
        faq(
          'When can I resume normal activities after a thigh lift?',
          'Most patients can return to light activities within 2 to 3 weeks, but strenuous activities and exercise should be avoided for at least 6 weeks or as advised by Mr Roshan Vijayan.',
        ),
        faq(
          'Is a thigh lift permanent?',
          'The results of a thigh lift can be long-lasting, especially if you maintain a stable weight and healthy lifestyle. However, natural ageing and weight fluctuations can affect the longevity of the results.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Thigh Lift Consultation',
      ctaBody:
        'If weight loss or time has left you with loose skin on the thighs, a consultation can clarify whether a thigh lift is the right procedure. Mr Vijayan will assess your thighs, explain where the scar would sit and give you an honest view of the result. Contact us today to arrange your consultation.',

      seoTitle: 'Thigh Lift | Roshan Vijayan',
      seoDescription:
        'Discover expert thigh lift treatments by Consultant Plastic Surgeon Mr. Roshan Vijayan for smoother, firmer thighs. Book your consultation today!',
    },
  },

  // ==================================================================
  // 5. Breast Augmentation
  // ==================================================================
  {
    slug: 'breast-augmentation',
    images: {
      heroImage: `${CDN}hf_20260810_000826_66a8cae2-2b9d-41f5-bdb7-778384ac73c3.png`,
      overviewImage: `${CDN}hf_20260810_000826_d7bbd95b-f19e-48da-9e54-b058a51a68ef.png`,
      candidatesImage: `${CDN}hf_20260810_000826_527c7318-5413-4f15-b4b5-b6eeb1ebb3df.png`,
      benefitsImage: `${CDN}hf_20260810_000835_2615bb8b-32ed-4f74-9887-72966454caac.png`,
    },
    fields: {
      title: 'Breast Augmentation',
      category: 'Body',
      surgical: true,
      heroHeading: 'Breast Augmentation',
      heroPromise:
        'Breast Augmentation, also known as augmentation mammoplasty, enhances breast size and shape using implants, providing improved aesthetics and increased self-confidence.',
      heroBullets: [
        'Enhanced breast size and shape',
        'Implants chosen around your frame and goals',
        'Incisions placed in inconspicuous areas',
        'Consultant-led care from consultation to final review',
      ],

      showIntro: true,
      introHeading: 'Balanced Proportion, Naturally Achieved',
      introBody: [
        para(
          'i1',
          'Breast Augmentation is a cosmetic surgical procedure offered by Consultant Plastic Surgeon Mr Roshan Vijayan.',
        ),
        para(
          'i2',
          'Below you will find a comprehensive guide covering the procedure, its benefits, candidacy, recovery, and why you should choose Mr Vijayan for your breast augmentation needs.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Breast Augmentation?',
      overviewBody: [
        para(
          'o1',
          'Breast Augmentation involves the surgical placement of implants to increase the size and improve the shape of the breasts.',
        ),
        para(
          'o2',
          'The implants can be placed either under the breast tissue or under the chest muscle, depending on the patient’s anatomy and desired outcome.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', '1–2 hours'),
        glance('briefcase', 'Time off work', 'About 1 week'),
        glance('home', 'Hospital stay', 'Day case or 1 night'),
        glance('droplet', 'Showering', 'After 2 days'),
        glance('walk', 'Light activity', 'After 1 week'),
        glance('shield', 'Supportive bra', '4–6 weeks'),
        glance('activity', 'Exercise', 'After 4–6 weeks'),
        glance('navigation', 'Driving', 'After 1–2 weeks'),
        glance('check', 'Full recovery', '4–6 weeks'),
        glance('moon', 'Final results', '3–6 months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Breast Augmentation Address?',
      conditionsIntro:
        'Breast size and shape change with genetics, weight and pregnancy. Augmentation can address:',
      conditions: [
        'Breasts that feel small in proportion to your frame',
        'Loss of volume following pregnancy or breastfeeding',
        'Volume lost after weight change',
        'Noticeable asymmetry between the breasts',
        'A lack of fullness in the upper part of the breast',
        'Breasts that have never developed as fully as you would like',
        'Difficulty filling clothing or swimwear comfortably',
        'Self-consciousness about breast size',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Breast Augmentation',
      benefitsIntro:
        'The primary benefit of breast augmentation is an enhanced breast size and shape, leading to a more proportionate and aesthetically pleasing appearance. The procedure can achieve:',
      benefitsList: [
        'Enhanced breast size and improved shape',
        'A more proportionate and balanced figure',
        'Restored fullness after pregnancy or weight change',
        'A significant boost in self-esteem and confidence',
        'Customisable results, with a choice of implant type, size and technique',
        'A wider, more comfortable choice of clothing',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Ideal candidates for breast augmentation are women who are in good overall health, have realistic expectations, and are looking to enhance their breast size and shape. Suitable candidates are typically:',
      candidates: [
        'In good overall health and non-smokers',
        'Dissatisfied with the size or shape of their breasts, whether due to genetics, weight loss or pregnancy',
        'At a stable weight',
        'Realistic about what implants can and cannot change',
        'Fully developed, with breast growth complete',
      ],
      candidatesOutro:
        'Where breasts have also dropped, an implant alone may not lift them, and Mr Vijayan will discuss whether combining augmentation with a lift would give a better-supported result.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'The procedure is performed under general anaesthesia and typically takes about 1 to 2 hours. Incisions are made in inconspicuous areas to minimise visible scarring.',
        ),
        para(
          'p2',
          'The implants can be placed either under the breast tissue or under the chest muscle, depending on the patient’s anatomy and desired outcome.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from breast augmentation surgery typically involves some downtime. Swelling and discomfort are normal in the initial days and can be managed with prescribed pain medications.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'Swelling and discomfort are normal and are managed with prescribed pain medication. A supportive bra is worn from the outset.',
        ),
        stage('Week one', 'Most patients can return to work within a week, avoiding anything strenuous.'),
        stage(
          'Weeks two to six',
          'Heavy lifting and strenuous activities are avoided for at least four to six weeks to ensure proper healing.',
        ),
        stage(
          'Three to six months',
          'Swelling settles and the implants soften into their final position. Follow-up appointments monitor healing and ensure optimal results.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgery, there are risks. These are rare and can be minimised by following the pre- and post-operative care instructions provided by Mr Vijayan and his team. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Implant rupture',
        'Capsular contracture',
        'Changes in nipple or skin sensation',
        'The need for further surgery or implant replacement in future',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'With breast augmentation his emphasis is proportion: choosing an implant that suits your frame and tissue rather than a number, so the result reads as naturally yours. Each plan is discussed openly, including implant type, placement and the scars involved.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'As a Consultant Plastic Surgeon with extensive experience, Mr Roshan Vijayan is committed to providing exceptional care and results. His personalised approach ensures each patient receives a tailored treatment plan that meets their unique needs and aesthetic goals. His care is based on:',
      whyPoints: [
        'Extensive consultant experience in breast surgery',
        'A tailored treatment plan built around your goals',
        'Meticulous surgical technique and compassionate care',
        'Honest guidance on implant type, size and placement',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up in a professional and welcoming environment',
      ],

      showCost: true,
      costHeading: 'How Much Does Breast Augmentation Cost?',
      costIntro:
        'The cost of breast augmentation depends on the implants selected, the surgical technique used, and whether it is combined with another breast procedure.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Breast Augmentation surgery painful?',
          'The procedure is performed under general anaesthesia, so you will not feel pain during the surgery. Post-operative discomfort is common and can be managed with prescribed pain medications. Most discomfort subsides within a few days.',
        ),
        faq(
          'How long does the surgery take?',
          'The surgery typically takes about 1 to 2 hours, depending on the complexity and techniques used.',
        ),
        faq(
          'Will there be visible scars?',
          'Incisions are made in inconspicuous areas, such as along the breast crease, around the areola, or through the armpit, to minimise visible scarring. Over time, scars typically fade and become less noticeable.',
        ),
        faq(
          'Are there any risks or complications?',
          'As with any surgery, there are risks, including infection, bleeding, implant rupture, or capsular contracture. However, these risks are rare and can be minimised by following pre- and post-operative care instructions.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'Most patients can return to normal activities within a week, but it is recommended to avoid heavy lifting and strenuous exercises for at least 4 to 6 weeks to ensure proper healing.',
        ),
        faq(
          'What types of implants are available?',
          'There are two main types of implants: saline and silicone. Each type has its own benefits and considerations, and Mr Vijayan will help you choose the best option for your needs and goals during the consultation.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Breast Augmentation Consultation',
      ctaBody:
        'If you are considering breast augmentation, a consultation is the place to start. Mr Vijayan will assess your frame and tissue, talk through implant options and give you an honest view of what is achievable. Contact us today to arrange your consultation.',

      seoTitle: 'Breast Augmentation | Roshan Vijayan',
      seoDescription:
        'Enhance your confidence with breast augmentation by Consultant Plastic Surgeon Mr. Roshan Vijayan. Safe, personalized treatments for natural results.',
    },
  },
]

async function uploadImage(slug: string, field: string, url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed (HTTP ${res.status})`)
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, {
    filename: `${slug}-${field.replace(/Image$/, '').toLowerCase()}.png`,
  })
  return {_type: 'image', asset: {_type: 'reference', _ref: asset._id}}
}

async function seed(proc: Procedure) {
  const existing = await client.fetch<Record<string, unknown> | null>(
    `*[_type=="procedure" && slug.current==$slug][0]`,
    {slug: proc.slug},
  )
  const id = (existing?._id as string) || `procedure.${proc.slug}`

  const images: Record<string, unknown> = {}
  for (const [field, url] of Object.entries(proc.images)) {
    if (existing?.[field]) continue
    try {
      images[field] = await uploadImage(proc.slug, field, url)
    } catch (err) {
      console.warn(`  ! ${field}: ${(err as Error).message} — falls back to the default image`)
    }
  }

  const doc = {...proc.fields, ...images}

  if (!existing) {
    await client.createOrReplace({
      _id: id,
      _type: 'procedure',
      slug: {_type: 'slug', current: proc.slug},
      ...doc,
    })
    console.log(`✓ created  ${id}`)
  } else {
    await client.patch(id).set(doc).unset(['surgeonQuote', 'costFrom', 'benefits']).commit()
    console.log(`✓ updated  ${id}`)
  }
}

async function run() {
  for (const proc of PROCEDURES) {
    console.log(`\n${proc.fields.title}`)
    await seed(proc)
  }
  console.log(`\nDone — ${PROCEDURES.length} procedures written.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
