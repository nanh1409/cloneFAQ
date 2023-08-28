import classNames from "classnames";
import { PropsWithoutRef } from "react";
import VisibilityIcon from '@mui/icons-material/Visibility';
import "./wp.scss";

const PostMetaPublishWatched = (props: PropsWithoutRef<{ data: number, className?: string, color?: string }>) => {
    const { data, className, color } = props;
    return <div className={classNames("wp-post-publish-watched", className)} style={{ color }}>
        <VisibilityIcon color="inherit" />&nbsp;<span>{data}</span>
    </div>
}

export default PostMetaPublishWatched;