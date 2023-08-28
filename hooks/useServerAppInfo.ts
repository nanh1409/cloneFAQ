import { apiGetAppSettingDetails } from "../features/appInfo/appInfo.api";
import { setAppInfo } from "../features/appInfo/appInfo.slice";
import { GetStaticPropsReduxContext } from "../types/nextReduxTypes";

const useServerAppInfo = async (store?: GetStaticPropsReduxContext["store"]) => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  const appInfo = await apiGetAppSettingDetails({ appName, local: true });
  if (store) store.dispatch(setAppInfo(appInfo));
  return appInfo;
}

export default useServerAppInfo;