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

export const getFormattedContentWithImg = (content: string, getCDN = (url: string) => url) => {
  if (!content) return "";
  const regex = /(\@PS@)[/a-z0-9-_\.]*(\@PE@)/gi;
  const matchesArray = content.match(regex);
  if (!matchesArray) return content;
  const style = `style="max-width: 70%; margin: 0px auto; display: block;"`;
  for (const match of matchesArray) {
    let uri = match.replace(IMG_START_TOKEN, '').replace(IMG_END_TOKEN, '');
    if (!uri.startsWith(GCS_BASE_URL)) {
      if (!uri.startsWith("/")) {
        uri = `/${uri}`
      }
      uri = `${GCS_BASE_URL}${uri}`
    }
    content = content.replace(match, `<img referrerpolicy="no-referrer" alt='' src='${getCDN(uri)}' ${style}></img>`)
  }
  return content;
}

export const getPurifiedContent = (html: string | Node) => DOMPurify.sanitize(html);
export const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email);
export const isValidatePhoneNumber = (phoneNumber: string) =>
  /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(phoneNumber)

export function secondsToHHMMSS(sec_num: number) {
  let hours: number | string = Math.floor(sec_num / 3600);
  let minutes: number | string = Math.floor((sec_num % 3600) / 60);
  let seconds: number | string = Math.floor(sec_num % 60);

  if (hours < 10) { hours = `0${hours}`; }
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${hours}:${minutes}:${seconds}`;
}

export function secondsToMMSS(sec_num: number) {
  const hours: number | string = Math.floor(sec_num / 3600);
  let minutes: number | string = Math.floor((sec_num % 3600) / 60);
  let seconds: number | string = Math.floor(sec_num % 60);
  if (hours > 0) minutes += hours * 60;
  if (minutes < 10) { minutes = `0${minutes}`; }
  if (seconds < 10) { seconds = `0${seconds}`; }
  return `${minutes}:${seconds}`;
}
