import { AUTONOMY } from "@/lib/archetypes";

export default function ResultCard({ archetype, stackDepth, surfaceCoverage, autonomy }) {
  const autonomyOpt = AUTONOMY.find((a) => a.value === autonomy);

  if (!archetype) {
    return (
      <div className="rounded-lg border border-[#E24B4A]/40 bg-[#E24B4A]/10 p-5">
        <p className="text-[#E24B4A] font-medium">— configuration invalid —</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-hairline bg-panel p-5">
      <h3 className="font-display text-xl text-paper mb-1">{archetype.name}</h3>
      <p className="text-sm text-smoke leading-relaxed mb-4">{archetype.desc}</p>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-hairline text-smoke">
          Stack Depth: {stackDepth} / 3
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-hairline text-smoke">
          Surface Coverage: {surfaceCoverage} / 2
        </span>
        {autonomyOpt && (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: `${autonomyOpt.color}1A`, color: autonomyOpt.color }}
          >
            Autonomy: {autonomyOpt.label}
          </span>
        )}
      </div>
    </div>
  );
}
