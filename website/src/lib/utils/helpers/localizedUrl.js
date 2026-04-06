/**
 * Helper function to generate a locale-prefixed URL
 * @param {string} path - The path to localize (e.g., "/about", "/trainings")
 * @param {string} locale - The locale to use (e.g., "en", "az")
 * @returns {string} The locale-prefixed URL
 */
export const getLocalizedUrl = (path, locale) => {
  if (!path || typeof path !== "string") {
    return path;
  }

  // If path already starts with a locale, return as is
  if (path.startsWith("/en/") || path.startsWith("/az/")) {
    return path;
  }

  // If path is an external URL, return as is
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }

  // If path starts with /, prefix with locale
  if (path.startsWith("/")) {
    return `/${locale}${path}`;
  }

  // For relative paths, add locale prefix
  return `/${locale}/${path}`;
};

