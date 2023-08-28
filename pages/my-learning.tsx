import { Container, Grid, LinearProgress, MenuItem, Select, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import { styled } from "@mui/styles";
import { unwrapResult } from "@reduxjs/toolkit";
import classNames from "classnames";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../app/hooks";
import { ROUTER_STUDY } from "../app/router";
import { wrapper } from "../app/store";
import Footer from "../components/footer";
import { setAppInfo } from "../features/appInfo/appInfo.slice";
import { fetchTopicProgressesStat, fetchTopicsByParentSlugStat, setCurrentStat, setStatTopics } from "../features/learning-stat/learningStat.slice";
import useAppConfig from "../hooks/useAppConfig";
import usePageAuth from "../hooks/usePageAuth";
import usePracticeData from "../hooks/usePracticeData";
import useServerAppInfo from "../hooks/useServerAppInfo";
import { SKILL_TYPE_LISTENING, SKILL_TYPE_READING, TOPIC_TYPE_EXERCISE, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../modules/share/constraint";
import AppSetting from "../modules/share/model/appSetting";
import Topic from "../modules/share/model/topic";
import { openUrl } from "../utils/system";

type ViewStat = "practice" | "flashCard" | "test" | "folder";

const appConfig = useAppConfig();
const Layout = dynamic(() => import("../features/common/Layout"), { ssr: false });

const LearningStatNav = styled("div")({
  backgroundColor: "#fff",
  borderRadius: "10px",
  top: "80px",
  position: "sticky",
  overflow: "auto",
  "& .learning-stat-block:not(:last-child)": {
    borderBottom: "2px solid #E9ECF3"
  },
  "& .learning-stat-block-tag": {
    paddingTop: "10px",
    paddingBottom: "16px",
    paddingLeft: "25px",
    paddingRight: "25px",
    fontWeight: 700,
    color: "#1d1d1d",
    fontSize: "16px"
  },
  "& .learning-stat-block-item": {
    padding: "8px 30px",
    cursor: "pointer",
    color: "#333",
    "&.active": {
      fontWeight: 600,
      backgroundColor: "#E9ECF3"
    },
    "&:hover": {
      backgroundColor: "rgba(204, 204, 204, 0.5)"
    }
  },
});

const LearningStatNavMobile = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "48px",
  marginBottom: "30px",
  // select
  '& .learning-stat-nav-mobile-select': {
    backgroundColor: ' #fff',
    padding: '0',
    height: '100%',
    marginRight: '10px',
    border: '2.5px solid #fff',
    boxShadow: 'inset 0px 2px 10px rgba(184, 184, 184, 0.5)',
    borderRadius: '10px !important',
    maxWidth: '130px',
    width: '100%',

  },
  '& .nav-select-active': {
    fontSize: '18px',
    fontWeight: 700,
    color: '#333',
    maxHeight: '44px',
    padding: '12px 14px',
    lineHeight: 'unset',
    marginBottom: '-8px',
    minHeight: '1.7em !important'
  },

  '& .nav-select-icon': {
    color: '#333'
  },

  '& fieldset': {
    border: 'none',
  },

  // tabs
  '& .learning-stat-nav-mobile-tabs': {
    backgroundColor: '#fff',
    height: '100%',
    padding: '0',
    border: '2.5px solid #fff',
    boxShadow: 'inset 0px 2px 10px rgba(184, 184, 184, 0.5)',
    borderRadius: '10px',
  },
  '& .nav-tabs-scroll-buttons.Mui-disabled': {
    display: 'none !important'
  },
  '& .nav-tabs-indicator': {
    display: 'none'
  },
  '& .nav-tab-item': {
    color: '#333',
    transition: 'all 0.25s',
    padding: '12px 16px',
    minHeight: 'unset',
    '&-selected': {
      backgroundColor: 'var(--menuBackground)',
      color: '#fff !important',
      lineHeight: 'unset'
    }
  },
})

