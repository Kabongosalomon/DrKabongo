// GENERATED FILE -- do not edit by hand.
// Source of truth: edtrace-studio (packages/viewer/src/TraceViewer.jsx).
// Synced by scripts/sync_web_bundle.py for course "ai_machine_learning_hello_world" (edtrace-studio git sha e9ede1584d698ad9977cd6c1a5b29ab115429748-dirty, built 2026-08-18T02:29:31+00:00).
// To change viewer behavior, edit edtrace-studio and re-run build_web_bundle.py + sync_web_bundle.py.
// > edtrace-studio vendor header end

import { memo, useState, useEffect, useMemo, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
// No `highlight.js/styles/*.css` import here on purpose: those stylesheets are
// unscoped globals that override the host page's own `.hljs-*` rules on every
// route the viewer loads, and they are single-theme. The equivalent token
// colours live in viewer.css scoped under `.edtrace-viewer`.
import {
  buildRenderingLookup,
  decodeTraceValue,
  findAdjacentNavigableStep,
  findAdjacentUpdateStep,
  findUpdateStepIndices,
  getLast,
  getNavigableStepIndices,
  getTraceLocation,
  languageFromTracePath,
  localizePythonIdentifiers,
  mergeTraceEnvironments,
  normalizeUpdateSnapshot,
  parameterDidUpdate,
  protectDisplayMathForMarkdown,
  resolveNavigableStepIndex,
  resolveTraceMetadata,
} from './utils';
import { marked } from 'marked';
import { PlotRendering } from './PlotRendering';

hljs.registerLanguage('python', python);

const PRESENTATION_LABELS = {
  en: {
    previousUpdate: 'Previous update',
    nextUpdate: 'Next update',
    learningMonitor: 'Learning monitor',
    currentValues: 'Current values',
    language: 'Language',
    openVideo: 'Open video directly',
    videoUnavailable: 'This animation could not be loaded.',
    videoPlayer: 'Lesson animation',
    playVideo: 'Play animation',
    epoch: 'Epoch', step: 'Step', sample: 'Sample', prediction: 'Prediction',
    error: 'Error', loss: 'Loss', parameter: 'Parameter', before: 'Before',
    gradient: 'Gradient', update: 'Update', after: 'After', status: 'Status',
    updated: 'UPDATED', unchanged: 'NO CHANGE',
    environment: 'Environment', close: 'Close',
  },
  fr: {
    previousUpdate: 'Mise à jour précédente',
    nextUpdate: 'Mise à jour suivante',
    learningMonitor: "Moniteur d'apprentissage",
    currentValues: 'Valeurs actuelles',
    language: 'Langue',
    openVideo: 'Ouvrir la vidéo directement',
    videoUnavailable: "Cette animation n'a pas pu être chargée.",
    videoPlayer: 'Animation de la leçon',
    playVideo: "Lire l'animation",
    epoch: 'Époque', step: 'Étape', sample: 'Exemple', prediction: 'Prédiction',
    error: 'Erreur', loss: 'Loss', parameter: 'Paramètre', before: 'Avant',
    gradient: 'Gradient', update: 'Mise à jour', after: 'Après', status: 'État',
    updated: 'MODIFIÉ', unchanged: 'INCHANGÉ',
    environment: 'Environnement', close: 'Fermer',
  },
  ln: {
    previousUpdate: 'Update ya liboso',
    nextUpdate: 'Update oyo elandi',
    learningMonitor: 'Moniteur ya apprentissage',
    currentValues: 'Ba valeurs ya sikoyo',
    language: 'Lokota',
    openVideo: 'Fungola video mbala moko',
    videoUnavailable: 'Animation oyo ekoki kofungwama te.',
    videoPlayer: 'Animation ya liteya',
    playVideo: 'Fungola animation',
    epoch: 'Époque', step: 'Etape', sample: 'Ndakisa', prediction: 'Prédiction',
    error: 'Erreur', loss: 'Loss', parameter: 'Paramètre', before: 'Liboso',
    gradient: 'Gradient', update: 'Update', after: 'Sima', status: 'Etat',
    updated: 'EBONGWANI', unchanged: 'EBONGWANI TE',
    environment: 'Environnement', close: 'Kanga',
  },
  lua: {
    previousUpdate: 'Update wa kumpala',
    nextUpdate: 'Update udi ulonda',
    learningMonitor: 'Moniteur wa dilonga',
    currentValues: 'Ba valeurs a mpindieu',
    language: 'Muakulu',
    openVideo: 'Bunula video imue',
    videoUnavailable: 'Animation ewu kayena ubanga to.',
    videoPlayer: 'Animation wa dilonga',
    playVideo: 'Bunula animation',
    epoch: 'Époque', step: 'Etape', sample: 'Tshilejilu', prediction: 'Prédiction',
    error: 'Erreur', loss: 'Loss', parameter: 'Paramètre', before: 'Kumpala',
    gradient: 'Gradient', update: 'Update', after: 'Panyima', status: 'Etat',
    updated: 'MUBINGISHIBUE', unchanged: 'KENA MUBINGISHIBUE TO',
    environment: 'Environnement', close: 'Jala',
  },
};

const DEFAULT_VIEW_STATE = {
  step: null,
  source: null,
  line: null,
  raw: false,
  animate: false,
  present: false,
  hideEnv: false,
  showNotes: false,
};

function identity(value) {
  return value;
}

// Keep the interaction mode aligned with the width-only CSS breakpoint. A
// narrow desktop window needs the same bottom-sheet environment panel and
// compact controls as a phone; otherwise draggable inline offsets fight the
// responsive CSS and can push the panel outside the viewport.
const COMPACT_MEDIA_QUERY = '(max-width: 760px)';
const SWIPE_MIN_DISTANCE_PX = 50;
const SWIPE_MAX_VERTICAL_DRIFT_PX = 60;

function useIsCompactViewport() {
  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(COMPACT_MEDIA_QUERY).matches
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(COMPACT_MEDIA_QUERY);
    const handleChange = () => setIsCompact(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isCompact;
}

/**
 * Host-agnostic EdTrace lesson viewer.
 *
 * This component owns no routing and no global URL state: every host
 * (the Vite dev shell in trace-viewer/, or a page inside a larger site)
 * supplies the trace to fetch, the current view state, and callbacks for
 * when the learner changes that state. This is what lets the same source
 * be vendored into an unrelated app without dragging in react-router.
 */
function TraceViewer({
  traceUrl,
  viewState,
  onViewStateChange,
  resolveAsset = identity,
  onLanguageChange,
  showIdentity = true,
  showLanguageSelector = true,
  renderOnlyRevealed = false,
  minimumStep = 0,
  className = '',
}) {
  const mergedViewState = { ...DEFAULT_VIEW_STATE, ...viewState };
  const targetSourcePath = mergedViewState.source;
  const targetLineNumber = mergedViewState.line;
  const targetStepIndex = mergedViewState.step;
  const rawMode = !!mergedViewState.raw;
  const animateMode = !!mergedViewState.animate;
  const hideEnv = !!mergedViewState.hideEnv;
  const showNotes = !!mergedViewState.showNotes;
  const presentMode = !!mergedViewState.present;

  /**
   * Whether the learner has moved through the trace themselves yet.
   *
   * Gates the "keep the current line on screen" scroll. Stepping should always
   * scroll, but doing it on first paint hijacks the page: a host that renders
   * the whole lesson as a document (rather than stepping through it) puts its
   * own title, video and controls above the viewer, and auto-scrolling to the
   * first executable line on mount throws all of that off screen before the
   * reader has touched anything. A deep link that names a step is a request to
   * jump, so that still scrolls — see `shouldTrackCurrentLine` below.
   */
  const hasNavigatedRef = useRef(false);

  const emitViewStateChange = (delta) => {
    hasNavigatedRef.current = true;
    onViewStateChange?.(delta);
  };

  const [loadError, setLoadError] = useState(null);
  const [loadedTrace, setLoadedTrace] = useState(null);
  // Ignore data from the previous URL during the render before the fetch
  // effect resets state. This also prevents stale-step canonicalization from
  // using one language/lesson's indices for another trace.
  const trace = loadedTrace?.url === traceUrl ? loadedTrace.data : null;
  const error = loadError?.url === traceUrl ? loadError.message : null;

  const [envPosition, setEnvPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mobileEnvOpen, setMobileEnvOpen] = useState(false);
  const isCompact = useIsCompactViewport();
  const touchStartRef = useRef(null);

  // A trace can contain thousands of execution steps. Build everything that
  // depends only on the fetched trace once, instead of rescanning the complete
  // trace and re-highlighting every source file on each learner step.
  const traceIndex = useMemo(() => {
    if (!trace) {
      return null;
    }
    const metadata = resolveTraceMetadata(trace, traceUrl);
    const highlightedFiles = Object.fromEntries(
      Object.entries(trace.files || {}).map(([path, source]) => {
        const localized = localizePythonIdentifiers(source, metadata.functionNames);
        return [
          path,
          {
            raw: hljs.highlight(source, { language: 'python' }).value.trim().split('\n'),
            localized: hljs.highlight(localized, { language: 'python' }).value.trim().split('\n'),
          },
        ];
      })
    );
    const navigableStepIndices = getNavigableStepIndices(trace, minimumStep);
    return {
      metadata,
      highlightedFiles,
      hiddenLines: Object.fromEntries(
        Object.entries(trace.hidden_line_numbers || {}).map(
          ([path, lines]) => [path, new Set(lines)]
        )
      ),
      lineRevealSteps: buildLineRevealSteps(trace),
      navigableStepIndices,
      navigableStepPositions: new Map(
        navigableStepIndices.map((stepIndex, position) => [stepIndex, position])
      ),
      renderingsByLocation: buildRenderingLookup(trace),
    };
  }, [trace, traceUrl, minimumStep]);

  const resolvedTargetStepIndex = useMemo(() => {
    if (!trace || targetStepIndex === null) {
      return null;
    }
    return resolveNavigableStepIndex(trace, targetStepIndex, minimumStep);
  }, [trace, targetStepIndex, minimumStep]);

  // Direct links can outlive a rebuilt trace or point at hidden setup work.
  // Render the resolved state immediately, then replace the host's stale URL.
  useEffect(() => {
    if (
      targetStepIndex !== null &&
      resolvedTargetStepIndex !== null &&
      targetStepIndex !== resolvedTargetStepIndex
    ) {
      onViewStateChange?.({
        step: resolvedTargetStepIndex,
        source: null,
        line: null,
      });
    }
  }, [targetStepIndex, resolvedTargetStepIndex, onViewStateChange]);

  useEffect(() => {
    if (!traceUrl) {
      return;
    }

    let cancelled = false;
    const fetchData = async () => {
      try {
        setLoadError(null);
        setLoadedTrace(null);
        const response = await fetch(traceUrl);
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (cancelled) {
          return;
        }
        setLoadedTrace({ url: traceUrl, data });
        const metadata = resolveTraceMetadata(data, traceUrl);
        if (typeof document !== 'undefined') {
          document.title = `${metadata.lesson.title} — ${metadata.course.title}`;
        }
      } catch (fetchError) {
        if (!cancelled) {
          console.error(fetchError);
          setLoadError({ url: traceUrl, message: fetchError.message });
        }
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [traceUrl]);

  useEffect(() => {
    if (!trace) {
      return;
    }

    const handleKeyDown = (event) => {
      if (event.altKey || event.ctrlKey) {
        return;
      }

      if (!event.shiftKey && (event.key === 'ArrowRight' || event.key === 'l')) {
        stepForward({ trace, currentStepIndex, minimumStep, emitViewStateChange });
      } else if (!event.shiftKey && (event.key === 'ArrowLeft' || event.key === 'h')) {
        stepBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange });
      } else if ((event.shiftKey && event.key === 'ArrowRight') || event.key === 'j') {
        stepOverForward({ trace, currentStepIndex, minimumStep, emitViewStateChange });
      } else if ((event.shiftKey && event.key === 'ArrowLeft') || event.key === 'k') {
        stepOverBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange });
      } else if (event.shiftKey && event.key === 'l') {
        stepForward({ trace, currentStepIndex, minimumStep, emitViewStateChange, stayOnSameLine: true });
      } else if (event.key === 'u') {
        stepUp({ trace, currentStepIndex, minimumStep, emitViewStateChange });
      } else if (event.key === 'R') {
        toggleFlag({ flag: 'raw', value: rawMode, emitViewStateChange });
      } else if (event.key === 'A') {
        toggleFlag({ flag: 'animate', value: animateMode, emitViewStateChange });
      } else if (event.key === 'E') {
        toggleFlag({ flag: 'hideEnv', value: hideEnv, emitViewStateChange });
      } else if (event.key === 'N') {
        toggleFlag({ flag: 'showNotes', value: showNotes, emitViewStateChange });
      } else if (event.key === ']') {
        gotoAdjacentUpdate({ trace, currentStepIndex, minimumStep, direction: 1, emitViewStateChange });
      } else if (event.key === '[') {
        gotoAdjacentUpdate({ trace, currentStepIndex, minimumStep, direction: -1, emitViewStateChange });
      } else {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // currentStepIndex is computed below (depends on trace + view state), so
    // this effect re-subscribes whenever any of the inputs that feed it change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trace, targetStepIndex, targetLineNumber, rawMode, animateMode, hideEnv, showNotes, minimumStep]);

  const handleMouseDown = (event) => {
    // The env panel becomes a fixed bottom sheet on compact viewports, so
    // free-form dragging (a mouse-only interaction anyway) is disabled there.
    if (presentMode || isCompact) {
      return;
    }
    const panel = event.target.closest('.env-panel');
    if (panel) {
      const rect = panel.getBoundingClientRect();
      setDragOffset({ x: event.clientX - rect.left, y: event.clientY - rect.top });
      setIsDragging(true);
      event.preventDefault();
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging) {
        setEnvPosition({ x: event.clientX - dragOffset.x, y: event.clientY - dragOffset.y });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const wrapperClassName = `edtrace-viewer ${className}`.trim();

  if (!traceUrl) {
    return <div className={wrapperClassName}><TraceUrlMissing /></div>;
  }
  if (error) {
    return <div className={wrapperClassName}>{renderError(error)}</div>;
  }
  if (!trace) {
    return <div className={wrapperClassName}><TraceLoading /></div>;
  }
  if (!Array.isArray(trace.steps) || trace.steps.length === 0) {
    return <div className={wrapperClassName}>{renderError('Trace contains no execution steps.')}</div>;
  }
  if (traceIndex.navigableStepIndices.length === 0) {
    return <div className={wrapperClassName}>{renderError('Trace contains no learner-facing steps.')}</div>;
  }

  const traceMetadata = traceIndex.metadata;
  const presentationLabels =
    PRESENTATION_LABELS[traceMetadata.language.code] ||
    PRESENTATION_LABELS[languageFromTracePath(traceUrl)] ||
    PRESENTATION_LABELS.en;

  let currentStepIndex;
  let currentStackElement;
  let currentStep;
  let currentLineNumber;
  let currentPath;
  if (targetStepIndex === null && targetLineNumber === null) {
    const firstRenderingIndex = trace.steps.findIndex(
      (step) => step.renderings && step.renderings.length > 0
    );
    const preferredStepIndex = presentMode && firstRenderingIndex >= 0 ? firstRenderingIndex : 0;
    currentStepIndex = resolveNavigableStepIndex(trace, preferredStepIndex, minimumStep);
    currentStep = trace.steps[currentStepIndex];
    currentStackElement = getLast(currentStep.stack);
    currentPath = currentStackElement.path;
    currentLineNumber = currentStackElement.line_number;
  } else if (targetStepIndex !== null) {
    currentStepIndex = resolvedTargetStepIndex;
    currentStep = trace.steps[currentStepIndex];
    currentStackElement = getLast(currentStep.stack);
    currentPath = currentStackElement.path;
    currentLineNumber = currentStackElement.line_number;
  } else {
    currentPath = targetSourcePath;
    currentLineNumber = targetLineNumber;
    currentStepIndex = trace.steps.findIndex((step, stepIndex) => {
      if (!traceIndex.navigableStepPositions.has(stepIndex)) {
        return false;
      }
      const item = getLast(step.stack);
      return item?.path === targetSourcePath && item.line_number === targetLineNumber;
    });
    if (currentStepIndex !== -1) {
      currentStep = trace.steps[currentStepIndex];
      currentStackElement = getLast(currentStep.stack);
    }
  }

  const handleTouchEnd = (event) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) {
      return;
    }
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL_DRIFT_PX || Math.abs(deltaX) < SWIPE_MIN_DISTANCE_PX) {
      return;
    }
    if (deltaX < 0) {
      stepForward({ trace, currentStepIndex, minimumStep, emitViewStateChange });
    } else {
      stepBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange });
    }
  };

  const renderedEnv = Number.isSafeInteger(currentStepIndex) && currentStepIndex >= 0 && !hideEnv
    ? renderEnv({
        trace,
        currentStepIndex,
        presentMode,
        labels: presentationLabels,
        inspectMath: traceMetadata.inspectMath,
      })
    : null;
  const renderedLines = renderLines({
    trace,
    currentPath,
    currentLineNumber,
    currentStepIndex,
    rawMode,
    hideEnv,
    showNotes,
    animateMode,
    emitViewStateChange,
    presentMode,
    labels: presentationLabels,
    metadata: traceMetadata,
    traceUrl,
    resolveAsset,
    onLanguageChange,
    showIdentity,
    showLanguageSelector,
    renderOnlyRevealed,
    minimumStep,
    traceIndex,
    mobileEnvOpen,
    setMobileEnvOpen,
    hasEnv: !!renderedEnv,
    // Follow the current line once the learner is driving, or immediately when
    // the host handed us a specific place to be.
    shouldTrackCurrentLine:
      hasNavigatedRef.current ||
      targetStepIndex !== null ||
      targetLineNumber !== null,
  });

  return (
    <div className={wrapperClassName}>
      <div
        className={`trace-viewer-container${presentMode ? ' present-mode' : ''}${renderedEnv ? ' has-env' : ' no-env'}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="lines-panel">{renderedLines}</div>
        {renderedEnv && (
          <EnvPanel
            presentMode={presentMode}
            isCompact={isCompact}
            envPosition={envPosition}
            isDragging={isDragging}
            mobileEnvOpen={mobileEnvOpen}
            setMobileEnvOpen={setMobileEnvOpen}
            labels={presentationLabels}
          >
            {renderedEnv}
          </EnvPanel>
        )}
      </div>
      <MobileControlBar
        trace={trace}
        currentStepIndex={currentStepIndex}
        presentMode={presentMode}
        hasEnv={!!renderedEnv}
        mobileEnvOpen={mobileEnvOpen}
        setMobileEnvOpen={setMobileEnvOpen}
        emitViewStateChange={emitViewStateChange}
        minimumStep={minimumStep}
        labels={presentationLabels}
      />
    </div>
  );
}

function EnvPanel({ presentMode, isCompact, envPosition, isDragging, mobileEnvOpen, setMobileEnvOpen, labels, children }) {
  // Free-form drag positioning only makes sense on a desktop-sized surface;
  // on compact viewports the panel is a fixed bottom sheet instead, and an
  // inline left/top would otherwise fight that CSS.
  const dragStyle = (presentMode || isCompact) ? undefined : {
    left: envPosition.x,
    top: envPosition.y,
    cursor: isDragging ? 'grabbing' : 'grab',
  };
  return (
    <>
      <div
        className={`env-panel${mobileEnvOpen ? ' mobile-open' : ''}`}
        style={dragStyle}
      >
        <div className="env-panel-mobile-header">
          <span>{labels.environment}</span>
          <button
            type="button"
            className="env-panel-close"
            onClick={() => setMobileEnvOpen(false)}
            aria-label={labels.close}
          >
            ✕
          </button>
        </div>
        {children}
      </div>
      {mobileEnvOpen && (
        <div
          className="env-panel-scrim"
          onClick={() => setMobileEnvOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

function MobileControlBar({
  trace,
  currentStepIndex,
  presentMode,
  hasEnv,
  mobileEnvOpen,
  setMobileEnvOpen,
  emitViewStateChange,
  minimumStep,
  labels,
}) {
  const navigableStepIndices = getNavigableStepIndices(trace, minimumStep);
  const visibleStepIndex = navigableStepIndices.indexOf(currentStepIndex);
  return (
    <div className="mobile-control-bar" role="toolbar" aria-label="Lesson navigation">
      <button
        type="button"
        className="mobile-control-button"
        onClick={() => stepBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange })}
        disabled={findAdjacentNavigableStep(trace, currentStepIndex, -1, minimumStep) === null}
        aria-label={labels.previousUpdate}
      >
        ‹
      </button>
      <span className="mobile-step-counter">
        {visibleStepIndex >= 0 ? visibleStepIndex + 1 : 0} / {navigableStepIndices.length}
      </span>
      <button
        type="button"
        className="mobile-control-button"
        onClick={() => stepForward({ trace, currentStepIndex, minimumStep, emitViewStateChange })}
        disabled={findAdjacentNavigableStep(trace, currentStepIndex, 1, minimumStep) === null}
        aria-label={labels.nextUpdate}
      >
        ›
      </button>
      {hasEnv && (
        <button
          type="button"
          className="mobile-control-button mobile-env-toggle"
          onClick={() => setMobileEnvOpen(!mobileEnvOpen)}
          aria-label={labels.environment}
          aria-pressed={mobileEnvOpen}
        >
          🅴
        </button>
      )}
    </div>
  );
}

function stepForward({ trace, currentStepIndex, minimumStep, emitViewStateChange }) {
  const newStepIndex = findAdjacentNavigableStep(trace, currentStepIndex, 1, minimumStep);
  if (newStepIndex !== null) {
    emitViewStateChange({ step: newStepIndex, source: null, line: null });
  }
}

function stepBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange }) {
  const newStepIndex = findAdjacentNavigableStep(trace, currentStepIndex, -1, minimumStep);
  if (newStepIndex !== null) {
    emitViewStateChange({ step: newStepIndex, source: null, line: null });
  }
}

function stepOverForward({ trace, currentStepIndex, minimumStep, emitViewStateChange }) {
  if (!trace.steps[currentStepIndex]) {
    return;
  }
  const newStepIndex = getStepOverIndex({ trace, currentStepIndex, minimumStep, direction: 1 });
  if (newStepIndex < trace.steps.length) {
    emitViewStateChange({ step: newStepIndex, source: null, line: null });
  }
}

function stepOverBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange }) {
  if (!trace.steps[currentStepIndex]) {
    return;
  }
  const newStepIndex = getStepOverIndex({ trace, currentStepIndex, minimumStep, direction: -1 });
  if (newStepIndex >= 0) {
    emitViewStateChange({ step: newStepIndex, source: null, line: null });
  }
}

function stepUp({ trace, currentStepIndex, minimumStep, emitViewStateChange }) {
  if (!trace.steps[currentStepIndex]) {
    return;
  }
  const newStepIndex = getStepUpIndex({ trace, currentStepIndex, minimumStep, direction: 1 });
  if (newStepIndex < trace.steps.length) {
    emitViewStateChange({ step: newStepIndex, source: null, line: null });
  }
}

function gotoAdjacentUpdate({ trace, currentStepIndex, minimumStep, direction, emitViewStateChange }) {
  const navigableStepIndices = new Set(getNavigableStepIndices(trace, minimumStep));
  const indices = findUpdateStepIndices(trace)
    .filter((stepIndex) => navigableStepIndices.has(stepIndex));
  const target = findAdjacentUpdateStep(indices, currentStepIndex, direction);
  if (target !== null) {
    emitViewStateChange({ step: target, source: null, line: null });
  }
}

function getStepOverIndex({ trace, currentStepIndex, minimumStep, direction, stayOnSameLine }) {
  const currentStep = trace.steps[currentStepIndex];
  const navigableStepIndices = new Set(getNavigableStepIndices(trace, minimumStep));
  let stepIndex = currentStepIndex + direction;
  while (stepIndex >= 0 && stepIndex < trace.steps.length) {
    if (navigableStepIndices.has(stepIndex) &&
        inSameFunction(trace.steps[stepIndex].stack, currentStep.stack) &&
        (!stayOnSameLine || getLast(trace.steps[stepIndex].stack).line_number !== getLast(currentStep.stack).line_number)) {
      return stepIndex;
    }
    if (navigableStepIndices.has(stepIndex) &&
        isStrictAncestorOf(trace.steps[stepIndex].stack, currentStep.stack)) {
      return stepIndex;
    }
    stepIndex += direction;
  }
  return stepIndex;
}

function getStepUpIndex({ trace, currentStepIndex, minimumStep, direction }) {
  const currentStep = trace.steps[currentStepIndex];
  const navigableStepIndices = new Set(getNavigableStepIndices(trace, minimumStep));
  let stepIndex = currentStepIndex + direction;
  while (stepIndex >= 0 && stepIndex < trace.steps.length) {
    if (navigableStepIndices.has(stepIndex) &&
        !inSameFunction(trace.steps[stepIndex].stack, currentStep.stack) &&
        isStrictAncestorOf(trace.steps[stepIndex].stack, currentStep.stack)) {
      return stepIndex;
    }
    stepIndex += direction;
  }
  return stepIndex;
}

/** Earliest execution step that reveals each source line in animate mode. */
function buildLineRevealSteps(trace) {
  const revealSteps = {};
  const pathToLines = {};

  for (let stepIndex = 0; stepIndex < (trace.steps || []).length; stepIndex++) {
    const stackElement = getLast(trace.steps[stepIndex].stack || []);
    if (!stackElement?.path || stackElement.line_number === undefined) {
      continue;
    }
    const path = stackElement.path;
    let lineNumber = stackElement.line_number;

    while (lineNumber > 0) {
      const location = getTraceLocation(path, lineNumber);
      if (revealSteps[location] !== undefined) {
        break;
      }
      revealSteps[location] = stepIndex;

      let lines = pathToLines[path];
      if (!lines) {
        lines = (trace.files?.[path] || '').split('\n');
        pathToLines[path] = lines;
      }
      const line = lines[lineNumber - 1] || '';
      if (/^\w/.test(line)) {
        break;
      }
      lineNumber--;
    }
  }
  return revealSteps;
}

function toggleFlag({ flag, value, emitViewStateChange }) {
  emitViewStateChange({ [flag]: value ? null : true });
}

/**
 * Render the environment variables associated with a step.
 */
function mergedEnvironment({ trace, currentStepIndex }) {
  const currentStep = trace.steps[currentStepIndex];
  const steps = [];
  for (let stepIndex = currentStepIndex; stepIndex >= 0; stepIndex--) {
    const step = trace.steps[stepIndex];
    if (inSameFunction(step.stack, currentStep.stack)) {
      steps.push(step);
    } else if (isStrictAncestorOf(step.stack, currentStep.stack)) {
      break;
    }
  }
  steps.reverse();
  return mergeTraceEnvironments(trace, steps);
}

function EnvironmentTable({ env, title, inspectMath }) {
  const entries = Object.entries(env).filter(
    ([key, value]) => key !== 'update_snapshot' && value !== null
  );
  if (entries.length === 0) {
    return null;
  }
  return (
    <div className="current-values-panel">
      {title && <div className="current-values-title">{title}</div>}
      <table className="env"><tbody>{entries.map(([key, value]) => (
        <tr key={key}>
          <td className="code-container key">
            {inspectMath?.[key] ?
              <MarkdownRenderer content={`$${inspectMath[key]}$`} /> :
              key}
          </td>
          <td className="code-container">=</td>
          <td className="code-container" title={renderTitle(value)}>{renderValue(value)}</td>
        </tr>
      ))}</tbody></table>
    </div>
  );
}

function formatMonitorNumber(value, decimals = 6) {
  if (typeof value !== 'number') {
    return String(value ?? '—');
  }
  const normalized = Object.is(value, -0) ? 0 : value;
  return `${normalized >= 0 ? '+' : ''}${normalized.toFixed(decimals)}`;
}

function UpdateMonitor({ encodedSnapshot, labels }) {
  const snapshot = normalizeUpdateSnapshot(decodeTraceValue(encodedSnapshot));
  if (!snapshot) {
    return null;
  }
  const rows = ['w1', 'w2', 'b'].map((name) => {
    const parameter = snapshot.parameters[name];
    const updated = parameterDidUpdate(parameter);
    return (
      <tr key={name} className={updated ? 'parameter-updated' : 'parameter-unchanged'}>
        <th scope="row">{name}</th>
        <td>{formatMonitorNumber(parameter.before)}</td>
        <td>{formatMonitorNumber(parameter.gradient)}</td>
        <td>{formatMonitorNumber(parameter.update)}</td>
        <td>{formatMonitorNumber(parameter.after)}</td>
        <td><span className="parameter-status">{updated ? labels.updated : labels.unchanged}</span></td>
      </tr>
    );
  });
  return (
    <section className="update-monitor" aria-label={labels.learningMonitor}>
      <div className="update-monitor-heading">
        <div>
          <span>{labels.epoch} {snapshot.epoch}</span>
          <strong>{labels.step} {snapshot.step}</strong>
        </div>
        <div>{labels.sample}: ({snapshot.sample.x1}, {snapshot.sample.x2}) → {snapshot.sample.y}</div>
      </div>
      <div className="forward-summary">
        <span>{labels.prediction} <strong>{formatMonitorNumber(snapshot.forward.prediction)}</strong></span>
        <span>{labels.error} <strong>{formatMonitorNumber(snapshot.forward.error)}</strong></span>
        <span>{labels.loss} <strong>{formatMonitorNumber(snapshot.forward.loss, 8)}</strong></span>
      </div>
      <table className="parameter-monitor-table">
        <thead><tr>
          <th>{labels.parameter}</th>
          <th>{labels.before}</th>
          <th>{labels.gradient}</th>
          <th>{labels.update}</th>
          <th>{labels.after}</th>
          <th>{labels.status}</th>
        </tr></thead>
        <tbody>{rows}</tbody>
      </table>
    </section>
  );
}

function renderEnv({ trace, currentStepIndex, presentMode, labels, inspectMath }) {
  const currentStep = trace.steps[currentStepIndex];
  const mergedEnv = mergedEnvironment({ trace, currentStepIndex });
  const currentEnv = mergeTraceEnvironments(trace, [currentStep]);
  const snapshot = mergedEnv.update_snapshot;
  const valuesToShow = presentMode ? currentEnv : mergedEnv;
  if (!snapshot && Object.keys(valuesToShow).length === 0) {
    return null;
  }
  return (
    <div className="env-stack">
      {snapshot && <UpdateMonitor encodedSnapshot={snapshot} labels={labels} />}
      <EnvironmentTable
        env={valuesToShow}
        title={presentMode ? labels.currentValues : null}
        inspectMath={inspectMath}
      />
    </div>
  );
}

/**
 * Return whether stack1 and stack2 refer to being in the same function (all but
 * the last element must agree).
 */
function inSameFunction(stack1, stack2) {
  if (stack1.length !== stack2.length) {
    return false;
  }
  for (let i = 0; i < stack1.length - 1; i++) {
    const a = stack1[i];
    const b = stack2[i];
    if (a.path !== b.path || a.line_number !== b.line_number) {
      return false;
    }
  }
  return true;
}

/**
 * Return whether stack1 is an ancestor of stack2.
 */
function isStrictAncestorOf(stack1, stack2) {
  return stack1.length < stack2.length;
}

function isInteger(value) {
  return typeof value === 'number' && value % 1 === 0;
}

function renderValue(value) {
  if (!value.type) {
    return 'NO_TYPE:' + JSON.stringify(value);
  }
  if (value.type === 'NoneType') {
    return 'None';
  }
  if (value.type === 'bool') {
    return '' + value.contents;
  }
  if (['int', 'float'].includes(value.type)) {
    return renderNumber(value.contents);
  }
  if (['torch.Tensor', 'torch.nn.parameter.Parameter', 'numpy.ndarray'].includes(value.type)) {
    return renderTensor(value.shape, value.contents);
  }
  if (value.type.startsWith('sympy.core.')) {
    return value.contents;
  }

  if (Array.isArray(value.contents)) {
    return renderList(value.contents);
  }
  if (typeof value.contents === 'object') {
    return renderDict(value.contents);
  }

  return JSON.stringify(value.contents, null, 2);
}

function renderNumber(x) {
  if (typeof x === 'string') {
    return x;
  }
  if (Math.abs(x) > 1e12) {
    return x.toExponential(3);
  } if (Math.abs(x) > 1e6) {
    return x.toLocaleString();
  }
  if (isInteger(x * 1000)) {
    return x.toString();
  }
  return x.toFixed(4);
}

function renderTensor(shape, contents) {
  if (shape.length === 0) {
    return renderNumber(contents);
  }

  if (shape.length === 1) {
    return <table className="matrix"><tbody><tr>{
      contents.map((v, i) => <td key={i}>{renderNumber(v)}</td>)
    }</tr></tbody></table>;
  }

  if (shape.length === 2) {
    return <table className="matrix"><tbody>{
      contents.map((row) => <tr key={JSON.stringify(row)}>{
        row.map((v, colIndex) => <td key={colIndex}>{renderNumber(v)}</td>)
      }</tr>)
    }</tbody></table>;
  }

  if (shape.length === 3) {
    const allRows = [];
    for (const slice of contents) {
      if (allRows.length > 0) {
        allRows.push(<tr key="separator"><td colSpan={slice[0].length}>&nbsp;</td></tr>);
      }
      slice.forEach((row) => {
        allRows.push(<tr key={allRows.length}>{
          row.map((v, colIndex) => <td key={colIndex}>{renderNumber(v)}</td>)
        }</tr>);
      });
    }
    return <table className="matrix"><tbody>{allRows}</tbody></table>;
  }

  return JSON.stringify(contents, null, 2);
}

function renderList(contents) {
  if (contents.length === 0) {
    return '[]';
  }
  return <table className="matrix"><tbody><tr>{
    contents.map((v, i) => <td key={i}>{renderValue(v)}</td>)
  }</tr></tbody></table>;
}

function renderDict(contents) {
  if (Object.keys(contents).length === 0) {
    return '{}';
  }
  return <table className="dict"><tbody>{
    Object.entries(contents).map(([key, value], i) => <tr key={i}>
      <td key={key}>{key}</td>
      <td>:</td>
      <td key={i}>{renderValue(value)}</td>
    </tr>)
  }</tbody></table>;
}

function renderTitle(value) {
  let title = value.type;
  if (value.dtype) {
    title += ` ${value.dtype}`;
  }
  if (value.shape) {
    title += ` [${value.shape.join(' x ')}]`;
  }
  return title;
}

function makeProgressBar(currentStepIndex, totalSteps) {
  const progressPercentage = currentStepIndex !== null && currentStepIndex >= 0 ?
    (totalSteps <= 1 ? 100 : (currentStepIndex / (totalSteps - 1)) * 100) : 0;
  const stepProgress = currentStepIndex !== null && currentStepIndex >= 0 ?
    `${currentStepIndex + 1} / ${totalSteps}` : null;
  return (
    <div title={stepProgress} style={{
      width: '100%',
      height: '4px',
      backgroundColor: 'lightgray',
      marginTop: '4px',
    }}>
      <div style={{
        width: `${progressPercentage}%`,
        height: '100%',
        backgroundColor: '#4CAF50',
        transition: 'width 0.2s ease-out'
      }} />
    </div>
  );
}

function renderLines({
  trace,
  currentPath,
  currentLineNumber,
  currentStepIndex,
  rawMode,
  hideEnv,
  showNotes,
  animateMode,
  emitViewStateChange,
  presentMode,
  labels,
  metadata,
  traceUrl,
  resolveAsset,
  onLanguageChange,
  showIdentity,
  showLanguageSelector,
  renderOnlyRevealed,
  minimumStep,
  traceIndex,
  shouldTrackCurrentLine = true,
}) {
  const lines = rawMode ?
    traceIndex.highlightedFiles[currentPath]?.raw || [] :
    traceIndex.highlightedFiles[currentPath]?.localized || [];

  const renderedLines = lines.map((line, index) => {
    const lineNumber = index + 1;

    if (traceIndex.hiddenLines[currentPath]?.has(lineNumber)) {
      return null;
    }

    const location = getTraceLocation(currentPath, lineNumber);
    const revealStep = traceIndex.lineRevealSteps[location];
    const isCloaked = currentStepIndex !== null && animateMode &&
      (revealStep === undefined || revealStep > currentStepIndex);
    if (isCloaked && renderOnlyRevealed) {
      return null;
    }

    const fullRenderings =
      traceIndex.renderingsByLocation[location] || [];
    const renderings = fullRenderings.filter((rendering) => rendering.type !== 'note');
    const noteRenderings = fullRenderings.filter((rendering) => rendering.type === 'note');

    const renderedItems = [];
    if (!rawMode && renderings && renderings.length > 0) {
      const indent = line.match(/^(\s*)/)[0];
      renderedItems.push(<span key="indent" className="code-container">{indent}</span>);

      const renderedRenderings = renderings.map((rendering, renderingIndex) => {
        const renderingKey = `${rendering.type}-${renderingIndex}-${
          typeof rendering.data === 'string' ? rendering.data : ''
        }`;
        return <span key={renderingKey}>
          {renderRendering(rendering, emitViewStateChange, labels, resolveAsset)}
        </span>;
      });
      renderedItems.push(<div key="renderings" className="renderings">{renderedRenderings}</div>);
    } else {
      let newLine = rawMode ? line : removeDirectives(line);
      renderedItems.push(<span key="code" className="code-container" dangerouslySetInnerHTML={{ __html: newLine }} />);
    }

    const lineNumberSpan = (
      <span
        key={0}
        className="line-number code-container"
        onClick={() => gotoLine({
          trace,
          currentPath,
          currentLineNumber,
          currentStepIndex,
          lineNumber,
          minimumStep,
          emitViewStateChange,
        })}
      >
        {lineNumber}
      </span>
    );

    if (showNotes && noteRenderings.length > 0) {
      for (const rendering of noteRenderings) {
        renderedItems.push(<div key={index} className="notes">{rendering.data}</div>);
      }
    }

    const renderedItemsSpan = (
      <span>{renderedItems}</span>
    );

    const lineClass = ['line'];
    const isCurrentLine = lineNumber === currentLineNumber;
    if (isCurrentLine) {
      lineClass.push('current-line');
    }
    if (isCloaked) {
      lineClass.push('cloaked');
    }

    return (
      <div
        key={index}
        className={lineClass.join(' ')}
        ref={isCurrentLine && shouldTrackCurrentLine ? scrollIntoViewIfNeeded : null}
      >
        {lineNumberSpan}
        {renderedItemsSpan}
      </div>
    );
  });

  const animateIcon = animateMode ? '⛅️' : '☀️';
  const rawIcon = rawMode ? '⚙️' : '⚪️';
  const envIcon = hideEnv ? '⬛' : '🅴';
  const notesIcon = showNotes ? '🛈' : '⬛';
  const navigableStepIndices = traceIndex.navigableStepIndices;
  const visibleStepIndex = traceIndex.navigableStepPositions.get(currentStepIndex) ?? -1;
  const buttons = (
    <span className="icon-buttons">
      {presentMode && <button className="update-navigation" title={`${labels.previousUpdate} [`} onClick={() => gotoAdjacentUpdate({ trace, currentStepIndex, minimumStep, direction: -1, emitViewStateChange })}>← {labels.previousUpdate}</button>}
      {presentMode && <button className="update-navigation" title={`${labels.nextUpdate} ]`} onClick={() => gotoAdjacentUpdate({ trace, currentStepIndex, minimumStep, direction: 1, emitViewStateChange })}>{labels.nextUpdate} →</button>}
      <button title="Toggle animation (whether to gradually show content when stepping through) [shortcut: A]" onClick={() => toggleFlag({ flag: 'animate', value: animateMode, emitViewStateChange })}>{animateIcon}</button>
      <button title="Toggle raw mode (whether to show the underlying code) [shortcut: R]" onClick={() => toggleFlag({ flag: 'raw', value: rawMode, emitViewStateChange })}>{rawIcon}</button>
      <button title="Toggle environment display (whether to show variable values) [shortcut: E]" onClick={() => toggleFlag({ flag: 'hideEnv', value: hideEnv, emitViewStateChange })}>{envIcon}</button>
      <button title="Toggle notes display (whether to show notes) [shortcut: N]" onClick={() => toggleFlag({ flag: 'showNotes', value: showNotes, emitViewStateChange })}>{notesIcon}</button>
      <button className="nav-icon-button" title="Step backward (into functions if necessary) [shortcut: h or left]" onClick={() => stepBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange })}>⬅️</button>
      <button className="nav-icon-button" title="Step forward (into functions if necessary) [shortcut: l or right]" onClick={() => stepForward({ trace, currentStepIndex, minimumStep, emitViewStateChange })}>➡️</button>
      <button className="nav-icon-button" title="Step over backward (stay at this level of the stack) [shortcut: k or shift-left]" onClick={() => stepOverBackward({ trace, currentStepIndex, minimumStep, emitViewStateChange })}>↖️</button>
      <button className="nav-icon-button" title="Step over forward (stay at this level of the stack) [shortcut: j or shift-right]" onClick={() => stepOverForward({ trace, currentStepIndex, minimumStep, emitViewStateChange })}>↗️</button>
      <button className="nav-icon-button" title="Step forward until we're out of this function [shortcut: u]" onClick={() => stepUp({ trace, currentStepIndex, minimumStep, emitViewStateChange })}>⤴️</button>
    </span>
  );

  const switchLanguage = (event) => {
    const nextLanguage = event.target.value;
    if (nextLanguage !== metadata.language.code) {
      onLanguageChange?.(nextLanguage);
    }
  };

  const header = (
    <div className="header">
      <div className="header-title">
        {showIdentity && (
          <div className="trace-identity">
            <div className="trace-breadcrumb">
              <span className="trace-course-title">{metadata.course.title}</span>
              <span className="trace-title-separator" aria-hidden="true">/</span>
              <strong className="trace-lesson-title">{metadata.lesson.title}</strong>
            </div>
            {!presentMode && <span className="trace-source-path">{currentPath}</span>}
          </div>
        )}
        <div className="header-controls">
          {showLanguageSelector && (
            <label className="language-selector">
              <span>{labels.language}</span>
              <select
                aria-label={labels.language}
                value={metadata.language.code}
                onChange={switchLanguage}
                disabled={metadata.supportedLanguages.length < 2 || !onLanguageChange}
              >
                {metadata.supportedLanguages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          {buttons}
        </div>
      </div>
      {makeProgressBar(visibleStepIndex, navigableStepIndices.length)}
    </div>
  );

  return (
    <div>
      {header}
      <div>
        {renderedLines}
      </div>
    </div>
  );
}

function removeDirectives(line) {
  const i = line.indexOf('#');
  if (i === -1) {
    return line;
  }
  const code = line.slice(0, i);
  const comment = line.slice(i).replace(/@.+/g, '');
  if (comment.trim() === '#') {
    return code;
  }
  return code + comment;
}

function gotoLine({
  trace,
  currentPath,
  currentLineNumber,
  currentStepIndex,
  lineNumber,
  minimumStep,
  emitViewStateChange,
}) {
  const navigableStepIndices = new Set(getNavigableStepIndices(trace, minimumStep));
  let stepIndex = Number.isSafeInteger(currentStepIndex) ? currentStepIndex : -1;
  if (currentLineNumber <= lineNumber) {
    stepIndex++;
    while (stepIndex < trace.steps.length) {
      const location = getLast(trace.steps[stepIndex].stack);
      if (
        navigableStepIndices.has(stepIndex) &&
        location?.path === currentPath &&
        location.line_number === lineNumber
      ) {
        emitViewStateChange({ source: null, line: null, step: stepIndex });
        return;
      }
      stepIndex++;
    }
  } else if (currentLineNumber > lineNumber) {
    while (stepIndex >= 0) {
      const location = getLast(trace.steps[stepIndex].stack);
      if (
        navigableStepIndices.has(stepIndex) &&
        location?.path === currentPath &&
        location.line_number === lineNumber
      ) {
        emitViewStateChange({ source: null, line: null, step: stepIndex });
        return;
      }
      stepIndex--;
    }
  }
  emitViewStateChange({ source: currentPath, line: lineNumber, step: null });
}

function scrollIntoViewIfNeeded(elem) {
  if (!elem) {
    return;
  }
  const rect = elem.getBoundingClientRect();
  const padding = 50;
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const isInView = rect.top >= padding && rect.bottom <= windowHeight - padding;

  const scrollDistance = Math.min(Math.abs(rect.top - 0), Math.abs(rect.bottom - windowHeight));
  const behavior = scrollDistance <= 100 ? 'smooth' : 'instant';

  if (!isInView) {
    elem.scrollIntoView({ behavior, block: 'center' });
  }
}

let mathJaxLoadPromise = null;

function ensureMathJax() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve(null);
  }
  if (window.MathJax?.typesetPromise || window.MathJax?.typeset) {
    return Promise.resolve(window.MathJax);
  }
  if (window.MathJax?.startup?.promise) {
    return window.MathJax.startup.promise.then(() => window.MathJax);
  }
  if (mathJaxLoadPromise) {
    return mathJaxLoadPromise;
  }

  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
    },
    svg: { fontCache: 'global' },
  };
  mathJaxLoadPromise = new Promise((resolve, reject) => {
    const existing = document.getElementById('MathJax-script');
    const script = existing || document.createElement('script');
    script.addEventListener('load', () => resolve(window.MathJax), { once: true });
    script.addEventListener(
      'error',
      () => reject(new Error('MathJax failed to load')),
      { once: true }
    );
    if (!existing) {
      script.id = 'MathJax-script';
      script.async = true;
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
      document.head.appendChild(script);
    }
  });
  return mathJaxLoadPromise;
}

const MarkdownRenderer = memo(function MarkdownRenderer({ content, style }) {
  const containerRef = useRef(null);

  const trailingWhitespace = content.endsWith(' ') ? '&nbsp;' : '';
  let renderedContent = marked(protectDisplayMathForMarkdown(content));
  renderedContent = renderedContent.replace(/\n$/, '');
  renderedContent = renderedContent.replace(/^<p>/g, '').replace(/<\/p>$/g, '');
  renderedContent += trailingWhitespace;

  useEffect(() => {
    if (!/(\$|\\\(|\\\[)/.test(content)) {
      return undefined;
    }
    let cancelled = false;

    const typeset = async () => {
      try {
        const mathJax = await ensureMathJax();
        if (cancelled || !containerRef.current || !mathJax) {
          return;
        }
        if (mathJax.startup?.promise) {
          await mathJax.startup.promise;
        }
        if (cancelled || !containerRef.current) {
          return;
        }
        if (typeof mathJax.typeset === 'function') {
          mathJax.typeset([containerRef.current]);
        } else if (typeof mathJax.typesetPromise === 'function') {
          await mathJax.typesetPromise([containerRef.current]);
        }
      } catch (typesetError) {
        if (!cancelled) {
          console.error('MathJax typesetting failed', typesetError);
        }
      }
    };

    void typeset();

    return () => {
      cancelled = true;
    };
  }, [content, renderedContent]);

  return <span ref={containerRef} className="markdown" style={style} dangerouslySetInnerHTML={{ __html: renderedContent }} />;
});

function ExternalLink({ link, style, anchorText }) {
  anchorText = anchorText || getReferenceAnchorText(link);
  if (!link.title) {
    return <a href={link.url} target="_blank" rel="noreferrer" style={style}>{anchorText}</a>;
  }

  const notes = link.notes && link.notes.split(/\n/).map((line, index) => <div key={index}>{line}</div>);

  const org = link.organization && `[${link.organization}] `;

  return (
    <div className="link-container" style={{ display: 'inline-block', position: 'relative' }}>
      <a
        href={link.url}
        target="_blank"
        rel="noreferrer"
        style={style}
        className="external-link"
      >
        {anchorText}
      </a>
      <div className="link-hover-panel">
        {link.title && <div className="link-title">{link.title}</div>}
        {link.authors && <div className="link-authors">{org}{renderAuthors(link.authors)}</div>}
        {link.date && <div className="link-date">{renderDate(link.date)}</div>}
        {link.description && <div className="link-description">{link.description}</div>}
        {link.notes && <div className="link-notes">{notes}</div>}
      </div>
    </div>
  );
}

function getReferenceAnchorText(reference) {
  if (reference.authors) {
    const firstAuthor = reference.authors[0];
    const lastName = firstAuthor.split(' ').includes('Team') ? firstAuthor : getLast(firstAuthor.split(' '));
    const plus = reference.authors.length > 1 ? '+' : '';
    const year = reference.date && reference.date.split('-')[0];
    return `[${lastName}${plus} ${year}]`;
  }
  return reference.title || reference.url;
}

function renderDate(date) {
  return date.split('T')[0];
}

function renderAuthors(authors) {
  const maxAuthors = 10;
  if (authors.length > maxAuthors) {
    const numOmitted = authors.length - maxAuthors;
    return authors.slice(0, maxAuthors / 2).join(', ') + ` ... (${numOmitted} more) ... ` + authors.slice(-maxAuthors / 2).join(', ');
  } else {
    return authors.join(', ');
  }
}

const YOUTUBE_SENTINEL_PREFIX = 'youtube:';

// Traces pin media to fixed pixel widths (e.g. video width: 840). On wide
// desktop screens we want media to fill the reading column instead, so the
// components below override that pinned width with 100%; the column itself
// (.renderings in viewer.css) caps the final size.
function YouTubeRendering({ videoId, caption, labels, style }) {
  const [playing, setPlaying] = useState(false);
  const mediaStyle = { ...style, width: '100%', maxWidth: '100%' };

  return (
    <figure className="video-rendering youtube-rendering" style={mediaStyle}>
      <div className="youtube-frame">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1`}
            title={caption || labels.videoPlayer}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            type="button"
            className="youtube-poster"
            onClick={() => setPlaying(true)}
            aria-label={labels.playVideo}
          >
            <img
              className="youtube-poster-image"
              src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              decoding="async"
            />
            <span className="youtube-play-icon" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption>
          <span className="video-caption">{caption}</span>
        </figcaption>
      )}
    </figure>
  );
}

