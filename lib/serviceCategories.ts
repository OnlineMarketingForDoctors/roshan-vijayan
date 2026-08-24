/**
 * The services in each category band, and the procedure page each one links to
 * where it has one. A handful are offered without a page of their own and show
 * as plain labels.
 *
 * Shared so the /procedures bands and the homepage carousel cannot drift: both
 * read this list, and a new procedure page needs its slug adding once.
 */
export type ServiceTag = {label: string; slug?: string}

export const SERVICE_TAGS: Record<string, ServiceTag[]> = {
  body: [
    {label: 'Abdominoplasty', slug: 'abdominoplasty'},
    {label: 'Arm Lift', slug: 'arm-lift'},
    {label: 'Thigh Lift', slug: 'thigh-lift'},
    {label: 'Liposuction', slug: 'liposuction-contouring'},
    {label: 'Post-Weight-Loss Lift'},
    {label: 'Mummy Makeover'},
  ],
  breast: [
    {label: 'Breast Reduction', slug: 'breast-reduction'},
    {label: 'Breast Uplift', slug: 'breast-lift'},
    {label: 'Breast Augmentation', slug: 'breast-augmentation'},
    {label: 'Breast Reconstruction'},
    {label: 'Gynaecomastia', slug: 'male-gynaecomastia-reduction'},
    {label: 'Nipple Correction'},
  ],
  face: [
    {label: 'Facelift', slug: 'facelift'},
    {label: 'Brow Lift'},
    {label: 'Eyelid Surgery', slug: 'upper-and-lower-lid-blepharoplasty'},
    {label: 'Rhinoplasty', slug: 'rhinoplasty'},
    {label: 'Lip Lift', slug: 'lip-lift'},
    {label: 'Ear Correction', slug: 'prominent-ear-correction'},
    {label: 'Split Ear Lobe Correction', slug: 'split-ear-lobe-correction'},
  ],
  skin: [
    {label: 'Skin-Cancer Removal', slug: 'aesthetic-repair-and-reconstruction-after-skin-cancer-removal'},
  // Split from "Mole & Cyst Removal" so each pill can reach its own page.
    {label: 'Mole Removal', slug: 'mole-removal'},
    {label: 'Cyst Removal', slug: 'cyst-removal'},
    {label: 'Lipoma Removal', slug: 'lipoma-removal'},
    {label: 'Scar Revision', slug: 'scar-revision-and-correction'},
    {label: 'Reconstructive Surgery'},
    {label: 'Dermatoscopy Review'},
  ],
}
