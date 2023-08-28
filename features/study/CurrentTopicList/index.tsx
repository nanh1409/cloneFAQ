import CheckOutlined from "@mui/icons-material/CheckOutlined";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { Fragment, PropsWithoutRef, useEffect, useMemo } from "react";
import { scroller } from "react-scroll";
import { useDispatch, useSelector } from "../../../app/hooks";
import { TOPIC_TYPE_LESSON } from "../../../modules/share/constraint";
import useUserPaymentInfo from "../../get-pro/useUserPaymentInfo";
import { setCurrentStudyInfo, setCurrentTopic, setTopicLoading, TopicItem } from "../topic.slice";
import ProChildTopicIcon from "./ProChildTopicIcon";
import "./style.scss";


const _TOPIC_CHUNK_SIZE = 3;
// const currentTopicList = [
//   { _id: 1, name: "Exercise 1" },
//   { _id: 2, name: "Exercise 2" },
//   { _id: 3, name: "Exercise 3" },
//   { _id: 4, name: "Exercise 4" },
//   { _id: 5, name: "Exercise 5" },
//   { _id: 6, name: "Exercise 6" },
//   { _id: 7, name: "Exercise 7" },
//   { _id: 8, name: "Exercise 8" },
//   { _id: 9, name: "Exercise 9" },
// ]

function getChunks<R>(arr: R[], chunkSize: number) {
  if (chunkSize < 0) return [];
  return _.reduce(arr, (chunks: Array<Array<R>>, item, index) => {
    const chunkIndex = Math.floor(index / chunkSize);
    chunks[chunkIndex] = [...(chunks[chunkIndex] || []), item];
    return chunks;
  }, []);
}

