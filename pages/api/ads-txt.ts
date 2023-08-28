import { NextApiRequest, NextApiResponse } from "next";
import { apiGetAppSettingDetails } from "../../features/appInfo/appInfo.api";
import { errorResponse } from "../../utils/nextApiUtils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) return errorResponse(res, 404, "Not Found");
  const appInfo = await apiGetAppSettingDetails({ appName, fields: ["adsTxt"], local: true });
  if (!appInfo) return errorResponse(res, 404, "Not Found");
  res.send(`${appInfo.adsTxt}`);
}