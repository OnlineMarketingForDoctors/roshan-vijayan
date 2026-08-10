/**
 * Creates five Skin procedures from their old vijayan.co.uk pages, preserving
 * copy and metadata so the existing search value carries over. These are the
 * first procedures in the Skin category, so they publish under
 * /procedures/skin/<slug>/ — matching the old site's paths.
 *
 * Run from the repo root, signed in to Sanity (`npx sanity login`):
 *
 *   npx sanity exec scripts/add-skin-procedures.ts --with-user-token
 *
 * Section art is generated; the script downloads it once and uploads it into
 * Sanity. Images already set on a document are left alone, so re-running is
 * safe. The stray markdown fence at the foot of the Mole Removal page is
 * dropped, and US spellings are corrected to UK.
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
  'Every procedure is planned individually. Once Mr Vijayan has assessed you and agreed a treatment plan, you will receive a complete written quotation covering the relevant surgical, hospital and anaesthetic costs.'

const SURGEON_INTRO =
  'Mr Roshan Vijayan is a GMC-registered Consultant Plastic Surgeon and Fellow of the Royal College of Surgeons. He trained extensively in plastic, reconstructive and aesthetic surgery across major UK teaching hospitals and continues to contribute to surgical education, academic work and the training of other doctors.'

type Procedure = {slug: string; images: Record<string, string>; fields: Record<string, unknown>}

const PROCEDURES: Procedure[] = [
  // ==================================================================
  // 1. Aesthetic Repair and Reconstruction After Skin Cancer Removal
  // ==================================================================
  {
    slug: 'aesthetic-repair-and-reconstruction-after-skin-cancer-removal',
    images: {
      heroImage: `${CDN}hf_20260810_015234_1d69bc07-c9f3-475e-a310-accd61e89635.png`,
      overviewImage: `${CDN}hf_20260810_015234_8064c9d1-3804-46a1-927a-f45446708c0d.png`,
      candidatesImage: `${CDN}hf_20260810_015234_337f60b8-a3e3-493e-97b1-e431d296a980.png`,
      benefitsImage: `${CDN}hf_20260810_015234_5333fc41-e90d-4141-972e-83be6038ae91.png`,
    },
    fields: {
      title: 'Aesthetic Repair and Reconstruction After Skin Cancer Removal',
      category: 'Skin',
      surgical: true,
      heroHeading: 'Aesthetic Repair and Reconstruction After Skin Cancer Removal',
      heroPromise:
        'Aesthetic Repair and Reconstruction After Skin Cancer Removal focuses on restoring the appearance and function of areas affected by skin cancer excision.',
      heroBullets: [
        'Appearance and function restored together',
        'From simple skin grafts to complex flap techniques',
        'Reconstructive precision on the face and body',
        'Consultant-led care throughout',
      ],

      showIntro: true,
      introHeading: 'Restoring Appearance and Function',
      introBody: [
        para(
          'i1',
          'Removing a skin cancer safely comes first; what it leaves behind is a separate problem, and one worth solving properly.',
        ),
        para(
          'i2',
          'Below you will find a guide to the procedure, its benefits, candidacy, the recovery process, and why Mr Roshan Vijayan is an excellent choice for your reconstructive needs.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Aesthetic Repair and Reconstruction?',
      overviewBody: [
        para(
          'o1',
          'Aesthetic Repair and Reconstruction after skin cancer removal involves various surgical techniques to restore both functionality and appearance to areas affected by skin cancer excision. Procedures can range from simple skin grafts to more complex flap techniques, depending on the location, size, and depth of the excised area.',
        ),
        para(
          'o2',
          'The primary goal is to repair the defect left by the cancer removal while maintaining or improving aesthetic appearance and functional integrity.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Surgery time', '1–4 hours'),
        glance('shield', 'Anaesthetic', 'Local or general'),
        glance('home', 'Hospital stay', 'Day case or 1 night'),
        glance('briefcase', 'Time off work', '1–2 weeks'),
        glance('droplet', 'Wound care', 'As directed'),
        glance('walk', 'Normal activities', 'Within 1–2 weeks'),
        glance('activity', 'Strenuous activity', 'Longer, depending on extent'),
        glance('clipboard', 'Follow-up', 'Scheduled reviews'),
        glance('check', 'Swelling and bruising', 'Subsides over time'),
        glance('moon', 'Results', 'Generally long-lasting'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Reconstruction Address?',
      conditionsIntro:
        'Skin cancer excision is guided by clear margins rather than appearance, so the defect it leaves rarely sits where it would be least noticeable. Reconstruction can address:',
      conditions: [
        'A defect left after skin cancer excision',
        'Wounds on the nose, ear, lip or eyelid where tissue is scarce',
        'Distortion of the eyelid, lip or nostril margin',
        'Loss of function such as eyelid closure or lip movement',
        'A depression or contour irregularity in the skin',
        'Scars that healed poorly after an earlier excision',
        'Skin grafts that differ in colour or texture from their surroundings',
        'Visible reminders of treatment on the face and hands',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Aesthetic Repair and Reconstruction',
      benefitsIntro:
        'The procedure aims to restore the natural appearance of the skin, minimising visible scars and deformities caused by skin cancer excision. It can achieve:',
      benefitsList: [
        'Restoration of the natural appearance of the skin',
        'Minimised visible scarring and deformity',
        'Restored function, such as facial expression, eyelid closure or lip movement',
        'Significantly improved self-esteem and emotional well-being',
        'A holistic approach combining oncological safety with aesthetic rehabilitation',
        'Long-lasting results with proper skin care',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Good candidates for aesthetic repair and reconstruction are individuals who have undergone skin cancer removal and are left with defects that affect appearance or functionality. Suitable candidates are typically:',
      candidates: [
        'Left with a defect that affects appearance or function',
        'In good overall health',
        'Realistic about the outcomes of reconstructive surgery',
        'Confirmed as having had all cancerous tissue successfully removed',
      ],
      candidatesOutro:
        'It is essential to ensure that all cancerous tissue has been successfully removed before proceeding with reconstructive surgery.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'The procedure is typically performed under local or general anaesthesia and can take between 1 to 4 hours based on complexity.',
        ),
        para(
          'p2',
          'The technique is chosen for the site: a direct closure, a skin graft or a local flap that borrows neighbouring tissue so that colour, texture and contour match the surrounding skin as closely as possible.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from aesthetic repair and reconstruction varies depending on the complexity of the procedure. Swelling, bruising, and discomfort are common initially and will subside over time.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'Swelling, bruising and discomfort are expected and settle gradually. Wound care instructions are followed closely.',
        ),
        stage(
          'One to two weeks',
          'Most patients can return to normal activities within one to two weeks, though more extensive reconstructions may require longer.',
        ),
        stage(
          'Beyond two weeks',
          'Strenuous activity is resumed gradually, guided by the extent of the reconstruction.',
        ),
        stage(
          'Follow-up',
          'Attending follow-up appointments ensures optimal healing and lets the result be assessed as it settles.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'As with any surgical procedure, there are risks. These are rare and can be minimised by following pre- and post-operative care instructions provided by Mr Vijayan and his team. Risks may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Adverse reactions to anaesthesia',
        'Issues with wound healing',
        'Visible scarring or contour irregularity',
        'Partial loss of a graft or flap',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'Reconstruction after skin cancer is where plastic surgery began, and it remains the discipline that underpins everything else he does. The aim is a repair that draws no attention to itself, on skin that has already been through enough.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a highly skilled Consultant Plastic Surgeon with extensive experience in aesthetic repair and reconstruction after skin cancer removal. His personalised approach ensures that each patient receives a treatment plan tailored to their unique needs and goals. His care is based on:',
      whyPoints: [
        'Extensive experience in reconstruction after skin cancer removal',
        'A treatment plan tailored to the site and to you',
        'Meticulous surgical technique and compassionate care',
        'Attention to function as well as appearance',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up and direct postoperative support',
      ],

      showCost: true,
      costHeading: 'How Much Does Reconstruction Cost?',
      costIntro:
        'The cost depends on the size and site of the defect and the technique required to repair it, from a direct closure to a graft or local flap.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Aesthetic Repair and Reconstruction after skin cancer removal painful?',
          'The procedure is performed under local or general anaesthesia, so you will not feel pain during the surgery. Post-operative discomfort is normal and can be managed with prescribed pain medications. Most discomfort subsides within a few days to a week.',
        ),
        faq(
          'How long does the procedure take?',
          'The duration of the procedure can vary between 1 to 4 hours, depending on the complexity and extent of the reconstruction required.',
        ),
        faq(
          'Will there be visible scars?',
          'While efforts are made to minimise scarring, some scars may be inevitable. Mr Vijayan employs advanced techniques to ensure scars are as inconspicuous as possible. Over time, scars typically fade and become less noticeable.',
        ),
        faq(
          'Are there any risks or complications?',
          'As with any surgical procedure, there are risks such as infection, bleeding, adverse reactions to anaesthesia, and issues with wound healing. These risks are rare and can be minimised by following pre- and post-operative care instructions provided by Mr Vijayan and his team.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'Most patients can return to normal activities within 1 to 2 weeks, but it is important to avoid strenuous activities for a longer period, depending on the extent of the reconstruction. Specific guidelines will be provided during post-operative care.',
        ),
        faq(
          'How long do the results last?',
          'The results of aesthetic repair and reconstruction are generally long-lasting. Maintaining a healthy lifestyle and proper skin care can enhance the longevity of the results.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Reconstruction Consultation',
      ctaBody:
        'If skin cancer treatment has left a defect that affects how you look or how something works, reconstruction can often do more than you expect. Contact us today to arrange your consultation with Mr Vijayan.',

      seoTitle: 'Aesthetic Repair and Reconstruction After Skin Cancer Removal | Roshan Vijayan',
      seoDescription:
        'Expert aesthetic repair and reconstruction by Mr. Roshan Vijayan after skin cancer removal. Restore confidence with personalized care.',
    },
  },

  // ==================================================================
  // 2. Scar Revision and Correction
  // ==================================================================
  {
    slug: 'scar-revision-and-correction',
    images: {
      heroImage: `${CDN}hf_20260810_015234_c7bfce89-4d1f-4456-8295-cd4552630855.png`,
      overviewImage: `${CDN}hf_20260810_015234_daf24ecb-6f25-4c47-8aed-8124c9379f09.png`,
      candidatesImage: `${CDN}hf_20260810_015234_c0713664-fee0-4a9d-89c8-33c75e94b230.png`,
      benefitsImage: `${CDN}hf_20260810_015234_b8803eca-c2da-4be9-bbf9-5eae9554f950.png`,
    },
    fields: {
      title: 'Scar Revision and Correction',
      category: 'Skin',
      surgical: true,
      heroHeading: 'Scar Revision and Correction',
      heroPromise:
        'Scar Revision and Correction is a procedure aimed at improving the appearance of scars and making them less noticeable.',
      heroBullets: [
        'A less noticeable, better-blended scar',
        'Relief from tightness, itching or restricted movement',
        'Technique chosen for the scar you have',
        'Consultant-led care throughout',
      ],

      showIntro: true,
      introHeading: 'Smoother, More Even Skin',
      introBody: [
        para(
          'i1',
          'Scar Revision and Correction is offered by Consultant Plastic Surgeon Mr Roshan Vijayan.',
        ),
        para(
          'i2',
          'Below you will find a guide to the procedure, its benefits, candidacy, the recovery process, and why Mr Vijayan is an excellent choice for your scar revision needs.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is Scar Revision?',
      overviewBody: [
        para(
          'o1',
          'Scar Revision and Correction is a surgical procedure aimed at improving the appearance of scars caused by injury, surgery, or skin conditions.',
        ),
        para(
          'o2',
          'Depending on the type and severity of the scar, various techniques may be used, including surgical excision, laser therapy, dermabrasion, or injectable treatments.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Procedure time', '30 minutes–a few hours'),
        glance('shield', 'Anaesthetic', 'Local or general'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('briefcase', 'Time off work', 'A few days–1 week'),
        glance('droplet', 'Keep area clean', 'First week'),
        glance('walk', 'Normal activities', 'A few days–1 week'),
        glance('activity', 'Strenuous activity', 'Avoid early on'),
        glance('clipboard', 'Sun protection', 'Essential while healing'),
        glance('check', 'Scar maturity before treating', 'At least a year'),
        glance('moon', 'Final results', 'Over several months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Scar Revision Address?',
      conditionsIntro:
        'Scars vary enormously in how they heal, and the right approach depends on the scar in front of you. Revision can address:',
      conditions: [
        'Raised, thickened hypertrophic scars',
        'Keloid scars extending beyond the original wound',
        'Contracture scars that tighten and restrict movement',
        'Wide or stretched scars',
        'Scars that sit against the natural lines of the skin',
        'Scars that differ in colour from the surrounding skin',
        'Uneven or indented scar texture',
        'Scars that remain itchy or uncomfortable',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Scar Revision',
      benefitsIntro:
        'The primary benefit is the improvement in the appearance of the scar, making it less noticeable and more aesthetically pleasing. Scar revision can achieve:',
      benefitsList: [
        'A less noticeable, more aesthetically pleasing scar',
        'A significant boost to self-esteem and confidence',
        'Improved functionality where a scar causes tightness or restricts movement',
        'Relief from scars that are uncomfortable or itchy',
        'Better blending with the surrounding skin',
        'Greater comfort in clothing and in daily movement',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Good candidates for scar revision are individuals who are unhappy with the appearance of their scars, whether due to size, shape, colour, or texture. Suitable candidates are typically:',
      candidates: [
        'Unhappy with the size, shape, colour or texture of a scar',
        'In good overall health and non-smokers',
        'Realistic about the outcomes of revision',
        'Waiting until the scar is fully healed and mature',
      ],
      candidatesOutro:
        'It is essential that the scar is fully healed and mature, generally requiring waiting at least a year after the injury or surgery that caused it.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'The procedure is typically performed under local or general anaesthesia and can take anywhere from 30 minutes to a few hours, depending on the complexity and extent of the scar.',
        ),
        para(
          'p2',
          'The technique is matched to the scar: surgical excision to re-close it more favourably, or laser therapy, dermabrasion or injectable treatments where the surface or the thickness is the problem.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from scar revision varies depending on the technique used and the extent of the revision. The treated area may be swollen, bruised, and red initially, but these symptoms will subside over time.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'Swelling, bruising and redness are expected. The area is kept clean as directed.',
        ),
        stage(
          'A few days to a week',
          'Most patients return to normal activities within a few days to a week, depending on the extent of the revision.',
        ),
        stage(
          'The first weeks',
          'Strenuous activity is avoided and the treated area is kept protected, with sun exposure avoided throughout.',
        ),
        stage(
          'Follow-up',
          'Follow-up appointments monitor your recovery and ensure the best possible outcome as the scar matures.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'Risks are minimal but worth understanding, and can be minimised by following post-operative care instructions and attending follow-up appointments. They may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Changes in skin sensation',
        'Recurrence of the scar appearance',
        'Delayed wound healing',
        'A result that needs further refinement',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'Scar revision is honest work: a scar cannot be erased, only exchanged for a better one. Mr Vijayan will tell you plainly what improvement is realistic before anything is agreed.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a highly skilled Consultant Plastic Surgeon specialising in scar revision and correction. His extensive experience and personalised approach ensure that each patient receives a tailored treatment plan designed to meet their unique needs and aesthetic goals. His care is based on:',
      whyPoints: [
        'Extensive experience across the full range of scar types',
        'A technique chosen for your particular scar',
        'Meticulous attention to detail',
        'An honest view of the improvement that is achievable',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up in a professional and supportive environment',
      ],

      showCost: true,
      costHeading: 'How Much Does Scar Revision Cost?',
      costIntro:
        'The cost of scar revision depends on the size and complexity of the scar and the technique required to improve it.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Scar Revision surgery painful?',
          'The procedure is performed under local or general anaesthesia, so you will not feel pain during the surgery. Some discomfort or mild pain may occur afterward but can be managed with prescribed or over-the-counter pain medications.',
        ),
        faq(
          'How long does the procedure take?',
          'The duration of the surgery depends on the size and complexity of the scar. It can take from 30 minutes to a few hours.',
        ),
        faq(
          'Will there be visible scars?',
          'While the goal of scar revision is to improve the appearance of the scar, it may not entirely eliminate it. Advanced surgical techniques are used to make any resulting scars as inconspicuous as possible, and scars will fade over time.',
        ),
        faq(
          'Are there any risks or complications?',
          'Risks are minimal but can include infection, bleeding, changes in skin sensation, or recurrence of the scar appearance. These risks can be minimised by following post-operative care instructions and attending follow-up appointments.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'Most patients can return to normal activities within a few days to a week, depending on the extent of the revision. It is important to avoid strenuous activities and keep the treated area protected during the initial healing phase.',
        ),
        faq(
          'Can all types of scars be treated?',
          'Most types of scars, including hypertrophic, keloid, and contracture scars, can be treated with revision techniques. During your consultation, Mr Vijayan will assess your specific scar and recommend the most appropriate treatment option.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Scar Revision Consultation',
      ctaBody:
        'If a scar bothers you, whether for how it looks or how it feels, a consultation can clarify what revision could realistically achieve. Contact us today to arrange your consultation with Mr Vijayan.',

      seoTitle: 'Scar Revision and Correction | Roshan Vijayan',
      seoDescription:
        'Discover expert scar revision and correction with Mr. Roshan Vijayan, Consultant Plastic Surgeon. Achieve smoother, more even skin today.',
    },
  },

  // ==================================================================
  // 3. Mole Removal
  // ==================================================================
  {
    slug: 'mole-removal',
    images: {
      heroImage: `${CDN}hf_20260810_015234_9b54b06a-03c3-4509-818f-53c1d8bc3203.png`,
      overviewImage: `${CDN}hf_20260810_015234_c8ba5449-4dd0-4d67-87fe-e72d50e19c17.png`,
      candidatesImage: `${CDN}hf_20260810_015234_f5cb40a2-7933-4146-8c35-5aa9c8530caa.png`,
      benefitsImage: `${CDN}hf_20260810_015234_b9be1015-3193-4417-a071-7ed0f1f7885c.png`,
      techniquesImage: `${CDN}hf_20260810_015537_6de214a7-eab6-4196-97bb-76ff339de17b.png`,
    },
    fields: {
      title: 'Mole Removal',
      category: 'Skin',
      surgical: true,
      heroHeading: 'Mole Removal',
      heroPromise:
        'Mr Roshan Vijayan offers expert mole removal, providing personalised care and advanced techniques to ensure optimal results.',
      heroBullets: [
        'Surgical, shave or laser removal',
        'Suspicious moles assessed and sent for analysis',
        'Advanced techniques to minimise scarring',
        'Consultant-led care throughout',
      ],

      showIntro: true,
      introHeading: 'Safe, Precise Mole Removal',
      introBody: [
        para(
          'i1',
          'Moles are removed for cosmetic reasons, for comfort, or because something about them has changed.',
        ),
        para(
          'i2',
          'Below you will find everything from understanding moles and the reasons for removal to the consultation process, treatment options and aftercare.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'Understanding Moles',
      overviewBody: [
        para(
          'o1',
          'Moles, medically known as nevi, are common skin growths that appear as small, dark brown spots. They are usually harmless but can sometimes change in appearance or become cancerous.',
        ),
        para(
          'o2',
          'Moles can be flat or raised, and their colour can range from pink to dark brown or black.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Procedure time', '15–45 minutes'),
        glance('shield', 'Anaesthetic', 'Local'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('walk', 'Normal activities', 'Same day'),
        glance('droplet', 'Keep area clean and dry', 'First few days'),
        glance('clipboard', 'Ointment as prescribed', 'As directed'),
        glance('check', 'Healing', '1–2 weeks'),
        glance('activity', 'Sun protection', 'Essential while healing'),
        glance('navigation', 'Driving', 'Same day'),
        glance('moon', 'Scar settles', 'Several months'),
      ]),

      showConditions: true,
      conditionsHeading: 'Reasons for Mole Removal',
      conditionsIntro:
        'There are several reasons why individuals may choose to have a mole removed:',
      conditions: [
        'Cosmetic concerns, where a mole is unsightly or in a prominent area',
        'A mole affecting appearance and self-confidence',
        'Medical reasons, where a mole changes in size, shape or colour',
        'Changes that can be indicative of skin cancer',
        'Removing such moles to prevent potential health risks',
        'Physical discomfort from moles in areas prone to friction',
        'Irritation from clothing or accessories',
        'A mole that catches, bleeds or is repeatedly knocked',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Mole Removal',
      benefitsIntro:
        'Removing a mole resolves both the cosmetic and the clinical question at once. It can achieve:',
      benefitsList: [
        'Removal of a mole that affects appearance or confidence',
        'An end to irritation from clothing or accessories',
        'Peace of mind where a mole has changed',
        'Laboratory analysis of the mole when appropriate',
        'A discreet scar, using techniques chosen to minimise it',
        'A quick procedure under local anaesthetic',
      ],

      showCandidates: true,
      candidatesHeading: 'Consultation Process',
      candidatesIntro:
        'During the consultation, Mr Roshan Vijayan will thoroughly examine the mole and discuss your concerns and expectations. He will evaluate the mole’s characteristics and determine the most appropriate removal method. The consultation covers:',
      candidates: [
        'A thorough examination of the mole',
        'Your concerns and expectations',
        'The characteristics of the mole itself',
        'The most appropriate removal method for it',
      ],
      candidatesOutro:
        'This personalised approach ensures that you receive the best possible care tailored to your needs.',

      showTechniques: true,
      techniquesHeading: 'Treatment Options',
      techniquesIntro: 'Mr Roshan Vijayan offers several mole removal techniques, including:',
      techniques: keyed('tech', [
        {
          _type: 'technique',
          name: 'Surgical Excision',
          tier: 'larger or suspicious moles',
          description:
            'This method involves cutting out the mole and stitching the skin back together. It is suitable for larger moles or those suspected of being cancerous.',
        },
        {
          _type: 'technique',
          name: 'Shave Excision',
          tier: 'raised moles',
          description:
            'The mole is shaved off flush with the skin. This technique is ideal for raised moles and leaves minimal scarring.',
        },
        {
          _type: 'technique',
          name: 'Laser Removal',
          tier: 'small, non-cancerous moles',
          description:
            'A laser is used to remove the mole by breaking down the pigment. This method is less invasive and suitable for smaller, non-cancerous moles.',
        },
      ]),

      showProcedure: false,
      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Aftercare',
      recoveryIntro:
        'Proper aftercare is crucial for optimal healing and minimising scarring. Mr Roshan Vijayan will provide detailed post-procedure instructions.',
      recovery: keyed('r', [
        stage('Keep the area clean', 'Keeping the area clean and dry supports healing from the outset.'),
        stage('Use prescribed ointments', 'Applying prescribed ointments or creams promotes healing.'),
        stage('Avoid sun exposure', 'Avoiding sun exposure to the treated area protects the healing skin.'),
        stage(
          'Monitor the site',
          'Monitoring the site for any signs of infection or unusual changes, and reporting them promptly.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'Mole removal is a minor procedure and risks are small, but they are worth understanding before you decide. They may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Scarring, varying with the method and your healing',
        'Changes in skin pigment at the site',
        'Incomplete removal requiring a further procedure',
        'Recurrence of the mole',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'A mole removal is a small procedure with a permanent result, often on a visible part of the face. It is worth having it done by someone whose day job is the scar.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'A mole removal leaves a mark wherever the mole was, so the technique and the closure matter as much as the removal itself. His care is based on:',
      whyPoints: [
        'A thorough assessment before any method is chosen',
        'Three techniques available, matched to the mole',
        'Advanced techniques to minimise scarring',
        'Laboratory analysis where a mole warrants it',
        'A second consultation before treatment, included as standard',
        'Consultant-led follow-up and direct postoperative support',
      ],

      showCost: true,
      costHeading: 'How Much Does Mole Removal Cost?',
      costIntro:
        'The cost of mole removal depends on the number of moles, their size and site, and the technique used to remove them.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is mole removal painful?',
          'The procedure is generally well-tolerated. Local anaesthesia is used to numb the area, ensuring minimal discomfort during the removal.',
        ),
        faq(
          'Will there be a scar after mole removal?',
          'Scarring is possible but varies depending on the removal method and individual healing process. Mr Roshan Vijayan employs advanced techniques to minimise scarring.',
        ),
        faq(
          'How long does it take to heal after mole removal?',
          'Healing time can vary, but most patients can expect the area to heal within 1 to 2 weeks. Following aftercare instructions is essential for a smooth recovery.',
        ),
        faq(
          'Can all moles be removed?',
          'Most moles can be removed, but the suitability of the removal method depends on the mole’s size, location, and characteristics. A consultation with Mr Roshan Vijayan will determine the best approach.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Mole Removal Consultation',
      ctaBody:
        'Whether a mole bothers you cosmetically or has changed in a way you would rather have checked, a consultation will settle it. Contact us today to arrange your consultation with Mr Vijayan.',

      seoTitle: 'Mole Removal | Roshan Vijayan',
      seoDescription:
        'Expert mole removal by Consultant Plastic Surgeon Mr. Roshan Vijayan. Safe, precise, and effective treatments for flawless skin.',
    },
  },

  // ==================================================================
  // 4. Lipoma Removal
  // ==================================================================
  {
    slug: 'lipoma-removal',
    images: {
      heroImage: `${CDN}hf_20260810_015259_9a270a0b-6056-496c-81c7-f9263c4c4db0.png`,
      overviewImage: `${CDN}hf_20260810_015259_dbf90ebd-97db-41c2-9482-98869927de19.png`,
      candidatesImage: `${CDN}hf_20260810_015259_c11a8288-4bb7-4e13-b601-cd8060a2f5f0.png`,
      benefitsImage: `${CDN}hf_20260810_015259_099ead29-3eb6-4977-8d79-e9817b331fb1.png`,
    },
    fields: {
      title: 'Lipoma Removal',
      category: 'Skin',
      surgical: true,
      heroHeading: 'Lipoma Removal',
      heroPromise:
        'Lipoma Removal is a minor surgical procedure designed to safely and effectively remove lipomas, the benign fatty lumps that can appear anywhere on the body.',
      heroBullets: [
        'A minor procedure under local anaesthetic',
        'Complete excision to minimise recurrence',
        'Relief from discomfort or pressure',
        'Back to normal activities within a day or two',
      ],

      showIntro: true,
      introHeading: 'Smooth, Lump-Free Skin',
      introBody: [
        para(
          'i1',
          'Lipoma Removal is offered by Consultant Plastic Surgeon Mr Roshan Vijayan.',
        ),
        para(
          'i2',
          'Below you will find an in-depth look at the procedure, its benefits, candidate eligibility, the recovery process, and the reasons for choosing Mr Vijayan for your lipoma removal needs.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is a Lipoma?',
      overviewBody: [
        para(
          'o1',
          'Lipoma removal is a minor surgical procedure aimed at excising lipomas, which are soft, benign tumours composed of fat tissue.',
        ),
        para(
          'o2',
          'These lumps can be removed through a straightforward procedure that is usually performed under local anaesthesia in an outpatient setting.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Procedure time', '30 minutes–1 hour'),
        glance('shield', 'Anaesthetic', 'Local'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('walk', 'Normal activities', 'Within a day or two'),
        glance('droplet', 'Keep incision clean and dry', 'First few days'),
        glance('clipboard', 'Dressings changed', 'As directed'),
        glance('check', 'Sutures removed', '1–2 weeks'),
        glance('activity', 'Strenuous activity', 'Avoid for the first few days'),
        glance('navigation', 'Driving', 'Within a day or two'),
        glance('moon', 'Scar settles', 'Several months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Lipoma Removal Address?',
      conditionsIntro:
        'Lipomas are harmless, but that does not always make them easy to live with. Removal can address:',
      conditions: [
        'A visible lump under the skin',
        'Discomfort or pain from a lipoma pressing on nerves',
        'A lipoma pressing on other structures',
        'A lump that is growing over time',
        'A lipoma that catches on clothing or a waistband',
        'Several lipomas across the body',
        'Self-consciousness about a visible lump',
        'Uncertainty about what a lump actually is',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Lipoma Removal',
      benefitsIntro:
        'One of the primary benefits of lipoma removal is the elimination of visible lumps, which can improve the aesthetic appearance of the affected area. Removal can achieve:',
      benefitsList: [
        'Elimination of visible lumps and improved appearance',
        'Relief from discomfort or pain where a lipoma presses on nerves or other structures',
        'A significant boost to self-esteem and confidence',
        'Prevention of potential complications such as further growth',
        'Confirmation of what the lump was',
        'A lasting result from a short, straightforward procedure',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Good candidates for lipoma removal are individuals who have one or more lipomas that are causing discomfort, pain, or cosmetic concerns. Suitable candidates are typically:',
      candidates: [
        'Troubled by one or more lipomas',
        'Experiencing discomfort, pain or cosmetic concern',
        'In good overall health and non-smokers',
        'Realistic about the results of the procedure',
      ],
      candidatesOutro:
        'If you have a lipoma that is growing, painful, or causing other symptoms, removal is advisable.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'The procedure involves making a small incision over the lipoma, extracting it, and then closing the incision with sutures.',
        ),
        para(
          'p2',
          'The entire process typically takes about 30 minutes to an hour, depending on the size and location of the lipoma, and is usually performed under local anaesthesia in an outpatient setting.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from lipoma removal is generally straightforward and quick. Over-the-counter pain medications can be used to manage any minor discomfort.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'The incision site is kept clean and dry, and any dressings are changed as directed.',
        ),
        stage('A day or two', 'Most patients can return to their normal activities within a day or two.'),
        stage('One to two weeks', 'Sutures will typically be removed within one to two weeks.'),
        stage(
          'Follow-up',
          'Follow-up appointments monitor healing and check for any signs of infection or complications.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'Risks are minimal and can be minimised by following post-operative care instructions and attending follow-up appointments. They may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Recurrence of the lipoma',
        'A small scar at the incision site',
        'Bruising around the site',
        'Temporary numbness near the incision',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'A lipoma is simple to remove and easy to remove badly. Taking the whole capsule and closing carefully is what separates a forgettable scar from a lasting one.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a highly skilled Consultant Plastic Surgeon known for his expertise in minor surgical procedures, including lipoma removal. His meticulous approach ensures that the entire lipoma is excised, minimising the chances of recurrence and scarring. His care is based on:',
      whyPoints: [
        'Expertise in minor surgical procedures',
        'Complete excision to minimise recurrence',
        'A meticulous closure to minimise scarring',
        'High-quality, personalised care',
        'A comfortable experience from start to finish',
        'Consultant-led follow-up and direct postoperative support',
      ],

      showCost: true,
      costHeading: 'How Much Does Lipoma Removal Cost?',
      costIntro:
        'The cost of lipoma removal depends on the size and location of the lipoma and how many are being removed.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Lipoma Removal surgery painful?',
          'The procedure is performed under local anaesthesia, so you will not feel pain during the surgery. Some discomfort or mild pain may occur afterward but can be managed with over-the-counter pain medications.',
        ),
        faq(
          'How long does the procedure take?',
          'The surgery typically takes about 30 minutes to an hour, depending on the size and location of the lipoma.',
        ),
        faq(
          'Will there be visible scars?',
          'There may be a small scar at the incision site, but it will generally fade over time. Mr Vijayan uses advanced surgical techniques to minimise scarring and promote optimal healing.',
        ),
        faq(
          'Are there any risks or complications?',
          'Risks are minimal but can include infection, bleeding, or recurrence of the lipoma. These can be minimised by following post-operative care instructions and attending follow-up appointments.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'Most patients can return to normal activities within a day or two. However, it is advised to avoid strenuous activities and keep the incision site clean and dry for the first few days to ensure proper healing.',
        ),
        faq(
          'Will the lipoma come back?',
          'While Mr Vijayan aims to remove the lipoma entirely to prevent recurrence, there is a small risk that the lipoma may return. Regular monitoring and follow-ups can help address any recurrence promptly.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Lipoma Removal Consultation',
      ctaBody:
        'If a fatty lump is uncomfortable, growing or simply something you would rather not have, removal is straightforward. Contact us today to arrange your consultation with Mr Vijayan.',

      seoTitle: 'Lipoma Removal | Roshan Vijayan',
      seoDescription:
        'Expert Lipoma Removal by Consultant Plastic Surgeon Mr. Roshan Vijayan. Safe, effective treatment for smooth, lump-free skin. Book your consultation today.',
    },
  },

  // ==================================================================
  // 5. Cyst Removal
  // ==================================================================
  {
    slug: 'cyst-removal',
    images: {
      heroImage: `${CDN}hf_20260810_015259_49d30dbe-80a9-48cf-a7f9-f738874cfd51.png`,
      overviewImage: `${CDN}hf_20260810_015300_283fa2d7-89a8-4a65-ab4d-356d495571f7.png`,
      candidatesImage: `${CDN}hf_20260810_015259_ae47e600-9fe4-4984-8dad-723817d8fc95.png`,
      benefitsImage: `${CDN}hf_20260810_015259_029d7b89-cba5-4393-a9cf-4345faf2c1db.png`,
    },
    fields: {
      title: 'Cyst Removal',
      category: 'Skin',
      surgical: true,
      heroHeading: 'Cyst Removal',
      heroPromise:
        'Cyst Removal is a specialised procedure that aims to safely and effectively remove cysts from various parts of the body.',
      heroBullets: [
        'A minor procedure under local anaesthetic',
        'Removed in its entirety to minimise recurrence',
        'Reduced risk of infection or inflammation',
        'Back to normal activities within a day or two',
      ],

      showIntro: true,
      introHeading: 'Smoother, Healthier Skin',
      introBody: [
        para('i1', 'Cyst Removal is offered by Consultant Plastic Surgeon Mr Roshan Vijayan.'),
        para(
          'i2',
          'Below you will find a guide to the procedure, its benefits, candidate suitability, the recovery process, and the reasons for choosing Mr Vijayan for your cyst removal needs.',
        ),
      ],

      showResults: false,

      showOverview: true,
      overviewHeading: 'What is a Cyst?',
      overviewBody: [
        para(
          'o1',
          'Cyst removal is a minor surgical procedure aimed at excising cysts, which are non-cancerous lumps filled with fluid or semi-solid material.',
        ),
        para(
          'o2',
          'The procedure can be performed under local anaesthesia in an outpatient setting and generally takes about 30 minutes to an hour.',
        ),
      ],

      showGlance: true,
      atAGlance: keyed('g', [
        glance('clock', 'Procedure time', '30 minutes–1 hour'),
        glance('shield', 'Anaesthetic', 'Local'),
        glance('home', 'Hospital stay', 'Day case'),
        glance('walk', 'Normal activities', 'Within a day or two'),
        glance('droplet', 'Keep incision clean and dry', 'First few days'),
        glance('clipboard', 'Dressings changed', 'As directed'),
        glance('check', 'Sutures removed', '1–2 weeks'),
        glance('activity', 'Strenuous activity', 'Avoid for the first few days'),
        glance('navigation', 'Driving', 'Within a day or two'),
        glance('moon', 'Scar settles', 'Several months'),
      ]),

      showConditions: true,
      conditionsHeading: 'What Can Cyst Removal Address?',
      conditionsIntro:
        'Cysts are harmless in themselves, but they tend to grow, catch and occasionally become inflamed. Removal can address:',
      conditions: [
        'A visible lump on the skin',
        'Pain, discomfort or irritation from a cyst',
        'A cyst in an area of friction or pressure',
        'A cyst that has become infected or inflamed',
        'A lump that is growing over time',
        'A cyst that repeatedly refills after draining',
        'Self-consciousness about a visible lump',
        'Uncertainty about what a lump actually is',
      ],

      showBenefits: true,
      benefitsHeading: 'Benefits of Cyst Removal',
      benefitsIntro:
        'Removing a cyst can alleviate discomfort, pain, or irritation, especially if the cyst is located in an area that experiences friction or pressure. It can achieve:',
      benefitsList: [
        'Relief from discomfort, pain or irritation',
        'Enhanced appearance of the skin, with visible lumps eliminated',
        'A reduced risk of the cyst becoming infected or inflamed',
        'Prevention of further complications',
        'A quick, low-risk procedure under local anaesthesia',
        'Confirmation of what the lump was',
      ],

      showCandidates: true,
      candidatesHeading: 'Who is a Good Candidate?',
      candidatesIntro:
        'Good candidates for cyst removal are individuals who have symptomatic or bothersome cysts, such as those causing pain, discomfort, or cosmetic concerns. Suitable candidates are typically:',
      candidates: [
        'Troubled by a symptomatic or bothersome cyst',
        'Experiencing pain, discomfort or cosmetic concern',
        'In good overall health',
        'Realistic about the outcomes of the procedure',
      ],
      candidatesOutro:
        'If you have a cyst that is growing, infected, or causing other symptoms, removal is highly recommended.',

      showTechniques: false,

      showProcedure: true,
      procedureHeading: 'About the Procedure',
      procedureBody: [
        para(
          'p1',
          'During the procedure, a small incision is made over the cyst, allowing it to be carefully removed in its entirety to minimise the chance of recurrence. The incision is then closed with sutures.',
        ),
        para(
          'p2',
          'It is performed under local anaesthesia in an outpatient setting and generally takes about 30 minutes to an hour, depending on the size and location of the cyst.',
        ),
      ],

      showJourney: false,

      showRecovery: true,
      recoveryHeading: 'Recovery Process',
      recoveryIntro:
        'Recovery from cyst removal is generally straightforward. Over-the-counter pain medications can be used to manage any minor discomfort.',
      recovery: keyed('r', [
        stage(
          'The first few days',
          'The incision site is kept clean and dry, and any dressings are changed as directed.',
        ),
        stage('A day or two', 'Most patients can return to normal activities within a day or two.'),
        stage('One to two weeks', 'Sutures will typically be removed within one to two weeks.'),
        stage(
          'Follow-up',
          'Follow-up appointments ensure proper healing and check for any signs of infection.',
        ),
      ]),

      showRisks: true,
      risksHeading: 'Risks and Complications',
      risksIntro:
        'Risks are minimal and can be minimised by following post-operative care instructions and attending follow-up appointments. They may include:',
      risks: [
        'Infection',
        'Bleeding',
        'Recurrence of the cyst',
        'A small scar at the incision site',
        'Bruising around the site',
        'Temporary numbness near the incision',
      ],

      showSurgeon: true,
      surgeonHeading: 'Meet Mr Roshan Vijayan',
      surgeonBody: [
        para('s1', SURGEON_INTRO),
        para(
          's2',
          'A cyst that is squeezed or partially drained almost always comes back. Removing the whole sac in one piece is what makes the difference, and it is worth doing carefully the first time.',
        ),
      ],

      showWhy: true,
      whyHeading: 'Why Choose Mr Roshan Vijayan?',
      whyIntro:
        'Mr Roshan Vijayan is a proficient Consultant Plastic Surgeon known for his expertise in minor surgical procedures, including cyst removal. His meticulous approach ensures that the entire cyst is excised correctly, minimising the chances of recurrence and scarring. His care is based on:',
      whyPoints: [
        'Expertise in minor surgical procedures',
        'Complete excision of the cyst to minimise recurrence',
        'A meticulous closure to minimise scarring',
        'High-quality, personalised care',
        'A comfortable experience from start to finish',
        'Consultant-led follow-up and direct postoperative support',
      ],

      showCost: true,
      costHeading: 'How Much Does Cyst Removal Cost?',
      costIntro:
        'The cost of cyst removal depends on the size and location of the cyst and how many are being removed.',
      costLead: COST_LEAD,
      costIncludes: COST_INCLUDES,

      showFaqs: true,
      faqHeading: 'Frequently Asked Questions',
      faqs: keyed('f', [
        faq(
          'Is Cyst Removal surgery painful?',
          'The procedure is performed under local anaesthesia, so you should not feel pain during the surgery. Some discomfort or mild pain may occur afterward but can be managed with over-the-counter pain medications.',
        ),
        faq(
          'How long does the procedure take?',
          'The surgery typically takes about 30 minutes to an hour, depending on the size and location of the cyst.',
        ),
        faq(
          'Will there be visible scars?',
          'There may be a small scar at the incision site, but it will generally fade over time. Mr Vijayan uses advanced surgical techniques to minimise scarring and promote optimal healing.',
        ),
        faq(
          'Are there any risks or complications?',
          'Risks are minimal but may include infection, bleeding, or recurrence of the cyst. These can be minimised by following post-operative care instructions and attending follow-up appointments.',
        ),
        faq(
          'How soon can I resume normal activities?',
          'Most patients can return to normal activities within a day or two. However, it is advised to avoid strenuous activities and keep the incision site clean and dry for the first few days to ensure proper healing.',
        ),
        faq(
          'Will the cyst come back?',
          'While Mr Vijayan aims to remove the cyst entirely to prevent recurrence, there is a small risk that the cyst may return. Regular monitoring and follow-ups can help address any recurrence promptly.',
        ),
      ]),

      showRelated: true,
      ctaHeading: 'Book Your Cyst Removal Consultation',
      ctaBody:
        'If a cyst is sore, growing or repeatedly coming back, removing it properly settles the matter. Contact us today to arrange your consultation with Mr Vijayan.',

      seoTitle: 'Cyst Removal | Roshan Vijayan',
      seoDescription:
        'Expert cyst removal by Consultant Plastic Surgeon Mr. Roshan Vijayan. Safe, effective treatment for a smoother, healthier skin.',
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
  console.log(`\nDone — ${PROCEDURES.length} Skin procedures written.`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
