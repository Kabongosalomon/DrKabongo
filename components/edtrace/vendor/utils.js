// GENERATED FILE -- do not edit by hand.
// Source of truth: edtrace-studio (packages/viewer/src/utils.js).
// Synced by scripts/sync_web_bundle.py for course "ai_machine_learning_hello_world" (edtrace-studio git sha e9ede1584d698ad9977cd6c1a5b29ab115429748-dirty, built 2026-08-18T02:29:31+00:00).
// To change viewer behavior, edit edtrace-studio and re-run build_web_bundle.py + sync_web_bundle.py.
// > edtrace-studio vendor header end

/**
 * Navigates to a new URL with updated URL parameters (`urlParams + delta`).
 */
export function navigateToUrl(urlParams, delta, location, navigate) {
  for (const key in delta) {
    if (delta[key] === null || delta[key] === false) {
      urlParams.delete(key);
    } else {
      urlParams.set(key, delta[key]);
    }
  }
  navigate({
    pathname: location.pathname,
    search: urlParams.toString(),
  });
}

/**
 * Returns the last element of an array.
 */
export function getLast(arr) {
  return arr[arr.length - 1];
}

const DISPLAY_MATH_PATTERN = /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\])/g;

/**
 * Preserve TeX backslashes while display-math blocks pass through Markdown.
 *
 * Markdown treats a pair of backslashes as one escaped backslash. MathJax,
 * however, needs both characters in a TeX row break (`\\`). Doubling every
 * backslash inside a display-math block before calling Marked makes the
 * Markdown round trip lossless for native TeX such as `aligned`.
 */
export function protectDisplayMathForMarkdown(content) {
  if (typeof content !== 'string') {
    return content;
  }
  return content.replace(
    DISPLAY_MATH_PATTERN,
    (math) => math.replace(/\\/g, '\\\\')
  );
}

const LANGUAGE_LABELS = {
  en: 'English',
  fr: 'Français',
  ln: 'Lingala',
  lua: 'Tshiluba',
};

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeFunctionNames(value) {
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter(
      ([sourceName, displayName]) =>
        /^[A-Za-z_][A-Za-z0-9_]*$/.test(sourceName) &&
        typeof displayName === 'string' &&
        displayName.trim().length > 0
    )
  );
}

function normalizeInspectMath(value) {
  if (!isRecord(value)) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(value).filter(
      ([variableName, tex]) =>
        /^[A-Za-z_][A-Za-z0-9_]*(?:\.[A-Za-z_][A-Za-z0-9_]*)*$/.test(variableName) &&
        typeof tex === 'string' &&
        tex.trim().length > 0
    )
  );
}

