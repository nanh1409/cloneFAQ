import { Breadcrumbs, Container, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useSelector } from "../../app/hooks";
import FBComments from "../../components/FBComments";
import RawLink from "../../components/RawLink";
import { getPurifiedContent } from "../../utils/format";
import AdsSelector from "../ads/AdsSelector";
import GoogleAdsense from "../ads/google-adsense";
import ThirdPartyAds from "../ads/third-party-ads";
import "./post.scss";
import PostMetaPublishDate from "./PostMetaPublishDate";
import PostMetaPublishWatched from "./PostMetaPublishWatched";
import FacebookShareIcon from "./social-icons/FacebookShareIcon";
import LinkedInShareIcon from "./social-icons/LinkedInShareIcon";
import PinterestShareIcon from "./social-icons/PinterestShareIcon";
import TumblrShareIcon from "./social-icons/TumblrShareIcon";
import TwitterShareIcon from "./social-icons/TwitterShareIcon";
import TableOfContents from "./TableOfContents";
import useHeadingsData from "./useHeadingsData";
import { getWPLink, WPCategory, WPPost } from "./wordpress.model";
import { useRouter } from "next/router";
import useAppConfig from "../../hooks/useAppConfig";

const WPPostView = (props: PropsWithoutRef<{
  category?: WPCategory;
  childCategory?: WPCategory;
  post: WPPost;
}>) => {
  const {
    category,
    childCategory,
    post
  } = props;
  const { locale, defaultLocale } = useRouter();
  const { multiLocales } = useAppConfig();
  const appName = useSelector((state) => state.appInfos.appInfo?.appName);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);
  const [sideAdsCount, setSideAdsCount] = useState(1);

  const { headings } = useHeadingsData({ rootElement: contentRef });
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const showSideAds = useMediaQuery(theme.breakpoints.up(1366));
  const wideSideAds = useMediaQuery(theme.breakpoints.between(1366, 1500));
  const halfPageSideAds = useMediaQuery(theme.breakpoints.up(1500));
  const slugPrefix = useMemo(() => (locale === defaultLocale ? "" : `/${locale}`), [locale, defaultLocale]);
  useEffect(() => {
    if (contentRef) {
      const sideAdsCount = Math.round(contentRef.clientHeight / 600);
      setSideAdsCount(sideAdsCount < 1 ? 1 : sideAdsCount);
    }
  }, [!!contentRef]);

  const renderSideAds = (position: "left" | "right" = "right") => {
    return !isTabletUI && <div className={classNames("wp-ads-container", position)}>
      {_.range(0, sideAdsCount).map((adsIdx) => {
        return <AdsSelector
          key={adsIdx}
          googleAds={<GoogleAdsense
            className="wp-post-side-ads"
            name="Wide_Skyscraper"
            height={600}
            style={{ maxWidth: "160px", width: "100%", height: "600px", marginBottom: "10px" }}
          />}
        // thirdPartyAds={appName === "toeic" && showSideAds && <ThirdPartyAds name="getpro-toeic" type={
        //   wideSideAds ? "160x600" : "300x600"
        // } className="wp-post-side-ads" style={{ maxWidth: "300px", marginBottom: "10px" }} storageKey="blog_post_view_side_ads" enableCheckUpgradeCached />}
        />
      })}
    </div>
  }

  return <div style={{ display: "flex", position: "relative" }}>
    {renderSideAds("left")}
    <Container maxWidth="xl" id="wp-post-view">
      <div className={classNames("post-content-main", isTabletUI ? "tablet" : "")}>
        {!isTabletUI && <div className="post-content-main-left">
          <TableOfContents headings={headings} className="post-toc-wrap" />
        </div>}

        <div className="post-content-main-view">
          <Breadcrumbs separator="-" className="site-breadcrumbs">
            <RawLink href={`${slugPrefix}/`}>{multiLocales ? (locale === defaultLocale ? 'Home' : 'Trang chủ') : 'Home'}</RawLink>
            {!!category && <RawLink href={`${slugPrefix}/${category.slug}`}>{category.name}</RawLink>}
            {!!childCategory && <RawLink href={`${slugPrefix}/${category.slug}/${childCategory.slug}`}>{childCategory.name}</RawLink>}
            <RawLink href={getWPLink(post.link)}><span dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} /></RawLink>
          </Breadcrumbs>
          <h1 className="post-title" dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} />
          <div className="post-meta">
            <PostMetaPublishDate date={post.date_gmt} />
            <PostMetaPublishWatched data={post.views} />
          </div>

          {isTabletUI && <TableOfContents headings={headings} className="post-toc-wrap-tablet" />}

          <div className="post-content"
            ref={setContentRef}
            dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.content.rendered) }}
          />


          <div id="social-share">
            <FacebookShareIcon url={post.link} />
            <PinterestShareIcon url={post.link} media={post._embedded?.["wp:featuredmedia"]?.[0]?.source_url} title={post.title.rendered} />
            <LinkedInShareIcon url={post.link} title={post.title.rendered} />
            <TwitterShareIcon url={post.link} title={post.title.rendered} />
            <TumblrShareIcon url={post.link} />
          </div>
          <FBComments href={post.link} />
        </div>
      </div>
    </Container>
    {renderSideAds()}
  </div>
}

export default WPPostView;