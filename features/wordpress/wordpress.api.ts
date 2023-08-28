import { get } from "../../utils/fetcher"
import { getNextEndpoint } from "../../utils/nextApiUtils";
import { post_per_page, wpHomeURL } from "./wordpress.config";
import { pickPost, WPCategory, WPPage, WPPost } from "./wordpress.model";

export const getWPBaseURL = (appName: string) => {
  return wpHomeURL[appName];
}

export const apiGetWPCategoryBySlug = async (args: {
  appName: string; slug: string; lang?: string;
}): Promise<WPCategory> => {
  const { appName, slug, lang } = args;
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return null;
  const { data, error } = await get({ endpoint: `${baseUrl}/wp-json/wp/v2/categories`, params: { slug, per_page: 1, lang } });
  return error ? null : (data[0] || null);
}

export const apiGetWPCategoryById = async (args: {
  appName: string; id: number;
}): Promise<WPCategory> => {
  const { appName, id } = args;
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return null;
  const { data, error } = await get({ endpoint: `${baseUrl}/wp-json/wp/v2/categories/${id}` });
  return error ? null : data;
}

export const apiGetWPSEOHeaderString = async (args: {
  appName: string; url: string;
}): Promise<string | {
  redirect: string
}> => {
  const { appName, url } = args;
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return "";
  const { data, error: _error } = await get({ endpoint: `${baseUrl}/wp-json/rankmath/v1/getHead`, params: { url }, getRedirectResponseURL: true });
  let error = _error;
  let redirect = false;
  if (!!data?.responseURL && data?.responseURL !== url) {
    error = true;
    redirect = true;
  }
  return error ? (redirect ? {
    redirect: data?.responseURL ?? ""
  } : "") : data.head;
}

export const apiGetWPPostBySlug = async (args: {
  appName: string; slug: string; categoryId?: number; lang?: string;
}): Promise<WPPost> => {
  const { appName, slug, categoryId, lang } = args;
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return null;
  const { data, error } = await get({ endpoint: `${baseUrl}/wp-json/wp/v2/posts`, params: { slug, per_page: 1, categories: categoryId, _embed: true, lang } });
  return error ? null : Array.isArray(data) && !!data.length ? (pickPost({ post: data[0], withContent: true }) || null) : null;
}

export type GetWPPostsArgs = {
  appName: string;
  categoryId?: number | number[];
  page: number;
  per_page?: number;
  offset: number;
  search?: string;
  lang?: string;
  orderby?: "date" | "views";
}

export const apiGetWPPosts = async (args: GetWPPostsArgs): Promise<{
  data: Array<WPPost>
  total: number
}> => {
  const {
    appName,
    categoryId,
    per_page = post_per_page,
    ...payload
  } = args;
  const params: any = { ...payload, per_page, categories: categoryId, _embed: true };
  if (typeof categoryId !== "undefined") Object.assign(params, { categories: Array.isArray(categoryId) ? categoryId.join(",") : categoryId });
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return { data: [], total: 0 };
  const { data, error, headers } = await get({ endpoint: `${baseUrl}/wp-json/wp/v2/posts`, params });
  return {
    data: ((error ? [] : (Array.isArray(data) ? data : [])) as Array<WPPost>).map((post) => pickPost({ post })),
    total: Number(headers.get("x-wp-total") || 0)
  };
}

export const apiGetWPChildCategories = async (args: { appName: string; parentId: number; lang?: string }): Promise<Array<WPCategory>> => {
  const { appName, parentId, lang } = args;
  const params: any = { parent: parentId, lang };
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return [];
  const { data, error } = await get({ endpoint: `${baseUrl}/wp-json/wp/v2/categories`, params });
  return error ? [] : data;
};

export const apiGetWPPageBySlug = async (args: {
  appName: string; slug: string; lang?: string;
}): Promise<WPPage> => {
  const { appName, slug, lang } = args;
  const baseUrl = getWPBaseURL(appName);
  if (!baseUrl) return null;
  const { data, error } = await get({ endpoint: `${baseUrl}/wp-json/wp/v2/pages`, params: { slug, per_page: 1, lang } });
  return error ? null : (data[0] || null);
}

export const apiUpdatePostView = async (args: {
  appName: string; postId: string | number;
}): Promise<number> => {
  const { appName, postId } = args;
  const { data, error } = await get({ endpoint: getNextEndpoint(`/api/wp/?type=update_post_views&post_id=${postId}&app=${appName}`) });
  return error ? 0 : data;
}