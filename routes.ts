/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = ["/", "/auth/error", "/monit"] as string[];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in user to /admin
 * @type {string[]}
 */
export const authRoutes = ["/login"] as string[];

/**
 * The prefix for API authentication routes
 * @type {string}
 */
export const apiAuthPrefix = "/api/demo/v1/auth";

/**
 * The prefix for API authentication routes
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/machine";
