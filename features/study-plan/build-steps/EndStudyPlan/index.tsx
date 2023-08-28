import moment from "moment";
import { useDispatch, useSelector } from "../../../../app/hooks";
import CtaButton from "../../../../components/CtaButton";
import StudyPlan from "../../../../modules/share/model/studyPlan";
import { recreateStudyPlan } from "../../studyPlan.slice";
import "./style.scss";

const EndStudyPlan = () => {
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const dispatch = useDispatch();

  const handleRecreateStudyPlan = () => {
    const initPlan = new StudyPlan({ courseId: studyPlan.courseId, userId: studyPlan.userId, startDate: moment().endOf("day").valueOf() });
    dispatch(recreateStudyPlan({ initPlan }));
  }

  return <div className="end-study-plan-view">
    <div className="end-study-plan-view-wrap">
      <div className="end-study-plan-main">
        <div className="end-study-plan-main-label">
          Congrats! You have already completed your study plan excellently!
        </div>
        <div className="end-study-plan-main-img">
          <img src="/images/study-plan/end-study-plan.png" alt="end-study-plan" />
        </div>
        <div className="end-study-plan-main-cta">
          Now you are ready to take the exam or create a new plan!
        </div>

        <div className="end-study-plan-main-cta-btn-wrap">
          <CtaButton
            title="CREATE NOW"
            width={200}
            breakpoint={576}
            backgroundColor="var(--btnTestBackground)"
            backgroundLayerColor="var(--btnTestBackgroundLayer)"
            color="var(--btnTestTitleColor)"
            borderRadius={10}
            titleClassName="end-study-plan-cta-btn-title"
            onClick={handleRecreateStudyPlan}
          />
        </div>
      </div>
    </div>
  </div>
}

export default EndStudyPlan;