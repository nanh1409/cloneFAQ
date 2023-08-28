import { Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
import { PropsWithoutRef, useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import { fetchTopicsByParentSlug } from "../../../features/study/topic.slice";
import usePracticeData from "../../../hooks/usePracticeData";
import { TOPIC_TYPE_TEST } from "../../../modules/share/constraint";
import Topic from "../../../modules/share/model/topic";
import WebSeo from "../../../modules/share/model/webSeo";
import type { DMVSubject } from "../../../types/appPracticeTypes";
import HeroSection from "../../hero-section";
import Introduction from "../../introduction";
import PracticeBlock from "../../practice/PracticeBlock";
import RawLink from "../../RawLink";
import TestItem from "../../test-item";
import "./carMotorStateView.scss";
import DMVChangeStateButton from "./DMVChangeStateButton";

const CarMotorStateView = (props: PropsWithoutRef<{
  stateSlug: string;
  subject: DMVSubject;
  subjectSlug: string;
  useMapSeo?: boolean;
  seoInfo?: WebSeo;
}>) => {
  const {
    stateSlug,
    subject,
    subjectSlug,
    useMapSeo,
    seoInfo: _seoInfo
  } = props;
  const seoInfo = _seoInfo || (useMapSeo ? useSeoInfo() : useSelector((state) => state.appInfos.seoInfo)) || {} as WebSeo;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const mapParentTopics = useSelector((state) => state.topicState.mapParentTopics);
  const dispatch = useDispatch();
  const { mapSubjectCourseIndex } = usePracticeData();

  useEffect(() => {
    const testCourseIndex = (mapSubjectCourseIndex ?? []).findIndex((subjectConfig) => subject === subjectConfig);
    const courseId = (appInfo?.courseIds ?? [])[testCourseIndex];
    if (!!courseId) {
      dispatch(fetchTopicsByParentSlug({
        courseId, slug: "test", baseSlug: stateSlug,
        asc: true, field: "orderIndex", exerciseFields: ["questionsNum", "duration"], topicTypes: [TOPIC_TYPE_TEST],
        local: false
      }))
    }
  }, []);

  return <>
    <HeroSection
      titleH1={seoInfo?.titleH1}
      summary={seoInfo?.summary}
      bgImage={subject ? `/images/app/dmv/bg-hero-section-${subject}.png` : ''}
      minHeight={825}
      ctaElement={<DMVChangeStateButton subject={subject} />}
    />

    <Container maxWidth="xl" id="main-state-view-dmv" className="main-state-view">
      <div id="practice-section-state-dmv">
        <Typography component="h2" className="section-title" id="practice">
          FREE DMV {subject === "dmv-permit" ? "Car" : "Motorcycle"} practice tests
        </Typography>
        <p className="section-description">
          You can practice freely on our designed tests, with and without time-limit. In addition, you are able to customize your own test to develop your exam’s tactic.
        </p>

        <div className="state-practice-block">
          <RawLink href={`/${ROUTER_STUDY}/${subject}/${subjectSlug}`}>
            <PracticeBlock
              item={{ name: "Practice Test", avatar: `/images/app/dmv/practice-test-avatar-${subject}.png` } as Topic}
              meta={[
                { name: "Questions", value: 400 }, { name: "Levels", value: 15 }
              ]} />
          </RawLink>
        </div>

        <div className="practice-introduction">
          <Image
            src={`/images/app/dmv/bg-practice-intro-${subject}.png`}
            layout="fill"
            alt={`upgrade-${subject}`}
            className="practice-introduction-image"
          />
          <div className="practice-introduction-content">
            <div className="title-text">We Guarantee</div>
            <div className="content-text">That You Pass On Your First Try</div>
            <div className="cta">Upgrade Now</div>
          </div>
        </div>
      </div>

      <div id="test-section-state-dmv">
        <div className="title-test" id="full-test">Full Test</div>
        <Grid container spacing={2}>
          {mapParentTopics["test"]?.data?.map((topic, i) => {
            const avatar = `/images/app/dmv/test/${subject}-${(i % (subject === "dmv-permit" ? 6 : 3) + 1)}.png`;
            return <Grid key={topic._id} item xs={12} sm={6} md={2.4}>
              <RawLink href={`/${ROUTER_STUDY}/test/${topic.slug}-${topic._id}`}>
                <TestItem
                  item={{ ...topic, avatar }}
                  meta={[
                    { name: "Questions", value: topic?.topicExercise?.questionsNum ?? 0 },
                    { name: "Time", value: topic?.topicExercise?.duration ?? 0 },
                  ]}
                />
              </RawLink>
            </Grid>
          })}
        </Grid>
      </div>

      <Introduction useMapSeo={useMapSeo} content={seoInfo?.content} />
    </Container>
  </>
}

export default CarMotorStateView;