import fs from "fs";
import moment from "moment";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import { Builder, parseStringPromise } from "xml2js";
import { apiGetAppSettingDetails } from "../../features/appInfo/appInfo.api";
import { getWPBaseURL } from "../../features/wordpress/wordpress.api";
import { wpHomeURL } from "../../features/wordpress/wordpress.config";
import { get } from "../../utils/fetcher";
import { errorResponse } from "../../utils/nextApiUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) return errorResponse(res, 404, "Not Found");
  const appInfo = await apiGetAppSettingDetails({ appName, fields: ["siteAddress"], local: true });
  if (!appInfo) return errorResponse(res, 404, "Not Found");
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return errorResponse(res, 404, "Not Found");
  const { data: rankMathSiteMap, error } = await get({ endpoint: `${baseUrl}/sitemap_index.xml`, responseType: "text" });
  if (error) return errorResponse(res);
  const sitemap = await parseStringPromise(rankMathSiteMap);
  const buildTime = fs.readFileSync(path.join(process.cwd(), "public", "sitemap-build-time.txt"), "utf8");

  ((sitemap["sitemapindex"] || {})["sitemap"] || []).push({
    loc: [`${appInfo.siteAddress}/page-sitemap.xml`],
    lastmod: [buildTime || moment().utc().format("YYYY-MM-DDThh:mm:ssZ")]
  });
  const sitemapBuilder = new Builder({ headless: true });
  const xmldec = `<?xml version="1.0" encoding="UTF-8"?>`;
  const newXML = `${xmldec}\n${process.env.NODE_ENV !== "production" ? "" : `<?xml-stylesheet type="text/xsl" href="${appInfo.siteAddress}/main-sitemap.xsl"?>\n`}${sitemapBuilder.buildObject(sitemap)}`;
  res.setHeader("Content-Type", "text/xml").status(200).send(newXML);
}