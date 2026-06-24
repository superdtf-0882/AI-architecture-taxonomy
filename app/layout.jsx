import "./globals.css";

export const metadata = {
  title: "AI Architecture Taxonomy",
  description: "Score and classify your AI system across nine architectural archetypes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900">{children}</body>
    </html>
  );
}