function pathSegments(tracePath) {
  return String(tracePath || '')
    .split(/[?#]/, 1)[0]
    .split('/')
    .filter(Boolean);
}

function withoutJsonExtension(value) {
  return String(value || '').replace(/\.json$/i, '');
}

/** Turn a slug into a readable fallback label without changing metadata titles. */
export function humanizeIdentifier(value, fallback = '') {
  const text = withoutJsonExtension(value).replace(/[_-]+/g, ' ').trim();
  if (!text) {
    return fallback;
  }
  return text.replace(/\b\p{L}/gu, (letter) => letter.toLocaleUpperCase());
}

/**
 * Parse the conventional trace path used before trace metadata was introduced.
 *
 * The supported shape is `.../var/traces/<course>/<language>/<lesson>.json`.
 * A bare trace name is still useful as a lesson fallback.
 */
export function traceIdentityFromPath(tracePath) {
  const segments = pathSegments(tracePath);
  const tracesIndex = segments.lastIndexOf('traces');
  if (tracesIndex >= 0 && segments.length >= tracesIndex + 4) {
    return {
      courseId: segments[tracesIndex + 1],
      languageCode: segments[tracesIndex + 2],
      lessonId: withoutJsonExtension(segments[tracesIndex + 3]),
    };
  }

  const knownLanguageIndex = segments.findIndex(
    (segment) => Object.prototype.hasOwnProperty.call(LANGUAGE_LABELS, segment)
  );
  if (knownLanguageIndex > 0 && knownLanguageIndex < segments.length - 1) {
    return {
      courseId: segments[knownLanguageIndex - 1],
      languageCode: segments[knownLanguageIndex],
      lessonId: withoutJsonExtension(segments[knownLanguageIndex + 1]),
    };
  }

  return {
    courseId: null,
    languageCode: null,
    lessonId: withoutJsonExtension(segments.at(-1)),
  };
}

/** Resolve a language from a trace path for traces that predate metadata. */
export function languageFromTracePath(tracePath) {
  return traceIdentityFromPath(tracePath).languageCode || 'en';
}

function normalizeEntity(value, fallbackId, fallbackTitle) {
  if (typeof value === 'string') {
    return {
      id: fallbackId || value,
      title: value,
    };
  }
  const entity = isRecord(value) ? value : {};
  const id = entity.id || entity.slug || entity.name || fallbackId || '';
  return {
    ...entity,
    id,
    title: entity.title || entity.label || entity.name ||
      humanizeIdentifier(id, fallbackTitle),
  };
}

function normalizeLanguage(value, fallbackCode) {
  const language = typeof value === 'string' ? { code: value } :
    (isRecord(value) ? value : {});
  const code = language.code || language.id || fallbackCode || 'en';
  return {
    ...language,
    code,
    label: language.label || language.title || language.name ||
      LANGUAGE_LABELS[code] || code.toLocaleUpperCase(),
  };
}

/**
 * Return complete, presentation-safe trace metadata.
 *
 * Metadata is additive: explicit values win, and missing values are derived
 * from the legacy trace path. Unknown metadata fields are preserved.
 */
export function resolveTraceMetadata(trace, tracePath) {
  const raw = isRecord(trace?.metadata) ? trace.metadata : {};
  const legacy = traceIdentityFromPath(tracePath);
  const course = normalizeEntity(
    raw.course,
    raw.course_id || legacy.courseId,
    'Course'
  );
  const lesson = normalizeEntity(
    raw.lesson,
    raw.lesson_id || legacy.lessonId,
    'Lesson'
  );
  const language = normalizeLanguage(
    raw.language || raw.language_code,
    legacy.languageCode
  );
  const rawSupportedLanguages = Array.isArray(raw.supported_languages) ?
    raw.supported_languages :
    (Array.isArray(raw.languages) ? raw.languages : []);
  const supportedLanguages =
    rawSupportedLanguages.length === 0 &&
    Object.prototype.hasOwnProperty.call(LANGUAGE_LABELS, legacy.languageCode) ?
      Object.entries(LANGUAGE_LABELS).map(([code, label]) => ({ code, label })) :
      rawSupportedLanguages.map((item) => normalizeLanguage(item, language.code));

  if (!supportedLanguages.some((item) => item.code === language.code)) {
    supportedLanguages.unshift(language);
  }

  return {
    ...raw,
    schemaVersion: raw.schema_version ?? raw.schemaVersion ?? null,
    course,
    lesson,
    language,
    supportedLanguages,
    functionNames: normalizeFunctionNames(
      raw.function_names || raw.functionNames
    ),
    inspectMath: normalizeInspectMath(raw.inspect_math || raw.inspectMath),
    videos: Array.isArray(raw.videos) ? raw.videos : [],
  };
}

/**
 * Replace Python identifier tokens for presentation without touching strings
 * or comments. The returned text is display-only; EdTrace still executes and
 * navigates with the original source identifiers.
 */
export function localizePythonIdentifiers(source, aliases) {
  if (typeof source !== 'string' || !isRecord(aliases) ||
      Object.keys(aliases).length === 0) {
    return source;
  }

  let result = '';
  let index = 0;
  let quote = null;
  let tripleQuoted = false;

  while (index < source.length) {
    const char = source[index];

    if (quote !== null) {
      if (char === '\\') {
        result += source.slice(index, index + 2);
        index += 2;
        continue;
      }
      const delimiter = tripleQuoted ? quote.repeat(3) : quote;
      if (source.startsWith(delimiter, index)) {
        result += delimiter;
        index += delimiter.length;
        quote = null;
        tripleQuoted = false;
        continue;
      }
      result += char;
      index += 1;
      continue;
    }

    if (char === '#') {
      const newline = source.indexOf('\n', index);
      if (newline === -1) {
        result += source.slice(index);
        break;
      }
      result += source.slice(index, newline + 1);
      index = newline + 1;
      continue;
    }

    if (char === '"' || char === "'") {
      quote = char;
      tripleQuoted = source.startsWith(char.repeat(3), index);
      const delimiter = tripleQuoted ? char.repeat(3) : char;
      result += delimiter;
      index += delimiter.length;
      continue;
    }

    if (/[A-Za-z_]/.test(char)) {
      let end = index + 1;
      while (end < source.length && /[A-Za-z0-9_]/.test(source[end])) {
        end += 1;
      }
      const identifier = source.slice(index, end);
      result += aliases[identifier] || identifier;
      index = end;
      continue;
    }

    result += char;
    index += 1;
  }

  return result;
}

/**
 * Rewrite only the language directory in a conventional trace path.
 *
 * Supplying `currentLanguage` lets metadata drive the replacement. If it is
 * absent, the current language is inferred from the legacy path.
 */
export function rewriteTraceLanguage(tracePath, nextLanguage, currentLanguage) {
  if (!tracePath || !nextLanguage) {
    return tracePath;
  }

  const current = currentLanguage || languageFromTracePath(tracePath);
  const parts = String(tracePath).split('/');
  const tracesIndex = parts.lastIndexOf('traces');
  let languageIndex = parts.findIndex((part) => part === current);

  if (languageIndex === -1 && tracesIndex !== -1 && parts.length > tracesIndex + 3) {
    languageIndex = tracesIndex + 2;
  }
  if (languageIndex === -1) {
    return tracePath;
  }

  parts[languageIndex] = nextLanguage;
  return parts.join('/');
}

/** A stable rendering lookup key that cannot confuse identical line numbers. */
export function getTraceLocation(path, lineNumber) {
  return `${path}:${lineNumber}`;
}

/** Index step renderings by both source path and line number. */
export function buildRenderingLookup(trace) {
  const lookup = {};
  for (const step of trace?.steps || []) {
    const stackElement = getLast(step.stack || []);
    if (!stackElement?.path || stackElement.line_number === undefined) {
      continue;
    }
    lookup[getTraceLocation(stackElement.path, stackElement.line_number)] =
      Array.isArray(step.renderings) ? step.renderings : [];
  }
  return lookup;
}

/** Convert edtrace's typed JSON values into ordinary JavaScript values. */
export function decodeTraceValue(value) {
  if (value === null || value === undefined) {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(decodeTraceValue);
  }
  if (typeof value !== 'object') {
    return value;
  }
  if (Object.prototype.hasOwnProperty.call(value, 'type') &&
      Object.prototype.hasOwnProperty.call(value, 'contents')) {
    return decodeTraceValue(value.contents);
  }
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, decodeTraceValue(item)])
  );
}

