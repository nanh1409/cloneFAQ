import { NextApiRequest, NextApiResponse } from "next";
import { apiGetAppSettingDetails } from "../../features/appInfo/appInfo.api";
import { errorResponse } from "../../utils/nextApiUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) return errorResponse(res, 404, "Not Found");
  const appInfo = await apiGetAppSettingDetails({ appName, fields: ["siteAddress"], local: true });
  if (!appInfo) return errorResponse(res, 404, "Not Found");
  res.send(`User-agent: *
Disallow: /study/test/

User-agent: *
Disallow: /learning/

User-agent: *
Disallow: /login/

User-agent: *
Disallow: /api/

User-agent: *
Disallow: /api-cms/

User-agent: *
Disallow: /cdn-cgi/

User-agent: *
Disallow: /_next/static/*

User-agent: *
Disallow: /_next/data/*

User-agent: *
Allow: /

Sitemap: ${appInfo.siteAddress}/sitemap_index.xml
  `)
}