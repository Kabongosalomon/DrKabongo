/**
 * Pure trace analysis and navigation helpers for EdTrace presentations.
 *
 * Kept framework-free so `node --test` can verify Table of Contents extraction,
 * localized function aliases, section tracking, and line-click resolution
 * directly against real generated course traces.
 */

export interface TraceStackFrame {
  path: string
  line_number: number
  function_name?: string
  code?: string
}

export interface TraceRendering {
  type: string
  data?: unknown
  caption?: string
  style?: Record<string, unknown>
}

export interface TraceStep {
  stack?: TraceStackFrame[]
  renderings?: TraceRendering[]
  env?: Record<string, unknown>
  /** A slide that discusses the results of the code above it, which stay visible. */
  keep_values?: boolean
}

export interface TraceMetadataRaw {
  course?: { id?: string; title?: string } | string
  lesson?: { id?: string; title?: string } | string
  language?: { code?: string; label?: string } | string
  supported_languages?: ({ code?: string; label?: string } | string)[]
  function_names?: Record<string, string>
  functionNames?: Record<string, string>
}

export interface TraceData {
  files?: Record<string, string>
  hidden_line_numbers?: Record<string, number[]>
  steps?: TraceStep[]
  metadata?: TraceMetadataRaw
}

export interface TocSubSection {
  title: string
  level: number
  stepIndex: number
  lineNumber: number
}

export interface TocEntry {
  /** 1-based position in the table of contents. */
  index: number
  path: string
  /** Line number of the call inside `table_of_contents()` (null on heading-only fallback). */
  tocLineNumber: number | null
  /** Navigable step on the call line inside `table_of_contents()`. */
  callStepIndex: number
  /** First navigable step inside the called section function. */
  sectionStepIndex: number
  /** Source line of the called function's `def` or section start. */
  targetLineNumber: number
  /** Last step belonging to this section call, used to highlight the active section. */
  endStepIndex: number
  /** Original Python function identifier (e.g. `how_does_ai_learn`). */
  functionName: string
  /** Localized or raw identifier shown to the learner (e.g. `comment_l_ia_apprend`). */
  displayName: string
  /** Localized or raw call line code without leading indentation or directives. */
  codeLabel: string
  /** First human-readable heading inside this section, if one is rendered. */
  heading: string | null
  /** Additional H2/H3 headings rendered within this section. */
  subSections: TocSubSection[]
}

export interface TocHeader {
  path: string
  lineNumber: number
  stepIndex: number
  functionName: string
  displayName: string
}

export interface TableOfContents {
  header: TocHeader | null
  entries: TocEntry[]
}

function getLastFrame(step: TraceStep | undefined): TraceStackFrame | null {
  const stack = step?.stack
  if (!Array.isArray(stack) || stack.length === 0) return null
  return stack[stack.length - 1] ?? null
}

export function isHiddenStep(trace: TraceData, stepIndex: number): boolean {
  const frame = getLastFrame(trace.steps?.[stepIndex])
  if (!frame?.path || typeof frame.line_number !== 'number') return false
  const hidden = trace.hidden_line_numbers?.[frame.path]
  return Array.isArray(hidden) && hidden.includes(frame.line_number)
}

export function isNavigableStep(trace: TraceData, stepIndex: number): boolean {
  const step = trace.steps?.[stepIndex]
  if (!step) return false
  const hasInspection = Object.keys(step.env ?? {}).length > 0
  return !isHiddenStep(trace, stepIndex) || hasInspection
}

export function getNavigableSteps(trace: TraceData | null, minimumStep = 0): number[] {
  if (!trace?.steps?.length) return []
  const floor = Number.isSafeInteger(minimumStep) ? Math.max(0, minimumStep) : 0
  const all: number[] = []
  for (let i = 0; i < trace.steps.length; i++) {
    if (isNavigableStep(trace, i)) all.push(i)
  }
  if (all.length === 0) return []
  const filtered = all.filter((idx) => idx >= floor)
  return filtered.length > 0 ? filtered : [all[all.length - 1]]
}

export function resolveNavigableStep(
  trace: TraceData | null,
  requestedStep: number | null,
  minimumStep = 0,
): number | null {
  const navigable = getNavigableSteps(trace, minimumStep)
  if (navigable.length === 0) return null
  if (requestedStep === null || !Number.isSafeInteger(requestedStep)) {
    return navigable[0]
  }
  return navigable.find((idx) => idx >= requestedStep) ?? navigable[navigable.length - 1]
}

/**
 * Compute the active step index using the exact same precedence as TraceViewer.jsx.
 */
