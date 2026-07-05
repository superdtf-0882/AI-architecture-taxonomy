import { kvGet } from "@/lib/kv";
import DiagnosticForm from "./DiagnosticForm";
import ReadoutView from "./ReadoutView";

export const metadata = {
  title: "Executive Readout — David Facer",
  description: "AI-assisted executive interpretation of an AI-Native SDLC Maturity Assessment.",
};

export default async function DiagnosticPage({ searchParams }) {
  const params = await searchParams;
  const hash = params?.hash;

  if (hash) {
    const readout = await kvGet(`diag_cache:${hash}`);
    if (!readout) {
      return (
        <main className="relative z-10 max-w-2xl mx-auto px-6 py-28 flex-1 w-full text-center">
          <p className="text-sm text-dim mb-4">
            This readout has expired or wasn&apos;t found — cached readouts are kept for 24 hours.
          </p>
          <a href="/maturitymodelassessment/" className="text-brass hover:underline text-sm">
            Run a new assessment →
          </a>

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
    return <ReadoutView readout={readout} hash={hash} />;
  }

  return <DiagnosticForm />;
}
