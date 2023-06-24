const { flatRoutes } = require("remix-flat-routes");

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  future: {
    unstable_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true
  },
  ignoredRouteFiles: ["**/.*"],
  postcss: "true",
  routes: async (defineRoutes) => {
    return flatRoutes("routes", defineRoutes);
  },
  server: process.env.NODE_ENV === "development" ? undefined : "./server.ts",
  serverBuildPath: "api/index.js",
  serverModuleFormat: "cjs",
  tailwind: "true"
};
