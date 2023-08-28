import { useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING } from "../../../modules/share/constraint";
import { goBackSkillBasedExamOverview, setCurrentSkillConfig, setStudyScoreDataId } from "../topic.slice";

export default function useQuestionPaletteConfig() {
  const topic = useSelector((state) => state.topicState.currentTopic);
  const isSkillBasedExam = useSelector((state) => state.topicState.isSkillBasedExam);
  const currentSkillConfig = useSelector((state) => state.topicState.currentSkillConfig);

  const dispatch = useDispatch();

  const disableStat = useMemo(() => {
    if (topic?.topicExercise?.contentType === EXAM_TYPE_IELTS) {
      return isSkillBasedExam && currentSkillConfig && [SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING].includes(currentSkillConfig.type)
    }
    return false;
  }, [topic?.topicExercise?.contentType, isSkillBasedExam, currentSkillConfig]);

  const isSubmitDisabled = useMemo(() => {
    if (topic?.topicExercise?.contentType === EXAM_TYPE_IELTS) {
      return isSkillBasedExam && currentSkillConfig && [SKILL_TYPE_WRITING].includes(currentSkillConfig.type);
    } else if (topic?.topicExercise?.contentType === EXAM_TYPE_TOEIC) {
      return isSkillBasedExam && currentSkillConfig && [SKILL_TYPE_WRITING].includes(currentSkillConfig.type);
    }
  }, [topic?.topicExercise?.contentType, isSkillBasedExam, currentSkillConfig]);

  function handleBackSkillBasedGame() {
    dispatch(goBackSkillBasedExamOverview());
  }

  return {
    disableStat,
    isSubmitDisabled,
    handleBackSkillBasedGame
  }
}