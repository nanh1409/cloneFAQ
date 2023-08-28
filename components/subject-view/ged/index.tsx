import { Button, Container, Tab, Tabs, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import { memo, PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import { fetchTopicsByParentSlug } from "../../../features/study/topic.slice";
import usePracticeData from "../../../hooks/usePracticeData";
import { TOPIC_TYPE_EXERCISE } from "../../../modules/share/constraint";
import AppSetting from "../../../modules/share/model/appSetting";
import Topic from "../../../modules/share/model/topic";
import WebSeo from "../../../modules/share/model/webSeo";
import { openUrl } from "../../../utils/system";
import Introduction from "../../introduction";
import PracticeListView from "../../practice/PracticeListView";
import "./gedSubjectView.scss";

const GEDSubjectView = memo((props: PropsWithoutRef<{
  isSubjectType: boolean;
  baseSlug?: string;
  useMapSeo?: boolean;
  seoInfo?: WebSeo;
}>) => {
  const { isSubjectType, baseSlug = '', useMapSeo, seoInfo } = props;
  const mapParentTopics = useSelector((state) => state.topicState.mapParentTopics);
  const practiceSlugList = useSelector((state) => state.appInfos.practiceSlugList);
  const practiceSlug = useSelector((state) => state.appInfos.practiceSlug);
  const subjectKey = useMemo(() => `ged-${baseSlug}-subject`, [baseSlug]);
  const { courseIds = [] } = useSelector((state) => state.appInfos.appInfo || {} as AppSetting);

  const { practiceCourseIndex } = usePracticeData();
  const practiceCourseId = useMemo(() => courseIds[practiceCourseIndex], [courseIds]);

  const dispatch = useDispatch();

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));

  const [practiceList, setPracticeList] = useState<Topic[]>([]);
  const [practice, setPractice] = useState<Topic | null>(null);

  useEffect(() => {
    if (practiceSlugList.length) {
      if (isSubjectType) {
        if (typeof window !== "undefined") {
          const sessionSubjectSlug = sessionStorage.getItem(subjectKey);
          const practice = sessionSubjectSlug ? (practiceSlugList.find(({ slug }) => slug === sessionSubjectSlug) ?? practiceSlugList[0]) : practiceSlugList[0];
          setPractice(practice);
        }
      } else {
        setPractice(practiceSlug);
        setPracticeList(practiceSlugList)
      }
    }
  }, [practiceSlugList.length]);

  useEffect(() => {
    if (isSubjectType) {
      if (!!practice) {
        if (!mapParentTopics[practice.slug]?.fetched) {
          dispatch(fetchTopicsByParentSlug({
            courseId: practiceCourseId,
            slug: practice.slug,
            asc: true, field: "orderIndex",
            topicTypes: [TOPIC_TYPE_EXERCISE],
            local: false
          }))
        } else {
          setPracticeList(mapParentTopics[practice.slug]?.data ?? []);
        }
      }
    }
  }, [practice, mapParentTopics[practice?.slug]?.fetched]);

  const onChangeSubject = (subjectSlug: string) => {
    const practice = (practiceSlugList.find(({ slug }) => slug === subjectSlug) ?? practiceSlugList[0]);
    setPractice(practice);
    sessionStorage.setItem(subjectKey, subjectSlug);
  }

  return <Container maxWidth="xl">
    {!!practice && <PracticeListView
      baseSlug={practice.slug}
      practice={{ ...practice, name: `${isSubjectType ? practiceSlug?.name : ''} ${practice.name}` }}
      practiceList={practiceList}
      progressBorderColor="#FFE9A6"
      progressBgColor="#FFFBEC"
      progressTextColor="#FFA901"
      SwitchSubjectComponent={isSubjectType
        ? <div className="practice-subject-tabs ged">
          <Tabs
            className="subject-tab-root"
            value={practice?.slug} onChange={(_evt, newValue) => onChangeSubject(newValue)}
            variant="fullWidth"
            TabIndicatorProps={{ className: "subject-tab-indicator" }}
          >
            {practiceSlugList.map(({ name, slug }, i) =>
              <Tab key={i} label={name} value={slug} className={classNames("subject-tab-button", practice?.slug === slug ? "selected" : "")} />
            )}
          </Tabs>
        </div>
        : <></>}
      PracticeTopSectionComponent={practiceSlug?.slug === "social-studies"
        ? <>
          <div className={classNames("practice-top-section", isMobileUI ? "mobile" : "")}>
            <div className="ged-social-studies">
              {!isMobileUI && <Image
                src="/images/app/ged/ged-social-studies-practice-test-video-banner.png"
                layout="fill"
                objectFit="initial"
                className="cta-bg-image"
              />}
              <div className={classNames("cta-section", isMobileUI ? "mobile" : "")}>
                <div className="title">VIDEO</div>
                <div className="desc">Watch our detailed tutorial videos to nail your GED Social Studies Test.</div>
                <Button
                  endIcon={<svg width="19" height="22" viewBox="0 0 19 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.71794 3.63731C9.10542 2.41602 10.0297 1.66139 11.182 1.397C13.033 1.02482 14.7305 1.62472 15.6604 2.82641C16.5826 4.01771 16.5342 5.57721 15.5324 6.63899C15.4092 6.76979 15.2678 6.88843 15.1264 7.00712C15.0473 7.0735 14.9682 7.1399 14.8923 7.20844C14.6714 7.40842 14.633 7.6352 14.8588 7.85967C15.0899 8.08947 15.3659 8.06349 15.6292 7.9259C15.7108 7.88287 15.7818 7.82574 15.8529 7.7686C15.8722 7.75302 15.8916 7.73743 15.9112 7.72213C17.4524 6.51182 17.8548 4.62069 16.9439 2.88618C16.0793 1.24105 14.0536 0.226385 11.8378 0.327862C9.85831 0.417304 8.10785 1.69148 7.62981 3.39274C7.62216 3.4191 7.61238 3.44684 7.60244 3.47507C7.5687 3.57081 7.53304 3.67202 7.5721 3.74284C7.66966 3.9206 7.8171 4.16721 7.98966 4.20623C8.16395 4.24491 8.41706 4.08946 8.5924 3.97268C8.65672 3.93019 8.67465 3.83828 8.6924 3.74728C8.69982 3.70924 8.7072 3.67136 8.71794 3.63731ZM15.5044 13.7024C16.0385 13.128 16.8067 13.0283 17.4683 13.4512C18.1118 13.8634 18.2308 14.5479 17.766 15.1567C17.5442 15.4447 17.3217 15.7337 17.1009 16.0224L16.9911 16.1655C16.207 17.1864 15.3987 18.239 14.5843 19.2646C12.9387 21.3369 9.9572 21.8402 7.33406 20.4878C6.97911 20.3047 6.58683 20.1018 6.17842 19.8854C5.85454 19.7138 5.51985 19.534 5.1855 19.3493C3.96538 18.6753 3.16154 17.7489 2.79446 16.5946C2.48206 15.6128 2.17193 14.6147 1.87267 13.6486C1.82516 13.4962 1.7778 13.3435 1.73045 13.1908C1.68307 13.038 1.6357 12.8853 1.58816 12.7328L1.5847 12.7334L1.48174 12.403C1.35311 11.9903 1.22667 11.5788 1.09977 11.1657L1.09848 11.1615C0.95545 10.6959 0.880061 10.3746 0.807346 10.0648C0.721074 9.69721 0.638566 9.34566 0.45132 8.78792C0.323861 8.40836 0.37961 8.07844 0.608129 7.85878C0.773247 7.70039 1.09855 7.52952 1.70921 7.61845C2.35427 7.71187 2.84956 8.06292 3.13975 8.63231L3.76568 9.86137C4.00567 10.3331 4.16089 10.6197 4.31698 10.9079C4.47019 11.1908 4.62423 11.4752 4.86009 11.9378C4.91266 12.0418 4.9668 12.1478 5.02852 12.2429C5.09088 12.3371 5.15485 12.3748 5.19052 12.3775C5.22837 12.3813 5.29966 12.3542 5.37573 12.2659C5.42296 12.2106 5.46698 12.1449 5.51404 12.0748L5.51537 12.0728C5.53449 12.043 5.55408 12.0147 5.57367 11.9864L6.7755 10.2517C6.86278 10.1259 6.95024 9.99976 7.03786 9.8734C8.35654 7.9717 9.71311 6.01535 11.0651 4.0961C11.2658 3.8105 11.6076 3.54853 11.9793 3.39728C12.5022 3.1838 13.1494 3.36077 13.4514 3.80036C13.666 4.11252 13.6855 4.16028 13.7044 4.48857C13.716 4.69943 13.6031 5.19002 13.4973 5.32119C13.4906 5.32976 13.4838 5.33822 13.4771 5.3466C13.459 5.36923 13.4413 5.39127 13.4261 5.41326C12.4905 6.76529 11.5528 8.11615 10.615 9.46702L10.6139 9.46857L9.93913 10.4415L9.84876 10.5721C9.68079 10.8214 9.70671 10.9075 9.70765 10.9105C9.71027 10.9219 9.73722 10.9436 9.78616 10.9683L9.7866 10.9685C9.8493 10.9993 9.93518 11.0414 10.1406 10.7467C10.4447 10.3115 10.7467 9.87513 11.0487 9.43876L11.049 9.43826L11.4433 8.86838L11.4882 8.80354C11.5301 8.74086 11.5726 8.67726 11.6249 8.61259C12.0574 8.0742 12.8429 7.92999 13.4934 8.26716L13.5054 8.27356C14.1686 8.62492 14.3903 9.31279 14.0206 9.87952C13.7126 10.3528 13.383 10.8248 13.0637 11.2796C12.9261 11.4763 12.7879 11.6739 12.6508 11.8721C12.6293 11.9032 12.6072 11.9351 12.5846 11.9656L12.5833 11.9674C12.5359 12.0337 12.4911 12.0965 12.4564 12.1573C12.3617 12.3266 12.4298 12.3604 12.5034 12.3969L12.5036 12.397L12.504 12.3972C12.5655 12.4273 12.6359 12.4617 12.7343 12.3282C12.8773 12.1344 13.0183 11.9308 13.1548 11.7335C13.2521 11.5929 13.3501 11.4513 13.4496 11.3118C13.9318 10.6388 14.7096 10.4493 15.4305 10.83L15.4327 10.8312C16.1518 11.2122 16.3182 11.902 15.8555 12.5879C15.6642 12.871 15.4537 13.1751 15.2111 13.517C15.0546 13.7367 15.1218 13.7755 15.1987 13.82L15.1993 13.8203C15.2665 13.8597 15.3274 13.8932 15.5044 13.7024Z" fill="#FFBF01" />
                  </svg>
                  }
                  className="cta-button"
                  onClick={() => {
                    openUrl(`/${ROUTER_STUDY}/lesson/${practiceSlug?.slug}`);
                  }}
                >
                  Watch Now
                </Button>
              </div>
            </div>
          </div>
        </>
        : <></>}
      useMapSeo={useMapSeo}
      seoInfo={seoInfo}
    />}
    <Introduction content={seoInfo?.content ?? ''} />
  </Container>
});

export default GEDSubjectView;