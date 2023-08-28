const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const withImages = require("next-images");
const withFonts = require("next-fonts");
const withPlugins = require("next-compose-plugins");
const fs = require("fs");
const path = require("path");

function getConfig(name) {
  return JSON.parse(fs.readFileSync(path.join(
    process.cwd(),
    "config",
    `${name}.json`
  )) || {})[appName]
}

const appName = process.env.NEXT_PUBLIC_APP_NAME;
const multiLocales = [
  "ielts",
  "toeic"
].includes(appName);

const rewriteRules = [
  {
    source: '/robots.txt',
    destination: '/api/robots'
  },
  {
    source: '/ads.txt',
    destination: '/api/ads-txt'
  },
  {
    source: '/sitemap_index.xml',
    destination: '/api/sitemap'
  },
  {
    source: '/page-sitemap.xml',
    destination: '/api/page-sitemap'
  },
  {
    source: '/qrcode',
    destination: '/api/qrcode'
  }
];

/** @type {Array<import("./types/SubjectData").SubjectData>} */
const subjects = getConfig('subject') || [];
/** @type {Array<import("./types/StateData").StateData>} */
const states = getConfig('state') || [];

// STATE
if (["cdl", "dmv"].includes(appName)) {
  if (appName === "cdl") {
    rewriteRules.push(...states.map((s) => {
      const source = `/${s.slug}/`;
      return {
        source,
        destination: `/_page-state${source}`
      }
    }))
  } else if (appName === "dmv") {
    rewriteRules.push(...states.flatMap((state) => {
      const subjects = ["dmv-cdl-permit", "dmv-motorcycle", "dmv-permit"];
      return subjects.map(subject => {
        const source = `/${state.slug}/${state.shortSlug}-${subject}-practice-test/`;
        return {
          source,
          destination: `/_page-state${source}`
        }
      })
    }))
  }
}
// SUBJECT
if ([
  "alevel",
  "ged"
].includes(appName)) {
  rewriteRules.push(...subjects.map((s => {
    const source = `/${s.slug}/`;
    return {
      source,
      destination: `/_page-subject${source}`
    }
  })))
}
// SUBJECT DMV
if (appName === "dmv") {
  rewriteRules.push(...subjects.map((s => {
    const source = `/${s.slug}/`;
    return {
      source,
      destination: `/_page-dmv-subject${source}`
    }
  })))
}
// MANUAL BOOK
if (appName === "dmv") {
  const subjects = ["dmv-cdl-permit", "dmv-motorcycle", "dmv-permit"];
  rewriteRules.push(...states.flatMap(state => subjects.map(subject => {
    const source = `/${state.slug}/${state.slug}-${subject}-manual-book/`;
    return {
      source,
      destination: `/_page-manual-book${source}`
    }
  })))
}
if (appName === "cdl") {
  rewriteRules.push(...states.map((item) => {
    const source = `/${item.slug}/${item.slug}-cdl-manual-book/`
    return {
      source,
      destination: `/_page-manual-book${source}`
    }
  }));
}

if (appName === "cscs") {
  rewriteRules.push(
    {
      source: '/mock-test/',
      destination: '/full-test/'
    }
  )
} else if (appName === "ged") {
  rewriteRules.push(
    {
      source: '/ged-online-test/',
      destination: '/full-test/'
    }
  )
} else if (appName === "hvac" || appName === "nclex") {
  rewriteRules.push(
    {
      source: '/exam-simulator/',
      destination: '/full-test/'
    }
  )
} else if (appName === "alevel") {
  rewriteRules.push(
    {
      source: '/a-level-maths-online-test/',
      destination: '/full-test/'
    }
  )
}

const locales = ['en'];
if (multiLocales) {
  locales.push('vi');
}

module.exports = (phase) => withPlugins([withImages, withFonts], {
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // https://github.com/webpack-contrib/mini-css-extract-plugin#recommended
    // For production builds it's recommended to extract the CSS from your bundle being able to use parallel loading of CSS/JS resources later on.
    // For development mode, using style-loader because it injects CSS into the DOM using multiple <style></style> and works faster.
    if (!dev) {
      config.plugins.push(new MiniCssExtractPlugin({
        filename: 'static/chunks/[name].[fullhash].css',
        ignoreOrder: true
      }));
    }
    config.module.rules.push(
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          isServer ? { loader: 'file-loader' } : (dev ? { loader: 'style-loader' } : { loader: MiniCssExtractPlugin.loader }),
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      }
    );
    return config;
  },
  env: {
    REACT_APP_ENDPOINT: process.env.NEXT_PUBLIC_ENDPOINT,
    REACT_APP_PREFIX: process.env.NEXT_PUBLIC_PREFIX,
    REACT_APP_SAMESITE: process.env.NEXT_PUBLIC_SAMESITE
  },
  typescript: {
    ignoreBuildErrors: true,

  },
  images: {
    domains: ['storage.googleapis.com'],
  },
  rewrites: async () => rewriteRules,
  i18n: {
    locales,
    defaultLocale: 'en',
    localeDetection: false
  },
  poweredByHeader: false,
  trailingSlash: true,
  distDir: ".next",
  experimental: { images: { allowFutureImage: true } }
})(phase, { defaultConfig: {} });
