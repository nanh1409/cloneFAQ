import { Breadcrumbs, Container, Grid, Pagination, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { useRouter } from "next/router";
import { PropsWithoutRef, useMemo, useState } from "react";
import { useSelector } from "../../app/hooks";
import RawLink from "../../components/RawLink";
import useAppConfig from "../../hooks/useAppConfig";
import { getPurifiedContent } from "../../utils/format";
import { openUrl } from "../../utils/system";
import AdsSelector from "../ads/AdsSelector";
import GoogleAdsense from "../ads/google-adsense";
import ThirdPartyAds from "../ads/third-party-ads";
import "./category.scss";
import PostImage from "./PostImage";
import PostMetaPublishDate from "./PostMetaPublishDate";
import PostMetaPublishWatched from "./PostMetaPublishWatched";
import SidePostList from "./SidePostList";
import { post_per_page } from "./wordpress.config";
import { getWPLink, WPCategory, WPPost } from "./wordpress.model";

export const tabsSidePostList = [
  {
    type: 0,
    name: 'Recent Posts'
  },
  {
    type: 1,
    name: "Popular Posts"
  }
]

const WPCategoryView = (props: PropsWithoutRef<{
  category: WPCategory;
  childCategory?: WPCategory;
  childCategories?: Array<WPCategory>;
  page: number;
  posts?: WPPost[];
}>) => {
  const {
    category,
    childCategory,
    childCategories = [],
    page,
    posts = []
  } = props;

  const latestPosts = useSelector((state) => state.wordPressState.latestPosts);
  const popularPosts = useSelector((state) => state.wordPressState.popularPosts);
  const appName = useSelector((state) => state.appInfos.appInfo?.appName);
  const [typeTabs, setTypeTabs] = useState(0)
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const isDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const isDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const { multiLocales } = useAppConfig();

  const totalPosts = useMemo(() =>
    !!childCategory ? childCategory.count : (category.count + childCategories.reduce((total, e) => (total += e.count, total), 0))
    , [category.count, !!childCategory, childCategory?.count, childCategories.length]);

  const handleChangePage = (page: number) => {
    const link = page <= 1 ? `/${category.slug}` : `/${category.slug}/page/${page}`;
    openUrl(multiLocales ? (router.locale === router.defaultLocale ? link : `/${router.locale}${link}`) : link);
  }

  return <Container maxWidth="xl" id="wp-category-view">
    <Grid container spacing={4}>
      <Grid item xs={12} sm={9}>
        <div id="category-main">
          <Breadcrumbs separator="-" className="site-breadcrumbs">
            <RawLink href="/">Home</RawLink>
            <RawLink href={`/${category.slug}/`}>{category.name}</RawLink>
            {!!childCategory && <RawLink href={`/${category.slug}/${childCategory.slug}`}>{childCategory.name}</RawLink>}
            {page > 1 && <RawLink href={`/${category.slug}/page/${page}/`}>Page {page}</RawLink>}
          </Breadcrumbs>

          <h1 className="cat-title">{category.name}</h1>
          <div className="cat-posts-list">
            <Grid container spacing={3}>
              {posts.map((post) => {
                const postMedia = (post._embedded["wp:featuredmedia"] ?? [])[0];
                return <Grid key={post.id} item xs={12} sm={6}>
                  <RawLink href={getWPLink(post.link)}>
                    <div className="post-item" title={post.title.rendered}>
                      <div className="post-thumb">
                        {!!postMedia && <PostImage media={postMedia} />}
                      </div>
                      <h2 className="post-title dot-2" dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} />
                      <div className="post-meta">
                        <PostMetaPublishDate date={post.date_gmt} className="post-publish-date" />
                        <PostMetaPublishWatched data={post.views} className="post-publish-watched" />
                      </div>
                      <div
                        className="post-excerpt"
                        dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.excerpt.rendered) }}
                      />
                    </div>
                  </RawLink>
                </Grid>
              })}
            </Grid>
          </div>

          <div className="cat-pagination">
            <Pagination count={Math.ceil(totalPosts / post_per_page)} page={page} onChange={(_, page) => handleChangePage(page)} />
          </div>
        </div>
      </Grid>

      <Grid item xs={12} sm={3}>
        <div id="category-secondary">
          {!!childCategories.length && <div className={classNames("side-child-categories", isTabletUI ? "tablet" : "")}>
            {childCategories.map((e) => <RawLink key={e.id} className="side-child-category-item" href={getWPLink(e.link)}>
              {e.name}
            </RawLink>)}
          </div>}
          <Tabs
            value={typeTabs}
            onChange={(_, value) => setTypeTabs(value)}
            textColor="inherit"
            variant="fullWidth"
            sx={{ paddingBottom: '10px' }}
          >
            {tabsSidePostList.map(item => (
              <Tab key={item.type} sx={{ fontSize: '16px', p: 0 }} onClick={() => setTypeTabs(item.type)} value={item.type} label={item.name} />
            ))}
          </Tabs>
          <SidePostList hidden={typeTabs !== 0} posts={latestPosts} />
          <SidePostList hidden={typeTabs !== 1} posts={popularPosts} />
          <AdsSelector
            googleAds={<GoogleAdsense name="Wide_Skyscraper" height={600} style={{ margin: "10px 0" }} />}
            // thirdPartyAds={appName === "toeic"
            //   && <ThirdPartyAds
            //     name="getpro-toeic"
            //     type={isDownMD ? (isDownSM ? "728x90" : "160x600") : "300x600"}
            //     style={{ margin: "10px 0" }}
            //     storageKey="blog_category_side_post_list"
            //     enableCheckUpgradeCached
            //   />}
          />
        </div>
      </Grid>
    </Grid>
  </Container>
}

export default WPCategoryView;