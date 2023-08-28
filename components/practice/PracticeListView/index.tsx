import Check from "@mui/icons-material/Check";
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import AdsSelector from "../../../features/ads/AdsSelector";
import GoogleAdsense from "../../../features/ads/google-adsense";
import ThirdPartyAds from "../../../features/ads/third-party-ads";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import useUserPaymentInfo from "../../../features/get-pro/useUserPaymentInfo";
import { apiGetTopicProgresses } from "../../../features/study/topic.api";
import { ClientTopicProgress, TopicWithUser } from "../../../features/study/topic.model";
import { MapTopicProgress } from "../../../features/study/topic.slice";
import useAppConfig from "../../../hooks/useAppConfig";
import { EXAM_SCORE_FINISH, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import WebSeo from "../../../modules/share/model/webSeo";
import { openUrl } from "../../../utils/system";
import ProTopicIcon from "../../test-item/ProTopicIcon";
import OtherPracticesList from "../OtherPracticesList";
import "./practiceListView.scss";
import Image from "next/future/image";
import { nFormatter } from "../../../utils/format";

const PracticeListView = (props: PropsWithoutRef<{
  baseSlug?: string;
  otherPracticeBaseSlug?: string;
  practice?: Topic;
  practiceList?: TopicWithUser[];
  progressBorderColor?: string;
  progressTextColor?: string;
  progressBgColor?: string;
  SwitchSubjectComponent?: JSX.Element;
  PracticeTopSectionComponent?: JSX.Element;
  useMapSeo?: boolean;
  seoInfo?: WebSeo;
}>) => {
  const {
    baseSlug = '',
    otherPracticeBaseSlug = '',
    practice: _practice,
    practiceList: _practiceList,
    progressBorderColor = "#bacdff",
    progressTextColor = "#656ef1",
    progressBgColor = "#e8eeff",
    SwitchSubjectComponent = <></>,
    PracticeTopSectionComponent = <></>,
    useMapSeo,
    seoInfo
  } = props;
  const { titleH1 } = seoInfo || (useMapSeo ? (useSeoInfo() || {} as WebSeo) : useSelector((state) => state.appInfos.seoInfo || {} as WebSeo)) || {} as WebSeo;
  const practice = _practice || useSelector((state) => state.appInfos.practiceSlug);
  const practiceList = _practiceList || useSelector((state) => state.appInfos.practiceSlugList);
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const { appName, uiVersion } = useAppConfig();
  const { paymentLoading, isValidTopicAccess, isProAcc } = useUserPaymentInfo();

  const [progress, setProgress] = useState<MapTopicProgress>({});
  const adsCount = useMemo(() => {
    let _adsCount = 1;
    if (uiVersion === 2) {
      const practiceItems = practiceList.filter((e) => e.type !== TOPIC_TYPE_LESSON);
      _adsCount = Math.floor(practiceItems.length / 18);
    } else {
      _adsCount = Math.floor(practiceList.length / 10);
    }
    return _adsCount <= 0 ? 1 : (_adsCount >= 3 ? 3 : _adsCount);
  }, [practiceList.length, uiVersion]);

  const theme = useTheme();
  const isDownMD = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (!user) {
      setProgress(topicProgresses);
    } else if (practiceList.length) {
      apiGetTopicProgresses({ topicIds: practiceList.map((e) => e._id), userId })
        .then((arr) => {
          const mapTopicProgress = arr.reduce((map, item) => {
            map[item.topicId] = ClientTopicProgress.fromServerTopicProgress(item);
            return map;
          }, {} as MapTopicProgress);
          setProgress(mapTopicProgress);
        })
    }
  }, [user, practiceList.length]);

  const handleClickItem = (item: Topic) => {
    openUrl(`/${ROUTER_STUDY}/${baseSlug}/${item.slug}`);
  }

  const itemPratice = (item: TopicWithUser) => {
    const { name, _id, accessLevel } = item;
    const pro = appInfo?.usingGetPro && !!accessLevel && !isProAcc;
    return (
      <Grid item xs={10} md={5} xl={4} key={_id} onClick={() => handleClickItem(item)}>
        <div className="practice-list-box">
          {/* {pro && <div className="practice-pro">
            <ProTopicIcon id={_id} />
          </div>} */}
          {item.type === TOPIC_TYPE_TEST
            ? (<div className="practice-list-box-item--progress">
              <Image src={progress[_id]?.userId === userId && progress[_id]?.status === EXAM_SCORE_FINISH ? '/images/exam-done.svg' : '/images/undone-exam.svg'} width={35} height={35} />
            </div>)
            : (
              <div 
                className={classNames("practice-list-box-item--progress", progress[_id]?.userId === userId && progress[_id]?.progress ? "" : "progress-none")}
                style={{
                  paddingTop: 25,
                  paddingBottom: 20
                }}
              >
                {progress[_id]?.userId === userId ? (progress[_id]?.progress ?? 0) : 0}%
              </div>
            )}
          <div className="practice-list-box-item--content">{name}</div>
          <div className="practice-list-box-item--participants">
            <span>{nFormatter(item.countPracticedUsers, 1)}</span>
            <div className="line"></div>
            <span>Participants</span>
          </div>
        </div>
      </Grid>
    )
  }

  const lessonListView = (practiceLists: Topic[]) => {
    return (
      <div style={{ borderRadius: 10, overflow: 'hidden' }}>
        {
          practiceLists.map((item) => {
            return <div key={item._id} className="practice-list-item" onClick={() => handleClickItem(item)}>
              <div className="practice-item-name">
                {item.name}
              </div>

              <div className="practice-item-progress-lesson">
                {progress[item._id]?.userId === userId && progress[item._id]?.progress > 0 && <Check className="check-icon" />}
              </div>
            </div>
          })
        }
      </div>
    )
  }

  return <div id="practice-list-view" className="practice-detail-view">
    {["ielts"].includes(appName) && <GoogleAdsense name="The_Leaderboard" height={90} style={{ maxWidth: 728, margin: "10px auto" }} />}
    <Typography component="h1" className="practice-list-view-title tilte-h1">
      {titleH1}
    </Typography>
    {SwitchSubjectComponent}
    <div className="practice-list-view-main">
      <Grid container spacing={3}>
        <Grid item xs={12} md={8.5}>
          {PracticeTopSectionComponent}
          <div className="practice-name">{practice?.name}</div>
          <div className="practice-list">
            {uiVersion === 2
              ? (
                // !paymentLoading &&
                <>
                  {lessonListView(practiceList.filter(o => o.type === TOPIC_TYPE_LESSON))}
                  <Grid columnSpacing={1.3} rowSpacing={1.8} container columns={20} style={{ paddingTop: 14 }}>
                    {
                      practiceList.map((item) => {
                        return item.type !== TOPIC_TYPE_LESSON && (
                          itemPratice(item)
                        )
                      })
                    }
                  </Grid>
                  {!isDownMD && <GoogleAdsense name="The_Leaderboard" height={90} style={{ marginTop: 10 }} />}
                </>
              )
              : (
                // ui cũ 
                // !paymentLoading &&
                practiceList.map((item) => {
                  return <div key={item._id} className="practice-list-item" onClick={() => handleClickItem(item)}>
                    <div className="practice-item-name">
                      {item.name}
                    </div>

                    <div className={classNames("practice-item-progress", item.type === TOPIC_TYPE_LESSON ? "lesson" : "")}>
                      <div className="progress-box" style={{
                        border: `1.5px solid ${progressBorderColor}`,
                        backgroundColor: progressBgColor,
                        color: progressTextColor
                      }}>
                        {progress[item._id]?.userId === userId ? (progress[item._id]?.progress ?? 0) : 0}%
                      </div>
                    </div>

                    <div className={classNames("practice-item-progress-lesson", item.type !== TOPIC_TYPE_LESSON ? "hidden" : "")}>
                      {progress[item._id]?.userId === userId && progress[item._id]?.progress > 0 && <Check className="check-icon" />}
                    </div>
                  </div>
                })
              )
            }
          </div>
        </Grid>

        <Grid item xs={12} md={3.5}>
          <AdsSelector thirdPartyAds={appName === "toeic" && <ThirdPartyAds name="getpro-toeic" type={
            isDownMD ? "728x90" : "300x250"
          } storageKey="practice_list_view" enableCheckUpgradeCached />} />
          <OtherPracticesList baseSlug={otherPracticeBaseSlug} />
          {["ged", "toeic", "ielts"].includes(appName) && _.range(0, adsCount).map(key => {
            return <GoogleAdsense key={key}
              name={isDownMD ? "The_Leaderboard" : "Half_Page_or_Large_Skyscraper"}
              height={isDownMD ? 90 : 600}
              style={{ margin: "10px 0" }}
            />
          })}
        </Grid>
      </Grid>
    </div>
  </div>
}

export default PracticeListView;