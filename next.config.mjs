/** @type {import('next').NextConfig} */
// The SDLC Maturity Assessment is static HTML served from /public. Next's
// /public folder doesn't do directory-index resolution, so it needs an
// explicit rewrite to its index.html. trailingSlash matches the canonical
// URL used everywhere else (aisdlc.davidfacer.com/maturitymodelassessment/).
const nextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/maturitymodelassessment/',
        destination: '/maturitymodelassessment/index.html',
      },
    ];
  },
  // This project's bare root has no landing page of its own — it hosts two
  // tools (the taxonomy and the maturity assessment) with no natural single
  // "home". Redirect to the EA hub page on the main site instead, so visitors
  // get a place to choose rather than being dropped into one tool arbitrarily.
  // This also covers ai-architecture-taxonomy.vercel.app/ (where the taxonomy
  // used to live directly before WP2b nested it under /aiarchitecturetaxonomy/)
  // since it's the same deployment — old bookmarks land on the EA hub instead
  // of a 404.
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://davidfacer.com/professional/enterprise-architecture/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
