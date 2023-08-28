import dynamic from "next/dynamic";
import { PropsWithoutRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from '../app/hooks';
import { wrapper } from '../app/store';
import Footer from "../components/footer";
import Layout from "../features/common/Layout";
import { setCurrentBlogPostCategoryLink, setUseDynamicNav } from "../features/common/layout.slice";
import { apiGetWPCategoryById, apiGetWPCategoryBySlug, apiGetWPChildCategories, apiGetWPPageBySlug, apiGetWPPostBySlug, apiGetWPPosts, apiGetWPSEOHeaderString, apiUpdatePostView } from "../features/wordpress/wordpress.api";
import { isEnableChildCategory, post_per_page, wpPermalinkType } from "../features/wordpress/wordpress.config";
import { getWPLink, pickCategory, WPCategory, WPPage, WPPost } from "../features/wordpress/wordpress.model";
import { setWPLatestPosts, setWPPopularPosts } from "../features/wordpress/wordpress.slice";
import useAppConfig from "../hooks/useAppConfig";
import useGeoInfo from "../hooks/useGeoInfo";
import usePageAuth from "../hooks/usePageAuth";
import useServerAppInfo from "../hooks/useServerAppInfo";
import { GetStaticPropsReduxContext } from "../types/nextReduxTypes";
import { getWebAppProps } from "../utils/getSEOProps";

const WPCategoryView = dynamic(() => import("../features/wordpress/WPCategoryView"));
const WPPageView = dynamic(() => import("../features/wordpress/WPPageView"));
const WPPostView = dynamic(() => import("../features/wordpress/WPPostView"));

type DynamicPageProps = {
  wpPage: WPPage;
  wpCategory: WPCategory;
  wpChildCategory: WPCategory;
  wpChildCategories: Array<WPCategory>;
  wpCategoryPosts: Array<WPPost>;
  wpCategoryPage: number;
  wpPost: WPPost;
  wpSEOHeaderString: string;
  wpLatestPosts: Array<WPPost>;
  wpPopularPosts: Array<WPPost>;
}

const DynamicPage = (props: PropsWithoutRef<DynamicPageProps>) => {
  const {
    wpPage,
    wpCategory,
    wpChildCategory,
    wpChildCategories,
    wpCategoryPosts,
    wpCategoryPage,
    wpPost,
    wpSEOHeaderString,
    wpLatestPosts,
    wpPopularPosts,
  } = props;
  const { appName } = useAppConfig();
  const dispatch = useDispatch();
  const appInfo = useSelector((state) => state.appInfos.appInfo);

  const bgColor = useMemo(() => {
    let bgColor = "transparent";
    if (appName === "ged") { bgColor = "#F5F7FB" };
    return bgColor;
  }, [appName]);

  usePageAuth();
  useGeoInfo();

  useEffect(() => {
    dispatch(setWPLatestPosts(wpLatestPosts));
    dispatch(setWPPopularPosts(wpPopularPosts))
    if (!!wpPost) {
      if (!!wpCategory) {
        dispatch(setCurrentBlogPostCategoryLink(`/${wpCategory.slug}`))
      }
      apiUpdatePostView({ appName, postId: wpPost.id });
    }
    return () => {
      dispatch(setCurrentBlogPostCategoryLink(""));
    }
  }, [])

  useEffect(() => {
    dispatch(setUseDynamicNav(false));
    return () => {
      dispatch(setUseDynamicNav(false));
    }
  }, []);

  const renderDynamicView = () => {
    return <Layout
      {...getWebAppProps(appInfo)}
      seoHeaderString={wpSEOHeaderString}
      backgroundColor={bgColor}
      disableAuth
      addFBComment={!!wpPost}
      enableSearch
    >
      {!wpPost
        ? (!!wpPage
          ? <WPPageView page={wpPage} />
          : (!!wpCategory && <WPCategoryView
            category={wpCategory}
            childCategory={wpChildCategory}
            childCategories={wpChildCategories}
            page={wpCategoryPage}
            posts={wpCategoryPosts}
          />))
        : <WPPostView
          post={wpPost}
          category={wpCategory}
          childCategory={wpChildCategory}
        />
      }
      <Footer />
    </Layout>
  }

  return <>{renderDynamicView()}</>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params, locale, defaultLocale }: GetStaticPropsReduxContext) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return {
    notFound: true
  }
  const appName = appInfo.appName;
  const slugs = params.slugs as string[];
  let wpPage: WPPage = null;
  let wpCategory: WPCategory = null;
  const wpChildCategories: Array<WPCategory> = [];
  let wpChildCategory: WPCategory = null;
  let wpCategoryPage = 1;
  let wpPost: WPPost = null;
  let wpSEOHeaderString = '';
  const wpCategoryPosts: Array<WPPost> = [];
  const wpLatestPosts: Array<WPPost> = [];
  const wpPopularPosts: Array<WPPost> = [];

  let postSlug = '';
  let isCategory = true;
  const [categorySlug, childSlug1, childSlug2, childSlug3, ..._restSlug] = slugs;
  const slugsLength = slugs.length;
  if (slugsLength === 1) {
    wpPage = await apiGetWPPageBySlug({ appName, slug: categorySlug, lang: locale });
  }
  if (wpPage) {
    const _wpSEOHeaderString = await apiGetWPSEOHeaderString({ appName, url: `${appInfo.siteAddress}${locale === defaultLocale ? "" : `/${locale}`}/${categorySlug}` });
    if (typeof _wpSEOHeaderString === "string") wpSEOHeaderString = _wpSEOHeaderString;
    else {
      return {
        redirect: {
          destination: getWPLink(_wpSEOHeaderString.redirect),
          permanent: true
        }
      }
    }
    return {
      props: {
        wpPage,
        wpSEOHeaderString,
      },
      revalidate: 600
    };
  }
  wpCategory = await apiGetWPCategoryBySlug({ appName, slug: categorySlug, lang: locale });
  if (!wpCategory) {
    if (wpPermalinkType[appName] === "post") isCategory = false;
    else return { notFound: true };
  } else if (isEnableChildCategory(appName)) {
    if (slugsLength >= 2 && childSlug1 !== "page") {
      wpChildCategory = await apiGetWPCategoryBySlug({ appName, slug: childSlug1, lang: locale });
    } else if (slugsLength === 1 || (childSlug1 === "page" && !isNaN(parseInt(childSlug2)))) {
      const _wpChildCategories = await apiGetWPChildCategories({ appName, parentId: wpCategory.id, lang: locale });
      wpChildCategories.push(..._wpChildCategories.map((e) => pickCategory({ category: e, fields: ["id", "name", "slug", "count", "link"] })));
    }
  }
  let categorySeoSlug = `/${categorySlug}`;
  if (!!wpChildCategory) categorySeoSlug += `/${childSlug1}`;
  if (isCategory) {
    const pageIndicator = !!wpChildCategory ? childSlug2 : childSlug1;
    const pageNum = !!wpChildCategory ? childSlug3 : childSlug2;
    const restSlug = !!wpChildCategory ? slugs.slice(2) : slugs.slice(3);
    if (pageIndicator === "page" && !isNaN(parseInt(pageNum)) && !restSlug?.length) {
      categorySeoSlug += `/${pageIndicator}/${pageNum}`;
      wpCategoryPage = parseInt(pageNum);
      const totalChildCategoryPosts = wpChildCategories.reduce((total, e) => (total += e.count, total), 0);
      const pageLimit = Math.ceil((!!wpChildCategory ? wpChildCategory.count : (wpCategory.count + totalChildCategoryPosts)) / post_per_page);
      if (wpCategoryPage > pageLimit) return { notFound: true };
    } else {
      const _postSlug = `${slugs.slice(!!wpChildCategory ? 2 : 1).join("/")}`;
      if (!!_postSlug) {
        isCategory = false;
        postSlug = `/${_postSlug}`;
      }
    }
  } else {
    const _postSlug = slugs.join("/");
    if (!!_postSlug) {
      isCategory = false;
      postSlug = `/${_postSlug}`;
    }
  }

  if (!!postSlug && postSlug !== "/") {
    wpPost = await apiGetWPPostBySlug({ appName, slug: postSlug, categoryId: wpChildCategory?.id ?? wpCategory?.id, lang: locale });
    if (!wpPost) return { notFound: true };
    if (!wpCategory) wpCategory = await apiGetWPCategoryById({ appName, id: wpPost.categories[0] });
  } else {
    const categoryId: number | number[] = !!wpChildCategory
      ? wpChildCategory.id
      : [wpCategory.id, ...(wpChildCategories.map((e) => e.id))];
    const posts = (await apiGetWPPosts({ appName, categoryId, page: wpCategoryPage, offset: (wpCategoryPage - 1) * post_per_page, lang: locale }))?.data || [];
    wpCategoryPosts.push(...posts);
  }
  const wpURL = `${appInfo.siteAddress}${locale === defaultLocale ? "" : `/${locale}`}${isCategory ? `${categorySeoSlug}` : (wpPermalinkType[appName] === "post" ? postSlug : `${categorySeoSlug}${postSlug}`)}/`;
  const _wpSEOHeaderString = await apiGetWPSEOHeaderString({ appName, url: wpURL });
  if (typeof _wpSEOHeaderString === "string") wpSEOHeaderString = _wpSEOHeaderString;
  else {
    return {
      redirect: {
        destination: getWPLink(_wpSEOHeaderString.redirect),
        permanent: true
      }
    }
  }
  const categoryId: number | number[] = !!wpChildCategory
    ? wpChildCategory.id
    : [wpCategory.id, ...(wpChildCategories.map((e) => e.id))];
  const _wpLatestPosts = (await apiGetWPPosts({ appName, offset: 0, page: 1, per_page: 3, categoryId }))?.data || [];
  const _wpPopularPosts = (await apiGetWPPosts({ orderby: 'views', appName, offset: 0, page: 1, per_page: 3, lang: locale }))?.data || []
  wpLatestPosts.push(..._wpLatestPosts);
  wpPopularPosts.push(..._wpPopularPosts)
  return {
    props: {
      wpCategory,
      wpChildCategory,
      wpChildCategories,
      wpCategoryPosts,
      wpCategoryPage,
      wpPost,
      wpSEOHeaderString,
      wpLatestPosts,
      wpPopularPosts,
    },
    revalidate: 600
  }
});

export const getStaticPaths = async () => {
  const appName = process.env.NEXT_PUBLIC_APP_NAME;
  if (!appName) throw new Error("appName is not defined");
  return {
    paths: [],
    fallback: "blocking"
  }
}

export default DynamicPage