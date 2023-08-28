import { getWPBaseURL } from "../../features/wordpress/wordpress.api";
import { wpHomeURL } from "../../features/wordpress/wordpress.config";
import { get } from "../../utils/fetcher";
import { APIHandler, createHandler } from "../../utils/nextApiUtils";

export default createHandler(new APIHandler({
  get: async (req, res) => {
    const type = req.query.type;
    if (type === "update_post_views") {
      const postId = req.query.post_id as string;
      const appName = req.query.app as string;
      const baseUrl = getWPBaseURL(appName);
      if (!baseUrl) return res.json(null);
      const { data } = await get({ endpoint: `${baseUrl}/wp-json/base/views/${postId}` });
      return res.json(data);
    }
    return res.json(null);
  }
}))