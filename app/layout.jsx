import "./globals.css";

export const metadata = {
  title: "AI Architecture Taxonomy",
  description: "Score and classify your AI system across nine architectural archetypes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-smoke">
        <a
          href="https://davidfacer.com/"
          className="fixed top-6 left-6 z-20 flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass/60 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          <img
            src="/HeadshotBW.jpg"
            alt=""
            className="w-9 h-11 rounded-lg object-cover object-[center_30%] border border-hairline"
          />
          <span className="font-sans text-sm text-dim tracking-wide">David Facer</span>
        </a>
        {children}
      </body>
    </html>
  );
}
