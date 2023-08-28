import { Container, Grid, Pagination, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSelector } from "../../app/hooks";
import RawLink from "../../components/RawLink";
import PostImage from "../../features/wordpress/PostImage";
import PostMetaPublishDate from "../../features/wordpress/PostMetaPublishDate";
import SidePostList from "../../features/wordpress/SidePostList";
import { post_per_page } from "../../features/wordpress/wordpress.config";
import { getWPLink, WPPost } from "../../features/wordpress/wordpress.model";
import { getPurifiedContent } from "../../utils/format";
import { openUrl } from "../../utils/system";
import PostMetaPublishWatched from "./PostMetaPublishWatched";
import { tabsSidePostList } from "./WPCategoryView";
import './wpSearchBlog.scss';

function WPSearchBlog({ listPost, wpLatestPosts, totalPost, wpPopularPosts }: { listPost: Array<WPPost>, wpLatestPosts: Array<WPPost>, totalPost: number, wpPopularPosts: Array<WPPost> }) {
    const router = useRouter()
    const queryString = router.query?.q
    const page = Number(router.query?.page || 1)
    const handleChangePage = (page: number) => {
        const link = page <= 1 ? `/search?q=${queryString}&page=1` : `/search?q=${queryString}&page=${page}`;
        openUrl(link);
    }
    const [typeTabs, setTypeTabs] = useState(0)

    return (
        <div id='search-blog'>
            <Container maxWidth='xl'>
                <Grid container spacing={4}>
                    <Grid key='col-left' item xs={12} sm={9}>
                        <div className='search-blog-main'>
                            <div className='search-title'>
                                <h1>{listPost.length ? `Search Result For: ${queryString}` : "Sorry, but nothing matched your search terms. Please try again with some different keywords."}</h1>
                            </div>
                            <div className='search-post-list'>
                                <Grid container spacing={3}>
                                    {listPost.map(post => {
                                        const postMedia = (post?._embedded["wp:featuredmedia"] ?? [])[0];
                                        return (
                                            <Grid key={post.id} item xs={12} sm={6}>
                                                <RawLink href={getWPLink(post.link)}>
                                                    <div className='search-post-item'>
                                                        <div className="search-post-thumb">
                                                            {!!postMedia && <PostImage media={postMedia} />}
                                                        </div>
                                                        <h2 className="search-post-title dot-2" dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} />
                                                        <div className="search-post-meta">
                                                            <PostMetaPublishDate date={post.date_gmt} className="search-post-publish-date" />
                                                            <PostMetaPublishWatched data={post.views} className="search-post-publish-watched" />
                                                        </div>
                                                        <div
                                                            className="search-post-excerpt"
                                                            dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.excerpt.rendered) }}
                                                        />
                                                    </div>
                                                </RawLink>
                                            </Grid>
                                        )
                                    })}
                                </Grid>
                            </div>

                            <div className="search-pagination">
                                {!!listPost.length && <Pagination count={Math.ceil(totalPost / post_per_page)} page={page} onChange={(_, page) => handleChangePage(page)} />}
                            </div>
                        </div>
                    </Grid>
                    <Grid key='col-right' item xs={12} sm={3}>
                        <div id="search-recent-posts">
                            <Tabs
                                value={typeTabs}
                                onChange={(_, value) => setTypeTabs(value)}
                                textColor="inherit"
                                sx={{ paddingBottom: '10px' }}
                                variant="fullWidth"
                            >
                                {tabsSidePostList.map(item => (
                                    <Tab key={item.type} sx={{ fontSize: '16px', p: 0 }} onClick={() => setTypeTabs(item.type)} value={item.type} label={item.name} />
                                ))}
                            </Tabs>
                            <SidePostList hidden={typeTabs !== 0} posts={wpLatestPosts} />
                            <SidePostList hidden={typeTabs !== 1} posts={wpPopularPosts} />
                        </div>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default WPSearchBlog;