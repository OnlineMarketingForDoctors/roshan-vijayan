/**
 * Where the old site's URLs go.
 *
 * Every address the previous site published is answered here rather than left
 * to 404, so a link from a directory, a referral letter or a search result
 * still arrives at the right page, and the ranking those pages earned carries
 * across. All of them are permanent (308): the old addresses are not coming
 * back.
 *
 * Two thirds of the old site needed nothing — all nineteen procedure pages
 * kept their exact URLs, as did the home page, gallery, locations, blog index
 * and contact page. What follows is the remainder.
 *
 * These are matched before the filesystem, so no source here may collide with
 * a real page. The list is generated from the old sitemap intersected with the
 * posts that exist now, and checked against the site's own routes; it is
 * static on purpose, so a build cannot quietly lose it when the CMS is slow.
 */

export type LegacyRedirect = {source: string; destination: string; permanent: true}

/**
 * Journal posts. The old site served all of these at the root — /tummy-tuck-
 * scars-healing-placement-and-minimization/ — and they now sit under /blog/.
 * The slugs themselves are unchanged, so the rule is the same for all 141.
 */
const BLOG_SLUGS = [
  'abdominoplasty-after-weight-loss-what-to-expect',
  'abdominoplasty-london-guide',
  'abdominoplasty-recovery-essential-tummy-tuck-aftercare-tips',
  'abdominoplasty-revision-when-additional-surgery-is-needed',
  'abdominoplasty-surgery-complete-patient-guide',
  'abdominoplasty-vs-liposuction-best-choice-for-your-goals',
  'actinic-keratosis-treatment-precancerous-lesion-management',
  'aesthetic-breast-surgery-uk-guide',
  'am-i-a-good-candidate-for-arm-lift-surgery',
  'arm-lift-complications-how-to-prevent-and-manage-issues',
  'arm-lift-exercise-pre-and-post-surgery-fitness-guide',
  'arm-lift-for-men-masculine-upper-arm-contouring',
  'arm-lift-scar-revision-improving-surgical-outcomes',
  'arm-lift-surgery-complete-recovery-guide-and-timeline',
  'arm-lift-surgery-eliminating-excess-arm-skin-safely',
  'arm-lift-surgery-risks-and-complications-what-to-know',
  'arm-lift-vs-liposuction-which-treatment-is-right-for-you',
  'atypical-mole-removal-when-dysplastic-nevi-need-surgery',
  'basal-cell-carcinoma-removal-surgical-excision-guide',
  'benefits-of-abdominoplasty',
  'body-contouring-after-massive-weight-loss-complete-guide',
  'body-contouring-consultation-what-to-expect-and-ask',
  'body-contouring-for-athletic-patients-special-considerations',
  'body-contouring-pain-management-comfort-during-recovery',
  'body-lift-surgery-comprehensive-guide-for-uk-patients',
  'brachioplasty-before-and-after-real-patient-results',
  'breast-asymmetry-surgery-options',
  'breast-augmentation-surgery-choosing-the-right-implant-size',
  'breast-lift-and-augmentation-combining-procedures-for-best-results',
  'breast-lift-complications-risks-and-how-to-minimize-them',
  'breast-lift-cost-uk-pricing-guide-and-payment-options',
  'breast-lift-recovery-timeline-tips-and-what-to-expect',
  'breast-lift-results-what-to-expect-and-how-long-they-last',
  'breast-lift-scars-types-healing-and-scar-minimization',
  'breast-lift-surgery-everything-you-need-to-know-about-mastopexy',
  'breast-lift-surgery-restoring-youthful-breast-shape',
  'breast-lift-suture-methods-healing',
  'breast-lift-techniques-anchor-lollipop-and-crescent-methods',
  'breast-lift-vs-breast-augmentation-choosing-the-right-procedure',
  'breast-reduction-age-requirements-when-is-the-right-time',
  'breast-reduction-and-breastfeeding-impact-on-future-nursing',
  'breast-reduction-before-and-after-real-patient-results-and-stories',
  'breast-reduction-consultation-questions-to-ask-your-surgeon',
  'breast-reduction-cost-uk-pricing-insurance-and-financing-options',
  'breast-reduction-for-back-pain-how-surgery-can-provide-relief',
  'breast-reduction-in-london',
  'breast-reduction-recovery',
  'breast-reduction-recovery-timeline-what-to-expect-week-by-week',
  'breast-reduction-revision-when-additional-surgery-is-needed',
  'breast-reduction-risks-and-complications-what-you-should-know',
  'breast-reduction-scars-healing-minimizing-and-long-term-care',
  'breast-reduction-sleeping-best-positions-and-recovery-tips',
  'breast-reduction-surgeon-selection-how-to-choose-the-right-expert',
  'breast-reduction-surgery',
  'breast-reduction-surgery-benefits-and-recovery-process',
  'breast-reduction-surgery-complete-guide-to-procedure-and-recovery',
  'breast-reduction-weight-loss-how-much-weight-is-removed',
  'candidate-for-lip-lift-suitability',
  'cherry-angioma-removal-cosmetic-vascular-lesion-treatment',
  'choosing-your-plastic-surgeon-for-body-contouring',
  'combining-body-contouring-procedures-what-you-should-know',
  'congenital-nevus-removal-large-birthmark-excision',
  'cyst-removal-surgery-types-procedure-and-aftercare',
  'dermatofibroma-excision-when-removal-is-recommended',
  'earlobe-keloid-removal-specialized-treatment-approach',
  'excisional-biopsy-diagnostic-skin-lesion-removal',
  'exercise-after-breast-reduction',
  'extended-abdominoplasty-when-standard-tummy-tuck-isnt-enough',
  'facelift-surgery-recovery-week-by-week-timeline-guide',
  'fleur-de-lis-tummy-tuck-360-degree-abdominal-transformation',
  'hidradenitis-suppurativa-surgery-wide-excision-treatment',
  'how-much-does-arm-lift-surgery-cost-in-the-uk',
  'hypertrophic-scar-revision-reducing-raised-scar-tissue',
  'inner-vs-outer-thigh-lift-which-procedure-do-you-need',
  'internal-bra-technique',
  'keloid-scar-treatment-surgical-and-non-surgical-solutions',
  'lip-lift-recovery',
  'lip-lift-vs-fillers',
  'lipoma-removal-surgery-procedure-recovery-results',
  'liposuction-contouring-advanced-body-sculpting-techniques',
  'long-term-results-of-body-contouring-surgery',
  'maintaining-your-tummy-tuck-results-long-term-care-guide',
  'male-gynecomastia-surgery-effective-chest-contouring-solutions',
  'mastopexy-candidates-am-i-suitable-for-breast-lift-surgery',
  'mastopexy-recovery-complete-healing-guide-and-timeline',
  'mastopexy-surgery-complete-guide-to-breast-lift-procedure',
  'mastopexy-techniques-explained-finding-your-perfect-breast-lift',
  'mastopexy-vs-breast-reduction-which-procedure-is-right-for-you',
  'mini-vs-full-abdominoplasty-choosing-the-right-option',
  'mole-and-lipoma-removal',
  'mole-cyst-lipoma-removal-guide',
  'mole-removal-surgery-when-medical-excision-is-necessary',
  'natural-looking-breast-surgery',
  'neurofibroma-removal-benign-nerve-tumor-excision',
  'pilonidal-sinus-surgery-treatment-and-recovery-guide',
  'pinnaplasty-for-adults',
  'pinnaplasty-scars-healing-guide',
  'pinnaplasty-surgery-complete-guide-to-ear-correction',
  'pinnaplasty-surgery-guide',
  'pinnaplasty-with-other-procedures',
  'post-pregnancy-body-contouring-restoring-your-figure',
  'preparing-for-body-contouring-surgery-complete-checklist',
  'preventing-bottoming-out-breast-lift',
  'punch-biopsy-vs-shave-biopsy-choosing-right-technique',
  'pyogenic-granuloma-excision-fast-growing-lesion-treatment',
  're-pierce-ears-after-surgery',
  'repairing-torn-earlobes-surgery',
  'rhinoplasty-before-and-after-what-to-expect-from-nose-surgery',
  'safe-breast-lift-techniques',
  'sebaceous-cyst-vs-epidermoid-cyst-identification-and-treatment',
  'seborrheic-keratosis-removal-cosmetic-lesion-treatment',
  'sensation-after-breast-reduction',
  'skin-cancer-reconstruction-aesthetic-repair-after-excision',
  'skin-lesion-excision-and-repair-surgery',
  'skin-tag-removal-medical-vs-cosmetic-treatment-options',
  'split-earlobe-repair-techniques',
  'squamous-cell-carcinoma-surgery-treatment-and-recovery',
  'surgical-facial-enhancement-london-guide',
  'surgical-lip-lift',
  'surgical-lip-lift-vs-non-surgical-options-which-is-better',
  'swelling-after-breast-reduction-guide',
  'thigh-lift-after-weight-loss-timing-and-preparation',
  'thigh-lift-alternatives-non-surgical-options-to-consider',
  'thigh-lift-and-liposuction-combined-treatment-benefits',
  'thigh-lift-cost-uk-investment-in-your-confidence',
  'thigh-lift-recovery-week-by-week-healing-timeline',
  'thigh-lift-scars-what-to-expect-and-how-to-minimize',
  'thigh-lift-surgery-comprehensive-guide-to-leg-contouring',
  'thigh-lift-surgery-everything-you-need-to-know',
  'traumatic-scar-revision-improving-injury-related-scars',
  'tummy-tuck-after-c-section-timing-and-considerations',
  'tummy-tuck-and-hernia-repair-simultaneous-treatment',
  'tummy-tuck-cost-uk-pricing-and-financing-options',
  'tummy-tuck-for-core-strength-benefits',
  'tummy-tuck-recovery-essential-dos-and-donts',
  'tummy-tuck-scars-healing-placement-and-minimization',
  'tummy-tuck-surgery-real-results-and-patient-stories',
  'upper-and-lower-blepharoplasty-complete-eyelid-surgery-guide',
  'upper-body-lift-vs-lower-body-lift-understanding-your-options',
  'vertical-thigh-lift-advanced-inner-thigh-contouring',
  'when-to-consider-scar-revision-surgery',
]

