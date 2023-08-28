import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { memo, PropsWithoutRef, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import AdsSelector from "../../../features/ads/AdsSelector";
import GoogleAdsense from "../../../features/ads/google-adsense";
import ThirdPartyAds from "../../../features/ads/third-party-ads";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import { fetchTopicsByParentSlug } from "../../../features/study/topic.slice";
import usePracticeData from "../../../hooks/usePracticeData";
import AppSetting from "../../../modules/share/model/appSetting";
import WebSeo from "../../../modules/share/model/webSeo";
import MainPracticeList from "../MainPracticeList";
import OtherPracticesList from "../OtherPracticesList";
import "./grammarVocabListView.scss";

const GrammarVocabListView = memo((props: PropsWithoutRef<{
  baseSlug?: string;
  isSubjectType?: boolean;
  otherPracticeBaseSlug?: string;
  baseStudySlug?: string;
  useCollapseSubject?: boolean;
  useMapSeo?: boolean;
}>) => {
  const {
    baseSlug = '',
    otherPracticeBaseSlug,
    isSubjectType,
    baseStudySlug,
    useCollapseSubject,
    useMapSeo
  } = props;
  const { courseIds = [], appName } = useSelector((state) => state.appInfos.appInfo || ({} as AppSetting));
  const { titleH1 } = useMapSeo ? (useSeoInfo() || {} as WebSeo) : useSelector((state) => state.appInfos.seoInfo || ({} as WebSeo));
  const practiceList = useSelector((state) => state.appInfos.practiceSlugList);
  const mapParentTopics = useSelector((state) => state.topicState.mapParentTopics);
  const { practiceCourseIndex } = usePracticeData();
  const practiceCourseId = useMemo(() => courseIds[practiceCourseIndex], [courseIds]);
  const dispatch = useDispatch();

  const theme = useTheme();
  const isDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const adsCount = useMemo(() => {
    const length = _.isEmpty(mapParentTopics) || !useCollapseSubject ? practiceList.length : Object.values(mapParentTopics).length;
    const _adsCount = Math.floor(length / 24);
    return _adsCount <= 0 ? 1 : (_adsCount >= 3 ? 3 : _adsCount);
  }, [practiceList.length, _.isEmpty(mapParentTopics), useCollapseSubject]);

  useEffect(() => {
    if (isSubjectType) {
      if (!!practiceList.length && practiceCourseId) {
        dispatch(fetchTopicsByParentSlug({
          courseId: practiceCourseId,
          slug: practiceList.map(({ slug }) => slug),
          asc: true, field: "orderIndex",
          topicFields: ["orderIndex", "courseId", "name", "slug", "avatar"],
          local: false
        }));
      }
    }
  }, [practiceList.length]);

  return (
    <div id="grammar-vocab-list-view" className="practice-detail-view-2">
      {/* {["ielts"].includes(appName) && <GoogleAdsense name="The_Leaderboard" height={90} style={{ maxWidth: 728, margin: "10px auto" }} />} */}
      <Typography component="h1" className="practice-list-view-title tilte-h1">
        {titleH1}
      </Typography>

      <div className={classNames("practice-list-view-main", isSubjectType ? "subject-type" : "")}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8.5}>
            <MainPracticeList
              isSubjectType={isSubjectType}
              practiceList={practiceList}
              baseSlug={baseSlug}
              baseStudySlug={baseStudySlug}
              useCollapseSubject={useCollapseSubject}
            />
            {!isDownMD && <GoogleAdsense name="The_Leaderboard" height={90} style={{ marginTop: 10 }} />}
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
  );
}
);

export default GrammarVocabListView;
