/* Seed documents for xtpxp7mw/production, used by /api/seed. */

let _k = 0
const key = () => 'k' + ++_k
const pt = (paras: string[]) =>
  paras.map((t) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: key(), text: t, marks: []}],
  }))
const keyed = <T extends object>(type: string, arr: T[]) =>
  arr.map((o) => Object.assign({_type: type, _key: key()}, o))

export function buildSeedDocs() {
  const reviewQuotes = [
    'He is caring and passionate in what he does. I would consider him an artist in the results he managed, limiting the scarring on the side of my face to almost nothing. From start to finish I felt safe, informed and genuinely looked after, and the outcome has exceeded everything I had hoped for.',
    'Really professional and knowledgeable. He listened, asked questions and gave reassurance throughout. The procedure was quick and painless, with a clear explanation at every step so I always knew what was happening. Highly recommended to anyone considering surgery.',
    'From the first consultation through to post-operative care, everything was handled with professionalism and attention to detail. I felt completely at ease and never rushed. I couldn’t be happier with the result and with how supported I felt the whole way through.',
    'I cannot thank Mr Vijayan enough for his vigilance in spotting something others had not. He put me at ease straight away and explained everything with such patience and care. To say I am grateful is an understatement, I genuinely believe he changed the course of things for me.',
    'A truly professional manner from beginning to end, thorough, calm and completely reassuring at every stage. Every question was answered honestly and I never felt pressured. The aftercare in particular was outstanding.',
    'Mr Vijayan is wonderful, kind, honest and hugely skilled. He took the time to understand exactly what I wanted and gave me a realistic, balanced view rather than overpromising. The result looks completely natural and I feel like myself again.',
  ]

  const siteSettings = {
    _id: 'siteSettings',
    _type: 'siteSettings',
    practiceName: 'RV Plastic Surgery',
    surgeonName: 'Mr Roshan Vijayan',
    credentials: 'MBBS FRCS(Plast)',
    gmcNumber: '7020524',
    phone: '01727 221799',
    email: 'roshanvijayan@gmail.com',
    reviewScore: '5.0',
    reviewCount: 45,
    reviewSource: 'iWantGreatCare',
    locations: keyed('location', [
      {name: 'One Hatfield Hospital', address: '3 Hatfield Avenue, Hatfield, AL10 9UA'},
      {name: 'One Stop Healthcare', address: 'One Medical House, Boundary Way, Hemel Hempstead, HP2 7YU'},
      {name: 'London Skin Clinic', address: '152 London Road, St Albans, AL1 1PQ'},
    ]),
  }

  const reviews = reviewQuotes.map((q, i) => ({
    _id: 'review.rv-' + (i + 1),
    _type: 'review',
    quote: q,
    author: 'Verified patient',
    rating: 5,
    source: 'iWantGreatCare',
    order: i + 1,
  }))

  const breastLift = {
    _id: 'procedure.breast-lift',
    _type: 'procedure',
    title: 'Breast Lift',
    slug: {_type: 'slug', current: 'breast-lift'},
    category: 'Body',
    surgical: true,
    heroPromise:
      'A breast lift, or mastopexy, raises and reshapes the breast to restore a firmer, more youthful contour, naturally and in proportion with your frame, by Consultant Plastic Surgeon Mr Roshan Vijayan.',
    benefits: [
      'A naturally lifted, more youthful shape',
      'Repositioned, re-centred nipple and areola',
      'Restored firmness after pregnancy or weight loss',
      'Consultant-led care, with two-surgeon safety on complex cases',
    ],
    overviewHeading: 'What is a breast lift?',
    overviewBody: pt([
      'A breast lift, known medically as a mastopexy, is a surgical procedure that raises and reshapes the breasts. Mr Vijayan removes excess, stretched skin and tightens the underlying tissue to restore a firmer, higher and more youthful contour, repositioning the nipple and areola to a natural height.',
      'Importantly, a lift reshapes rather than resizes. It restores shape and position rather than significantly changing volume. Where you would also like more fullness, or a smaller size, a lift can be combined with an implant or a reduction in a single operation.',
    ]),
    atAGlance: keyed('glanceItem', [
      {icon: 'clock', label: 'Surgery time', value: '2–3 hours'},
      {icon: 'briefcase', label: 'Time off work', value: '1–2 weeks'},
      {icon: 'home', label: 'Hospital stay', value: 'Day case or 1 night'},
      {icon: 'droplet', label: 'Showering', value: 'After 2 days'},
      {icon: 'walk', label: 'Reasonable mobility', value: 'After 2 days'},
      {icon: 'activity', label: 'Exercise', value: 'After 6 weeks'},
      {icon: 'heart', label: 'Sexual activity', value: 'After 4–6 weeks'},
      {icon: 'moon', label: 'Sleeping on back', value: '4–6 weeks'},
      {icon: 'check', label: 'Full recovery', value: '3–6 months'},
      {icon: 'navigation', label: 'Driving', value: 'After 2 weeks'},
    ]),
    candidatesIntro:
      'A breast lift may suit you if you are troubled by sagging, lost firmness or a change in shape, particularly after the life events that naturally stretch the skin and tissue. You might consider it if you experience:',
    candidates: [
      'Breasts that have lost firmness or begun to sag',
      'Changes following pregnancy or breastfeeding',
      'Significant or fluctuating weight loss',
      'Nipples that sit below the breast crease or point downward',
      'Stretched skin or enlarged areolae',
      'Noticeable asymmetry between the breasts',
    ],
    candidatesOutro:
      'Mr Vijayan will assess your skin quality, breast tissue and goals, then advise honestly whether a lift, or another approach, will serve you best. A stable weight and being a non-smoker help support the safest result and the longest-lasting outcome.',
    techniquesIntro:
      'The right technique depends on how much lift is needed and the quality of your skin. The goal is always the best shape with the least scarring for your case, and Mr Vijayan will recommend the approach that suits you at your consultation.',
    techniques: keyed('technique', [
      {name: 'Crescent', tier: 'very mild sagging', description: 'A small crescent scar along the upper areola, for the subtlest lift or minor nipple asymmetry.'},
      {name: 'Periareolar', tier: 'mild sagging', description: 'The donut lift — a single, discreet scar around the areola, for a modest lift.'},
      {name: 'Vertical', tier: 'moderate sagging', description: 'The lollipop lift — around the areola and down to the crease, allowing more reshaping.'},
      {name: 'Inverted-T', tier: 'significant sagging', description: 'The anchor lift — with a discreet crease incision, for the fullest reshaping.'},
    ]),
    procedureHeading: 'What happens during breast lift surgery?',
    procedureBody: pt([
      'Surgery is carried out under general anaesthetic and, for more complex cases, alongside a second consultant surgeon, for shorter operating times and an added layer of safety. Mr Vijayan makes the incisions for your chosen technique, removes excess skin and reshapes the breast tissue, then lifts and re-centres the nipple and areola.',
      'The breast is closed with fine, dissolvable sutures placed for the most discreet healing, and you are supported in a soft surgical bra. Most patients return home the same day or after a single night’s stay.',
    ]),
    recovery: keyed('recoveryStage', [
      {stage: 'The first few days', description: 'You will go home in a supportive surgical bra. Some swelling, bruising and tightness is normal. Mr Vijayan calls you personally on day one.'},
      {stage: 'Week one to two', description: 'Most discomfort settles quickly. Many patients return to desk-based work within one to two weeks, avoiding any strenuous activity.'},
      {stage: 'Weeks three to six', description: 'Gentle activity is gradually resumed. The supportive bra is worn day and night while the breasts settle into their new shape.'},
      {stage: 'Six weeks onward', description: 'Most normal activity, including exercise, is comfortably resumed. Swelling continues to settle and the contour refines.'},
      {stage: 'Three to six months', description: 'Scars soften and fade considerably, and the final, natural shape becomes clear. Aftercare with Mr Vijayan is unlimited throughout.'},
    ]),
    risksIntro:
      'All surgery carries some risk. Breast lift surgery is generally very safe, and complications are uncommon, but Mr Vijayan will discuss every consideration fully and honestly so your decision is a confident and informed one.',
    risks: keyed('risk', [
      {title: 'Scarring', description: 'Permanent, but placed as discreetly as possible and fading considerably over the months that follow.'},
      {title: 'Bleeding or infection', description: 'Uncommon, and readily treatable when they do occur.'},
      {title: 'Changes in sensation', description: 'Altered nipple or skin sensation, usually temporary as healing progresses.'},
      {title: 'Asymmetry', description: 'Minor differences in shape or position can remain, as no two breasts are identical.'},
      {title: 'Breastfeeding', description: 'Many women can still breastfeed afterwards, though this cannot be guaranteed.'},
      {title: 'Healing and anaesthetic', description: 'General surgical and anaesthetic risks, minimised by careful planning and, on more complex cases, a second consultant surgeon in theatre.'},
    ]),
    surgeonQuote: 'A breast lift is about restoring balance and confidence, with a result that looks entirely, naturally you.',
    costFrom: 'from £6,500',
    costIntro:
      'Every breast lift is planned individually, so the final price depends on the technique and the complexity of your case. As a guide, breast lift surgery with Mr Vijayan typically starts from:',
    costIncludes: [
      'Your consultation with Mr Vijayan',
      'A second consultation, included',
      'Surgeon’s and anaesthetist’s fees',
      'Hospital and theatre fees',
      'All follow-up and aftercare',
      'A personal day-one call',
    ],
    faqs: keyed('faq', [
      {question: 'Will a breast lift change my size?', answer: 'A lift on its own reshapes and raises the breast rather than changing its size significantly. If you would also like more fullness, a lift can be combined with an implant; if you would prefer a smaller size, it can be combined with a reduction. Mr Vijayan will plan this with you at your consultation.'},
      {question: 'Where will the scars be?', answer: 'This depends on the technique needed for your shape: periareolar, vertical or anchor. Scars may sit around the areola, in a single vertical line, or with a small additional crease incision. They are placed as discreetly as possible and fade considerably over the months that follow.'},
      {question: 'Is a breast lift painful?', answer: 'Most patients describe tightness and soreness rather than severe pain in the first days, well managed with simple pain relief. Discomfort settles quickly, and Mr Vijayan and his team support you throughout recovery.'},
      {question: 'How long do the results last?', answer: 'A breast lift gives lasting results, though the natural ageing process, gravity, weight changes and future pregnancies will continue over time. A stable weight helps your result last as long as possible.'},
      {question: 'Can I still breastfeed afterwards?', answer: 'Many women are able to breastfeed after a lift, though it cannot be guaranteed. If you are planning a pregnancy, it is worth discussing the timing of surgery with Mr Vijayan.'},
      {question: 'When can I return to exercise?', answer: 'Gentle movement is encouraged early on. Light activity is usually resumed by three to four weeks, with most exercise, including upper-body and high-impact activity, comfortably resumed from around six weeks.'},
    ]),
    seoTitle: 'Breast Lift (Mastopexy) in Hertfordshire | RV Plastic Surgery',
    seoDescription:
      'Breast lift (mastopexy) by Mr Roshan Vijayan, Consultant Plastic Surgeon in Hertfordshire. Techniques, candidacy, what happens during surgery, recovery, risks and cost, with consultant-led care and two-surgeon safety on more complex cases.',
  }

  return [siteSettings, ...reviews, breastLift]
}
