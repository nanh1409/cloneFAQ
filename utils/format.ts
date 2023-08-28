import DOMPurify from "isomorphic-dompurify";

const GCS_BASE_URL = "https://storage.googleapis.com";
const IMG_START_TOKEN = "@PS@";
const IMG_END_TOKEN = "@PE@";

export const getStorageURL = (_url: string = "") => {
  if (!_url) return "";
  let url = _url;
  if (!url.startsWith(GCS_BASE_URL) && !url.startsWith("http") && !url.startsWith("file://")) url = url.startsWith("/") ? `${GCS_BASE_URL}${url}` : `${GCS_BASE_URL}/${url}`;
  return url;
}

export const getFormattedContentWithImg = (content: string) => {
  const regex = /(\@PS@)[/a-z0-9-_\.]*(\@PE@)/gi;
  let m: RegExpExecArray;
  let images: string[] = [];
  while ((m = regex.exec(content)) !== null) {
    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    m.forEach((match, groupIndex) => {
      groupIndex == 0 && !images.includes(match) && images.push(match);
    });
  }
  if (images.length) {
    let style = `style="max-width: 70%; margin: 0px auto; display: block;"`;
    images.map((e, i) => {
      let image = e
        .replace(IMG_START_TOKEN, "")
        .replace(IMG_END_TOKEN, "");
      if (!image.includes(GCS_BASE_URL)) {
        if (image.startsWith("/")) {
          image = image.substring(1, image.length);
        }
        image = `${GCS_BASE_URL}/` + image;
      }
      content = content.replace(
        e,
        `<img alt="${i}" src="${image}" ${style}></img>`
      );
    });
  }
  return content;
}

export const getPurifiedContent = (html: string | Node) => DOMPurify.sanitize(html);
export const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);

/**
 * 
 * @param HTMLPart 
 * @returns 
 * @author Poyoman
 */
export const HTMLPartToTextPart = (HTMLPart: string) => (
  HTMLPart
    .replace(/\n/ig, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style[^>]*>/ig, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head[^>]*>/ig, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script[^>]*>/ig, '')
    .replace(/<\/\s*(?:p|div)>/ig, '\n')
    .replace(/<br[^>]*\/?>/ig, '\n')
    .replace(/<[^>]*>/ig, '')
    .replace('&nbsp;', ' ')
    .replace(/[^\S\r\n][^\S\r\n]+/ig, ' ')
);

export const getRouterLink = (slug: string) => slug.startsWith("/") ? slug : `/${slug}`;

export const nFormatter = (num: number, digits: number) => { 
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "K" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup.slice().reverse().find((item) => num >= item.value);
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}