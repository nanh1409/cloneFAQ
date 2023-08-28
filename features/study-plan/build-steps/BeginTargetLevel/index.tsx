import { Grid, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { StudyPlanBeginLevel, StudyPlanTargetLevel } from "../../../../modules/share/model/studyPlan";
import { setCanNextStep, updatePlan } from "../../studyPlan.slice";
import classNames from "classnames";
import "./beginTargetLevel.scss";
import StudyPlanTargetIcon from "../../icons/StudyPlanTargetIcon";
import StudyPlanBeginIcon from "../../icons/StudyPlanBeginIcon";

const beginLevels = [
  {
    id: StudyPlanBeginLevel.Beginner,
    label: "Beginner"
  },
  {
    id: StudyPlanBeginLevel.Intermediate,
    label: "Intermediate"
  },
  {
    id: StudyPlanBeginLevel.Advanced,
    label: "Advanced"
  }
];

const targetLevels = [
  {
    id: StudyPlanTargetLevel.Pass,
    label: "Pass"
  },
  {
    id: StudyPlanTargetLevel.Advanced,
    label: "Advanced"
  },
  {
    id: StudyPlanTargetLevel.Master,
    label: "Master"
  }
];

const StudyPlanBeginTargetLevelStep = () => {
  const levels = Object.entries(StudyPlanBeginLevel);
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const canNext = useSelector((state) => state.studyPlanState.canNext);
  const [level, setLevel] = useState<StudyPlanBeginLevel | null>(studyPlan?.begin ?? null);
  const [target, setTarget] = useState<StudyPlanTargetLevel | null>(studyPlan?.target ?? null);

  const dispatch = useDispatch();

  useEffect(() => {
    const _canNext = level !== null && target !== null;
    if (_canNext !== canNext) {
      dispatch(setCanNextStep(_canNext));
    }
  }, [level, target]);

  const handleChangeLevel = (_level: StudyPlanBeginLevel) => {
    setLevel(_level);
    if (!!studyPlan) {
      dispatch(updatePlan({ ...studyPlan, begin: _level }));
    }
  }

  const handleChangeTarget = (_target: StudyPlanTargetLevel) => {
    setTarget(_target);
    if (!!studyPlan) {
      dispatch(updatePlan({ ...studyPlan, target: _target }));
    }
  }

  return <div className="study-plan-begin-target">
    <div className="study-plan-begin-target-title study-plan-title">Choose your current & target level</div>
    <div className="study-plan-level">
      <div className="study-plan-header study-plan-level-header">Your current level</div>
      <Grid container spacing={4}>
        {beginLevels.map((item, i) => {
          return <Grid item xs={12} sm={4} key={i}>
            <div
              className={classNames("study-plan-level-item", item.id === level ? "active" : "")}
              onClick={() => handleChangeLevel(item.id)}
            >
              <div className="study-plan-level-item-header">{item.label}</div>
              <div className="study-plan-level-item-image">
                <StudyPlanBeginIcon level={item.id} />
              </div>
            </div>
          </Grid>
        })}
      </Grid>
    </div>

    <div className="study-plan-level">
      <div className="study-plan-header study-plan-level-header">Your target level</div>
      <Grid container spacing={4}>
        {targetLevels.map((item, i) => {
          return <Grid item xs={12} sm={4} key={i}>
            <div
              className={classNames("study-plan-level-item", item.id === target ? "active" : "")}
              onClick={() => handleChangeTarget(item.id)}
            >
              <div className="study-plan-level-item-header">{item.label}</div>
              <div className="study-plan-level-item-image">
                <StudyPlanTargetIcon level={item.id} />
              </div>
            </div>
          </Grid>
        })}
      </Grid>
    </div>
  </div>;
}

export default StudyPlanBeginTargetLevelStep;