const CurrentTopicList = (props: PropsWithoutRef<{ clickItemCallback?: () => void; }>) => {
  const { clickItemCallback = () => { } } = props;
  const topics = useSelector((state) => state.topicState.list);
  const subTopic = useSelector((state) => state.topicState.subTopic);
  const studyBaseSlug = useSelector((state) => state.topicState.studyBaseSlug);
  const currentTopic = useSelector((state) => state.topicState.currentTopic);
  const topicLoading = useSelector((state) => state.topicState.loading);
  const topicProgesses = useSelector((state) => state.topicState.topicProgresses);
  const userId = useSelector((state) => state.authState.userId);
  const topicChunkSize = useSelector((state) => state.studyLayoutState.topicChunkSize);
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const { paymentLoading, isValidTopicAccess, isProAcc } = useUserPaymentInfo();

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const TOPIC_CHUNK_SIZE = topicChunkSize ?? _TOPIC_CHUNK_SIZE;

  const {
    lessonList,
    currentTopicList
  } = useMemo(() => {
    const list = topics.filter((e) => e.parentId === subTopic?._id);
    return ({
      lessonList: list.filter((e) => e.type === TOPIC_TYPE_LESSON),
      currentTopicList: list.filter((e) => e.type !== TOPIC_TYPE_LESSON),
    })
  }, [subTopic?._id, topics.length]);

  const lessonListHeight = useMemo(() => lessonList.length
    ? (lessonList.length >= 3 ? 130 : (lessonList.length === 2 ? 85 : 40))
    : 0, [lessonList.length]);

  const topicChunks = useMemo(() =>
    getChunks(currentTopicList, topicChunkSize ?? TOPIC_CHUNK_SIZE),
    [currentTopicList.length, topicChunkSize]);

  const topicHeight = useMemo(() => topicChunks.length
    ? (topicChunks.length >= 3 ? 130 : (topicChunks.length === 2 ? 85 : 40))
    : 0, [topicChunks.length]);

  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      try {
        scroller.scrollTo(currentTopic?._id, {
          containerId: currentTopic?.type === TOPIC_TYPE_LESSON
            ? "current-topic-lesson-list" : "current-topic-list",
          duration: 800,
          delay: 0,
          smooth: 'easeInOutQuart'
        });
      } catch (error) { }
    }, 500);
  }, [currentTopic?._id]);

  const onClickTopic = (item: TopicItem) => {
    // if (!isValidTopicAccess(item)) {
    //   window.location.href = `/${ROUTER_GET_PRO}?from=locked`;
    //   return;
    // }
    if (item._id === currentTopic?._id) return;
    if (topicLoading) return;
    clickItemCallback();
    dispatch(setTopicLoading(true));
    dispatch(setCurrentStudyInfo({ courseId: item.courseId, studyScoreId: '', studyScoreDataId: '' }));
    const slug = `/${studyBaseSlug}/${item.slug}`;
    router.replace(slug, undefined, { shallow: true });
    dispatch(setCurrentTopic(item));
    dispatch(setTopicLoading(false));
  }

  return (!paymentLoading && (!!currentTopicList.length || !!lessonList.length)
    ? <>
      {!!currentTopicList.length && !!lessonList.length && <div className="current-level-list-label">Lessons</div>}
      {!!lessonList.length && <div id="current-topic-lesson-list" className="current-topic-list" style={{ height: lessonListHeight }}>
        {lessonList.map((lesson) => {
          const isActive = currentTopic?._id === lesson._id;
          const progress = topicProgesses[lesson._id]?.userId === userId ? (topicProgesses[lesson._id]?.progress ?? 0) : 0;
          return <Fragment key={lesson._id}>
            <div
              className={classNames(
                "topic-level-item item-lesson",
                isActive ? "current-level" : "",
              )}
              onClick={() => onClickTopic(lesson)}
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                <span className="level-wrap level-wrap-lesson">
                  <span className="level-name level-lesson-name dot-1">{lesson.name}</span>
                  {/* {!isValidTopicAccess(lesson) && <Lock fontSize="inherit" className="level-lock" />} */}
                </span>
                {progress > 0 && <CheckOutlined color="inherit" sx={{ zIndex: 1, mr: "10px" }} />}
              </Box>
              <div
                className={classNames(
                  "level-progress",
                  isActive ? "current-level" : ""
                )}
                style={{
                  background: "#fff",
                  width: `${progress}%`,
                  borderTopRightRadius: progress <= 90 ? 0 : 10,
                  borderBottomRightRadius: progress <= 90 ? 0 : 10
                }}
              />
            </div>
          </Fragment>
        })}
      </div>}

      {!!currentTopicList.length && <>
        {!!lessonList.length && !!currentTopicList.length && <div className="current-level-list-label">Practices</div>}
        <div id="current-topic-list" className="current-topic-list" style={{ height: isTabletUI ? "67vh" : topicHeight }}>
          {topicChunks.map((chunk, index) => {
            const isReversed = index % 2 !== 0;
            return <Grid container key={index} className="topic-levels" spacing={1} flexDirection={isReversed ? "row-reverse" : "row"}>
              {chunk.map((topic, cIndex) => {
                const isActive = currentTopic?._id === topic._id;
                const hasAfterConnector = cIndex < TOPIC_CHUNK_SIZE - 1 && cIndex !== chunk.length - 1;
                const hasBeforeConnector = index > 0 && cIndex === 0;
                const progress = topicProgesses[topic._id]?.userId === userId ? (topicProgesses[topic._id]?.progress ?? 0) : 0;
                const showPro = !!topic.accessLevel && appInfo?.usingGetPro && !isProAcc;
                // const progress = topicProgesses[topic._id] ? (topicProgesses[topic._id]?.progress ?? 0) : 0;
                return (
                  <Grid item xs={Math.floor(12 / TOPIC_CHUNK_SIZE)} key={topic._id}>
                    <div
                      id={topic._id}
                      className={classNames(
                        "topic-level-item",
                        isActive ? "current-level" : "",
                        hasAfterConnector ? (isReversed ? "after-connector-reversed" : "after-connector") : "",
                        hasBeforeConnector ? "before-connector" : "",
                        !isActive && progress > 0 ? "has-progress-border" : "",
                        progress === 0 && !isActive ? "no-progress" : "",
                        progress === 0 && hasAfterConnector ? "after-connector-2" : "",
                        progress === 0 && hasBeforeConnector ? "before-connector-2" : ""
                      )}
                      onClick={() => onClickTopic(topic)}
                    >
                      {/* {showPro && <span className="level-pro-icon"><ProChildTopicIcon id={topic._id} /></span>} */}
                      <span className="level-wrap">
                        <span className="level-name">{topic.name}</span>
                        {/* {!isValidTopicAccess(topic) && <Lock fontSize="inherit" className="level-lock" />} */}
                      </span>
                      <div
                        className={classNames(
                          "level-progress",
                          isActive ? "current-level" : ""
                        )}
                        style={{
                          background: "#fff",
                          width: `${progress}%`,
                          borderTopRightRadius: progress <= 90 ? 0 : 10,
                          borderBottomRightRadius: progress <= 90 ? 0 : 10,
                        }}
                      />
                    </div>
                  </Grid>
                )
              })}
            </Grid>
          })}
        </div>
      </>}
    </>
    : <></>
  )
}

export default CurrentTopicList;