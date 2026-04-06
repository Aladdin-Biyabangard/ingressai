import { siteLocales } from "@/lib/constants/locales";
import { hiddenRoutesInSitemap, routes } from "@/lib/constants/routes";

export const generateSitemap = (courses) => {
  const baseUrl = process.env.NEXT_PUBLIC_DOMAIN;
  const now = new Date().toISOString();

  const generateAlternateLinks = (path) =>
    siteLocales
      .map(
        (locale) => `
        <xhtml:link 
          rel="alternate" 
          hreflang="${locale}" 
          href="${baseUrl}/${locale}${path}" 
        />`
      )
      .join("");

  const staticRoutes = Object.values(routes)
    .map((route) => {
      if (!hiddenRoutesInSitemap.includes(route)) {
        const alternateLinks = generateAlternateLinks(route);

        return `
      <url>
        <loc>${baseUrl}${route}</loc>
        <lastmod>${now}</lastmod>
        ${alternateLinks}
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>`;
      }
      return "";
    })
    .join("");

  const courseRoutes =
    courses
      ?.map((course) => {
        const updatedAt = course?.updatedAt ?? now;
        const path = `/trainings/${course.id}`;

        return `
      <url>
        <loc>${baseUrl}${path}</loc>
        ${generateAlternateLinks(path)}
        <lastmod>${new Date(updatedAt).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>`;
      })
      .join("") ?? "";

  // home page alternate links
  const homeAlternateLinks = generateAlternateLinks("");

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset 
    xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:xhtml="http://www.w3.org/1999/xhtml"
  >
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${now}</lastmod>
      ${homeAlternateLinks}
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>

    ${staticRoutes}
    ${courseRoutes}

  </urlset>`;

  return sitemap;
};
