import useServerAppInfo from "../../hooks/useServerAppInfo";
import { APIHandler, createHandler } from "../../utils/nextApiUtils";

export default createHandler(new APIHandler({
  get: async (req, res) => {
    const {
      dynamicLinkGooglePlay,
      dynamicLinkAppStore
    } = await useServerAppInfo();
    const ua = req.headers["user-agent"]?.toLowerCase() ?? "";
    if (!ua) {
      res.redirect(dynamicLinkGooglePlay);
      return;
    } else if (/windows phone/i.test(ua)) {
      // WINDOW PHONE
      res.redirect(dynamicLinkGooglePlay);
      return;
    } else if (/android/i.test(ua)) {
      res.redirect(dynamicLinkGooglePlay);
      return;
    } else if (/iphone|ipod|ipad/i.test(ua)) {
      res.redirect(dynamicLinkAppStore);
      return;
    }
    res.redirect(dynamicLinkGooglePlay);
    return;
  }
}))