"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";

function LinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

// The approved prompt (EXECUTIVE_READOUT_PROMPT_V1) instructs the model to end
// its own output with the "This Executive Readout provides..." attribution
// paragraph — so `readout` already includes it. The download file only adds
// the title and the CC BY footer, which the prompt does not generate.
function buildDownloadMd(readout) {
  return (
    `# Executive Readout\n\n${readout.trim()}\n\n` +
    `*AI-Native SDLC Maturity Model © 2026 David Facer — CC BY 4.0*\n` +
    `*Full model: https://github.com/superdtf-0882/ai-native-sdlc-maturity-model*\n`
  );
}

const markdownComponents = {
  h1: (props) => <h1 className="font-display text-2xl md:text-3xl text-paper leading-snug mt-2 mb-4" {...props} />,
  h2: (props) => <h2 className="font-display text-lg text-paper mt-10 mb-2 pb-2 border-b border-hairline" {...props} />,
  p: (props) => <p className="text-smoke text-[15px] leading-relaxed mb-4" {...props} />,
  hr: () => <hr className="border-hairline my-8" />,
  ul: (props) => <ul className="list-disc list-inside text-smoke text-[15px] leading-relaxed mb-4 space-y-1" {...props} />,
  strong: (props) => <strong className="text-paper font-semibold" {...props} />,
};

export default function ReadoutView({ readout, hash }) {
  const [copied, setCopied] = useState(false);

  function handleDownload() {
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([buildDownloadMd(readout)], { type: "text/markdown" })),
      download: "sdlc-executive-readout.md",
    });
    a.click();
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable — silently no-op rather than error.
    }
  }

  return (
    <main className="relative z-10 max-w-3xl mx-auto px-6 py-28 flex-1 w-full">
      <header className="mb-6">
        <div className="text-xs font-mono uppercase tracking-[0.18em] text-dim mb-3">Executive Readout</div>
      </header>

      <article>
        <ReactMarkdown components={markdownComponents}>{readout}</ReactMarkdown>
      </article>

      <div className="mt-8 pt-6 border-t border-hairline flex flex-wrap gap-4 items-center">
        <button
          type="button"
          onClick={handleDownload}
          className="px-4 py-2 rounded-md text-sm font-medium bg-[#185FA5] text-white hover:bg-[#134a82] transition-colors"
        >
          Download Executive Readout
        </button>
        <button
          type="button"
          onClick={handleCopyUrl}
          className="px-4 py-2 rounded-md text-sm font-medium bg-[#185FA5] text-white hover:bg-[#134a82] transition-colors inline-flex items-center gap-2"
        >
          <LinkIcon />
          {copied ? "Copied!" : "Copy This URL"}
        </button>
        <a href="/maturitymodelassessment/" className="text-sm text-dim hover:text-brass transition-colors">
          Run another assessment →
        </a>
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
