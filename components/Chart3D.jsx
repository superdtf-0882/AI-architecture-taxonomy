"use client";

import { useEffect, useRef } from "react";

const AUTONOMY_COLORS = {
  1: "#1D9E75",
  2: "#BA7517",
  3: "#E24B4A",
};

function seedToPoint(seed) {
  const stackDepth = seed.dev + seed.arch + seed.engine;
  const surfaceCoverage = seed.feature + seed.ui;
  return {
    name: seed.name,
    x: stackDepth,
    y: surfaceCoverage,
    z: seed.autonomy,
    color: AUTONOMY_COLORS[seed.autonomy],
  };
}

export default function Chart3D({ seeds = [], communityEntries = [], userEntry = null }) {
  const containerRef = useRef(null);
  const plotlyRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function render() {
      const Plotly = (await import("plotly.js-dist-min")).default;
      if (!isMounted || !containerRef.current) return;
      plotlyRef.current = Plotly;

      const seedPoints = seeds.map(seedToPoint);
      const seedTrace = {
        type: "scatter3d",
        mode: "markers+text",
        name: "Seeded examples",
        x: seedPoints.map((p) => p.x),
        y: seedPoints.map((p) => p.y),
        z: seedPoints.map((p) => p.z),
        text: seedPoints.map((p) => p.name),
        textposition: "top center",
        textfont: { size: 10 },
        marker: {
          size: 8,
          color: seedPoints.map((p) => p.color),
          symbol: "circle",
        },
      };

      const communityTrace = {
        type: "scatter3d",
        mode: "markers+text",
        name: "Community entries",
        x: communityEntries.map((e) => e.stackDepth),
        y: communityEntries.map((e) => e.surfaceCoverage),
        z: communityEntries.map((e) => e.autonomy),
        text: communityEntries.map((e) => e.name),
        textposition: "top center",
        textfont: { size: 10 },
        marker: {
          size: 8,
          color: communityEntries.map((e) => AUTONOMY_COLORS[e.autonomy]),
          symbol: "circle-open-dot",
          line: { width: 2 },
        },
      };

      const traces = [seedTrace, communityTrace];

      if (userEntry) {
        traces.push({
          type: "scatter3d",
          mode: "markers+text",
          name: "Your entry",
          x: [userEntry.stackDepth],
          y: [userEntry.surfaceCoverage],
          z: [userEntry.autonomy],
          text: [userEntry.name || "Your entry"],
          textposition: "top center",
          textfont: { size: 10 },
          marker: {
            size: 10,
            color: "rgba(0,0,0,0)",
            line: { color: "#185FA5", width: 3 },
            symbol: "circle",
          },
        });
      }

      const layout = {
        autosize: true,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        margin: { l: 0, r: 0, t: 0, b: 0 },
        showlegend: false,
        scene: {
          xaxis: { title: "Stack Depth", range: [0, 4] },
          yaxis: { title: "Surface Coverage", range: [-0.5, 2.5] },
          zaxis: {
            title: "Autonomy",
            tickvals: [1, 2, 3],
            ticktext: ["Commander", "Navigator", "Autopilot"],
            range: [0.5, 3.5],
          },
          camera: { eye: { x: 1.6, y: -1.6, z: 0.9 } },
        },
      };

      const config = { responsive: true, displayModeBar: false };

      Plotly.newPlot(containerRef.current, traces, layout, config);
    }

    render();

    return () => {
      isMounted = false;
      if (plotlyRef.current && containerRef.current) {
        plotlyRef.current.purge(containerRef.current);
      }
    };
  }, [seeds, communityEntries, userEntry]);

  return <div ref={containerRef} className="w-full" style={{ height: 520 }} />;
}
