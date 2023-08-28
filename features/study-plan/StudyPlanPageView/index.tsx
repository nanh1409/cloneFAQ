import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { Button, Container } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import moment from "moment";
import { useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import CtaButton from "../../../components/CtaButton";
import StudyPlan from "../../../modules/share/model/studyPlan";
import StudyPlanBeginTargetLevelStep from "../build-steps/BeginTargetLevel";
import StudyPlanBuildEndStep from "../build-steps/BuildEnd";
import EndStudyPlan from "../build-steps/EndStudyPlan";
import StudyPlanIntroStep from "../build-steps/IntroStep";
import StudyPlanSelectStateStep from "../build-steps/SelectState";
import StudyPlanSelectTopicStep from "../build-steps/SelectTopic";
import StudyPlanTestDateStep from "../build-steps/TestDate";
import UserStudyPlan from "../build-steps/UserStudyPlan";
import { fetchStudyPlan, initPlanTopics, loadPlans, setCurrentPlan, setInitTopicLoading, setStudyPlanBuildStep, setTopicQuestionMode } from "../studyPlan.slice";
import useStudyPlanConfig, { StudyPlanBuildStep } from "../useStudyPlanConfig";
import "./style.scss";

const StudyPlanPageView = () => {
  const { loading: authLoading, user, userId } = useSelector((state) => state.authState);
  const {
    loading: studyPlanLoading,
    initTopicLoading,
    listPlans,
    currentStudyPlan,
    step,
    canNext,
    isCreated
  } = useSelector((state) => state.studyPlanState);

  const dispatch = useDispatch();

  const config = useStudyPlanConfig();

  useEffect(() => {
    if (!authLoading && !!config.courseId) {
      let studyPlan: StudyPlan;
      dispatch(setTopicQuestionMode(config.isTopicQuestion));
      if (!user) {
        // on-device StudyPlan
        const _listPlans = listPlans.filter(({ userId: _userId, _id }) => _userId === userId && !!_id);
        studyPlan = _listPlans.find(({ courseId }) => courseId === config.courseId) ?? null;
        if (!studyPlan) {
          studyPlan = new StudyPlan({ userId, courseId: config.courseId, startDate: moment().endOf("day").valueOf() });
          _listPlans.push(studyPlan);
        }
        dispatch(loadPlans(_listPlans));
        dispatch(setCurrentPlan({ studyPlan, isCreated: !!studyPlan?._id }));
      } else {
        dispatch(fetchStudyPlan({ courseId: config.courseId, userId, withDailyGoals: true }))
          .then(unwrapResult)
          .then(({ studyPlan }) => {
            if (!studyPlan) {
              const newStudyPlan = new StudyPlan({ userId, courseId: config.courseId, startDate: moment().endOf("day").valueOf() });
              dispatch(setCurrentPlan({ studyPlan: newStudyPlan, isCreated: false }));
            } else {
              dispatch(setCurrentPlan({ studyPlan, isCreated: true }));
            }
          });
      }
    }
  }, [authLoading, config.courseId]);

  useEffect(() => {
    if (!!currentStudyPlan && !isCreated) {
      if (!!config.initTopicSlugs) {
        dispatch(initPlanTopics({ courseId: config.courseId, slugs: config.initTopicSlugs }))
      } else {
        dispatch(setInitTopicLoading(false));
      }
    } else if (!!currentStudyPlan && isCreated) {
      dispatch(setInitTopicLoading(false));
    }
  }, [!!currentStudyPlan, isCreated, config.initTopicSlugs])

  const handleChangeStep = (args: { next?: boolean } = { next: false }) => {
    const isNext = !!args.next;
    const currentStepIndex = config.steps.findIndex((v) => v === step);
    if (currentStepIndex !== -1) {
      if (currentStepIndex > 0 && !isNext) {
        dispatch(setStudyPlanBuildStep({ step: config.steps[currentStepIndex - 1] }));
      } else if (currentStepIndex + 1 < config.steps.length && isNext && canNext) {
        const nextStep = config.steps[currentStepIndex + 1];
        dispatch(setStudyPlanBuildStep({
          step: nextStep,
          isNext: true,
          canNext: nextStep === StudyPlanBuildStep.INTRO
        }));
      }
    }
  }

  const renderStep = () => {
    switch (step) {
      case StudyPlanBuildStep.INTRO:
        return <StudyPlanIntroStep />;
      case StudyPlanBuildStep.BEGIN_TARGET:
        return <StudyPlanBeginTargetLevelStep />;
      case StudyPlanBuildStep.STATE:
        return <StudyPlanSelectStateStep />;
      case StudyPlanBuildStep.TOPIC:
        return <StudyPlanSelectTopicStep />;
      case StudyPlanBuildStep.TEST_DATE:
        return <StudyPlanTestDateStep />;
      case StudyPlanBuildStep.END:
        return <StudyPlanBuildEndStep />;
      default:
        return <></>;
    }
  }

  const renderView = () => {
    if (!currentStudyPlan || !isCreated) {
      // Un-created
      return <>
        {renderStep()}
        {step === StudyPlanBuildStep.INTRO && <div className="study-plan-button-group">
          <div className="study-plan-intro-btn">
            <CtaButton
              title="Start"
              width={180}
              breakpoint={576}
              backgroundColor="var(--btnTestBackground)"
              backgroundLayerColor="var(--btnTestBackgroundLayer)"
              color="var(--btnTestTitleColor)"
              borderRadius={10}
              titleClassName="study-plan-btn-title"
              onClick={() => handleChangeStep({ next: true })}
            />
          </div>
        </div>}
        {![
          StudyPlanBuildStep.INTRO,
          StudyPlanBuildStep.END
        ].includes(step) && <div className="study-plan-step-btn-group">
            <Button className="study-plan-step-btn btn-back"
              onClick={() => handleChangeStep()}
            >
              <ChevronLeft color="inherit" /> Back
            </Button>

            <Button className="study-plan-step-btn btn-next"
              onClick={() => handleChangeStep({ next: true })}
            >
              Next <ChevronRight color="inherit" />
            </Button>
          </div>}
      </>
    } else {
      if (currentStudyPlan.testDate && moment(currentStudyPlan.testDate).isSameOrBefore(Date.now(), "day")) {
        return <EndStudyPlan />
      }
      // Render Current StudyPlan
      return <UserStudyPlan />;
    }
  }

  return <Container maxWidth="lg" id="study-plan-page-view">
    {!authLoading && !studyPlanLoading && !initTopicLoading
      ? <>{renderView()}</>
      : <></>}
  </Container>
}

export default StudyPlanPageView;