export function resolveCurrentStepIndex(
  trace: TraceData | null,
  viewState: {
    step: number | null
    source: string | null
    line: number | null
    present: boolean
  },
  minimumStep = 0,
): number | null {
  if (!trace?.steps?.length) return null
  const navigable = getNavigableSteps(trace, minimumStep)
  if (navigable.length === 0) return null

  if (viewState.step === null && viewState.line === null) {
    const firstRenderingIndex = trace.steps.findIndex(
      (step) => Array.isArray(step.renderings) && step.renderings.length > 0,
    )
    const preferred =
      viewState.present && firstRenderingIndex >= 0 ? firstRenderingIndex : 0
    return resolveNavigableStep(trace, preferred, minimumStep)
  }

  if (viewState.step !== null) {
    return resolveNavigableStep(trace, viewState.step, minimumStep)
  }

  const navigableSet = new Set(navigable)
  const found = trace.steps.findIndex((step, idx) => {
    if (!navigableSet.has(idx)) return false
    const frame = getLastFrame(step)
    return frame?.path === viewState.source && frame?.line_number === viewState.line
  })
  return found >= 0 ? found : navigable[0]
}

function getFunctionAliases(trace: TraceData, rawMode: boolean): Record<string, string> {
  if (rawMode) return {}
  const raw = trace.metadata?.function_names ?? trace.metadata?.functionNames
  if (!raw || typeof raw !== 'object') return {}
  return Object.fromEntries(
    Object.entries(raw).filter(
      ([k, v]) => typeof k === 'string' && typeof v === 'string' && v.trim().length > 0,
    ),
  )
}

function replaceIdentifiers(code: string, aliases: Record<string, string>): string {
  if (!code || Object.keys(aliases).length === 0) return code
  return code.replace(/\b([A-Za-z_][A-Za-z0-9_]*)\b/g, (ident) => aliases[ident] ?? ident)
}

function stripDirectives(code: string): string {
  const hashIndex = code.indexOf('#')
  if (hashIndex === -1) return code.trim()
  const before = code.slice(0, hashIndex)
  const comment = code.slice(hashIndex).replace(/@.+/g, '')
  return (comment.trim() === '#' ? before : before + comment).trim()
}

