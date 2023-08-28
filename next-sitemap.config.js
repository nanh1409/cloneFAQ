const fs = require("fs");
const path = require("path");
const moment = require("moment");

const getExcludePaths = () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  const exclude = [
    "/search",
    "/reset-password",
    "/maintainance",
    "/profile",
    "/study-plan",
    "/get-pro/payment-details",
    "/get-pro/checkout"
  ];
  if (appName !== "toeic" && appName !== "ielts") exclude.push(...["/practice", "/my-learning"]);
  if (appName !== "toeic") exclude.push("/test");
  if (appName !== "hvac") exclude.push("/flash-card");
  if (appName === "cdl") {
    exclude.push("/full-test");
  } else if (appName === "dmv") {
    exclude.push("/full-test");
  } else if (appName === "nclex") {
    exclude.push(...[
      "/nclex-rn",
      "/nclex-pn"
    ])
  }
  // GetPro
  if (!["toeic"].includes(appName)) {
    exclude.push("/get-pro")
  }
  return exclude;
}

/**
 * 
 * @param {import("next-sitemap").IConfig} config 
 * @returns 
 */
const getAdditionalPaths = (config) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  /**
  * @type {import("next-sitemap").ISitemapField | Promise<import("next-sitemap").ISitemapField> | undefined}
  */
  const defautConfig = {
    changefreq: config.changefreq,
    priority: config.priority,
    lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    alternateRefs: config.alternateRefs ?? []
  }
  /** @type {Array<import("next-sitemap").ISitemapField>} */
  const paths = [];
  if (appName === "ged") {
    paths.push(
      { loc: "/list-of-most-viewed-articles-at-ged-test-pro", ...defautConfig }
    )
  }
  if (["cscs", "nclex"].includes(appName)) {
    /** @type {import("./types/appPracticeTypes").PracticeDataConfig} */
    const { mapSlugData = {} } = JSON.parse(fs.readFileSync(path.join(process.cwd(), "config", "practice-data.json")))[appName];
    if (appName === "cscs") {
      paths.push(...Object.keys(mapSlugData).map((slug) => ({ loc: `/study/${slug}`, ...defautConfig })));
    } else if (appName === "nclex") {
      Object.values(mapSlugData).filter(({ tag }) => tag !== "flash-card").forEach(({ children = {} }) => {
        paths.push(...Object.keys(children).map((slug) => ({ loc: `/study/${slug}`, ...defautConfig })));
      });
    }
  }
  return paths;
}

const _main_ = () => {
  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap-build-time.txt"), moment().utc().format("YYYY-MM-DDThh:mm:ssZ"));
}

_main_();

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.SITE_URL || "https://example.com",
  exclude: getExcludePaths(),
  additionalPaths: getAdditionalPaths,
  transform: async (config, path) => {
    /**
     * @type {import("next-sitemap").ISitemapField | Promise<import("next-sitemap").ISitemapField> | undefined}
     */
    const defautConfig = {
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? []
    }
    const appName = process.env.NEXT_PUBLIC_APP_NAME;
    if (path === "/full-test") {
      if (appName === "nclex" || appName === "hvac") {
        return {
          loc: "/exam-simulator",
          ...defautConfig
        }
      } else if (appName === "cscs") {
        return {
          loc: "/mock-test",
          ...defautConfig
        }
      } else if (appName === "alevel") {
        return {
          loc: "/a-level-maths-online-test",
          ...defautConfig
        }
      } else if (appName === "ged") {
        return {
          loc: "/ged-online-test",
          ...defautConfig
        }
      }
    }
    return {
      loc: path,
      ...defautConfig
    }
  }
}

module.exports = config;