"use client";

import { useState } from "react";

export default function DiagnosticForm() {
  const [mdText, setMdText] = useState("");
  const [status, setStatus] = useState("idle"); // idle | submitting | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMdText(await file.text());
  }

  async function handleSubmit() {
    if (!mdText.trim()) return;
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/diagnostic/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ md: mdText }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "Something went wrong.");
        return;
      }
      window.location.href = `/executivereadout/?hash=${data.hash}`;
    } catch {
      setStatus("error");
      setErrorMsg("Network error — please try again.");
    }
  }

  return (
    <main className="relative z-10 max-w-2xl mx-auto px-6 py-28 flex-1 w-full">
      <header className="mb-8">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-dim mb-3">Executive Readout</div>
        <h1 className="font-display text-3xl md:text-4xl text-paper leading-snug mb-2">
          Generate an Executive Readout
        </h1>
        <p className="text-smoke text-[15px] leading-relaxed max-w-2xl">
          Paste or upload a completed AI-Native SDLC Maturity Assessment (.md) to generate an AI-assisted
          executive interpretation. Don&apos;t have one yet?{" "}
          <a href="/maturitymodelassessment/" className="text-brass hover:underline">
            Take the assessment
          </a>
          .
        </p>
      </header>

      <div className="space-y-4">
        <textarea
          value={mdText}
          onChange={(e) => setMdText(e.target.value)}
          placeholder="Paste your assessment .md content here..."
          rows={10}
          className="w-full rounded-md border border-hairline bg-panel px-3 py-2 text-sm text-paper placeholder:text-dormant focus:outline-none focus:ring-2 focus:ring-brass/40 focus:border-brass font-mono"
        />

        <label className="block text-sm text-dim">
          or upload a file:{" "}
          <input type="file" accept=".md,text/markdown" onChange={handleFile} className="text-sm text-dim" />
        </label>

        {status === "error" && <p className="text-sm text-red-400">{errorMsg}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={!mdText.trim() || status === "submitting"}
          className="px-4 py-2 rounded-md text-sm font-medium bg-[#926318] text-white hover:bg-[#7a5314] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {status === "submitting" ? "Generating…" : "Generate Executive Readout"}
        </button>
      </div>

      <a
        href="https://github.com/superdtf-0882/ai-native-sdlc-maturity-model"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 text-xs text-dim hover:text-brass transition-colors"
      >
        AI-Native SDLC Maturity Model © 2026 David Facer CC BY 4.0
      </a>
    </main>
  );
}