/**
 * Normalize the learning-monitor payload while accepting early trace aliases.
 *
 * Lesson source uses Python identifiers such as `w_1`, but the monitor schema
 * uses compact transport keys such as `w1`. Older traces accidentally exposed
 * the Python names, so accept both without allowing an incomplete payload to
 * crash the whole viewer.
 */
export function normalizeUpdateSnapshot(snapshot) {
  if (!snapshot?.parameters || !snapshot?.forward || !snapshot?.sample) {
    return null;
  }
  const parameters = {
    w1: snapshot.parameters.w1 ?? snapshot.parameters.w_1,
    w2: snapshot.parameters.w2 ?? snapshot.parameters.w_2,
    b: snapshot.parameters.b,
  };
  if (Object.values(parameters).some(
    (parameter) => !parameter || typeof parameter !== 'object'
  )) {
    return null;
  }
  return {
    ...snapshot,
    sample: {
      ...snapshot.sample,
      x1: snapshot.sample.x1 ?? snapshot.sample.x_1,
      x2: snapshot.sample.x2 ?? snapshot.sample.x_2,
    },
    parameters,
  };
}

/** Return environment names listed after a targeted `@clear` directive. */
export function environmentKeysToClear(trace, step) {
  const location = getLast(step?.stack || []);
  const source = trace?.files?.[location?.path];
  if (!source || location?.line_number === undefined) {
    return [];
  }
  const line = source.split('\n')[location.line_number - 1] || '';
  const match = line.match(/@clear(?:\s+([^@#]*))?/);
  return match?.[1]?.match(/[A-Za-z_]\w*/g) || [];
}

/** Merge inspected environments, applying targeted clears in trace order. */
export function mergeTraceEnvironments(trace, steps) {
  const merged = {};
  for (const step of steps) {
    Object.assign(merged, step.env || {});
    for (const key of environmentKeysToClear(trace, step)) {
      delete merged[key];
    }
  }
  return merged;
}

/** Return trace indices containing a completed parameter update snapshot. */
export function findUpdateStepIndices(trace) {
  if (!trace?.steps) {
    return [];
  }
  return trace.steps.flatMap((step, index) =>
    step.env?.update_snapshot ? [index] : []
  );
}

/** Find the previous or next update checkpoint relative to the current step. */
export function findAdjacentUpdateStep(indices, currentStepIndex, direction) {
  if (direction > 0) {
    return indices.find((index) => index > currentStepIndex) ?? null;
  }
  return [...indices].reverse().find((index) => index < currentStepIndex) ?? null;
}

/** Whether a trace step executes on a source line hidden from the learner. */
export function isHiddenTraceStep(trace, stepIndex) {
  const location = getLast(trace?.steps?.[stepIndex]?.stack || []);
  if (!location?.path || location.line_number === undefined) {
    return false;
  }
  return (trace.hidden_line_numbers?.[location.path] || [])
    .includes(location.line_number);
}

/** Hidden steps remain navigable only when that step exposes an inspection. */
export function isNavigableTraceStep(trace, stepIndex) {
  const step = trace?.steps?.[stepIndex];
  if (!step) {
    return false;
  }
  const hasInspection = Object.keys(step.env || {}).length > 0;
  return !isHiddenTraceStep(trace, stepIndex) || hasInspection;
}

/** Normalize a host-supplied lower bound. */
function normalizeMinimumStepIndex(minimumStepIndex) {
  if (!Number.isSafeInteger(minimumStepIndex)) {
    return 0;
  }
  return Math.max(minimumStepIndex, 0);
}

/** Raw trace indices that should count as learner-facing navigation steps. */
export function getNavigableStepIndices(trace, minimumStepIndex = 0) {
  const allNavigableStepIndices = (trace?.steps || []).flatMap((_, stepIndex) =>
    isNavigableTraceStep(trace, stepIndex) ? [stepIndex] : []
  );
  const minimum = normalizeMinimumStepIndex(minimumStepIndex);
  const candidates = allNavigableStepIndices.filter((stepIndex) => stepIndex >= minimum);
  if (candidates.length > 0 || allNavigableStepIndices.length === 0) {
    return candidates;
  }
  // A stale catalog can name a floor beyond a rebuilt trace. Recover at the
  // last learner-facing state rather than violating the guard with raw step 0.
  return [allNavigableStepIndices[allNavigableStepIndices.length - 1]];
}

/**
 * Resolve an untrusted URL step to a learner-facing trace index.
 *
 * Exact navigable indices are preserved. Hidden steps resolve forward to the
 * next visible state, except at the end of a trace where the last visible
 * state is used. Invalid values start at the host's authored lower bound.
 */
export function resolveNavigableStepIndex(
  trace,
  requestedStepIndex,
  minimumStepIndex = 0
) {
  const navigableStepIndices = getNavigableStepIndices(trace, minimumStepIndex);
  if (navigableStepIndices.length === 0) {
    return null;
  }
  if (!Number.isSafeInteger(requestedStepIndex)) {
    return navigableStepIndices[0];
  }
  return navigableStepIndices.find((stepIndex) => stepIndex >= requestedStepIndex) ??
    navigableStepIndices[navigableStepIndices.length - 1];
}

/** Find the next learner-visible step, skipping hidden implementation work. */
export function findAdjacentNavigableStep(
  trace,
  currentStepIndex,
  direction,
  minimumStepIndex = 0
) {
  const navigableStepIndices = getNavigableStepIndices(trace, minimumStepIndex);
  if (direction > 0) {
    return navigableStepIndices.find((stepIndex) => stepIndex > currentStepIndex) ?? null;
  }
  return [...navigableStepIndices].reverse()
    .find((stepIndex) => stepIndex < currentStepIndex) ?? null;
}

/** A zero gradient means the parameter cannot change on this sample. */
export function parameterDidUpdate(parameter, tolerance = 1e-12) {
  return Math.abs(parameter?.gradient ?? 0) > tolerance;
}
