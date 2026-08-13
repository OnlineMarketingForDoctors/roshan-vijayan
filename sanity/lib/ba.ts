import {urlFor} from './image'
import {BA_PROCEDURES, type BAProcedure, type BAPatient} from '@/lib/baCases'

export type SanityBACase = {
  _id: string
  caption: string
  treatment?: string
  category?: string
  beforeImage?: unknown
  afterImage?: unknown
  beforeLabel?: string
  afterLabel?: string
  procedureSlugs?: string[]
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

/**
 * Groups before/after documents into the shape the gallery and the homepage
 * take: one entry per treatment, in the order the documents come back.
 *
 * Falls back to the copy in lib/baCases.ts when the CMS has nothing, so the
 * gallery is never empty and the images stay recoverable from the repository.
 */
export function buildBAProcedures(cases: SanityBACase[] | null | undefined): BAProcedure[] {
  if (!cases || !cases.length) return BA_PROCEDURES

  const out: BAProcedure[] = []
  const byTreatment = new Map<string, BAProcedure>()

  for (const c of cases) {
    if (!c.beforeImage || !c.afterImage) continue
    const treatment = c.treatment || c.caption
    const key = slugify(treatment)

    let group = byTreatment.get(key)
    if (!group) {
      group = {
        slug: key,
        title: treatment,
        area: c.category || 'Breast',
        procedureSlugs: [],
        patients: [],
      }
      byTreatment.set(key, group)
      out.push(group)
    }

    // a treatment inherits every procedure page its cases are linked to
    for (const s of c.procedureSlugs || []) {
      if (s && !group.procedureSlugs.includes(s)) group.procedureSlugs.push(s)
    }

    const patient: BAPatient = {
      caption: c.caption,
      beforeUrl: urlFor(c.beforeImage as never).width(900).quality(82).url(),
      afterUrl: urlFor(c.afterImage as never).width(900).quality(82).url(),
    }
    if (c.beforeLabel) patient.beforeLabel = c.beforeLabel
    if (c.afterLabel) patient.afterLabel = c.afterLabel
    group.patients.push(patient)
  }

  return out.filter((g) => g.patients.length)
}

/** cases for one procedure page, from CMS data */
export function baForProcedureFrom(procedures: BAProcedure[], procedureSlug: string): BAProcedure[] {
  return procedures.filter((p) => p.procedureSlugs.includes(procedureSlug))
}
