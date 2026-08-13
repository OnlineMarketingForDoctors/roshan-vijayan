/**
 * Before & after cases, grouped by procedure.
 *
 * These are patient photographs held in the repository rather than in Sanity,
 * so the gallery renders without a CMS round trip. Every pair is 800x680, which
 * is what lets the reveal slider line the two frames up exactly.
 *
 * beforeLabel/afterLabel exist because not every pair is a plain before/after:
 * one case is photographed during the procedure, and one after is at one week.
 * Those read as they were taken rather than being flattened into Before/After.
 */

export type BAPatient = {
  /** short caption shown under the card */
  caption: string
  beforeUrl: string
  afterUrl: string
  /** defaults to Before/After */
  beforeLabel?: string
  afterLabel?: string
}

export type BAProcedure = {
  slug: string
  title: string
  /** grouping shown as a heading in the procedure menu */
  area: string
  /**
   * Slugs of the Sanity procedure pages this case belongs on. Several
   * reconstruction cases share the skin cancer page, and the one
   * blepharoplasty page carries both lid cases, so this is many-to-many
   * rather than a slug match.
   */
  procedureSlugs: string[]
  patients: BAPatient[]
}

const img = (slug: string, kind: 'before' | 'after') => `/images/ba/${slug}-${kind}.jpg`

export const BA_PROCEDURES: BAProcedure[] = [
  {
    slug: 'breast-reduction',
    title: 'Breast Reduction',
    area: 'Breast',
    procedureSlugs: ['breast-reduction'],
    patients: [
      {
        caption: 'Bilateral breast reduction · Patient one',
        beforeUrl: img('breast-reduction-1', 'before'),
        afterUrl: img('breast-reduction-1', 'after'),
      },
      {
        caption: 'Bilateral breast reduction · Patient two',
        beforeUrl: img('breast-reduction-2', 'before'),
        afterUrl: img('breast-reduction-2', 'after'),
      },
    ],
  },
  {
    slug: 'breast-explant-mastopexy',
    title: 'Explant & Mastopexy',
    area: 'Breast',
    procedureSlugs: ['breast-lift'],
    patients: [
      {
        caption: 'Bilateral explant with mastopexy · One week after surgery',
        beforeUrl: img('breast-explant-1', 'before'),
        afterUrl: img('breast-explant-1', 'after'),
        afterLabel: '1 week after',
      },
    ],
  },
  {
    slug: 'arm-lift',
    title: 'Arm Lift',
    area: 'Body',
    procedureSlugs: ['arm-lift'],
    patients: [
      {
        caption: 'Bilateral arm reduction · Patient one',
        beforeUrl: img('arm-lift-1', 'before'),
        afterUrl: img('arm-lift-1', 'after'),
      },
      {
        caption: 'Bilateral arm reduction · Patient two',
        beforeUrl: img('arm-lift-2', 'before'),
        afterUrl: img('arm-lift-2', 'after'),
      },
    ],
  },
  {
    slug: 'thigh-reduction',
    title: 'Thigh Reduction',
    area: 'Body',
    procedureSlugs: ['thigh-lift'],
    patients: [
      {
        caption: 'Bilateral thigh reduction',
        beforeUrl: img('thigh-reduction-1', 'before'),
        afterUrl: img('thigh-reduction-1', 'after'),
      },
    ],
  },
  {
    slug: 'upper-and-lower-lid-blepharoplasty',
    title: 'Upper & Lower Lid Blepharoplasty',
    area: 'Face',
    procedureSlugs: ['upper-and-lower-lid-blepharoplasty'],
    patients: [
      {
        caption: 'Upper and lower lid blepharoplasty',
        beforeUrl: img('upper-lower-bleph-1', 'before'),
        afterUrl: img('upper-lower-bleph-1', 'after'),
      },
    ],
  },
  {
    slug: 'lower-blepharoplasty',
    title: 'Lower Blepharoplasty',
    area: 'Face',
    procedureSlugs: ['upper-and-lower-lid-blepharoplasty'],
    patients: [
      {
        caption: 'Lower lid blepharoplasty',
        beforeUrl: img('lower-bleph-1', 'before'),
        afterUrl: img('lower-bleph-1', 'after'),
      },
    ],
  },
  {
    slug: 'skin-tumour-and-blepharoplasty',
    title: 'Skin Tumour & Upper Blepharoplasty',
    area: 'Skin & Reconstruction',
    procedureSlugs: ['aesthetic-repair-and-reconstruction-after-skin-cancer-removal', 'upper-and-lower-lid-blepharoplasty'],
    patients: [
      {
        caption: 'Skin tumour excision with bilateral upper blepharoplasty',
        beforeUrl: img('skin-tumour-bleph-1', 'before'),
        afterUrl: img('skin-tumour-bleph-1', 'after'),
      },
    ],
  },
  {
    slug: 'skin-tumour-surgery',
    title: 'Skin Tumour Surgery',
    area: 'Skin & Reconstruction',
    procedureSlugs: ['aesthetic-repair-and-reconstruction-after-skin-cancer-removal'],
    patients: [
      {
        caption: 'Skin tumour excision and reconstruction',
        beforeUrl: img('skin-tumour-1', 'before'),
        afterUrl: img('skin-tumour-1', 'after'),
      },
    ],
  },
  {
    slug: 'cheek-tumour',
    title: 'Cheek Tumour',
    area: 'Skin & Reconstruction',
    procedureSlugs: ['aesthetic-repair-and-reconstruction-after-skin-cancer-removal'],
    patients: [
      {
        caption: 'Cheek tumour excision and reconstruction',
        beforeUrl: img('cheek-tumour-1', 'before'),
        afterUrl: img('cheek-tumour-1', 'after'),
      },
    ],
  },
  {
    slug: 'forehead-flap',
    title: 'Forehead Flap',
    area: 'Skin & Reconstruction',
    procedureSlugs: ['aesthetic-repair-and-reconstruction-after-skin-cancer-removal'],
    patients: [
      {
        caption: 'Forehead flap reconstruction',
        beforeUrl: img('forehead-flap-1', 'before'),
        afterUrl: img('forehead-flap-1', 'after'),
      },
    ],
  },
  {
    slug: 'cervicofacial-flap',
    title: 'Cervicofacial Flap',
    area: 'Skin & Reconstruction',
    procedureSlugs: ['aesthetic-repair-and-reconstruction-after-skin-cancer-removal'],
    patients: [
      {
        caption: 'Cervicofacial flap reconstruction · Shown during surgery and healed',
        beforeUrl: img('cervicofacial-flap-1', 'before'),
        afterUrl: img('cervicofacial-flap-1', 'after'),
        beforeLabel: 'During',
      },
    ],
  },
]

/** cases to show on a given Sanity procedure page, in BA_PROCEDURES order */
export function baForProcedure(procedureSlug: string): BAProcedure[] {
  return BA_PROCEDURES.filter((p) => p.procedureSlugs.includes(procedureSlug))
}
