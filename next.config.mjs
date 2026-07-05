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
  // The taxonomy app used to live at this project's bare root
  // (ai-architecture-taxonomy.vercel.app/) before WP2b nested it under
  // /aiarchitecturetaxonomy/. Redirect old links/bookmarks to the new
  // canonical domain rather than letting them 404.
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://aisdlc.davidfacer.com/aiarchitecturetaxonomy/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
