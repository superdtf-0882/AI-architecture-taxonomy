import { AUTONOMY } from "@/lib/archetypes";

export default function ResultCard({ archetype, stackDepth, surfaceCoverage, autonomy }) {
  const autonomyOpt = AUTONOMY.find((a) => a.value === autonomy);

  if (!archetype) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-5">
        <p className="text-red-700 font-medium">— configuration invalid —</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <h3 className="text-xl font-semibold text-gray-900 mb-1">{archetype.name}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{archetype.desc}</p>
      <div className="flex flex-wrap gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
          Stack Depth: {stackDepth} / 3
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
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
