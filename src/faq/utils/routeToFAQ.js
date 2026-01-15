/**
 * Maps dashboard routes to FAQ sections/items
 * Used to determine which FAQ section to link to based on current page
 */

export const routeToFAQMap = {
  // Dashboard routes
  overview: {
    sectionId: "financial-dashboard",
    itemId: "financial-dashboard-overview",
  },
  statements: {
    sectionId: "financial-dashboard",
    itemId: "financial-dashboard-statements",
  },
  "financial-health": {
    sectionId: "financial-dashboard",
    itemId: "financial-dashboard-health",
  },
  forecasts: {
    sectionId: "financial-dashboard",
    itemId: "forecasts",
  },
  "production-line": {
    sectionId: "financial-dashboard",
    itemId: "productivity",
  },
  investments: {
    sectionId: "financial-dashboard",
    itemId: "project-evaluation",
  },
  // Auth routes
  login: {
    sectionId: "accounts",
    itemId: null, // Will show Accounts section
  },
  "forgot-password": {
    sectionId: "accounts",
    itemId: "accounts-forgot-password",
  },
  "reset-password": {
    sectionId: "accounts",
    itemId: null,
  },
};

/**
 * Get FAQ section/item based on current route
 * @param {string} routePath - Current route path (e.g., "overview", "statements")
 * @returns {Object} { sectionId, itemId } or null if not found
 */
export const getFAQForRoute = (routePath) => {
  return routeToFAQMap[routePath] || null;
};

/**
 * Get FAQ section/item based on full pathname
 * @param {string} pathname - Full pathname (e.g., "/mxrep/institution/dashboard/overview")
 * @returns {Object} { sectionId, itemId } or null if not found
 */
export const getFAQForPathname = (pathname) => {
  const pathParts = pathname.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];
  return getFAQForRoute(lastPart);
};
