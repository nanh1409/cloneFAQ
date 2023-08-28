import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useSelector } from "../app/hooks";
import { wrapper } from "../app/store";
import Footer from "../components/footer";
import { apiGetAppSettingDetails } from "../features/appInfo/appInfo.api";
import { setAppInfo } from "../features/appInfo/appInfo.slice";
import Layout from "../features/common/Layout";
import { apiGetWPPosts } from "../features/wordpress/wordpress.api";
import { post_per_page } from "../features/wordpress/wordpress.config";
import { WPCategory, WPPost } from "../features/wordpress/wordpress.model";
import WPSearchBlogView from "../features/wordpress/WPSearchBlogView";
import { META_ROBOT_NO_INDEX_NO_FOLLOW } from "../modules/share/constraint";
import { getWebAppProps, getWebSEOProps } from "../utils/getSEOProps";

function SearchBlogPage({ listPost, wpLatestPosts, totalPost, query, wpPopularPosts }) {
    const appInfo = useSelector((state) => state.appInfos.appInfo);

    return (
        <Layout
            title={`Search Result For: ${query}`}
            robots={META_ROBOT_NO_INDEX_NO_FOLLOW}
            {...getWebAppProps(appInfo)}
        >
            <WPSearchBlogView listPost={listPost} wpLatestPosts={wpLatestPosts} wpPopularPosts={wpPopularPosts} totalPost={totalPost} />
            <Footer />
        </Layout>
    );
}

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
    const appName = process.env.NEXT_PUBLIC_APP_NAME;
    if (!appName) throw new Error("appName is not defined");
    const appInfo = await apiGetAppSettingDetails({ appName });
    context.store.dispatch(setAppInfo(appInfo));
    const wpLatestPosts: Array<WPPost> = [];
    const wpPopularPosts: Array<WPPost> = [];
    let wpPost: WPPost = null;
    let wpCategory: WPCategory = null;
    const query = context.query?.q
    const page = Number(context.query?.page)
    const _wpLatestPosts = (await apiGetWPPosts({ appName, offset: page - 1 || 0, page: page || 1, per_page: 3, categoryId: wpCategory?.id || wpPost?.categories[0] }))?.data || [];
    const _wpPopularPosts = (await apiGetWPPosts({ appName, offset: page - 1 || 0, page: page || 1, per_page: 3, orderby: 'views' }))?.data || [];
    const postData = (await apiGetWPPosts({
        search: query as string, appName, per_page: post_per_page,
        page: page || 1,
        offset: post_per_page * (page - 1 || 0)
    }))

    const totalPost = postData?.total
    const listPost = postData?.data
    wpLatestPosts.push(..._wpLatestPosts);
    wpPopularPosts.push(..._wpPopularPosts)
    return {
        props: {
            listPost,
            totalPost,
            wpLatestPosts,
            wpPopularPosts,
            query
        },
    }
})

export default SearchBlogPage;