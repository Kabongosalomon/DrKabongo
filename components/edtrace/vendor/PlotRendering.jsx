// GENERATED FILE -- do not edit by hand.
// Source of truth: edtrace-studio (packages/viewer/src/PlotRendering.jsx).
// Synced by scripts/sync_web_bundle.py for course "ai_machine_learning_hello_world" (edtrace-studio git sha e9ede1584d698ad9977cd6c1a5b29ab115429748-dirty, built 2026-08-18T02:29:31+00:00).
// To change viewer behavior, edit edtrace-studio and re-run build_web_bundle.py + sync_web_bundle.py.
// > edtrace-studio vendor header end

import { Suspense, lazy } from 'react';

// vega + vega-lite + react-vega are the heaviest dependency in the viewer and
// only matter for `plot` renderings, so they're split into their own chunk
// and fetched on demand instead of on every lesson load.
const LazyVegaEmbed = lazy(() =>
  import('react-vega').then((module) => ({ default: module.VegaEmbed }))
);

export function PlotRendering({ spec, style }) {
  return (
    <Suspense fallback={<span className="plot-loading" aria-hidden="true" />}>
      <LazyVegaEmbed spec={spec} style={style} />
    </Suspense>
  );
}
