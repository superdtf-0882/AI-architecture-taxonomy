"use client";

import { AUTONOMY } from "@/lib/archetypes";

export default function AutonomySelector({ autonomy, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {AUTONOMY.map((opt) => {
        const selected = autonomy === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="text-left rounded-lg border p-4 transition-colors"
            style={
              selected
                ? { borderColor: opt.color, backgroundColor: `${opt.color}1A` }
                : { borderColor: "#e5e7eb", backgroundColor: "#fff" }
            }
          >
            <div className="flex items-baseline justify-between gap-2 mb-1">
              <span className="font-semibold text-gray-900">{opt.label}</span>
              {opt.sublabel && (
                <span className="text-xs text-gray-500">{opt.sublabel}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{opt.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