function parseMarkdownHeading(step: TraceStep | undefined): { level: number; title: string } | null {
  if (!Array.isArray(step?.renderings)) return null
  for (const rendering of step.renderings) {
    if (rendering.type !== 'markdown' || typeof rendering.data !== 'string') continue
    const match = rendering.data.trim().match(/^(#{1,4})\s+(.+)$/m)
    if (match) {
      const cleanTitle = match[2]
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .trim()
      if (cleanTitle) {
        return { level: match[1].length, title: cleanTitle }
      }
    }
  }
  return null
}

/**
 * Extract the interactive Table of Contents from an EdTrace lesson trace.
 *
 * Supports lessons structured around `def table_of_contents()` (preserving
 * localized function aliases, section headings, sub-headings, call steps, and
 * target entry steps), with a clean fallback to Markdown headings for traces
 * without a `table_of_contents` orchestrator.
 */
export function extractTableOfContents(
  trace: TraceData | null,
  rawMode = false,
  minimumStep = 0,
): TableOfContents {
  if (!trace?.steps?.length) {
    return { header: null, entries: [] }
  }

  const steps = trace.steps
  const navigableSet = new Set(getNavigableSteps(trace, minimumStep))
  const aliases = getFunctionAliases(trace, rawMode)

  // Locate the first visible step inside `table_of_contents`.
  let tocDefStepIndex = -1
  let tocStackDepth = -1
  let tocPath = ''
  let tocDefLine = -1

  for (let i = 0; i < steps.length; i++) {
    const frame = getLastFrame(steps[i])
    if (frame?.function_name === 'table_of_contents' && !isHiddenStep(trace, i)) {
      tocDefStepIndex = i
      tocStackDepth = steps[i].stack!.length
      tocPath = frame.path
      tocDefLine = frame.line_number
      break
    }
  }

  if (tocDefStepIndex >= 0) {
    const headerStep = resolveNavigableStep(trace, tocDefStepIndex, minimumStep) ?? tocDefStepIndex
    const header: TocHeader = {
      path: tocPath,
      lineNumber: tocDefLine,
      stepIndex: headerStep,
      functionName: 'table_of_contents',
      displayName: aliases.table_of_contents ?? 'table_of_contents',
    }

    const sourceLines = (trace.files?.[tocPath] ?? '').split('\n')
    const entries: TocEntry[] = []

    let i = tocDefStepIndex + 1
    while (i < steps.length) {
      const stack = steps[i].stack ?? []
      if (stack.length < tocStackDepth) {
        break
      }
      const topAtTocDepth = stack[tocStackDepth - 1]
      if (
        topAtTocDepth?.path !== tocPath ||
        topAtTocDepth?.function_name !== 'table_of_contents'
      ) {
        break
      }

      // Direct statement inside `table_of_contents()` (not yet inside a callee).
      if (stack.length === tocStackDepth) {
        const callLine = topAtTocDepth.line_number
        // If we already recorded this TOC line (e.g., the post-call return event), advance.
        if (callLine === tocDefLine || entries.some((e) => e.tocLineNumber === callLine)) {
          i++
          continue
        }

        const callStepIndex = navigableSet.has(i)
          ? i
          : (resolveNavigableStep(trace, i, minimumStep) ?? i)

        // Scan until control returns to `table_of_contents` on a subsequent line or exits.
        let endStepIndex = i
        let firstCalleeStep = -1
        let calleeName = ''
        let calleeDefLine = callLine

        let j = i + 1
        while (j < steps.length) {
          const jStack = steps[j].stack ?? []
          if (jStack.length < tocStackDepth) break
          const jTocFrame = jStack[tocStackDepth - 1]
          if (
            jTocFrame?.path !== tocPath ||
            jTocFrame?.function_name !== 'table_of_contents'
          ) {
            break
          }
          if (jStack.length === tocStackDepth && jTocFrame.line_number !== callLine) {
            break
          }
          if (jStack.length > tocStackDepth && firstCalleeStep === -1) {
            const calleeFrame = jStack[tocStackDepth]
            calleeName = calleeFrame?.function_name ?? ''
            calleeDefLine = calleeFrame?.line_number ?? callLine
            if (navigableSet.has(j)) {
              firstCalleeStep = j
            }
          } else if (
            jStack.length > tocStackDepth &&
            firstCalleeStep === -1 &&
            navigableSet.has(j)
          ) {
            firstCalleeStep = j
          }
          endStepIndex = j
          j++
        }

        const rawLine = sourceLines[callLine - 1] ?? topAtTocDepth.code ?? ''
        const cleanedLine = stripDirectives(rawLine)
        if (!calleeName) {
          const callMatch = cleanedLine.match(/(?:=\s*)?([A-Za-z_][A-Za-z0-9_]*)\s*\(/)
          calleeName = callMatch?.[1] ?? cleanedLine
        }

        const sectionStepIndex =
          firstCalleeStep >= 0 ? firstCalleeStep : callStepIndex

        // Collect rendered headings inside [i..endStepIndex].
        let primaryHeading: string | null = null
        const subSections: TocSubSection[] = []
        const seenHeadingLines = new Set<string>()

        for (let k = i; k <= endStepIndex; k++) {
          if (!navigableSet.has(k)) continue
          const heading = parseMarkdownHeading(steps[k])
          if (!heading) continue
          const kFrame = getLastFrame(steps[k])
          const locKey = `${kFrame?.path ?? ''}:${kFrame?.line_number ?? k}`
          if (seenHeadingLines.has(locKey)) continue
          seenHeadingLines.add(locKey)

          if (primaryHeading === null) {
            primaryHeading = heading.title
          } else {
            subSections.push({
              title: heading.title,
              level: heading.level,
              stepIndex: k,
              lineNumber: kFrame?.line_number ?? calleeDefLine,
            })
          }
        }

        entries.push({
          index: entries.length + 1,
          path: tocPath,
          tocLineNumber: callLine,
          callStepIndex,
          sectionStepIndex,
          targetLineNumber: calleeDefLine,
          endStepIndex,
          functionName: calleeName,
          displayName: aliases[calleeName] ?? calleeName,
          codeLabel: replaceIdentifiers(cleanedLine, aliases),
          heading: primaryHeading,
          subSections,
        })

        i = endStepIndex + 1
        continue
      }

      i++
    }

    if (entries.length > 0) {
      return { header, entries }
    }
  }

  // Fallback for traces without `table_of_contents`: build sections from top-level headings.
  const fallbackEntries: TocEntry[] = []
  const seenLocations = new Set<string>()

  for (let i = 0; i < steps.length; i++) {
    if (!navigableSet.has(i)) continue
    const heading = parseMarkdownHeading(steps[i])
    if (!heading || heading.level > 2) continue
    const frame = getLastFrame(steps[i])
    if (!frame) continue
    const locKey = `${frame.path}:${frame.line_number}`
    if (seenLocations.has(locKey)) continue
    seenLocations.add(locKey)

    if (fallbackEntries.length > 0) {
      fallbackEntries[fallbackEntries.length - 1].endStepIndex = i - 1
    }

    const fnName = frame.function_name ?? `section_${fallbackEntries.length + 1}`
    fallbackEntries.push({
      index: fallbackEntries.length + 1,
      path: frame.path,
      tocLineNumber: null,
      callStepIndex: i,
      sectionStepIndex: i,
      targetLineNumber: frame.line_number,
      endStepIndex: steps.length - 1,
      functionName: fnName,
      displayName: aliases[fnName] ?? fnName,
      codeLabel: heading.title,
      heading: heading.title,
      subSections: [],
    })
  }

  return { header: null, entries: fallbackEntries }
}

/**
 * Find the TOC entry containing `stepIndex`, or null when positioned at the
 * `def table_of_contents()` header before the first section begins.
 */
export function findActiveTocEntry(
  toc: TableOfContents,
  stepIndex: number | null,
): TocEntry | null {
  if (stepIndex === null || toc.entries.length === 0) return null
  for (const entry of toc.entries) {
    if (stepIndex >= entry.callStepIndex && stepIndex <= entry.endStepIndex) {
      return entry
    }
  }
  return null
}

/**
 * Determine whether `stepIndex` is the pre-call step of a function invocation
 * (rather than the post-return event on the same caller line).
 */
function isCallEntryStep(steps: TraceStep[], stepIndex: number): boolean {
  const curDepth = steps[stepIndex]?.stack?.length ?? 0
  const nextDepth = steps[stepIndex + 1]?.stack?.length ?? 0
  return curDepth > 0 && nextDepth > curDepth
}

/**
 * Resolve clicking a line number in the viewer to a concrete navigable step.
 *
 * Fixes two issues in the bare line-search fallback:
 * 1. Jumping backward to a function-call line (such as `how_does_ai_learn()` in
 *    `table_of_contents`) previously landed on the *return* step after the call
 *    completed rather than the *entry* step before entering the function.
 * 2. Clicking a line with no match in only one direction fell back to `step: null`,
 *    leaving `currentStepIndex = -1` and breaking relative stepping.
 */
export function resolveLineClickStep(
  trace: TraceData | null,
  path: string,
  lineNumber: number,
  currentStepIndex: number | null,
  minimumStep = 0,
): number | null {
  if (!trace?.steps?.length) return null
  const steps = trace.steps
  const navigable = getNavigableSteps(trace, minimumStep)
  if (navigable.length === 0) return null
  const navigableSet = new Set(navigable)

  // Collect every navigable step whose top-of-stack is on (path, lineNumber).
  const matchingSteps: number[] = []
  for (const stepIdx of navigable) {
    const frame = getLastFrame(steps[stepIdx])
    if (frame?.path === path && frame.line_number === lineNumber) {
      matchingSteps.push(stepIdx)
    }
  }

  if (matchingSteps.length === 0) {
    // Line has no direct step (e.g. blank/comment/multiline continuation):
    // snap to the nearest navigable step at or after this line in the same file.
    for (const stepIdx of navigable) {
      const frame = getLastFrame(steps[stepIdx])
      if (frame?.path === path && frame.line_number >= lineNumber) {
        return stepIdx
      }
    }
    return null
  }

  const curIdx =
    currentStepIndex !== null && navigableSet.has(currentStepIndex)
      ? currentStepIndex
      : navigable[0]
  const curFrame = getLastFrame(steps[curIdx])
  const curLine = curFrame?.path === path ? curFrame.line_number : -1

  // Already standing on this line: cycle to the next occurrence (or wrap to the first).
  if (curLine === lineNumber) {
    const nextOnSameLine = matchingSteps.find((idx) => idx > curIdx)
    return nextOnSameLine ?? matchingSteps[0]
  }

  if (curLine < lineNumber) {
    const forward = matchingSteps.find((idx) => idx > curIdx)
    return forward ?? matchingSteps[0]
  }

  // Jumping backward (`curLine > lineNumber`): find the latest match before `curIdx`,
  // but if that match is the post-call return of a function invocation whose pre-call
  // entry step is also on this line, prefer the pre-call entry step so stepping
  // forward enters the function rather than skipping past it.
  const backwardCandidates = matchingSteps.filter((idx) => idx < curIdx)
  if (backwardCandidates.length === 0) {
    return matchingSteps[0]
  }

  const candidate = backwardCandidates[backwardCandidates.length - 1]
  if (!isCallEntryStep(steps, candidate)) {
    const candidateDepth = steps[candidate]?.stack?.length ?? 0
    for (let k = backwardCandidates.length - 2; k >= 0; k--) {
      const earlier = backwardCandidates[k]
      if ((steps[earlier]?.stack?.length ?? 0) !== candidateDepth) break
      if (isCallEntryStep(steps, earlier)) {
        // Verify no other line at the same stack depth ran between `earlier` and `candidate`.
        let sameCallPair = true
        for (let m = earlier + 1; m < candidate; m++) {
          const mStack = steps[m]?.stack ?? []
          if (mStack.length < candidateDepth) {
            sameCallPair = false
            break
          }
          if (
            mStack.length === candidateDepth &&
            mStack[candidateDepth - 1]?.line_number !== lineNumber
          ) {
            sameCallPair = false
            break
          }
        }
        if (sameCallPair) return earlier
      }
    }
  }

  return candidate
}
