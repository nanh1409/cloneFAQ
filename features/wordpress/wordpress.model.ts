import _ from "lodash";
import useAppConfig from "../../hooks/useAppConfig";

export type WPStatus = "publish" | "future" | "draft" | "pending" | "private";
export interface WPCategory {
  id: number;
  count: number;
  description: string;
  name: string;
  slug: string;
  link: string;
}

export interface WPAttachment extends WPPost {
  alt_text: string;
  source_url: string;
  media_details: {
    width: number;
    height: number;
    sizes: {
      [size: string]: {
        width: number;
        height: number;
        source_url: string;
      }
    }
  }
}

export interface WPPost {
  id: number;
  date_gmt: string | null;
  slug: string;
  status: WPStatus,
  type: string,
  link: string;
  categories: Array<number>;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  views?: number;
  _embedded: {
    "wp:featuredmedia": Array<WPAttachment>
  }
}

export interface WPPage {
  id: number;
  link: string;
  slug: string;
  status: WPStatus;
  type: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  }
}

export const pickPost = (args: { post: WPPost, withContent?: boolean }) => {
  const { post, withContent = false } = args;
  const keys = ["id", "date_gmt", "slug", "status", "type", "link", "title", "excerpt", "_embedded", "categories", "views"];
  if (withContent) keys.push("content");
  return _.pick<WPPost>(post, keys) as WPPost;
}

export const getWPLink = (link: string) => {
  const appConfig = useAppConfig();
  return link.startsWith("http") && (process.env.NODE_ENV !== "production" || appConfig.testMode)
    ? link.replace(/(https?:\/\/)(.*?)(\/.*)/g, '$3')
    : link
}

export const pickCategory = (args: { category: WPCategory; fields?: Array<keyof WPCategory> }) => {
  const { category, fields = ["id", "name", "count", "description", "slug", "link"] } = args;
  return _.pick<WPCategory>(category, fields) as WPCategory;
}