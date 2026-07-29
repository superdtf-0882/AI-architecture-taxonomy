/** @type {import('next').NextConfig} */
// The standalone SDLC self-assessment + Executive Readout retired
// 2026-07-29 (briefs/2026-07-29-davidfacer-retire/, OKF TOGAF) --
// superseded by aimaturitymodels.com's own three assessment tools
// (SDLC/PDLC/Prioritization). Old routes redirect rather than 404 or
// silently keep serving; /public/maturitymodelassessment/index.html
// and app/executivereadout/ are left in place (unreachable, since
// Next's redirects() match before both rewrites and the filesystem
// router), matching this repo's own precedent of not deleting
// superseded static content once a redirect covers it.
const nextConfig = {
  trailingSlash: true,
  async redirects() {
    return [
      {
        source: '/maturitymodelassessment',
        destination: 'https://aimaturitymodels.com/models/sdlc/assessment',
        permanent: true,
      },
      {
        source: '/maturitymodelassessment/',
        destination: 'https://aimaturitymodels.com/models/sdlc/assessment',
        permanent: true,
      },
      {
        source: '/executivereadout',
        destination: 'https://aimaturitymodels.com/models/sdlc/executivereadout',
        permanent: true,
      },
      {
        source: '/executivereadout/',
        destination: 'https://aimaturitymodels.com/models/sdlc/executivereadout',
        permanent: true,
      },
      // This project's bare root has no landing page of its own -- it hosts
      // the taxonomy tool (still live, untouched) with no natural single
      // "home". Previously redirected to the EA hub page on the main site;
      // that page itself retired in the same change as the routes above, so
      // this now points straight at aimaturitymodels.com rather than
      // chaining through a second redirect. Also covers
      // ai-architecture-taxonomy.vercel.app/ (same deployment, pre-WP2b
      // bookmarks) for the same reason.
      {
        source: '/',
        destination: 'https://aimaturitymodels.com',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
