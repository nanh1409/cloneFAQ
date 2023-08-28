import { FormControlLabel, Grid, Radio, RadioGroup, Checkbox } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import useAppConfig from "../../../../hooks/useAppConfig";
import usePracticeData from "../../../../hooks/usePracticeData";
import { DMVSubject } from "../../../../types/appPracticeTypes";
import StudyPlanCheckIcon from "../../icons/StudyPlanCheckIcon";
import StudyPlanCheckNoneIcon from "../../icons/StudyPlanCheckNoneIcon";
import { fetchTopicsOrStates, setCanNextStep, setStudyPlanStateId, updatePlan } from "../../studyPlan.slice";
import "./selectTopic.scss";

type MapSelectTopics = {
  [topicId: string]: boolean;
}

const StudyPlanSelectTopicStep = () => {
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const stateId = useSelector((state) => state.studyPlanState.stateId);
  const topics = useSelector((state) => state.studyPlanState.topics);
  const canNext = useSelector((state) => state.studyPlanState.canNext);
  const courseId = studyPlan?.courseId;

  const { appName } = useAppConfig();
  const router = useRouter();
  const { mapSlugData } = usePracticeData(
    appName === "dmv" ?
      (router.query.app as DMVSubject === "dmv-cdl-permit" ? "cdl" : appName)
      : appName
  )

  const dispatch = useDispatch();

  const [selectAll, setSelectAll] = useState(false);
  const [mapSelectTopics, setMapSelectTopics] = useState<MapSelectTopics>({});

  useEffect(() => {
    if (!topics.length && !!courseId) {
      dispatch(fetchTopicsOrStates({ parentId: stateId || null, courseId, isState: false }));
    }
  }, [topics.length, courseId]);

  useEffect(() => {
    const _canNext = !!studyPlan.topicIds?.length;
    if (_canNext !== canNext) {
      dispatch(setCanNextStep(_canNext));
    }
  }, [studyPlan.topicIds]);

  useEffect(() => {
    if (!!topics.length && !!studyPlan?.topicIds) {
      const mapSelectTopics = studyPlan.topicIds.reduce((map, e) => (map[e] = true, map), {} as MapSelectTopics);
      const selectAll = Object.keys(mapSelectTopics).length === topics.length;
      setSelectAll(selectAll);
      setMapSelectTopics(mapSelectTopics)
    }
  }, [studyPlan, topics.length]);

  const handleChangeChangeSelectAll = (checked: boolean) => {
    dispatch(updatePlan({ ...studyPlan, topicIds: checked ? topics.map((e) => e._id) : null }));
    setSelectAll(checked);
    const mapSelectTopics = checked
      ? topics.reduce((map, e) => (map[e._id] = true, map), {} as MapSelectTopics)
      : {} as MapSelectTopics;
    setMapSelectTopics(mapSelectTopics);
  }

  const handleChangeSelectTopic = (topicId: string, checked: boolean) => {
    const newMap = { ...mapSelectTopics, [topicId]: checked };
    const selected = Object.keys(newMap).filter((topicId) => !!newMap[topicId]);

    dispatch(updatePlan({ ...studyPlan, topicIds: selected }));
    const selectAll = selected.length === topics.length
    setSelectAll(selectAll);
    setMapSelectTopics(newMap);
  }

  return <div className="study-plan-select-topic">
    <div className="study-plan-select-topic-header-title study-plan-title">
      Choose your topics
    </div>

    <div className="study-plan-select-topic-list-topic">
      <div className="study-plan-select-all-topics">
        <FormControlLabel
          label="Select All"
          labelPlacement="start"
          classes={{
            label: "sp-select-all-topic-label"
          }}
          control={<Checkbox
            checked={selectAll}
            onChange={(e) => {
              handleChangeChangeSelectAll(e.target.checked);
            }}
            icon={<StudyPlanCheckNoneIcon stroke="var(--titleColor)" />}
            checkedIcon={<StudyPlanCheckIcon stroke="var(--titleColor)" />}
          />}
        />
      </div>

      <div className="study-plan-list-topic-main">
        <Grid container spacing={2}>
          {_.sortBy(topics, (e) => Object.keys(mapSlugData).filter((slug) => mapSlugData[slug]?.tag !== "flash-card").indexOf(e.slug)).map((e) => {
            const icon = (mapSlugData ?? {})[e.slug]?.icon;
            return <Grid key={e._id} item xs={12} sm={6} md={3}>
              <div className={classNames(
                "study-plan-topic-item",
                !!mapSelectTopics[e._id] ? "selected" : ""
              )}
                onClick={() => handleChangeSelectTopic(e._id, !mapSelectTopics[e._id])}
              >
                {icon && <span className="topic-icon"><img src={icon} alt={e.name} width={24} /></span>}
                <span className="topic-name">{e.name}</span>
              </div>
            </Grid>
          })}
        </Grid>
      </div>
    </div>
  </div>;
}

export default StudyPlanSelectTopicStep;