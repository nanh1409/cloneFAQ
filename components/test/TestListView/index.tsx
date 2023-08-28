import { Dialog, DialogContent, Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import GoogleAdsense from "../../../features/ads/google-adsense";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import useUserPaymentInfo from "../../../features/get-pro/useUserPaymentInfo";
import { apiGetTopicProgresses } from "../../../features/study/topic.api";
import { ClientTopicProgress, TopicWithUser } from "../../../features/study/topic.model";
import { MapTopicProgress } from "../../../features/study/topic.slice";
import useAppConfig from "../../../hooks/useAppConfig";
import { EXAM_SCORE_FINISH } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import WebSeo from "../../../modules/share/model/webSeo";
import { openUrl } from "../../../utils/system";
import DialogTransitionDown from "../../DialogTransitionDown";
import TestItem from "../../test-item";
import "./testListView.scss";

const TestListView = (props: {
  progressBorderColor?: string;
  progressTextColor?: string;
  progressBgColor?: string;
  useMapSeo?: boolean;
  list?: TopicWithUser[];
  onClickItem?: (item: Topic) => void;
  useAsView?: boolean;
}) => {
  const {
    progressBorderColor,
    progressTextColor,
    progressBgColor,
    useMapSeo,
    list,
    onClickItem,
    useAsView
  } = props;
  const { uiVersion } = useAppConfig();
  const { titleH1 } = useMapSeo ? (useSeoInfo() || {} as WebSeo) : useSelector((state) => state.appInfos.seoInfo || {} as WebSeo);
  const test = useSelector((state) => state.appInfos.practiceSlug);
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const testList = typeof list !== "undefined" ? list : useSelector((state) => state.appInfos.practiceSlugList);
  const user = useSelector((state) => state.authState.user);
  const userId = useSelector((state) => state.authState.userId);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);

  const { paymentLoading, isValidTopicAccess, isProAcc } = useUserPaymentInfo();
  const router = useRouter();

  const [progress, setProgress] = useState<MapTopicProgress>({});
  const [openGetProDialog, setOpenGetProDialog] = useState(false);
  const usingGetPro = useMemo(() => appInfo?.usingGetPro, [appInfo?.usingGetPro]);

  useEffect(() => {
    if (!user) {
      setProgress(topicProgresses);
    } else if (testList.length) {
      apiGetTopicProgresses({ topicIds: testList.map((e) => e._id), userId, includeStatData: true })
        .then((arr) => {
          const mapTopicProgress = arr.reduce((map, item) => {
            map[item.topicId] = ClientTopicProgress.fromServerTopicProgress(item);
            return map;
          }, {} as MapTopicProgress);
          setProgress(mapTopicProgress);
        })
    }
  }, [user, testList.length]);

  const handleClickItem = (item: Topic) => {
    if (!!onClickItem) onClickItem(item);
    else {
      // if (usingGetPro && !isValidTopicAccess(item)) {
      //   setOpenGetProDialog(true);
      //   return;
      // }
      // if (!isValidTopicAccess(item)) {
      //   router.push(`/${ROUTER_GET_PRO}`);
      // } else
      // window.location.href = 
      openUrl(`/${ROUTER_STUDY}/${test?.slug === "simulation-test" ? "simulation-test" : "test"}/${item.slug}-${item._id}`);
    }
  }

  const handleCloseGetProDialog = () => {
    setOpenGetProDialog(false);
  }

  const renderProgress = (p: ClientTopicProgress) => {
    if (appInfo?.appName === "ielts") {
      let completedParts = 0;
      const progress = p?.progress ?? 0;
      if (progress < 25) completedParts = 0;
      else if (progress >= 25 && progress < 50) completedParts = 1;
      else if (progress >= 50 && progress < 75) completedParts = 2;
      else if (progress >= 75 && progress < 100) completedParts = 3;
      else completedParts = 4;
      return `${completedParts} / 4`;
    }
    return `${p?.score ?? 0} pts`
  }

  // const newTestList = testList.filter((i) => i.name.toLowerCase().includes("new"));

  return <div id="test-list-view" className="practice-detail-view">
    {!useAsView && <h1 className="practice-list-view-title tilte-h1">
      {titleH1}
    </h1>}

    <div className="practice-list-view-main">
      <div className="practice-name">{test?.name}</div>
      <div className="practice-list">
        {
          uiVersion === 2
            ? (
              <Grid container spacing={1}>
                <Grid item container xs={12} sm={9} spacing={1}>
                  {/* <Grid container spacing={1.2} style={{ paddingBottom: 14, borderBottom: "1px solid #BBBBC9" }} >
                    {!paymentLoading && newTestList.map((item) => {
                      return (
                        <Grid item xs={6} sm={4} onClick={() => handleClickItem(item)} style={{ cursor: 'pointer' }} key={item._id}>
                          <TestItem
                            item={item}
                            meta={[
                              { name: 'Questions', value: item.topicExercise.questionsNum },
                              { name: 'Minutes', value: item.topicExercise.duration }
                            ]}
                            score={progress[item._id]?.score ?? 0}
                            itemNew
                            showCountUser
                            getProLocked={usingGetPro && !!item.accessLevel && !isProAcc}
                          />
                        </Grid>
                      )
                    })
                    }
                  </Grid> */}
                  <div>
                    <Grid container spacing={1.2} style={{ paddingTop: 14 }}>
                      {
                        // !paymentLoading && 
                        testList.map((item, index) => {
                          return (
                            <Grid key={item._id} item xs={6} sm={4} onClick={() => handleClickItem(item)} style={{ cursor: 'pointer' }}>
                              <TestItem
                                item={item}
                                meta={[
                                  // { name: 'Questions', value: item.topicExercise?.questionsNum },
                                  { name: 'Attempted', value: `${progress[item._id]?.userId === userId ? (progress[item._id]?.correctNum ?? 0) + (progress[item._id]?.incorrectNum ?? 0) : 0}/${item.topicExercise?.questionsNum}` },
                                  { name: 'Participants', value: item.countPracticedUsers ?? 0 }
                                ]}
                                score={progress[item._id]?.userId === userId && progress[item._id]?.status === EXAM_SCORE_FINISH ? (progress[item._id]?.score ?? 0) : 0}
                                // getProLocked={usingGetPro && !!item.accessLevel && !isProAcc}
                                itemNew={item.name.toLowerCase().includes("new")}
                                bgrTest={`/images/app/${appInfo?.appName}/test${index % 6 + 1}.png`}
                                status={progress[item._id]?.userId === userId && progress[item._id]?.status}
                              />
                            </Grid>
                          )
                        })
                      }
                    </Grid>
                  </div>
                </Grid>
                <Grid item xs={12} sm={3}>
                  {/* <GoogleAdsense name="The_Medium_Rectangle" height={250} style={{ marginBottom: "20px" }} /> */}
                  <GoogleAdsense name="Half_Page_or_Large_Skyscraper" height={600} style={{ marginBottom: 20 }} />
                  <GoogleAdsense name="Half_Page_or_Large_Skyscraper" height={600} />
                </Grid>
              </Grid>
            )
            : (
              // !paymentLoading && 
              testList.map((item) => {
                return <div key={item._id} className="practice-list-item" onClick={() => handleClickItem(item)}>
                  <div className="practice-item-name">
                    {item.name}
                  </div>

                  <div className="practice-item-progress">
                    <div className="progress-box" style={{
                      border: progressBorderColor ? `1px solid ${progressBorderColor}` : undefined,
                      color: progressTextColor,
                      background: progressBgColor
                    }}>
                      {progress[item._id]?.userId === userId
                        ? <>{renderProgress(progress[item._id])}</>
                        : <>{renderProgress(new ClientTopicProgress())}</>}
                    </div>
                  </div>
                </div>
              })
            )
        }
      </div>
    </div>

    <Dialog
      open={openGetProDialog}
      onClose={handleCloseGetProDialog}
      TransitionComponent={DialogTransitionDown}
      className="testlist-getpro-dialog-warning"
      fullWidth
      classes={{ paper: "testlist-getpro-dialog-warning-main" }}
    >
      <DialogContent sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <img height={40} width={51} src={`${router.basePath}/images/get-pro/get-pro-dialog-icon.png`} alt="getpro-dialog-icon" />
        <div className="getpro-title">GET PRO</div>
        <div className="getpro-msg">
          Upgrade your account to unlock this test!
        </div>
      </DialogContent>
    </Dialog>
  </div>
}

export default TestListView;