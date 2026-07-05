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
};

export default nextConfig;