const LearningStatOverview = styled("div")({
  backgroundColor: "#fff",
  borderRadius: "10px",
  padding: "16px 50px",
  "& .learning-stat-overview-title": {
    color: "var(--titleColor)",
    fontSize: "26px",
    fontWeight: 600,
    textAlign: "center"
  },
  "& .overview-progress": {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    "& .overview-progress-value": {
      backgroundColor: "#EBEEF0",
      width: "73px", height: "73px",
      borderRadius: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      fontWeight: 600,
      color: "#33CD99"
    }
  }
});

const LearningStatProgress = styled(LinearProgress)({
  height: "24px",
  borderRadius: "50px",
  backgroundColor: "#DEE1E7",
  flex: 1,
  "& .current-progress": {
    backgroundColor: "#01C971"
  }
});

const LearningStatTableBlock = styled("div")({
  marginTop: "10px",
  "& .topic-parent-name": {
    color: "var(--titleColor)",
    fontWeight: 600,
    marginBottom: "10px"
  }
});

const LearningStatTable = styled("table")({
  width: "100%",
  backgroundColor: "#fff",
  borderCollapse: "collapse",
  borderRadius: "10px",
  "& th, td": {
    border: "1px solid #F2F6FC",
    borderCollapse: "collapse"
  },
  "& thead tr": {
    height: "55px"
  },
  "& thead th": {
    color: "#333", fontSize: "18px", fontWeight: 600,
    "&:first-child": {
      width: "50%"
    }
  },
  "& tbody tr": {
    height: "45px",
    cursor: "pointer",
    "& td": {
      paddingLeft: "20px",
      paddingRight: "20px",
      "&:not(:first-child)": {
        textAlign: "center"
      }
    },
    "&:hover": {
      boxShadow: "0px 20px 20px rgba(0, 0, 0, 0.05)"
    }
  }
});


