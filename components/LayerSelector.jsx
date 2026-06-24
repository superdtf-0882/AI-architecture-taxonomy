"use client";

import { useState } from "react";
import { LAYERS } from "@/lib/archetypes";

export default function LayerSelector({ layers, onChange }) {
  const [warning, setWarning] = useState(false);

  function toggle(key) {
    if (key === "dev") return; // P-01: Dev is always 1, locked

    const next = { ...layers, [key]: layers[key] ? 0 : 1 };

    // P-02: Arch = 1 requires Engine = 1
    if (key === "arch" && next.arch === 1 && next.engine !== 1) {
      next.engine = 1;
      setWarning(true);
      setTimeout(() => setWarning(false), 3000);
    }

    onChange(next);
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {LAYERS.map((layer) => {
          const active = layers[layer.key] === 1;
          const locked = layer.locked;
          return (
            <button
              key={layer.key}
              type="button"
              onClick={() => toggle(layer.key)}
              disabled={locked}
              title={layer.desc}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                locked
                  ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                  : active
                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {layer.label}
            </button>
          );
        })}
      </div>
      {warning && (
        <p className="mt-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          P-02: Arch = 1 requires Engine = 1. Engine has been set automatically.
        </p>
      )}
    </div>
  );
}
