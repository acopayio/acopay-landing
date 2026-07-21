import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { absoluteUrl, PAGE_SEO, SITE, type PageSeo } from "../seo/site";

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, extra?: Record<string, string>) {
  const selector = extra?.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (extra) {
      for (const [k, v] of Object.entries(extra)) el.setAttribute(k, v);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function applySeo(page: PageSeo) {
  const url = absoluteUrl(page.path);
  const title = page.title;
  const description = page.description;
  const image = SITE.ogImage;
  const keywords = SITE.keywords.join(", ");
  const hashtags = SITE.hashtags.join(" ");

  document.title = title;
  document.documentElement.lang = SITE.language;

  upsertMeta("name", "description", description);
  upsertMeta("name", "keywords", keywords);
  upsertMeta("name", "author", SITE.name);
  upsertMeta("name", "robots", "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
  upsertMeta("name", "googlebot", "index, follow");
  upsertMeta("name", "theme-color", SITE.themeColor);
  upsertMeta("name", "color-scheme", "dark");
  upsertMeta("name", "application-name", SITE.name);
  upsertMeta("name", "apple-mobile-web-app-title", SITE.name);
  upsertMeta("name", "format-detection", "telephone=no");
  upsertMeta("name", "geo.region", SITE.region);
  upsertMeta("name", "geo.placename", "United States");
  upsertMeta("name", "language", SITE.language);
  upsertMeta("name", "rating", "general");
  upsertMeta("name", "referrer", "strict-origin-when-cross-origin");

  // Social / discovery helpers (not ranking signals, but brand consistency)
  upsertMeta("name", "twitter:card", "summary_large_image");
  upsertMeta("name", "twitter:title", title);
  upsertMeta("name", "twitter:description", description);
  upsertMeta("name", "twitter:image", image);
  upsertMeta("name", "twitter:image:alt", SITE.ogImageAlt);
  upsertMeta("name", "twitter:url", url);
  if (SITE.twitterHandle) {
    upsertMeta("name", "twitter:site", SITE.twitterHandle);
    upsertMeta("name", "twitter:creator", SITE.twitterHandle);
  }

  upsertMeta("property", "og:type", "website");
  upsertMeta("property", "og:site_name", SITE.name);
  upsertMeta("property", "og:locale", SITE.locale);
  upsertMeta("property", "og:title", title);
  upsertMeta("property", "og:description", description);
  upsertMeta("property", "og:url", url);
  upsertMeta("property", "og:image", image);
  upsertMeta("property", "og:image:secure_url", image);
  upsertMeta("property", "og:image:type", "image/png");
  upsertMeta("property", "og:image:width", "1200");
  upsertMeta("property", "og:image:height", "630");
  upsertMeta("property", "og:image:alt", SITE.ogImageAlt);
  upsertMeta("property", "article:tag", hashtags);

  upsertLink("canonical", url);
  upsertLink("alternate", url, { hreflang: "en" });
  upsertLink("alternate", url, { hreflang: "en-US" });
  upsertLink("alternate", url, { hreflang: "x-default" });
}

/** Updates document head for the active route (SPA). */
export function SeoManager() {
  const { pathname } = useLocation();
  const key = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const page = PAGE_SEO[key] ?? {
    title: SITE.defaultTitle,
    description: SITE.defaultDescription,
    path: key || "/",
  };

  useEffect(() => {
    applySeo(page);
  }, [key, page.title, page.description, page.path]);

  return null;
}
