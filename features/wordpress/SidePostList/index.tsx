import Image from "next/image";
import { PropsWithoutRef } from "react";
import RawLink from "../../../components/RawLink";
import { getPurifiedContent } from "../../../utils/format";
import PostImage from "../PostImage";
import PostMetaPublishDate from "../PostMetaPublishDate";
import PostMetaPublishWatched from "../PostMetaPublishWatched";
import { getWPLink, WPPost } from "../wordpress.model";
import "./sidePostList.scss";

const SidePostList = (props: PropsWithoutRef<{
  posts: Array<WPPost>;
  hidden?: boolean
}>) => {
  return <div className="side-post-list" style={{ display: props.hidden ? 'none' : '' }}>
    {props.posts.map((post) => {
      const postMedia = (post._embedded["wp:featuredmedia"] ?? [])[0];
      return <RawLink key={post.id} href={getWPLink(post.link)}>
        <div className="side-post-list-item">
          <div className="post-thumb">
            {!!postMedia && <PostImage media={post._embedded["wp:featuredmedia"][0]} />}
          </div>

          <div className="post-title" dangerouslySetInnerHTML={{ __html: getPurifiedContent(post.title.rendered) }} />
          <div className="post-publish">
            <PostMetaPublishDate date={post.date_gmt} className="post-publish-date" />
            <PostMetaPublishWatched data={post.views} className="post-publish-watched" />
          </div>
        </div>
      </RawLink>
    })}
  </div>
}

export default SidePostList;