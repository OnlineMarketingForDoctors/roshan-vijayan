/**
 * Creates five Face procedures from their old vijayan.co.uk pages, preserving
 * copy and metadata so the existing search value carries over. These are the
 * first procedures in the Face category, so they publish under
 * /procedures/face/<slug>/ — matching the old site's paths.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/add-face-procedures.ts --with-user-token
 *
 * Section art is generated; the script downloads it once and uploads it into
 * Sanity. Images already set on a document are left alone, so re-running is
 * safe. Stray markdown fences at the foot of the Rhinoplasty and Facelift
 * pages are dropped, and US spellings are corrected to UK.
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

type Procedure = {slug: string; images: Record<string, string>; fields: Record<string, unknown>}

const PROCEDURES: Procedure[] = [
  // ==================================================================
  // 1. Split Ear Lobe Correction
  // ==================================================================
  {
    slug: 'split-ear-lobe-correction',
    images: {
      heroImage: `${CDN}hf_20260810_011733_8fa586f7-1a0f-4726-ab6f-1624ed073a10.png`,
      overviewImage: `${CDN}hf_20260810_011732_3d970a39-d235-4a14-a54e-eeddbaa69bed.png`,
      candidatesImage: `${CDN}hf_20260810_011732_31ff2c52-0020-4c26-a2b7-f281782148fc.png`,
      benefitsImage: `${CDN}hf_20260810_011732_c9ea7913-ef47-4eb4-8c6e-be98d722ff0e.png`,
    },
    fields: {
      title: 'Split Ear Lobe Correction',
      category: 'Face',
      surgical: true,
      heroHeading: 'Split Ear Lobe Correction',
      heroPromise:
        'Split Ear Lobe Correction is a specialised procedure offered by Consultant Plastic Surgeon Mr Roshan Vijayan to repair torn or split earlobes.',
      heroBullets: [
        'The natural shape of the earlobe restored',
        'A short procedure under local anaesthetic',
        'Earrings can be worn again once healed',
        'Meticulous suturing for minimal scarring',
      ],

      showIntro: true,
      introHeading: 'Restoring the Natural Shape of the Earlobe',
      introBody: [
        para(
          'i1',
          'A torn or split earlobe is a common problem, and one that is straightforward to put right.',
        ),
        para(
          'i2',
          'Below you will find a guide to the procedure, its benefits, the recovery process and patient care, so you can make an informed decision.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Split Ear Lobe Correction?',
      overviewBody: [
        para(
          'o1',
          'Split Ear Lobe Correction addresses the issue of torn or split earlobes, which can result from trauma, heavy earrings, or stretching practices.',
        ),
        para(
          'o2',
          'This procedure involves meticulous suturing of the earlobe tissue to restore its original shape.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Procedure time', '30–60 minutes'),
        glance('shield', 'Anaesthetic', 'Local'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('walk', 'Normal activities', 'Immediately'),
        glance('droplet', 'Keep dry', 'A few days'),
        glance('check', 'Stitches removed', 'Within a week'),
        glance('activity', 'Complete healing', 'A few weeks'),
        glance('navigation', 'Driving', 'Same day'),
        glance('clipboard', 'Re-piercing', 'After 6 weeks–3 months'),
        glance('moon', 'Final results', 'A few months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Split Ear Lobe Correction Address?',
      conditionsIntro:
        'Earlobes tear or stretch for all sorts of everyday reasons, and the tissue rarely closes on its own. The procedure can address:',
      conditions: [
        'A completely split earlobe torn through to the edge',
        'A partial tear that has widened over time',
        'A piercing hole stretched by heavy earrings',
        'Earlobes stretched by tunnels or gauges',
        'A tear caused by trauma, such as an earring catching',
        'Asymmetry between the two earlobes',
        'Difficulty wearing earrings comfortably or at all',
        'Self-consciousness about the appearance of the ear',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Split Ear Lobe Correction',
      benefitsIntro:
        'This procedure effectively restores the natural shape of the earlobe, enhancing facial symmetry and aesthetics. It can achieve:',
      benefitsList: [
        'The natural shape of the earlobe restored',
        'Improved facial symmetry and aesthetics',
        'The freedom to wear earrings comfortably again',
        'A significant boost to self-esteem and confidence',
        'Minimal, well-hidden scarring',
        'A lasting result from a short, straightforward procedure',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Individuals with torn or split earlobes, whether from trauma, earrings, or other factors, are ideal candidates. As long as you are in good general health, you can consider this procedure to restore your earlobes. Suitable candidates are typically:',
      candidates: [
        'Troubled by a torn, split or stretched earlobe',
        'In good general health',
        'Happy to wait before re-piercing while the earlobe heals',
        'Realistic about the small scar the repair leaves',
      ],
      candidatesOutro:
        'The procedure suits both a recent tear and one that happened years ago, and it can be carried out on one or both ears in the same appointment.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'It is performed under local anaesthesia and typically takes about 30 to 60 minutes.',
        ),
        para(
          'p2',
          'The edges of the split are refreshed and the earlobe is carefully sutured so that it heals as a smooth, continuous margin rather than a visible notch.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from split ear lobe correction is usually quick. Most patients can return to normal activities immediately after the procedure, although caution is advised with earlobe handling.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'The area is kept clean and dry. Normal activities can resume straight away, taking care not to knock or pull the earlobe.',
        ),
        stage('Within a week', 'Stitches may be removed within a week at a short follow-up appointment.'),
        stage('A few weeks', 'Complete healing typically occurs within a few weeks as the scar settles.'),
        stage(
          'Six weeks to three months',
          'It is generally recommended to wait at least six weeks to three months before re-piercing, to ensure full healing and the best result.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'Risks are minimal but worth understanding. Carefully following post-operative care instructions can reduce them considerably. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Unfavourable scarring',
        'A small notch at the earlobe margin',
        'Slight asymmetry between the ears',
        'Recurrence if the earlobe is stretched again',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'Small procedures deserve the same precision as large ones. An earlobe repair is judged entirely on its margin and its scar, so Mr Vijayan approaches it with the same reconstructive care he brings to any facial work.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a highly skilled Consultant Plastic Surgeon dedicated to providing top-quality care with a personal touch. His extensive experience with split ear lobe correction ensures expert precision and excellent results. His care is based on:',
      whyPoints: [
        'Extensive experience with earlobe repair',
        'Expert precision and attention to the scar line',
        'An individualised treatment plan for each patient',
        'A priority on patient comfort and satisfaction',
        'Clear guidance on healing and when to re-pierce',
        'Consultant-led follow-up throughout',
      ],

      showCost: true,
      costHeading: 'How Much Does Split Ear Lobe Correction Cost?',
      costIntro:
        'The cost depends on whether one or both earlobes are being repaired and the extent of the correction required.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Split Ear Lobe Correction surgery painful?',
          'The procedure is performed under local anaesthesia, so you will not feel pain during the surgery. Post-operative discomfort is usually minimal and can be managed with over-the-counter pain relief if needed.',
        ),
        faq(
          'How long does the procedure take?',
          'The surgery typically takes about 30 to 60 minutes, depending on the extent of the repair needed.',
        ),
        faq(
          'Will there be visible scars?',
          'Any scarring is generally minimal and fades over time. The suturing technique aims to achieve the most aesthetically pleasing result with minimal scarring.',
        ),
        faq(
          'What are the risks or complications?',
          'Risks are minimal but can include infection, bleeding, or unfavourable scarring. Carefully following post-operative care instructions can reduce these risks considerably.',
        ),
        faq(
          'How soon can I re-pierce my ears?',
          'It is generally recommended to wait at least six weeks to three months before re-piercing the earlobes to ensure full healing and optimal results.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Earlobe Repair Consultation',
      ctaBody:
        'If a torn or stretched earlobe is stopping you wearing earrings or making you self-conscious, it is a straightforward thing to put right. Contact us today to arrange your consultation with Mr Vijayan.',

      seoTitle: 'Split Ear Lobe Correction | Roshan Vijayan',
      seoDescription:
        'Expert split ear lobe correction by Consultant Plastic Surgeon Mr. Roshan Vijayan. Restore your ear’s natural appearance with precision care.',
    },
  },

  // ==================================================================
  // 2. Rhinoplasty
  // ==================================================================
  {
    slug: 'rhinoplasty',
    images: {
      heroImage: `${CDN}hf_20260810_011732_3efc82d1-8179-4040-ba2a-b70fc4a69344.png`,
      overviewImage: `${CDN}hf_20260810_011732_13a0a357-7fcf-4f03-980b-771e09b50e03.png`,
      candidatesImage: `${CDN}hf_20260810_011732_4257d16b-f940-4817-bff8-109f35f22be6.png`,
      benefitsImage: `${CDN}hf_20260810_011732_b3941f38-baa4-4c49-991a-3087be7fb5b9.png`,
    },
    fields: {
      title: 'Rhinoplasty',
      category: 'Face',
      surgical: true,
      heroHeading: 'Rhinoplasty',
      heroPromise:
        'Rhinoplasty, often referred to as a “nose job,” is a highly specialised surgical procedure aimed at enhancing the aesthetic appearance and functionality of the nose.',
      heroBullets: [
        'A nose in harmony with your other features',
        'Aesthetic and functional improvement together',
        'Bespoke planning around your anatomy',
        'Consultant-led care from consultation to final review',
      ],

      showIntro: true,
      introHeading: 'Balance, Proportion and Better Breathing',
      introBody: [
        para(
          'i1',
          'Mr Roshan Vijayan, a renowned Consultant Plastic Surgeon, offers bespoke rhinoplasty solutions tailored to meet individual needs, ensuring both cosmetic and functional improvements.',
        ),
        para(
          'i2',
          'Below you will find everything from the basics of rhinoplasty and the consultation process to the surgical procedure, recovery and frequently asked questions.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Rhinoplasty?',
      overviewBody: [
        para(
          'o1',
          'Rhinoplasty is a surgical procedure designed to reshape the nose for both aesthetic and functional purposes. It can address issues such as nasal asymmetry, bumps on the bridge, and breathing difficulties caused by structural abnormalities.',
        ),
        para(
          'o2',
          'The goal is to create a harmonious balance with other facial features while improving nasal function.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', '1–3 hours'),
        glance('shield', 'Anaesthetic', 'General'),
        glance('home', 'Hospital stay', 'Day case or 1 night'),
        glance('briefcase', 'Time off work', '1–2 weeks'),
        glance('moon', 'Sleeping elevated', 'First 1–2 weeks'),
        glance('walk', 'Swelling and bruising', 'Settles within 2 weeks'),
        glance('activity', 'Exercise', 'After 4–6 weeks'),
        glance('navigation', 'Driving', 'After 1–2 weeks'),
        glance('check', 'Back to normal', '2–3 weeks'),
        glance('clipboard', 'Final results', 'Up to a year'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Rhinoplasty Address?',
      conditionsIntro:
        'Rhinoplasty can change how the nose looks, how it works, or both. It can address:',
      conditions: [
        'A bump or irregularity on the bridge of the nose',
        'Nasal asymmetry or a crooked appearance',
        'A nasal tip that is wide, drooping or poorly defined',
        'A nose that feels out of proportion with other features',
        'Breathing difficulties caused by structural abnormalities',
        'A deviated septum affecting airflow',
        'Changes to the nose following injury',
        'Nostrils that appear too wide or uneven',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Rhinoplasty',
      benefitsIntro:
        'Rhinoplasty aims at a harmonious balance with your other facial features while improving nasal function. It can achieve:',
      benefitsList: [
        'A nose in better proportion with the rest of the face',
        'A smoother bridge and a better-defined tip',
        'Improved facial symmetry',
        'Easier breathing where structural issues are corrected',
        'A result planned around your own anatomy rather than a template',
        'A lasting change, with final results settling over the first year',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Rhinoplasty suits people who are troubled by the shape of their nose, its function, or both. Suitable candidates are typically:',
      candidates: [
        'Fully grown, with facial development complete',
        'In good general health and non-smokers',
        'Clear about what specifically they would like changed',
        'Realistic about what surgery can achieve for their anatomy',
        'Prepared for a result that settles gradually over months',
      ],
      candidatesOutro:
        'Digital imaging at the consultation helps make expectations concrete, so you and Mr Vijayan are working towards the same result before anything is agreed.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'The Surgical Procedure',
      procedureBody: [
        para(
          'p1',
          'Rhinoplasty is typically performed under general anaesthesia and can take between one to three hours, depending on the complexity of the case.',
        ),
        para(
          'p2',
          'There are two primary techniques: open rhinoplasty and closed rhinoplasty. Open rhinoplasty involves a small incision on the columella, while closed rhinoplasty involves incisions within the nostrils. Mr Vijayan will choose the most appropriate technique based on your individual needs.',
        ),
      ],

      showJourney: true,
      journeyHeading: 'Your Rhinoplasty Journey',
      journeyIntro:
        'Rhinoplasty is a planned, staged process, and each step is explained before you commit to anything.',
      journey: keyed('j', [
        journeyStage(
          'The Consultation Process',
          'During the initial consultation, Mr Roshan Vijayan will conduct a thorough assessment of your nasal structure and discuss your aesthetic goals. This is a critical step to ensure that the surgical plan is tailored to your specific needs. Digital imaging may be used to provide a visual representation of the potential outcomes.',
        ),
        journeyStage(
          'Surgery',
          'The procedure is carried out under general anaesthesia using the technique agreed with you, whether open or closed, and typically takes between one and three hours.',
        ),
        journeyStage(
          'Recovery and Aftercare',
          'Post-operative care is crucial for optimal recovery and results. Patients may experience swelling and bruising, which typically subside within two weeks. It is essential to follow Mr Vijayan’s aftercare instructions, including avoiding strenuous activities and sleeping with your head elevated.',
        ),
        journeyStage(
          'Results',
          'Follow-up appointments are scheduled to monitor your progress and ensure proper healing. Initial improvements can be seen within a few weeks, while the final result settles over the following months.',
        ),
      ]),

      showRecovery: false,

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgical procedure, rhinoplasty carries some risks. These are minimised when the surgery is performed by an experienced surgeon. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Adverse reactions to anaesthesia',
        'Persistent swelling in the early months',
        'Asymmetry or a result that needs refinement',
        'The need for revision surgery',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'Rhinoplasty rewards restraint. Mr Vijayan plans each nose around the face it belongs to, aiming for a result that looks unremarkable in the best sense — balanced, natural, and breathing well.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan for Rhinoplasty?',
      whyIntro:
        'Rhinoplasty is among the most technically demanding facial procedures, because a small change reads across the whole face. Mr Vijayan offers bespoke solutions tailored to individual needs. His care is based on:',
      whyPoints: [
        'A thorough assessment of both nasal structure and appearance',
        'Digital imaging to agree the goal before surgery',
        'A technique chosen for your anatomy, whether open or closed',
        'Attention to breathing as well as aesthetics',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up through the full year of settling',
      ],

      showCost: true,
      costHeading: 'How Much Does Rhinoplasty Cost?',
      costIntro:
        'The cost of rhinoplasty varies based on the complexity of the procedure and other factors. A detailed quote will be provided during the consultation.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'How long does it take to see the final results?',
          'While initial improvements can be seen within a few weeks, the final results of rhinoplasty may take up to a year to fully manifest as the nasal tissues settle.',
        ),
        faq(
          'Is rhinoplasty painful?',
          'Most patients report minimal pain post-surgery, which can be managed effectively with prescribed pain medication.',
        ),
        faq(
          'Are there any risks associated with rhinoplasty?',
          'As with any surgical procedure, rhinoplasty carries some risks, including infection, bleeding, and adverse reactions to anaesthesia. However, these risks are minimised when performed by an experienced surgeon like Mr Roshan Vijayan.',
        ),
        faq(
          'Can rhinoplasty improve breathing?',
          'Yes, functional rhinoplasty can correct structural issues such as a deviated septum, thereby improving breathing.',
        ),
        faq(
          'How much does rhinoplasty cost?',
          'The cost of rhinoplasty varies based on the complexity of the procedure and other factors. A detailed quote will be provided during the consultation.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Rhinoplasty Consultation',
      ctaBody:
        'If you are considering rhinoplasty, the consultation is where the plan takes shape. Mr Vijayan will assess your nasal structure, discuss your goals and give you an honest view of what is achievable. Contact us today to arrange your consultation.',

      seoTitle: 'Rhinoplasty | Roshan Vijayan',
      seoDescription:
        'Discover expert rhinoplasty with Consultant Plastic Surgeon Mr. Roshan Vijayan. Achieve your desired look with precision and care. Book a consultation today.',
    },
  },

  // ==================================================================
  // 3. Prominent Ear Correction
  // ==================================================================
  {
    slug: 'prominent-ear-correction',
    images: {
      heroImage: `${CDN}hf_20260810_011732_e20a6f4d-4d28-4cc6-a9d2-ccf4fc909157.png`,
      overviewImage: `${CDN}hf_20260810_011732_1ae7f97d-81bf-4a3c-a802-87ac418cd766.png`,
      candidatesImage: `${CDN}hf_20260810_011732_c89c0fa5-c2ca-42dc-a5cd-4ed41d3565b2.png`,
      benefitsImage: `${CDN}hf_20260810_011732_0f41077c-48b2-4fd2-90d2-caa56f784925.png`,
    },
    fields: {
      title: 'Prominent Ear Correction',
      category: 'Face',
      surgical: true,
      heroHeading: 'Prominent Ear Correction',
      heroPromise:
        'Prominent Ear Correction, also known as otoplasty or ear pinning, addresses prominent or protruding ears, providing a balanced and natural appearance.',
      heroBullets: [
        'Ears set closer to the head',
        'Improved facial symmetry and balance',
        'Incisions hidden behind the ear',
        'Suitable for adults and children',
      ],

      showIntro: true,
      introHeading: 'A Balanced, Natural Appearance',
      introBody: [
        para(
          'i1',
          'Prominent Ear Correction is a highly effective procedure offered by Consultant Plastic Surgeon Mr Roshan Vijayan.',
        ),
        para(
          'i2',
          'Below you will find a guide to the procedure, its benefits, recovery and patient care, to help you make an informed decision.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Prominent Ear Correction?',
      overviewBody: [
        para(
          'o1',
          'Prominent Ear Correction is a surgical procedure aimed at setting back the ears closer to the head, thereby correcting their protruding appearance.',
        ),
        para(
          'o2',
          'The surgery typically involves reshaping or repositioning the cartilage for a more natural look. Otoplasty is a relatively straightforward procedure with lasting results.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', '1–2 hours'),
        glance('shield', 'Anaesthetic', 'Local or general'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('briefcase', 'Back to work or school', 'Within a week'),
        glance('droplet', 'Head bandage', 'First few days'),
        glance('walk', 'Swelling and bruising', 'Subsides within days'),
        glance('activity', 'Contact sport', 'After several weeks'),
        glance('navigation', 'Driving', 'After a few days'),
        glance('check', 'Normal activities', 'Within a week'),
        glance('moon', 'Results', 'Generally permanent'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Ear Correction Address?',
      conditionsIntro:
        'Prominent ears are usually a matter of how the cartilage formed rather than anything that changes over time. Otoplasty can address:',
      conditions: [
        'Ears that protrude noticeably from the head',
        'An underdeveloped or absent antihelical fold',
        'A deep concha that pushes the ear outward',
        'Noticeable asymmetry between the two ears',
        'Ears that appear large in proportion to the face',
        'A misshapen upper ear rim',
        'Self-consciousness about wearing hair tied back',
        'Long-standing distress about ear appearance in children and adults',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Prominent Ear Correction',
      benefitsIntro:
        'The primary benefit of ear correction surgery is enhanced facial symmetry and a natural appearance. The procedure can achieve:',
      benefitsList: [
        'Enhanced facial symmetry and a natural appearance',
        'Improved overall aesthetic balance of the face',
        'A significant boost in self-esteem and confidence',
        'Freedom to wear hair tied back without self-consciousness',
        'Generally permanent outcomes, providing long-term satisfaction',
        'Well-hidden scarring behind the ear',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Individuals who are dissatisfied with the prominence of their ears and are in good health are ideal candidates for otoplasty. The surgery is suitable for both adults and children, typically over the age of 5, as the ears are fully developed by this age. Suitable candidates are typically:',
      candidates: [
        'Dissatisfied with how prominent their ears appear',
        'In good general health',
        'Aged five or over, once the ears are fully developed',
        'Realistic about what the surgery can achieve',
      ],
      candidatesOutro:
        'For children, the decision is best made when the child is bothered by their ears themselves, rather than at a fixed age.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'Performed under local or general anaesthesia, otoplasty is a relatively straightforward procedure with lasting results, usually taking about one to two hours.',
        ),
        para(
          'p2',
          'Incisions are usually made behind the ears, and the cartilage is reshaped or repositioned so the ear sits closer to the head with a natural-looking fold.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from prominent ear correction surgery is relatively swift. Swelling and bruising are common but subside within a few days.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'A supportive dressing protects the ears. Swelling and bruising are common but subside within a few days.',
        ),
        stage(
          'The first week',
          'Most patients can return to normal activities, including work or school, within a week.',
        ),
        stage(
          'Several weeks',
          'Strenuous activities and contact sports are avoided for several weeks to ensure proper healing.',
        ),
        stage(
          'Follow-up',
          'Follow-up appointments are scheduled to monitor healing and ensure optimal results.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgical procedure, there are risks. These are rare and can be minimised by following pre- and post-operative care instructions. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Adverse reactions to anaesthesia',
        'Asymmetry between the ears',
        'Scarring behind the ear',
        'Partial recurrence of prominence',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'With otoplasty the aim is ears that simply stop drawing attention. Mr Vijayan reshapes rather than over-corrects, so the fold looks like one the ear always had.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'As a Consultant Plastic Surgeon with years of experience, Mr Roshan Vijayan is dedicated to providing personalised care and exceptional results. His expertise in prominent ear correction ensures that each patient receives a tailored treatment plan. His care is based on:',
      whyPoints: [
        'Years of consultant experience in facial surgery',
        'A tailored treatment plan focused on your goals',
        'A compassionate approach with children and adults alike',
        'Careful, natural reshaping rather than over-correction',
        'A second consultation before treatment, included as standard',
        'Outstanding outcomes in a professional and comforting environment',
      ],

      showCost: true,
      costHeading: 'How Much Does Ear Correction Cost?',
      costIntro:
        'The cost of otoplasty depends on whether one or both ears are being corrected, the extent of the reshaping required and the anaesthetic used.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Prominent Ear Correction surgery painful?',
          'The procedure is typically performed under anaesthesia, so you will not feel pain during the surgery. Some discomfort or mild pain is normal during recovery, which can be managed with prescribed pain medication.',
        ),
        faq(
          'How long does the surgery take?',
          'The surgery usually takes about 1 to 2 hours, depending on the complexity and extent of the correction needed.',
        ),
        faq(
          'Will there be visible scars?',
          'Incisions are usually made behind the ears, so any scarring will be minimal and well-hidden. Over time, scars typically fade and become less noticeable.',
        ),
        faq(
          'Are there any risks or complications?',
          'As with any surgical procedure, there are risks, including infection, bleeding, and adverse reactions to anaesthesia. However, these are rare and can be minimised by following pre- and post-operative care instructions.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'You can generally return to work or school within a week, but you should avoid strenuous activities and contact sports for several weeks to ensure proper healing.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Ear Correction Consultation',
      ctaBody:
        'If prominent ears are a source of self-consciousness, for you or for your child, a consultation can explain exactly what otoplasty involves and what it can achieve. Contact us today to arrange your consultation.',

      seoTitle: 'Prominent Ear Correction | Roshan Vijayan',
      seoDescription:
        'Expert Prominent Ear Correction by Mr. Roshan Vijayan. Achieve natural-looking results with personalized care. Book your consultation today.',
    },
  },

  // ==================================================================
  // 4. Lip Lift
  // ==================================================================
  {
    slug: 'lip-lift',
    images: {
      heroImage: `${CDN}hf_20260810_011754_8f637f52-44f0-4713-9068-52f5b15c9ff6.png`,
      overviewImage: `${CDN}hf_20260810_011754_d1e54e56-85e4-4a9e-8292-24c39dd6f12b.png`,
      candidatesImage: `${CDN}hf_20260810_011754_a5365d00-53c0-4e5f-9f21-d96bfaec7cc8.png`,
      benefitsImage: `${CDN}hf_20260810_011754_f95f5ad6-af22-40d5-b21c-3bbf3098a1fe.png`,
    },
    fields: {
      title: 'Lip Lift',
      category: 'Face',
      surgical: true,
      heroHeading: 'Lip Lift',
      heroPromise:
        'The Lip Lift is a specialised cosmetic surgery designed to enhance the appearance of the lips by shortening the distance between the upper lip and the nose.',
      heroBullets: [
        'A more defined, youthful upper lip',
        'Improved smile aesthetics',
        'A permanent alternative to fillers',
        'A short procedure under local anaesthetic',
      ],

      showIntro: true,
      introHeading: 'A More Youthful, Balanced Smile',
      introBody: [
        para(
          'i1',
          'The Lip Lift is a transformative cosmetic surgery aimed at enhancing the appearance of the lips by reducing the distance between the upper lip and the nose.',
        ),
        para(
          'i2',
          'This procedure is ideal for individuals seeking a more youthful and balanced facial appearance.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is a Lip Lift?',
      overviewBody: [
        para(
          'o1',
          'A Lip Lift is a cosmetic surgical procedure designed to enhance the appearance of the lips by shortening the distance between the upper lip and the nose, resulting in a more youthful and aesthetically pleasing smile.',
        ),
        para(
          'o2',
          'Because it changes the lip itself rather than adding volume, the result is permanent in a way that fillers are not.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Procedure time', '1–2 hours'),
        glance('shield', 'Anaesthetic', 'Local'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('briefcase', 'Time off work', 'About 1 week'),
        glance('droplet', 'Keep incision clean and dry', 'First week'),
        glance('clipboard', 'Soft diet', 'First few days'),
        glance('activity', 'Strenuous activity', 'After 1 week'),
        glance('check', 'Normal activities', 'Within a week'),
        glance('walk', 'Complete healing', 'A few weeks'),
        glance('moon', 'Results', 'Permanent'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can a Lip Lift Address?',
      conditionsIntro:
        'The space between the nose and the upper lip lengthens with age, which can make the mouth look flatter and less defined. A lip lift can address:',
      conditions: [
        'A long distance between the nose and the upper lip',
        'An upper lip that shows little pink when relaxed',
        'A flat or poorly defined cupid’s bow',
        'Teeth that no longer show when the mouth is at rest',
        'A lip that has lengthened with age',
        'A wish for definition without added volume',
        'Dissatisfaction with the temporary nature of fillers',
        'An upper lip out of proportion with the lower lip',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of a Lip Lift',
      benefitsIntro: 'A Lip Lift offers numerous benefits, including:',
      benefitsList: [
        'Enhanced lip definition and contour.',
        'Improved smile aesthetics.',
        'A more youthful and rejuvenated appearance.',
        'Increased lip volume and prominence.',
        'Permanent results compared to temporary fillers.',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Good candidates for a Lip Lift are individuals who are unhappy with the length of their upper lip, desire a more defined lip contour, or seek a permanent solution compared to temporary fillers. Suitable candidates are typically:',
      candidates: [
        'Unhappy with the length of the upper lip',
        'Looking for a more defined lip contour',
        'Seeking a permanent alternative to fillers',
        'In good general health and non-smokers',
        'Realistic about the small scar beneath the nose',
      ],
      candidatesOutro:
        'The incision sits at the base of the nose, where it is well concealed, and Mr Vijayan will discuss how it heals so you know exactly what to expect.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'The Lip Lift Procedure',
      procedureBody: [
        para(
          'p1',
          'The Lip Lift procedure is a straightforward surgical technique performed under local anaesthesia. During the procedure, a small strip of skin is removed from the area between the upper lip and the nose.',
        ),
        para(
          'p2',
          'The remaining skin is then lifted and sutured, resulting in a shorter distance between the lip and the nose and a more pronounced lip appearance.',
        ),
      ],

      showJourney: true,
      journeyHeading: 'Step-by-Step Process',
      journeyIntro: 'The procedure follows a clear sequence, explained to you in advance:',
      journey: keyed('j', [
        journeyStage(
          'Consultation',
          'A thorough consultation with Mr Roshan Vijayan to discuss your goals and expectations.',
        ),
        journeyStage('Anaesthesia', 'Local anaesthesia is administered to ensure comfort during the procedure.'),
        journeyStage('Incision', 'A precise incision is made at the base of the nose.'),
        journeyStage('Skin Removal', 'A small strip of skin is carefully removed.'),
        journeyStage(
          'Suturing',
          'The remaining skin is lifted and sutured to create the desired lip appearance.',
        ),
        journeyStage('Recovery', 'Post-operative care instructions are provided to ensure a smooth recovery.'),
      ]),

      showRecovery: true,
      recoveryHeading: 'Recovery and Aftercare',
      recoveryIntro:
        'Recovery from a Lip Lift is relatively quick, with most patients resuming normal activities within a week. It is essential to follow the aftercare instructions provided by Mr Roshan Vijayan to ensure optimal healing and results.',
      recovery: keyed('r', [
        stage('Keep the area clean', 'Keep the incision area clean and dry.'),
        stage('Rest from exercise', 'Avoid strenuous activities for at least one week.'),
        stage('Eat gently', 'Follow a soft diet to minimise strain on the lips.'),
        stage('Follow-up', 'Attend follow-up appointments as scheduled, and report any unusual symptoms immediately.'),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgical procedure, there are potential risks. These are minimised when the procedure is performed by an experienced surgeon. Risks may include:',
      risks: [
        'Infection',
        'Scarring at the base of the nose',
        'Asymmetry',
        'Delayed wound healing',
        'Temporary numbness of the upper lip',
        'A result that needs minor refinement',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'A lip lift is measured in millimetres, and the scar sits in plain sight beneath the nose. Mr Vijayan plans both carefully, so the change reads as a naturally shorter lip rather than as surgery.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan for a Lip Lift?',
      whyIntro:
        'A lip lift is a small operation where precision matters enormously, because the scar and the proportion are both on show. His care is based on:',
      whyPoints: [
        'Careful measurement planned around your own proportions',
        'Meticulous placement of the incision at the base of the nose',
        'An honest discussion of scarring and healing',
        'Experience across the full range of facial procedures',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up and direct postoperative support',
      ],

      showCost: true,
      costHeading: 'How Much Does a Lip Lift Cost?',
      costIntro:
        'The cost of a lip lift depends on the complexity of the case and whether it is combined with another facial procedure.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'What is a Lip Lift?',
          'A Lip Lift is a cosmetic surgical procedure designed to enhance the appearance of the lips by shortening the distance between the upper lip and the nose, resulting in a more youthful and aesthetically pleasing smile.',
        ),
        faq(
          'Who is a good candidate for a Lip Lift?',
          'Good candidates for a Lip Lift are individuals who are unhappy with the length of their upper lip, desire a more defined lip contour, or seek a permanent solution compared to temporary fillers.',
        ),
        faq(
          'How long does the procedure take?',
          'The Lip Lift procedure typically takes about one to two hours, depending on the complexity of the case.',
        ),
        faq(
          'What is the recovery time?',
          'Most patients can resume normal activities within a week, although complete healing may take a few weeks. It is essential to follow post-operative care instructions for optimal results.',
        ),
        faq(
          'Are there any risks associated with a Lip Lift?',
          'As with any surgical procedure, there are potential risks, including infection, scarring, and asymmetry. However, these risks are minimised when the procedure is performed by an experienced surgeon like Mr Roshan Vijayan.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Lip Lift Consultation',
      ctaBody:
        'If a long upper lip or a lack of definition is something you have thought about for a while, a consultation can explain exactly what a lip lift changes and what it does not. Contact us today to arrange your consultation.',

      seoTitle: 'Lip Lift | Roshan Vijayan',
      seoDescription:
        'Discover expert Lip Lift treatments by Consultant Plastic Surgeon Mr. Roshan Vijayan for a rejuvenated, youthful smile. Book your consultation today!',
    },
  },

  // ==================================================================
  // 5. Facelift
  // ==================================================================
  {
    slug: 'facelift',
    images: {
      heroImage: `${CDN}hf_20260810_011754_2f799552-a732-4465-9b43-e1e8d88537ba.png`,
      overviewImage: `${CDN}hf_20260810_011754_b46cc73b-5f02-4115-a7bc-8d93b78bc302.png`,
      candidatesImage: `${CDN}hf_20260810_011754_a9a30029-22c1-48bb-9113-595cffc3d58e.png`,
      benefitsImage: `${CDN}hf_20260810_011754_394f23b9-c64d-4f8d-b935-947e46a9563b.png`,
    },
    fields: {
      title: 'Facelift',
      category: 'Face',
      surgical: true,
      heroHeading: 'Facelift',
      heroPromise:
        'A facelift, also known as rhytidectomy, is a surgical procedure designed to reduce the visible signs of ageing in the face and neck.',
      heroBullets: [
        'Softened creases around the nose and mouth',
        'Improved definition along the midface and jawline',
        'A rested, refreshed appearance',
        'Incisions placed in inconspicuous areas',
      ],

      showIntro: true,
      introHeading: 'Refreshed, Never Rearranged',
      introBody: [
        para(
          'i1',
          'Consultant Plastic Surgeon Mr Roshan Vijayan offers personalised facelift procedures to help patients achieve a more youthful and refreshed appearance.',
        ),
        para(
          'i2',
          'Below you will find detailed information on what a facelift entails, the benefits, the procedure itself, recovery and frequently asked questions.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is a Facelift?',
      overviewBody: [
        para(
          'o1',
          'A facelift, or rhytidectomy, is a cosmetic surgical procedure aimed at creating a younger appearance in the face. The surgery can reduce sagging or folds of skin on the cheeks and jawline and other changes in the shape of your face that occur with age.',
        ),
        para(
          'o2',
          'It involves lifting and tightening the underlying muscles of the face to create a more aesthetically pleasing contour and rejuvenated appearance.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', 'Several hours'),
        glance('shield', 'Anaesthetic', 'General'),
        glance('home', 'Hospital stay', '1 night'),
        glance('briefcase', 'Time off work', '2–3 weeks'),
        glance('walk', 'Swelling and bruising', 'Settles over 2–3 weeks'),
        glance('moon', 'Sleeping elevated', 'First 1–2 weeks'),
        glance('activity', 'Exercise', 'After 4–6 weeks'),
        glance('navigation', 'Driving', 'After 2 weeks'),
        glance('check', 'Normal activities', '2–3 weeks'),
        glance('clipboard', 'Final results', 'Several months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can a Facelift Address?',
      conditionsIntro:
        'A facelift treats the structural changes that come with age rather than the surface of the skin. It can address:',
      conditions: [
        'Deep creases around the nose and mouth',
        'Sagging in the midface',
        'Loss of definition along the jawline',
        'Jowls forming at the lower face',
        'Folds of loose skin on the cheeks',
        'Slackness beneath the chin and along the neck',
        'A face that looks tired when it is not',
        'Changes in facial shape that have come with age',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of a Facelift',
      benefitsIntro:
        'Undergoing a facelift with Mr Roshan Vijayan can provide numerous benefits, including:',
      benefitsList: [
        'Reduction of deep creases around the nose and mouth',
        'Improvement of sagging in the midface and jawline',
        'Restoration of a more youthful and rested appearance',
        'Enhanced self-confidence and self-esteem',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'A facelift suits people troubled by sagging and loss of definition rather than by skin texture alone. Suitable candidates are typically:',
      candidates: [
        'Troubled by sagging skin on the cheeks, jawline or neck',
        'In good general health and non-smokers',
        'At a stable weight',
        'Realistic about what surgery can and cannot change',
        'Prepared for two to three weeks of recovery',
      ],
      candidatesOutro:
        'A facelift addresses structure rather than skin quality, so Mr Vijayan will be clear about what it will not change, including fine lines and pigmentation.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'The Facelift Procedure',
      procedureBody: [
        para(
          'p1',
          'During the facelift procedure, Mr Roshan Vijayan will make incisions in inconspicuous areas to minimise visible scarring. The underlying tissues and muscles are then lifted and repositioned, and excess skin is removed.',
        ),
        para(
          'p2',
          'The incisions are carefully closed to ensure a natural-looking result. The procedure typically takes several hours to complete, depending on the extent of the surgery.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery and Aftercare',
      recoveryIntro:
        'Recovery from a facelift varies from patient to patient. Swelling and bruising are common but will gradually subside, and Mr Roshan Vijayan will provide detailed aftercare instructions to ensure a smooth recovery and optimal results.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'Swelling and bruising are at their most noticeable and are managed with rest, elevation and prescribed pain relief.',
        ),
        stage(
          'Week one to two',
          'Bruising fades and the face begins to settle. Gentle activity is encouraged, and sleeping with the head elevated helps.',
        ),
        stage(
          'Two to three weeks',
          'Most individuals can expect to return to normal activities within two to three weeks.',
        ),
        stage(
          'Several months',
          'Residual swelling resolves and the final contour becomes clear. Follow-up appointments are scheduled to monitor your progress.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgical procedure, there are risks involved. These are minimised when the surgery is performed by an experienced and qualified surgeon. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Scarring',
        'Temporary numbness or altered sensation',
        'Asymmetry',
        'Delayed wound healing',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'With facial rejuvenation his aim is that nobody can name what changed. Repositioning the deeper tissues rather than pulling the skin keeps expression intact, so the face looks rested rather than altered.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan for a Facelift?',
      whyIntro:
        'A facelift is judged on how natural it looks, which depends on what happens beneath the skin rather than to it. His care is based on:',
      whyPoints: [
        'Lifting the underlying tissues rather than tightening skin alone',
        'Incisions placed in inconspicuous areas',
        'A personalised plan built around your face and your goals',
        'Honest guidance on what a facelift will and will not change',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up through the months of settling',
      ],

      showCost: true,
      costHeading: 'How Much Does a Facelift Cost?',
      costIntro:
        'The cost of a facelift depends on the extent of the surgery and whether it is combined with eyelid surgery, a brow lift or a neck lift.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'How long do the results of a facelift last?',
          'The results of a facelift can last for several years, but the natural ageing process will continue. Maintaining a healthy lifestyle and skincare routine can help prolong the results.',
        ),
        faq(
          'Is a facelift painful?',
          'Discomfort and pain are usually minimal and can be managed with prescribed pain medication. Most patients report feeling tightness rather than pain.',
        ),
        faq(
          'Are there any risks associated with a facelift?',
          'As with any surgical procedure, there are risks involved, including infection, bleeding, and scarring. However, these risks are minimised when the surgery is performed by an experienced and qualified surgeon like Mr Roshan Vijayan.',
        ),
        faq(
          'Can a facelift be combined with other procedures?',
          'Yes, a facelift is often combined with other procedures such as eyelid surgery, brow lift, or neck lift to achieve more comprehensive rejuvenation.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Facelift Consultation',
      ctaBody:
        'If your face looks tired when you are not, a consultation can clarify whether a facelift is the right answer and what it would realistically change. Contact us today to arrange your consultation with Mr Vijayan.',

      seoTitle: 'Facelift | Roshan Vijayan',
      seoDescription:
        'Revitalize your appearance with a facelift by Consultant Plastic Surgeon Mr. Roshan Vijayan. Expert care for a youthful, natural look.',
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
  console.log(`\nDone — ${PROCEDURES.length} Face procedures written.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