function VideoRendering({ rendering, labels, resolveAsset }) {
  if (typeof rendering.data === 'string' && rendering.data.startsWith(YOUTUBE_SENTINEL_PREFIX)) {
    return (
      <YouTubeRendering
        videoId={rendering.data.slice(YOUTUBE_SENTINEL_PREFIX.length)}
        caption={rendering.caption}
        labels={labels}
        style={rendering.style}
      />
    );
  }

  const videoData =
    rendering.data && typeof rendering.data === 'object' ? rendering.data : {};
  const rawSrc =
    (typeof rendering.data === 'string' ? rendering.data : null) ||
    rendering.src ||
    videoData.src ||
    videoData.url;
  const src = rawSrc ? resolveAsset(rawSrc) : rawSrc;
  const poster = rendering.poster || videoData.poster;
  const caption = rendering.caption || videoData.caption;
  const mimeType = rendering.mime_type || videoData.mime_type;
  const [loadFailed, setLoadFailed] = useState(!src);
  const mediaStyle = {
    ...rendering.style,
    width: '100%',
    maxWidth: '100%',
    height: 'auto',
  };

  return (
    <figure className="video-rendering">
      {loadFailed ? (
        <div className="video-error" role="alert">
          {labels.videoUnavailable}
        </div>
      ) : (
        <video
          controls
          playsInline
          preload="metadata"
          poster={poster}
          style={mediaStyle}
          aria-label={caption || labels.videoPlayer}
          onError={() => setLoadFailed(true)}
        >
          <source
            src={src}
            type={mimeType}
            onError={() => setLoadFailed(true)}
          />
          {labels.videoUnavailable}
        </video>
      )}
      {(caption || src) && (
        <figcaption>
          {caption && <span className="video-caption">{caption}</span>}
          {src && (
            <a href={src} target="_blank" rel="noopener noreferrer">
              {labels.openVideo}
            </a>
          )}
        </figcaption>
      )}
    </figure>
  );
}

