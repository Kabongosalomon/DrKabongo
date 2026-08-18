/**
 * Recorded lecture for each lesson, by language.
 *
 * This is a hand-maintained overlay, in the same spirit as `videos.config.ts`:
 * the edtrace-studio catalog tracks the short Manim concept clips embedded
 * *inside* a lesson, which is a different thing from the full recorded lecture
 * that sits above it. Keeping the lecture here means publishing one does not
 * require rebuilding and re-syncing a course bundle.
 *
 * IDs are the 11-character YouTube video id from https://youtu.be/<id>.
 * A language with no recording yet is simply left out — the lesson page falls
 * back through `COURSE_FALLBACK` and shows nothing if no language has one.
 */
export const LESSON_VIDEOS: Record<string, Record<string, Record<string, string>>> = {
  ai_machine_learning_hello_world: {
    from_scratch: {
      // "Hello World to AI | Machine Learning From Scratch: Teach a Computer to Add"
      en: '2MUHPPKWwWA',
      // "Hello World de l'IA | Machine Learning From Scratch : Apprendre à un ordinateur à additionner"
      fr: 'sw7C7llz7S4',
      // "Hello World ku AI mu Tshiluba | Machine Learning From Scratch -- Kulongesha Ordinatɛr Addition"
      lua: 'K2ZbEeIgJDQ',
      // ln: the Lingala channel has no recording of this lesson yet.
    },
  },
}
