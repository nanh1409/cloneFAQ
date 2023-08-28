import { Chip, Container, Grid, MenuItem, Select, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import Image from "next/image";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import { fetchTopicsByParentSlug } from "../../../features/study/topic.slice";
import usePracticeData from "../../../hooks/usePracticeData";
import { TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import WebSeo from "../../../modules/share/model/webSeo";
import { PracticeDataConfig } from "../../../types/appPracticeTypes";
import HeroSection from "../../hero-section";
import Introduction from "../../introduction";
import RawLink from "../../RawLink";
import TestItem from "../../test-item";
import "./cdlStateView.scss";
import CDLTestListSkeleton from "./CDLTestListSkeleton";

type MapTestSectionRef = { [slug: string]: HTMLDivElement | null; }

const CDLStateView = (props: PropsWithoutRef<{
  stateSlug: string;
  bgHeroSection?: string;
  ctaHeroSection?: JSX.Element;
  testList?: Array<Topic & { fullName?: string }>;
  getPracticeStudySlug?: (topic: Topic) => string;
  practiceId?: string;
  testId?: string;
  useMapSeo?: boolean;
  seoInfo?: WebSeo;
}>) => {
  const {
    stateSlug, bgHeroSection, ctaHeroSection, testList: _testList, getPracticeStudySlug, practiceId, testId, useMapSeo,
    seoInfo: _seoInfo
  } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const seoInfo = _seoInfo || (useMapSeo ? useSeoInfo() : useSelector((state) => state.appInfos.seoInfo)) || {} as WebSeo;
  const statesList = useSelector((state) => state.state.statesList);
  const testList = _testList || useSelector((state) => state.appInfos.testList);
  const mapParentTopics = useSelector((state) => state.topicState.mapParentTopics);
  const { mapSlugData = {}, testCourseIndex, groupSlugs = [] } = usePracticeData("cdl");
  // Server Side for SEO
  const currentState = statesList.find((state) => state.slug === stateSlug);
  const dispatch = useDispatch();
  const fullTestRefs = useRef<MapTestSectionRef>({} as MapTestSectionRef);


  const [activeTag, setActiveTag] = useState("ALL");
  const [onSettingTag, setOnSettingTag] = useState(false);
  const [selectedSectionSlug, setSelectedSectionSlug] = useState(Object.keys(mapSlugData)[0]);
  // const [offsetTop, setOffsetTop] = useState(0);
  // const [fullTestOffsetTop, setFullTestOffsetTop] = useState<{ [slug: string]: number } | null>(null);
  // const [currentSection, setCurrentSection] = useState("");
  const currentGroupSlugs = useMemo(() => {
    return (activeTag === "ALL" ? {} : groupSlugs.find(({ name }) => name === activeTag)) as PracticeDataConfig["groupSlugs"][0];
  }, [activeTag]);

  const {
    currentSubSelectOptions,
    _selectedSectionSlug
  } = useMemo(() => {
    const currentSubSelectOptions =
      _.isEmpty(currentGroupSlugs)
        ? Object.keys(mapSlugData)
        : Object.keys(mapSlugData).filter((slug) => currentGroupSlugs?.slugs?.includes(slug));
    const _selectedSectionSlug = currentSubSelectOptions.includes(selectedSectionSlug) ? selectedSectionSlug : currentSubSelectOptions[0];
    return { currentSubSelectOptions, _selectedSectionSlug };
  }, [currentGroupSlugs, selectedSectionSlug]);


  const router = useRouter();
  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    setSelectedSectionSlug(_selectedSectionSlug)
  }, [_selectedSectionSlug]);

  useEffect(() => {
    if (typeof _testList === "undefined" && !!testList.length && appInfo && currentState?.slug) {
      const testCourseId = (appInfo.courseIds ?? [])[testCourseIndex];
      if (testCourseId) {
        dispatch(fetchTopicsByParentSlug({
          courseId: testCourseId,
          baseSlug: currentState.slug,
          slug: testList.map((e) => e.slug),
          topicTypes: [TOPIC_TYPE_TEST],
          topicFields: ["orderIndex", "courseId", "name", "slug", "avatar"],
          exerciseFields: ["questionsNum", "duration"],
          local: false
        }));
      }
    }
  }, [typeof _testList, testList.length, appInfo, testCourseIndex, currentState?.slug]);

  // useEffect(() => {
  //   let _fullTestOffsetTop = fullTestOffsetTop || {};
  //   if (!fullTestOffsetTop) {
  //     _fullTestOffsetTop = Object.entries(fullTestRefs.current || {}).reduce((map, [slug, el]) => {
  //       map[slug] = el?.offsetTop ?? 0;
  //       return map;
  //     }, {} as { [slug: string]: number });
  //     setFullTestOffsetTop(_fullTestOffsetTop);
  //   }
  //   const currentSectionEl = _.findLast(Object.entries(_fullTestOffsetTop), ([slug, value]) => value < offsetTop);
  //   setCurrentSection(!!currentSectionEl ? currentSectionEl[0] : "");
  // }, [offsetTop]);

  const handleChangeSelectedSectionSlug = (slug: string) => {
    router.push({ hash: `cdl-${slug}-full-test` }, undefined, { shallow: true });
    setSelectedSectionSlug(slug);
  }

  const handleChangeActiveTag = (tag: string) => {
    setOnSettingTag(true);
    setActiveTag(tag);
    setTimeout(() => {
      setOnSettingTag(false);
    }, 300);
  }

  return <>
    <HeroSection
      titleH1={seoInfo?.titleH1}
      summary={seoInfo?.summary}
      bgImage={bgHeroSection || `/images/app/cdl/bg-hero-section-state.png`}
      minHeight={630}
      ctaElement={ctaHeroSection}
    />
    <Container maxWidth="xl" id="main-state-view" className={classNames("main-state-view", isMobileUI ? "mobile" : "")}>
      <div id="practice-section-state">
        <div className="section-title" {...{ id: practiceId }}>
          It's time to ace your {currentState?.name ?? ''} CDL practice test!!
        </div>
        <div className="section-list">
          <Grid container spacing="20px">
            {Object.keys(mapSlugData).map((slug) => {
              const item = mapSlugData[slug];
              const href = typeof getPracticeStudySlug !== "undefined" ? getPracticeStudySlug(({ ...item, slug } as any) as Topic) : `/${ROUTER_STUDY}/${currentState?.slug}/${slug}`;
              return <Grid key={slug} item xs={12} sm={6} md={3}>
                <RawLink href={href}>
                  <div className="section-list-item">
                    <div className="section-list-item-icon">
                      <Image src={item.icon} layout="fixed" width="35px" height="20px" objectFit="contain" />
                    </div>
                    <div className="section-list-item-name dot-2">{item.name as string}</div>
                  </div>
                </RawLink>
              </Grid>
            })}
          </Grid>
        </div>
      </div>

      <div id={`${currentState?.slug}-full-test`} className="test-section-state">
        <div className="section-title" {...{ id: testId }}>
          Be fully prepared with {currentState?.name ?? ''} CDL full test now!!
        </div>

        <div id="test-section-tags-list" className="test-section-tags-list">
          {[
            { name: "ALL", slugs: [] },
            ...groupSlugs
          ].map((tag, i) => <Chip
            key={i}
            className={classNames(
              "tag-item",
              i === testList.length ? "last" : "",
              tag.name === activeTag ? "active" : ""
            )}
            label={tag.name.toUpperCase()} onClick={() => {
              handleChangeActiveTag(tag.name);
            }}
          />)}
        </div>

        <div className="section-list">
          {onSettingTag
            ? <><CDLTestListSkeleton /></>
            : testList.map((sub, i) => {
              return <div
                key={i}
                id={`cdl-${sub.slug}-full-test`}
                className={classNames(
                  "sub-section-list",
                  activeTag !== "ALL" && !currentGroupSlugs?.slugs?.includes(sub.slug) ? "hidden" : ""
                )}
                ref={(el) => {
                  fullTestRefs.current[sub.slug] = el;
                }}
              >
                <div className="sub-header">
                  <div className="sub-title">{sub.fullName || sub.name}</div>
                  {!i && <Select
                    value={selectedSectionSlug}
                    onChange={(evt) => handleChangeSelectedSectionSlug(evt.target.value)}
                    className="sub-select-options"
                    classes={{
                      select: "sub-select-label"
                    }}
                  >
                    {currentSubSelectOptions.map((slug) => <MenuItem
                      key={slug}
                      value={slug}
                      sx={{
                        fontSize: 13, fontWeight: 500
                      }}
                    >{mapSlugData[slug]?.name as string}</MenuItem>)}
                  </Select>}
                </div>
                <div className="sub-list">
                  <Grid container spacing={2}>
                    {(mapParentTopics[sub.slug]?.data ?? []).map((topic, i) => {
                      const link = `/${ROUTER_STUDY}/test/${topic.slug}-${topic._id}`;
                      const name = `CDL ${sub.name} ${topic.name}`;
                      const avatar = `/images/app/cdl/test/${sub.slug}-${i % 3 + 1}.png`;
                      return <Grid key={topic._id} item xs={12} sm={6} md={2.4}>
                        <RawLink href={link}>
                          <TestItem
                            item={{ ...topic, name, avatar } as Topic}
                            meta={[
                              { name: "Questions", value: topic?.topicExercise?.questionsNum ?? 0 },
                              { name: "Time", value: topic?.topicExercise?.duration ?? 0 }
                            ]}
                          />
                        </RawLink>
                      </Grid>;
                    })}
                  </Grid>
                </div>
              </div>;
            })}
        </div>
      </div>
      <Introduction content={seoInfo?.content} useMapSeo={useMapSeo} />
    </Container>
  </>
}

export default CDLStateView;