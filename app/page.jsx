"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import LayerSelector from "@/components/LayerSelector";
import AutonomySelector from "@/components/AutonomySelector";
import ResultCard from "@/components/ResultCard";
import DownloadButton from "@/components/DownloadButton";
import { ARCHETYPES } from "@/lib/archetypes";
import { SEEDS } from "@/lib/seeds";

const Chart3D = dynamic(() => import("@/components/Chart3D"), { ssr: false });

const INITIAL_LAYERS = { dev: 1, arch: 0, engine: 0, feature: 0, ui: 0 };

export default function Home() {
  const [productName, setProductName] = useState("");
  const [layers, setLayers] = useState(INITIAL_LAYERS);
  const [autonomy, setAutonomy] = useState(1);
  const [communityEntries, setCommunityEntries] = useState([]);
  const [addState, setAddState] = useState("idle"); // idle | added

  useEffect(() => {
    fetch("/api/entries")
      .then((res) => res.json())
      .then((data) => setCommunityEntries(data.entries || []))
      .catch(() => setCommunityEntries([]));
  }, []);

  const binaryKey = `${layers.dev}${layers.arch}${layers.engine}${layers.feature}${layers.ui}`;
  const archetype = ARCHETYPES[binaryKey] || null;
  const stackDepth = layers.dev + layers.arch + layers.engine;
  const surfaceCoverage = layers.feature + layers.ui;

  const hasScoredEntry = productName.trim().length > 0 && !!archetype;

  const userEntry = hasScoredEntry
    ? { name: productName, stackDepth, surfaceCoverage, autonomy }
    : null;

  async function handleAddToCommunity() {
    if (!hasScoredEntry) return;

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: productName,
        stackDepth,
        surfaceCoverage,
        autonomy,
        archetype: archetype.name,
      }),
    });
    const data = await res.json();

    if (data.ok) {
      const refreshed = await fetch("/api/entries").then((r) => r.json());
      setCommunityEntries(refreshed.entries || []);
      setAddState("added");
      setTimeout(() => setAddState("idle"), 2000);
    }
  }

  return (
    <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 flex-1 w-full">
      <header className="mb-10">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-dim mb-3">Taxonomy</div>
        <h1 className="font-display text-3xl md:text-4xl text-paper leading-snug mb-2">AI Architecture Taxonomy</h1>
        <p className="text-smoke text-[15px] leading-relaxed max-w-2xl">
          Identify which of nine AI system archetypes describes your product, and where it sits in a 3D classification space.
        </p>
      </header>

      <div className="space-y-10">
        <section>
          <label htmlFor="productName" className="block text-xs font-mono uppercase tracking-wide text-dim mb-2">
            Product name
          </label>
          <input
            id="productName"
            type="text"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g. My AI Product"
            className="w-full max-w-md rounded-md border border-hairline bg-panel px-3 py-2 text-sm text-paper placeholder:text-dormant focus:outline-none focus:ring-2 focus:ring-brass/40 focus:border-brass"
          />
        </section>

        <section>
          <h2 className="text-xs font-mono uppercase tracking-wide text-dim mb-1.5">Architectural layers</h2>
          <p className="text-sm text-smoke mb-3">Are these layers AI-Native, or Legacy?</p>
          <LayerSelector layers={layers} onChange={setLayers} />
        </section>

        <section>
          <h2 className="text-xs font-mono uppercase tracking-wide text-dim mb-1.5">Autonomy level</h2>
          <p className="text-sm text-smoke mb-3">The balance between AI &amp; humans.</p>
          <AutonomySelector autonomy={autonomy} onChange={setAutonomy} />
        </section>

        <section>
          <ResultCard
            archetype={archetype}
            stackDepth={stackDepth}
            surfaceCoverage={surfaceCoverage}
            autonomy={autonomy}
          />
        </section>

        <section className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAddToCommunity}
            disabled={!hasScoredEntry}
            className="px-4 py-2 rounded-md text-sm font-medium bg-[#7B61FF] text-white hover:bg-[#6a4fe0] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {addState === "added" ? "Added ✓" : "Add to community chart"}
          </button>
          {hasScoredEntry && (
            <DownloadButton
              productName={productName}
              layers={layers}
              autonomy={autonomy}
              archetype={archetype}
              scores={{ stackDepth, surfaceCoverage }}
            />
          )}
        </section>

        <section className="bg-panel border border-hairline rounded-2xl p-6 md:p-8">
          <Chart3D seeds={SEEDS} communityEntries={communityEntries} userEntry={userEntry} />

          <div className="flex flex-wrap gap-4 mt-4 text-sm text-dim">
            <LegendItem color="#1D9E75" label="Commander" />
            <LegendItem color="#BA7517" label="Navigator" />
            <LegendItem color="#E24B4A" label="Autopilot" />
            <LegendItem color="#185FA5" label="Your entry" outline />
            <LegendItem color="#7B61FF" label="Community entries" />
          </div>
        </section>
      </div>

      <footer className="mt-16 pt-6 border-t border-hairline text-sm text-dim">
        A taxonomy by David Facer · davidfacer.com
      </footer>
    </main>
  );
}

function LegendItem({ color, label, outline }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block w-3 h-3 rounded-full"
        style={
          outline
            ? { border: `2px solid ${color}`, backgroundColor: "transparent" }
            : { backgroundColor: color }
        }
      />
      {label}
    </span>
  );
}