function renderRendering(rendering, emitViewStateChange, labels, resolveAsset) {
  if (rendering.type === 'markdown') {
    return <MarkdownRenderer content={rendering.data.toString()} style={rendering.style} />;
  } else if (rendering.type === 'image') {
    const imageStyle = { ...rendering.style, width: '100%', maxWidth: '100%', height: 'auto' };
    return <img
      src={resolveAsset(rendering.data)}
      style={imageStyle}
      alt={rendering.alt || ''}
      loading="lazy"
      decoding="async"
    />;
  } else if (rendering.type === 'video') {
    return <VideoRendering rendering={rendering} labels={labels} resolveAsset={resolveAsset} />;
  } else if (rendering.type === 'link') {
    if (rendering.internal_link) {
      const link = rendering.internal_link;
      const anchorText = rendering.data || link.path + ':' + link.line_number;
      return (<a href="#" style={rendering.style}
                 onClick={(event) => {
                   event.preventDefault();
                   emitViewStateChange({ source: link.path, line: link.line_number, step: null });
                 }}
              >
        {anchorText}
      </a>);
    } else if (rendering.external_link) {
      const link = rendering.external_link;
      return <ExternalLink link={link} style={rendering.style} anchorText={rendering.data} />;
    }
  } else if (rendering.type === 'plot') {
    return <PlotRendering spec={rendering.data} style={rendering.style} />;
  } else {
    return <span style={rendering.style}>{rendering.data}</span>;
  }
}

function renderError(error) {
  return (
    <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
      <h2>Error loading trace</h2>
      <p>{error}</p>
    </div>
  );
}

function TraceLoading() {
  return <div style={{ padding: '50px', textAlign: 'center' }}>Loading…</div>;
}

function TraceUrlMissing() {
  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      No trace URL was supplied to the viewer.
    </div>
  );
}

export default TraceViewer;
export { PRESENTATION_LABELS };
