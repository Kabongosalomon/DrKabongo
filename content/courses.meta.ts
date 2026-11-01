/**
 * Hand-maintained details for the courses index, kept here because the
 * edtrace-studio catalogs (content/courses/*.json) are generated and carry
 * neither a date nor keywords.
 *
 * Add one entry per course when you publish it:
 *   published — ISO date (YYYY-MM-DD); the index lists newest first by it.
 *   topics    — a few keywords, shown on the course card.
 * A course with no entry here still appears, after the dated ones.
 */
export interface CourseMeta {
  published: string
  topics: string[]
}

export const COURSE_META: Record<string, CourseMeta> = {
  ai_machine_learning_hello_world: {
    published: '2026-08-18',
    topics: ['AI', 'Machine learning'],
  },
}
