import { LinearProgress, useMediaQuery, useTheme } from "@mui/material";
import { withStyles } from "@mui/styles";
import classNames from "classnames";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo } from "react";
import { scroller } from "react-scroll";
import { useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import useAppConfig from "../../../hooks/useAppConfig";
import { TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import { DMVSubject } from "../../../types/appPracticeTypes";
import { openUrl } from "../../../utils/system";
import useUserPaymentInfo from "../../get-pro/useUserPaymentInfo";
import "./style.scss";

const TopicProgress = withStyles(() => ({
  barColorPrimary: { backgroundColor: "#4CAF50" }
}))(LinearProgress);

const SubTopicList = (props: PropsWithoutRef<{
  clickItemCallback?: () => void;
  onClickTopic?: (topic: Topic) => void;
  list?: Topic[];
  gridView?: boolean;
}>) => {
  const {
    clickItemCallback = () => { },
    list: _list,
    onClickTopic: _onClickTopic,
    gridView
  } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const topics = useSelector((state) => state.topicState.list);
  const hasSub = useSelector((state) => state.topicState.hasSub);
  const rootTopic = useSelector((state) => state.topicState.rootTopic);
  const subTopic = useSelector((state) => state.topicState.subTopic);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const userId = useSelector((state) => state.authState.userId);
  const router = useRouter();
  const { appName, hasState } = useAppConfig();
  const { paymentLoading, isValidTopicAccess } = useUserPaymentInfo();

  const isIELTSFullTest = useMemo(() => router.pathname.startsWith(`/${ROUTER_STUDY}/test`) && appName === "ielts", [router.pathname, appName]);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const subTopicList = useMemo(() =>
    typeof _list !== "undefined"
      ? _list
      : (
        hasSub ? topics.filter((e) => e.parentId === rootTopic?._id) : topics.filter((e) => !e.parentId)
      ), [hasSub, rootTopic?._id, topics.length, _list]
  );

  useEffect(() => {
    setTimeout(() => {
      try {
        scroller.scrollTo(subTopic?._id, {
          containerId: "sub-topic-list",
          duration: 800,
          delay: 0,
          smooth: "easeInOutQuart"
        });
      } catch (error) { }
    }, 500);
  }, [subTopic?._id]);

  const onClickTopic = (item: Topic) => {
  //   if (!isValidTopicAccess(item)) {
  //     window.location.href = `/${ROUTER_GET_PRO}?from=locked`;
  //     return;
  //   }
    if (item._id === subTopic?._id) return;
    if (typeof _onClickTopic !== "undefined") {
      _onClickTopic(item);
    } else {
      // PRACTICE
      const slugs = router.query.slugs as string[];
      let slug = `/${ROUTER_STUDY}`;
      // state-first
      if (appName === "dmv" && slugs[0] as DMVSubject === "dmv-cdl-permit") {
        slug += `/${slugs.slice(0, 2).join("/")}/${item.slug}`;
      } else if (hasSub) {
        slug += `/${slugs.slice(0, 1).join("/")}/${item.slug}`;
      } else {
        if (hasState) slug += `/${slugs[0]}/${item.slug}`;
        else slug += `/${item.slug}`;
      }
      openUrl(slug);
    }
    clickItemCallback();
  }

  return (<div id="sub-topic-list" className={classNames(gridView ? "sub-topic-grid-view" : "")}>
    {!paymentLoading && subTopicList.map((topic, i) => {
      const isActive = topic._id === subTopic?._id;
      const progress = topicProgresses[topic._id]?.userId === userId ? (topicProgresses[topic._id]?.progress ?? 0) : 0;
      // const progress = topicProgresses[topic._id] ? (topicProgresses[topic._id]?.progress ?? 0) : 0;
      let ieltsFullTestProgress = 0;
      if (progress < 25) ieltsFullTestProgress = 0;
      else if (progress < 50) ieltsFullTestProgress = 1;
      else if (progress < 75) ieltsFullTestProgress = 2;
      else if (progress < 100) ieltsFullTestProgress = 3;
      else ieltsFullTestProgress = 4;

      return (<div
        key={topic._id}
        id={topic._id}
        className={classNames("sub-topic-item", isActive ? "sub-active" : "", isTabletUI ? "tablet" : "")}
        onClick={() => onClickTopic(topic)}
      >
        <div className="sub-topic-item-header">
          <div className="sub-topic-item-name dot-1">{topic.name}</div>
          {/* {!isValidTopicAccess(topic) && <Lock className="item-locked" fontSize="small" />} */}
        </div>
        {topic.type !== TOPIC_TYPE_TEST &&
          <div className="sub-topic-progress">
            <TopicProgress
              className={classNames("sub-topic-progress-bar", isTabletUI ? "tablet" : "")}
              color="primary"
              variant="determinate"
              value={progress}
              style={{ flex: 1 }}
            />
            <div
              className="topic-progress-percent"
              style={
                {
                  color: progress > 0 ? "#62B966" : "unset",
                  marginLeft: "4px"
                }
              }
            >
              {progress}%
            </div>
          </div>
        }
        {isIELTSFullTest && <div className="sub-topic-progress-ielts">
          {ieltsFullTestProgress} / 4
        </div>}
      </div>)
    })}
  </div>)
}

export default SubTopicList;