/** Pages that moved, or whose equivalent is now a section of another page. */
const MOVED: [string, string][] = [
  ['/about-me/', '/about/'],
  ['/thank-you/', '/thank-you-contact/'],
  // the old site gave each procedure category a page of its own; they are now
  // bands on the one procedures page
  ['/procedures/body/', '/procedures/#body'],
  ['/procedures/face/', '/procedures/#face'],
  ['/procedures/skin/', '/procedures/#skin'],
  ['/procedures/other/', '/procedures/'],
]

/**
 * Addresses the old site had already retired by the time its final sitemap was
 * taken, so they appear in neither the blog export nor the page inventory that
 * the rules above are built from.
 *
 * They still matter, because every one of them is linked from the body of a
 * published article — fifty links across twenty-seven posts, left behind when
 * their targets were deleted. Those links were broken on the old site too.
 * This answers them while the articles themselves are corrected.
 */
const RETIRED: [string, string][] = [
  // Procedures whose address changed. The page survived the rebuild; only its slug, or the
  // category it sits under, did not.
  ['/procedures/body/abdominoplasty-tummy-tuck/',                                                    '/procedures/body/abdominoplasty/'],
  ['/procedures/body/tummy-tuck-abdominoplasty/',                                                    '/procedures/body/abdominoplasty/'],
  ['/procedures/abdominoplasty/',                                                                    '/procedures/body/abdominoplasty/'],
  ['/procedures/body/liposuction/',                                                                  '/procedures/body/liposuction-contouring/'],
  ['/procedures/body/arm-lift-brachioplasty/',                                                       '/procedures/body/arm-lift/'],
  ['/procedures/breast/breast-lift-mastopexy/',                                                      '/procedures/body/breast-lift/'],
  ['/procedures/body/breast-lift-mastopexy/',                                                        '/procedures/body/breast-lift/'],
  ['/procedures/breast/breast-reduction-hertfordshire/',                                             '/procedures/body/breast-reduction/'],
  ['/procedures/breast-reduction/',                                                                  '/procedures/body/breast-reduction/'],
  ['/procedures/male/gynaecomastia-male-chest-reduction/',                                           '/procedures/body/male-gynaecomastia-reduction/'],
  ['/procedures/body/scar-revision/',                                                                '/procedures/skin/scar-revision-and-correction/'],
  ['/procedures/skin/scar-revision/',                                                                '/procedures/skin/scar-revision-and-correction/'],
  ['/procedures/scar-revision/',                                                                     '/procedures/skin/scar-revision-and-correction/'],
  ['/procedures/skin/skin-cancer/',                                                                  '/procedures/skin/aesthetic-repair-and-reconstruction-after-skin-cancer-removal/'],
  ['/reconstructive-surgery/',                                                                       '/procedures/skin/aesthetic-repair-and-reconstruction-after-skin-cancer-removal/'],
  ['/procedures/body/skin-lesion-removal/',                                                          '/procedures/skin/mole-removal/'],

  // Body contouring after weight loss had a procedure page of its own, which the rebuild
  // did not carry over. The journal guide is the nearest live equivalent.
  ['/procedures/body/body-contouring-after-major-weight-loss/',                                      '/blog/body-contouring-after-massive-weight-loss-complete-guide/'],
  ['/procedures/body/body-contouring-after-massive-weight-loss/',                                    '/blog/body-contouring-after-massive-weight-loss-complete-guide/'],

  // The surgeon's own page, which is now the About page.
  ['/about/mr-roshan-vijayan/',                                                                      '/about/'],

  // Journal posts retired before the rebuild, so they are missing from the export the
  // rules above are built from.
  ['/blog/guide-to-breast-reduction-scars/',                                                         '/blog/breast-reduction-scars-healing-minimizing-and-long-term-care/'],
  ['/blog/split-earlobe-repair-everything-you-need-to-know/',                                        '/blog/split-earlobe-repair-techniques/'],
  ['/split-earlobe-repair-everything-you-need-to-know/',                                             '/blog/split-earlobe-repair-techniques/'],
  ['/breast-reduction-recovery-timeline/',                                                           '/blog/breast-reduction-recovery-timeline-what-to-expect-week-by-week/'],
  ['/blog/preparing-for-your-cosmetic-surgery/',                                                     '/blog/preparing-for-body-contouring-surgery-complete-checklist/'],
  ['/blog/understanding-surgical-scars/',                                                            '/blog/when-to-consider-scar-revision-surgery/'],
  ['/blog/scar-management-after-plastic-surgery/',                                                   '/blog/when-to-consider-scar-revision-surgery/'],
  ['/blog/radiant-results-how-to-get-the-most-from-your-breast-shape-before-and-after-weight-loss/', '/blog/body-contouring-after-massive-weight-loss-complete-guide/'],
  ['/blog/guide-to-recovering-from-plastic-surgery/',                                                '/blog/'],
  ['/blog/your-guide-to-a-smooth-recovery-after-plastic-surgery/',                                   '/blog/'],

  // Nothing on the new site answers these. Aftercare and the consultation process are no
  // longer pages of their own — that material sits inside each procedure's journey and
  // recovery sections — and no mummy makeover page was rebuilt. They go to the home page
  // rather than to a section that only half answers them.
  ['/procedures/body/mummy-makeover/',                                                               '/'],
  ['/aftercare/',                                                                                    '/'],
  ['/aftercare-and-faqs/',                                                                           '/'],
  ['/your-journey/aftercare/',                                                                       '/'],
  ['/information/post-operative-care/',                                                              '/'],
  ['/your-journey/',                                                                                 '/'],
  ['/your-journey/consultation-process/',                                                            '/'],
  ['/information/consultation-process/',                                                             '/'],
]

export const LEGACY_REDIRECTS: LegacyRedirect[] = [
  ...[...MOVED, ...RETIRED].map(([source, destination]) => ({
    source,
    destination,
    permanent: true as const,
  })),
  ...BLOG_SLUGS.map((slug) => ({
    source: `/${slug}/`,
    destination: `/blog/${slug}/`,
    permanent: true as const,
  })),
]
