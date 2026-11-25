import { TALKS, type InteractiveTalkSpec, type Talk } from '@/content/talks'
import { lessonLanguages, pickLocalized, resolveLessonLanguage } from '@/lib/courses'

/**
 * Draft talks stay visible during local development (`npm run dev`) or when
 * explicitly opted in via `SHOW_DRAFT_TALKS=1` (e.g., when promoting a talk to
 * `dev.drkabongo.com` before `drkabongo.com`), and are omitted from default
 * production/staging builds.
 */
export function showDraftTalks(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.SHOW_DRAFT_TALKS === '1'
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
