import { TALKS, type InteractiveTalkSpec, type Talk } from '@/content/talks'
import { lessonLanguages, pickLocalized, resolveLessonLanguage } from '@/lib/courses'
import { IS_DEV_DEPLOYMENT } from '@/lib/metadata'

/**
 * Draft talks stay visible during local development (`npm run dev`), on the
 * `dev` branch deployment (`dev.drkabongo.com`, which is already `noindex`),
 * or when explicitly opted in via `SHOW_DRAFT_TALKS=1`, and stay hidden on
 * production (`main` -> `drkabongo.com`) until `draft` is set to `false`.
 */
export function showDraftTalks(): boolean {
  return (
    process.env.NODE_ENV !== 'production' ||
    IS_DEV_DEPLOYMENT ||
    process.env.SHOW_DRAFT_TALKS === '1'
  )
}

export function getVisibleTalks(): Talk[] {
  const includeDrafts = showDraftTalks()
  return TALKS.filter((talk) => !talk.draft || includeDrafts)
}

export function getInteractiveTalks(): (Talk & { edtrace: InteractiveTalkSpec })[] {
  return getVisibleTalks().filter(
    (talk): talk is Talk & { edtrace: InteractiveTalkSpec } => Boolean(talk.edtrace),
  )
}

export function getInteractiveTalkBySlug(
  slug: string,
): (Talk & { edtrace: InteractiveTalkSpec }) | null {
  return getInteractiveTalks().find((talk) => talk.edtrace.slug === slug) ?? null
}

export function resolveTalkLanguage(spec: InteractiveTalkSpec, locale: string) {
  return resolveLessonLanguage(spec.courseId, spec.lessonId, locale)
}

export function talkLanguages(spec: InteractiveTalkSpec): string[] {
  return lessonLanguages(spec.courseId, spec.lessonId)
}

export { pickLocalized }