const MyLearningPage = (props: {
  appInfo: AppSetting
}) => {
  const { appInfo } = props;

  const currentStat = useSelector((state) => state.learningStatState.currentStat);
  const mapStatTopic = useSelector((state) => state.learningStatState.mapStatTopic);
  const mapTopicProgress = useSelector((state) => state.learningStatState.mapTopicProgress);
  const statTopics = useSelector((state) => state.learningStatState.statTopics);
  const mapExpandTopic = useSelector((state) => state.learningStatState.mapExpandTopic);

  const { loading, user, userId } = usePageAuth({ unAuthorizedRedirect: "/" });
  const {
    learningStatData = [],
    practiceCourseIndex,
    practiceParentSlug = null,
    testCourseIndex,
    testParentSlug = null
  } = usePracticeData();
  const practiceCourseId = (appInfo.courseIds ?? [])[practiceCourseIndex ?? 0] ?? "";
  const testCourseId = (appInfo.courseIds ?? [])[testCourseIndex ?? 0] ?? "";
  const dispatch = useDispatch();
  const router = useRouter();

  // const [currentStat, setCurrentStat] = useState<StatItem>({ tagIndex: 0, itemIndex: 0 });
  const [viewStat, setViewStat] = useState<ViewStat>("practice");
  const tagData = learningStatData[currentStat.tagIndex];
  const statData = (tagData?.data ?? [])[currentStat.itemIndex];
  const courseId = tagData.type === "practice" ? practiceCourseId : testCourseId;
  const statTopic = mapStatTopic[`${courseId}_${statData.slug}`];
  const childTopics = statTopic?.childrenTopics ?? [];
  const baseSlug = tagData.type === "practice" ? practiceParentSlug : testParentSlug;

  const theme = useTheme()
  const isTabletUI = useMediaQuery(theme.breakpoints.down('md'))

  const overviewProgress = useMemo(() => {
    if (!statData) return 0;
    if (!statTopic) return 0;
    const childTopics = statTopic.childrenTopics ?? [];
    let childTopicIds = childTopics.map((e) => e._id);
    if (statData.subjectType && statData.expandSubject) {
      const _childTopicIds: string[] = [];
      mapExpandTopic[statTopic.parentTopic._id]?.forEach(({ childrenTopics = [] }) => {
        _childTopicIds.push(...childrenTopics.map((e) => e._id));
      });
      childTopicIds = _childTopicIds;
    }
    const totalTopics = childTopicIds.length;
    const totalProgress = Object.values(mapTopicProgress).filter((tp) => childTopicIds.includes(tp.topicId)).reduce((total, tp) => {
      total += tp.progress;
      return total;
    }, 0);
    return Math.round((totalProgress / (totalTopics || 1) + Number.EPSILON) * 100) / 100;
  }, [currentStat, mapTopicProgress, mapStatTopic, mapExpandTopic]);

  const headers = useMemo(() => {
    const headers: string[] = [];
    if (viewStat === "practice") {
      let level = "Level", correct = "Total Correct", progress = "Progress";
      if (appConfig.appName === "toeic") {
        level = "Test";
      }
      if (router.locale === "vi") {
        correct = "Số câu đúng", progress = "Hoàn thành";
      }
      headers.push(level, correct, progress);
    } else if (viewStat === "test") {
      if (appConfig.appName === "toeic") {
        let totalTime = "Total Time";
        if (router.locale === "vi") {
          totalTime = "Thời gian";
        }
        headers.push("Test", "Reading Score", "Listening Score", totalTime);
      }
    } else if (viewStat === "flashCard") {
      let name = "Topic", memorized = "Memorized", unmemorized = "Unmemorized", progress = "Progress";
      if (router.locale === "vi") {
        name = "Chủ đề"; memorized = "Đã thuộc"; unmemorized = "Chưa thuộc"; progress = "Hoàn thành";
      }
      headers.push(name, memorized, unmemorized, progress);
    } else {
      let name = "Topic", progress = "Progress";
      if (router.locale === "vi") {
        name = "Chủ đề"; progress = "Hoàn thành";
      }
      if (statData?.flashCard && statData?.expandSubject) {
        let memorized = "Memorized", unmemorized = "Unmemorized";
        if (router.locale === "vi") {
          memorized = "Đã thuộc"; unmemorized = "Chưa thuộc";
        }
        headers.push(name, memorized, unmemorized, progress);
      } else {
        headers.push(name, progress);
      }
    }
    return headers;
  }, [viewStat, router.locale, statData]);

  const getDataTable = (_childTopics: Array<Topic>) => {
    const data: Array<Array<string | number>> = [];
    _childTopics.forEach((topic) => {
      const tp = mapTopicProgress[topic._id];
      if (viewStat === "practice") {
        data.push([topic.name, tp?.correctNum ?? 0, `${tp?.progress ?? 0}%`]);
      } else if (viewStat === "test") {
        const dataPush: Array<string | number> = [topic.name];
        if (appConfig.appName === "toeic") {
          const mapStats = tp?.statistics?.mapSkillTypeScore ?? {};
          dataPush.push(mapStats[SKILL_TYPE_READING] ?? 0, mapStats[SKILL_TYPE_LISTENING] ?? 0, moment.duration(tp?.totalTime ?? 0, "s").format("HH:mm:ss", { trim: false }));
        }
        data.push(dataPush);
      } else if (viewStat === "flashCard") {
        // TODO:
      } else {
        if (statData?.flashCard && statData?.expandSubject) {
          data.push([topic.name, `${tp?.correctNum ?? 0}`, `${tp?.incorrectNum ?? 0}`, `${tp?.progress ?? 0}%`])
        } else {
          data.push([topic.name, `${tp?.progress ?? 0}%`]);
        }
      }
    });
    return data;
  };

  useEffect(() => {
    if (!loading && !user) {
      dispatch(setCurrentStat({ tagIndex: 0, itemIndex: 0 }));
    }
  }, [loading, !!user]);

  useEffect(() => {
    if (!user) return;
    if (statData) {
      setViewStat(() => {
        if (statData.subjectType) return "folder";
        if (tagData.type === "practice") return "practice";
        return "test";
      });
      const { slug, subjectType } = statData;

      const keyFetched = `${courseId}_${slug}`;
      if (!mapStatTopic[keyFetched]) {
        fetchData({
          slug,
          baseSlug,
          topicTypes: subjectType ? [TOPIC_TYPE_LESSON] : (tagData.type === "practice" ? [TOPIC_TYPE_EXERCISE] : [TOPIC_TYPE_TEST]),
          expandSubject: statData.expandSubject
        })
      } else {
        if (statData.subjectType && statData.expandSubject) {
          const parentStatId = mapStatTopic[keyFetched].parentTopic._id;
          dispatch(setStatTopics(mapExpandTopic[parentStatId]));
        } else {
          dispatch(setStatTopics([mapStatTopic[keyFetched]]));
        }
        const topicIds = (mapStatTopic[keyFetched].childrenTopics ?? []).map((e) => e._id).filter((id) => !mapTopicProgress[id]);
        if (topicIds.length) dispatch(fetchTopicProgressesStat({ topicIds, userId }));
      }
    }
  }, [currentStat, !!user]);

  const fetchData = async (args: {
    slug: string | string[];
    topicTypes: number[];
    expandSubject?: boolean;
    baseSlug?: string;
    parentStatId?: string;
  }) => {
    const { slug, topicTypes, expandSubject, baseSlug: _baseSlug, parentStatId } = args;
    const action = await dispatch(fetchTopicsByParentSlugStat({
      courseId, slug,
      baseSlug: _baseSlug ?? baseSlug,
      local: false,
      topicFields: ["_id", "name", "slug"],
      exerciseFields: ["questionsNum"],
      field: "orderIndex",
      asc: true,
      topicTypes,
      disableStore: expandSubject,
      parentStatId
    }));
    const data = unwrapResult(action);
    const [{ children = [], slug: cBaseSlug = '', _id: _parentStatId = '' } = {}] = data;
    if (!expandSubject) {
      const topicIds = children.map((e) => e._id).filter((id) => !mapTopicProgress[id]);
      if (topicIds.length) {
        dispatch(fetchTopicProgressesStat({ topicIds, userId }));
      }
    } else {
      fetchData({
        slug: children.map((e) => e.slug),
        topicTypes: [TOPIC_TYPE_EXERCISE, TOPIC_TYPE_TEST],
        expandSubject: false,
        baseSlug: cBaseSlug,
        parentStatId: _parentStatId
      });
    }
  }

  const handleChangeStatItem = (item: { tagIndex: number; itemIndex: number }) => {
    dispatch(setCurrentStat(item));
  }

  const handleClickRow = (args: { topic: Topic; parentExpandSlug?: string; }) => {
    const { topic, parentExpandSlug = "" } = args;
    if (!topic || !tagData || !statData) return;
    let url = `/${ROUTER_STUDY}`;
    if (statData.subjectType && !statData.flashCard) {
      url += `/${statData.slug}${parentExpandSlug}/${topic.slug}`;
    } else {
      if (tagData.type === "practice") {
        if (statData.flashCard) {
          url += `/flash-card/${statData.slug}${parentExpandSlug}/${topic.slug}`;
        } else {
          url += `/${statData.slug}${parentExpandSlug}/${topic.slug}`;
        }
      } else if (tagData.type === "test") {
        url += `/test/${topic.slug}-${topic._id}`;
      }
    }
    openUrl(url);
  }

  return <div id="my-learning">
    {!loading && !!user
      ? <Layout title={router.locale === "vi" ? "Kết quả học tập" : "My Learning"} backgroundColor="#f2f6fc">
        <Container maxWidth="xl" sx={{ mt: "20px", mb: "20px" }}>
          <Grid container spacing={1}>
            <Grid item xs={12} md={3}>
              {!isTabletUI
                ? <LearningStatNav>
                  {learningStatData.map(({ tag, type, data }, i) => {
                    return <div className="learning-stat-block" key={i}>
                      <div className="learning-stat-block-tag">
                        {tag}
                      </div>
                      {data.map((item, _itemIndex) => {
                        const { name, slug } = item;
                        return <div
                          className={classNames("learning-stat-block-item", currentStat.tagIndex === i && currentStat.itemIndex === _itemIndex ? "active" : "")}
                          key={slug}
                          onClick={() => handleChangeStatItem({ tagIndex: i, itemIndex: _itemIndex })}
                        >
                          {name}
                        </div>
                      })}
                    </div>
                  })}
                </LearningStatNav>
                : <LearningStatNavMobile>
                  <Select
                    classes={{
                      select: 'nav-select-active',
                      iconOutlined: 'nav-select-icon'
                    }}
                    value={currentStat.tagIndex}
                    onChange={(e) => handleChangeStatItem({ tagIndex: Number(e.target.value), itemIndex: 0 })}
                    className="learning-stat-nav-mobile-select"
                  >
                    {learningStatData.map((item, index) => (
                      <MenuItem value={index} key={item.tag}>{item.tag}</MenuItem>
                    ))}
                  </Select>
                  <Tabs
                    className="learning-stat-nav-mobile-tabs"
                    classes={{
                      scrollButtons: 'nav-tabs-scroll-buttons',
                      indicator: "nav-tabs-indicator"
                    }}
                    variant="scrollable"
                    scrollButtons
                    allowScrollButtonsMobile
                    onChange={(e, value) => handleChangeStatItem({ tagIndex: currentStat.tagIndex, itemIndex: Number(value) })}
                    value={currentStat.itemIndex}
                  >
                    {learningStatData[currentStat.tagIndex].data.map((item, index) => (
                      <Tab classes={{ root: 'nav-tab-item', selected: 'nav-tab-item-selected' }} key={item.name} label={item.name} value={index} />
                    ))}
                  </Tabs>
                </LearningStatNavMobile>
              }
            </Grid>

            <Grid item xs={12} md={9}>
              <LearningStatOverview>
                <div className="learning-stat-overview-title">{statData?.name} Overview</div>
                <div className="overview-progress">
                  <div className="overview-progress-value">{overviewProgress}%</div>
                  <LearningStatProgress
                    value={overviewProgress}
                    variant="determinate"
                    classes={{ bar1Determinate: "current-progress" }}
                  />
                </div>
              </LearningStatOverview>

              {statTopics.map(({ parentTopic, childrenTopics = [] }) => {
                const data = getDataTable(childrenTopics);
                return <LearningStatTableBlock key={parentTopic._id}>
                  {statTopics.length > 1 && <div className="topic-parent-name">{parentTopic.name}</div>}
                  <LearningStatTable>
                    <thead>
                      <tr>
                        {headers.map((header) => <th key={header}>{header}</th>)}
                      </tr>
                    </thead>

                    <tbody>
                      {data.map((row, rowIndex) => {
                        const topic = childrenTopics?.find((_, i) => i === rowIndex);
                        return <tr key={rowIndex} title={`Go To: ${topic?.name}`} onClick={() => {
                          handleClickRow({
                            topic, parentExpandSlug:
                              statData.subjectType && statData.expandSubject ? `/${parentTopic.slug}` : undefined
                          })
                        }}>
                          {row.map((cell, cellIndex) => <td key={`${rowIndex}_${cellIndex}`}>{cell}</td>)}
                        </tr>
                      })}
                    </tbody>
                  </LearningStatTable>
                </LearningStatTableBlock>
              })}
            </Grid>
          </Grid>
        </Container>
        <Footer />
      </Layout>
      : <></>}
  </div >;
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }) => {
  if (!appConfig.userLearningFeature) return { notFound: true };
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true };
  return {
    props: {
      appInfo
    }
  }
});

export default MyLearningPage;