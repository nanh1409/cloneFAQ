import moment from "moment";
import { NextRouter, useRouter } from "next/router";
import { parseCookies, setCookie } from "nookies";
import { useEffect } from "react";
import { AFFILIATE_SRC_KEY, AFFILIATE_UTM_MEDIUM, ARTICLE_SRC_KEY, ARTICLE_UTM_MEDIUM } from "./config";

function parseQueryStr(q: NextRouter["query"][string]) {
  return (Array.isArray(q) ? q.at(0) : q) || ""
}

// TODO: Rename into USE UTM_LINK
export type UseAffiliateLinkHookProps = {
  disabled?: boolean;
}

export default function useAffiliateLink(props: UseAffiliateLinkHookProps = {
  disabled: false
}) {
  const {
    disabled
  } = props;
  const isClient = typeof window !== "undefined";
  const router = useRouter();

  useEffect(() => {
    if (disabled) return;
    if (isClient && router.isReady) {
      const utmMedium = parseQueryStr(router.query.utm_medium);
      const utmSource = parseQueryStr(router.query.utm_source);
      if (utmMedium === AFFILIATE_UTM_MEDIUM && utmSource) {
        const now = moment();
        const end = moment(now).add(1, "week").endOf("day");

        setCookie(null, AFFILIATE_SRC_KEY, utmSource, {
          maxAge: Math.abs(now.diff(end, "seconds")),
          path: "/"
        })
      } else if (utmMedium === ARTICLE_UTM_MEDIUM && utmSource) {
        const now = moment();
        const end = moment(now).add(1, "week").endOf("day");

        setCookie(null, ARTICLE_SRC_KEY, utmSource, {
          maxAge: Math.abs(now.diff(end, "seconds")),
          path: "/"
        })
      }
    }
  }, [router.isReady, router.query, isClient, disabled])
}

export function getAffiliateSource() {
  const cookies = parseCookies();
  return cookies[AFFILIATE_SRC_KEY];
}

export function getArticleSource() {
  const cookies = parseCookies();
  return cookies[ARTICLE_SRC_KEY];
}