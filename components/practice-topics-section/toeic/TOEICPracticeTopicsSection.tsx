import { Grid, Typography } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { ROUTER_PRACTICE, ROUTER_PRACTICE_SW } from "../../../app/router";
import GoogleAdsense from "../../../features/ads/google-adsense";
import useAppConfig from "../../../hooks/useAppConfig";
import usePracticeData from "../../../hooks/usePracticeData";
import { MapLocaleString } from "../../../types/appPracticeTypes";
import PartItemData, { PartItemDataProps } from "./PartItem";
import TestItemPanel from "./TestItemPanel";
import "./TOEICpracticeListStyle.scss";

type Tag = "listening" | "reading" | "speaking" | "writing";

const TOEICPracticeTopicsSection = () => {
  const { mapSlugData = {}, mapTagName = {} } = usePracticeData();
  const { uiVersion } = useAppConfig();
  const router = useRouter();
  const [active, setActive] = useState(false)

  const toeicSkills = useMemo(() =>
    _.uniq(Object.values(mapSlugData).map(({ tag }) => tag)).filter((tag) => !!tag)
    , [mapSlugData]);
  const mapSkillData = useMemo(() =>
    Object.entries(mapSlugData).reduce((map, [slug, { name, fullName, shortDescription, ...data }]) => {
      if (!!data.tag) {
        const baseRouter = ["speaking", "writing"].includes(data.tag) ? ROUTER_PRACTICE_SW : ROUTER_PRACTICE;
        map[data.tag] = [...(map[data.tag] || []), {
          ...data,
          slug: !!data.children ? "" : `/${baseRouter}/${slug}`,
          shortName: (name as MapLocaleString)[router.locale],
          name: (fullName as MapLocaleString)[router.locale],
          shortDescription: (shortDescription as MapLocaleString)[router.locale],
          childs: !!data.children ? Object.entries(data.children).map(([slug, cData]) => ({
            name: (cData.name as MapLocaleString)[router.locale],
            slug: `/${baseRouter}/${slug}`
          })) : undefined
        }];
      }
      return map;
    }, {} as Record<Tag, PartItemDataProps[]>), [toeicSkills, router.locale]);

  const trans = useMemo(() => {
    let simulatorToeic = "TOEIC Exam Simulator",
      desciptionMiniTest = "Take mini test with the number of questions and time limit reduced by half",
      desciptionFullTest = "Take full test with the same number of questions and time limit as the actual test",
      tabLR = "Listening & Reading",
      tabSW = "Speaking & Writing",
      listening = "Listening",
      reading = "Reading",
      speaking = "Speaking",
      writing = "Writing",
      titleSimulationTest = "TOEIC Computer - based Simulation Test",
      descriptionSimulationTest = "Computer-based simulation test with the format and testing interface as the actual test will help you carefully prepare for your test day."
    if (router.locale === "vi") {
      simulatorToeic = "Mô phỏng bài thi TOEIC";
      desciptionMiniTest = "Làm bài mini test với số lượng câu hỏi và thời gian giảm một nửa so với bài thi thật";
      desciptionFullTest = "Làm bài full test với số lượng câu hỏi và thời gian giống như bài thi thật";
      tabLR = "Nghe & Đọc";
      tabSW = "Nói & Viết";
      listening = "Nghe";
      reading = "Đọc";
      speaking = "Nói";
      writing = "Viết";
      titleSimulationTest = "Thi Mô Phỏng"
      descriptionSimulationTest = "Luyện thi mô phỏng trên máy tính như thi thật giúp bạn làm quen khi bước vào kì thi chính thức";
    }
    return {
      simulatorToeic,
      desciptionMiniTest, desciptionFullTest,
      tabLR, tabSW,
      listening, reading, speaking, writing,
      titleSimulationTest,
      descriptionSimulationTest
    }
  }, [router.locale]);

  const subjectRef = useRef<Record<Tag, HTMLDivElement>>({
    listening: null,
    reading: null,
    speaking: null,
    writing: null
  });
  const lrHeight = !subjectRef.current.listening || !subjectRef.current.reading
    ? undefined
    : (subjectRef.current.listening.clientHeight + subjectRef.current.reading.clientHeight);
  const swHeight = !subjectRef.current.speaking || !subjectRef.current.writing
    ? undefined
    : (subjectRef.current.speaking.clientHeight + subjectRef.current.writing.clientHeight);

  return <div className="practice-topics-section toeic">
    <div className="part-container-panel">
      {uiVersion === 2
        ? (
          <div className="toeic-subjects-tabs">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="toeic-subjects-tabs-container">
                <div className={`toeic-subjects-tabs-container-tab-bg ${active ? 'active' : ''}`}></div>
                <Grid container spacing={1} className="box-tabs">
                  <Grid item xs={6} className="toeic-subjects-tabs-container__tab" onClick={() => setActive(false)}>
                    <div className={`tab-content ${!active && 'active'}`}>
                      {trans.tabLR}
                    </div>
                  </Grid>
                  <Grid item xs={6} className="toeic-subjects-tabs-container__tab" onClick={() => setActive(true)}>
                    <div className={`tab-content ${active && 'active'}`}>
                      {trans.tabSW}
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
            <div className="toeic-subjects-tab-pane-wrap">
              <div className={classNames("toeic-subjects-tab-pane-item", active ? "active" : "")}
                style={{ height: active ? swHeight : lrHeight }}
              >
                <div className="toeic-subject-item" ref={(e) => subjectRef.current.listening = e}>
                  <h3 className="toeic-subject-item-title">{trans.listening}</h3>
                  <Grid className="part-item-data-container" container spacing={2}>
                    {mapSkillData.listening.map((data, idx) => <Grid key={idx} item xs={12} sm={6} lg={3}>
                      <PartItemData {...data} />
                    </Grid>)}
                  </Grid>
                </div>
                <div className="toeic-subject-item" ref={(e) => subjectRef.current.reading = e}>
                  <h3 className="toeic-subject-item-title">{trans.reading}</h3>
                  <Grid className="part-item-data-container" container spacing={2}>
                    {mapSkillData.reading.map((data, idx) => <Grid key={idx} item xs={12} sm={6} lg={3}>
                      <PartItemData {...data} />
                    </Grid>)}
                  </Grid>
                </div>
              </div>

              <div className={classNames("toeic-subjects-tab-pane-item", active ? "active" : "")}
                style={{ height: active ? swHeight : lrHeight }}
              >
                <div className="toeic-subject-item" ref={(e) => subjectRef.current.speaking = e}>
                  <h3 className="toeic-subject-item-title">{trans.speaking}</h3>
                  <Grid className="part-item-data-container" container spacing={2}>
                    {mapSkillData.speaking.map((data, idx) => <Grid key={idx} item xs={12} sm={6} lg={3}>
                      <PartItemData {...data} />
                    </Grid>)}
                  </Grid>
                </div>
                <div className="toeic-subject-item" ref={(e) => subjectRef.current.writing = e}>
                  <h3 className="toeic-subject-item-title">{trans.writing}</h3>
                  <Grid className="part-item-data-container" container spacing={2}>
                    {mapSkillData.writing.map((data, idx) => <Grid key={idx} item xs={12} sm={6} lg={3}>
                      <PartItemData {...data} />
                    </Grid>)}
                  </Grid>
                </div>
              </div>
            </div>
          </div>
        ) : toeicSkills.map((tag, i) => {
          return <div className="part-item" key={i}>
            <Typography className="part-item-name" component="h3">{(mapTagName[tag] as MapLocaleString)[router.locale]}</Typography>
            <Grid className="part-item-data-container" container spacing={2}>
              {mapSkillData[tag as Tag].map((itemData, itemDataIdx) => {
                return <Grid key={itemDataIdx} item xs={12} sm={6} md={3}>
                  <PartItemData {...itemData} />
                </Grid>
              })}
            </Grid>
          </div>
        })}
    </div>

    <div className="test-container-panel">
      <Typography className="test-title" component="h3">{trans.simulatorToeic}</Typography>
      <div className="test-item-simulation-container">
        <TestItemPanel
          classes={{ title: "dot-1" }}
          title={trans.titleSimulationTest}
          description={trans.descriptionSimulationTest}
          slug="/test/simulation-test"
          bgImage="/images/app/toeic/simulation-test.png"
        />
      </div>
      <div className="test-item-container">
        <TestItemPanel
          title="MINI TEST"
          description={trans.desciptionMiniTest}
          slug="/test/minitest"
          bgImage="/images/app/toeic/mini-test.png"
        />

        <TestItemPanel
          title="FULL TEST"
          description={trans.desciptionFullTest}
          slug="/test/full-test"
          bgImage="/images/app/toeic/full-test.png"
        />
      </div>
    </div>

    <GoogleAdsense name="PracticeHomeBannerAds" />
  </div>
}

export default TOEICPracticeTopicsSection;