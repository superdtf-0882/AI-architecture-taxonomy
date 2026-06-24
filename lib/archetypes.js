export const ARCHETYPES = {
  "11111": {
    name: "AI-Native System",
    desc: "AI present across all five architectural layers. Built AI-first from inception."
  },
  "11110": {
    name: "Invisible AI Platform",
    desc: "Full AI stack with no user-facing surface. AI operates entirely in the background (e.g. fraud detection, dynamic pricing)."
  },
  "11101": {
    name: "AI-First Interface",
    desc: "AI is the primary user interface. Product features are not independently AI-driven; AI is the access layer (e.g. conversational assistants)."
  },
  "11100": {
    name: "AI Infrastructure Platform",
    desc: "Deep AI stack with no user-facing surface. Pure internal ML platform or AI-as-a-service backend."
  },
  "10111": {
    name: "Retrofitted AI System",
    desc: "AI added to an existing architecture via engine and feature layers. Architecture not redesigned. The most common enterprise pattern."
  },
  "10100": {
    name: "AI Inference Engine",
    desc: "AI present only in development and inference layer. Consumed as a service endpoint. No feature or UI surface (e.g. foundation model APIs)."
  },
  "10110": {
    name: "Retrofitted Engine+Feature",
    desc: "AI in engine and features but no UI surface and no architectural redesign. Backend AI integration without user-facing AI presentation."
  },
  "10011": {
    name: "Surface-Level AI (Wrapper)",
    desc: "AI integrated at feature and UI layers only. Thin wrapper over third-party AI. No proprietary engine or architectural redesign."
  },
  "10001": {
    name: "AI UI Skin",
    desc: "AI present only in the user interface layer. Chatbot widget or AI styling bolted onto an existing product with zero backend AI integration."
  },
};

export const LAYERS = [
  { key: "dev",     label: "Dev",     desc: "AI-assisted development",       locked: true },
  { key: "arch",    label: "Arch",    desc: "AI-redesigned architecture",     locked: false },
  { key: "engine",  label: "Engine",  desc: "AI inference / orchestration",   locked: false },
  { key: "feature", label: "Feature", desc: "AI-driven product features",     locked: false },
  { key: "ui",      label: "UI",      desc: "AI-surfaced interface",          locked: false },
];

export const AUTONOMY = [
  {
    value: 1,
    label: "Commander",
    sublabel: "least autonomous",
    desc: "Executes a direct instruction. Human commands, AI acts. No initiative or workflow reasoning.",
    color: "#1D9E75",
  },
  {
    value: 2,
    label: "Navigator",
    sublabel: "",
    desc: "Advises across a workflow with situational judgment. Human sets the destination, AI finds the route. Human retains command authority.",
    color: "#BA7517",
  },
  {
    value: 3,
    label: "Autopilot",
    sublabel: "most autonomous",
    desc: "Executes the full mission autonomously. Initiates multi-step tasks across systems. Human monitors and can disengage; does not approve each step.",
    color: "#E24B4A",
  },
];
