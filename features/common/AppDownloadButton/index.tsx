import Bowser from "bowser";
import classNames from "classnames";
import { CSSProperties, memo, PropsWithoutRef, useMemo, useState } from "react";
import { useSelector } from "../../../app/hooks";
import { mobileAndTabletCheck } from "../../../utils/system";
import "./style.scss";
import dynamic from "next/dynamic";

const GooglePlayBadgeIcon = dynamic(() => import("./GooglePlayBadgeIcon"), { ssr: false })
const AppStoreBadgeIcon = dynamic(() => import("./AppStoreBadgeIcon"), { ssr: false })

const AppDownloadButton = (props: PropsWithoutRef<{
  link?: string; source: "chplay" | "appstore"; className?: string; linkStyle?: CSSProperties;
  color?: string; hoverColor?: string;
  background?: string; hoverBackround?: string;
  border?: string; hoverBorder?: string;
}>) => {
  const hasGtag = typeof gtag !== "undefined";
  const {
    link, source, className, linkStyle,
    color, hoverColor,
    background, hoverBackround,
    border, hoverBorder
  } = props;
  const [hover, setHover] = useState(false);
  const dynamicLink = useSelector((state) => source === "chplay"
    ? state.appInfos.appInfo?.dynamicLinkGooglePlay
    : (source === "appstore" ? state.appInfos.appInfo?.dynamicLinkAppStore : "")
  );
  const displayLink = useMemo(() => dynamicLink || link, [dynamicLink, link]);
  const isClient = typeof window !== "undefined";
  const ua = useMemo(() => isClient ? navigator.userAgent : "", [isClient]);
  const platform = useMemo(() => isClient ? Bowser.parse(ua).os.name : null, [ua]);
  const isIOSWebView = useMemo(() => {
    if (!isClient) return true;
    // @ts-ignore
    const standalone = window.navigator.standalone;
    const ua = window.navigator.userAgent.toLowerCase();
    const iOS = /iphone|ipod|ipad/.test(ua);
    const safari = /safari/.test(ua);
    return iOS && !standalone && !safari;
  }, [isClient]);

  const {
    stroke,
    fill,
    contentFill
  } = useMemo(() => ({
    stroke: hover ? hoverBorder : border,
    fill: hover ? hoverBackround : background,
    contentFill: hover ? hoverColor : color
  }), [hover]);

  const sendDownloadAnalytics = () => {
    if (hasGtag) {
      gtag("event", "click", {
        event_category: "download_app",
        event_label: source === "chplay" ? "download_app_android" : "download_app_ios"
      });
    }
  }

  return (<a href={displayLink} className="plain-anchor-tag" style={{ ...linkStyle }} onClick={(event) => {
    event.preventDefault();
    sendDownloadAnalytics();
    window.open(mobileAndTabletCheck() ? displayLink : link, "_blank");
  }}>
    <div className={classNames("app-download-btn", className)} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {source === "chplay"
        ? <GooglePlayBadgeIcon stroke={stroke} fill={fill} contentFill={contentFill} hidden={(platform === "iOS" && mobileAndTabletCheck()) || isIOSWebView} />
        : <AppStoreBadgeIcon stroke={stroke} fill={fill} contentFill={contentFill} hidden={platform === "Android" && mobileAndTabletCheck()} />}
    </div>
  </a>)
}

export default memo(AppDownloadButton);