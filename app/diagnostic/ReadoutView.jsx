"use client";

import ReactMarkdown from "react-markdown";

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
  function handleDownload() {
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([buildDownloadMd(readout)], { type: "text/markdown" })),
      download: "sdlc-executive-readout.md",
    });
    a.click();
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
          className="px-4 py-2 rounded-md text-sm font-medium bg-[#7B61FF] text-white hover:bg-[#6a4fe0] transition-colors"
        >
          Download Executive Readout
        </button>
        <a href="/maturitymodelassessment/" className="text-sm text-dim hover:text-brass transition-colors">
          Run another assessment →
        </a>
      </div>
    </main>
  );
}
