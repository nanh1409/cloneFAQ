import CalendarTodayTwoTone from "@mui/icons-material/CalendarTodayTwoTone";
import classNames from "classnames";
import moment from "moment";
import { PropsWithoutRef } from "react";
import "./wp.scss";

const PostMetaPublishDate = (props: PropsWithoutRef<{ date: string; className?: string; color?: string; }>) => {
  const { date, className, color } = props;
  return <div className={classNames("wp-post-publish-date", className)} style={{ color }}>
    <CalendarTodayTwoTone color="inherit" />&nbsp;<span>{moment(date).format("MMMM D, YYYY")}</span>
  </div>
}

export default PostMetaPublishDate;