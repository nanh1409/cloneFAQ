import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { GameStatus } from "../../../modules/new-game/src/models/game.core";
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY, SKILL_TYPE_SPEAKING } from "../../../modules/share/constraint";
import Skill from "../../../modules/share/model/skill";
import { SkillSettingInfo } from "../../../modules/share/model/topicSetting";
import { ClientTopicProgress } from "../topic.model";
import { fetchCards, fetchSkillBasedProgress, fetchTopicSetting, MapTopicProgress, setCurrentSkillConfig } from "../topic.slice";

export default function useSkillBasedExamData() {
  const userId = useSelector((state) => state.authState.userId);
  const user = useSelector((state) => state.authState.user);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const topicSetting = useSelector((state) => state.topicState.topicSetting);

  const dispatch = useDispatch();

  const skillItems = useMemo<SkillSettingInfo[]>(() => {
    if (!topicSetting) return [];
    return (topicSetting.skillInfos ?? []).map((e) => {
      const eSkill = topicSetting.skills?.find((skill) => skill._id === e.skillId);
      return { ...e, skill: eSkill };
    });
  }, [topicSetting]);

  useEffect(() => {
    if (!!topic?._id) {
      const topicSettingId = topic.topicExercise.topicSettingId;
      if (topicSettingId) {
        dispatch(fetchTopicSetting({ topicSettingId, topicId: topic._id, includeSkills: true }))
      }
    }
  }, [topic?._id]);

  useEffect(() => {
    if (!!topicSetting) {
      dispatch(fetchSkillBasedProgress({ topicId: topic._id, userId, skillIds: topicSetting.skillInfos?.map((e) => e.skillId) ?? [], client: !user }))
    }
  }, [!!topicSetting, user]);

  const goToGame = async (args: {
    skillSettingInfo: SkillSettingInfo;
    skillTestView: GameStatus;
    onErrorMicro?: (err?: any) => void;
  }) => {
    const {
      skillSettingInfo: e,
      skillTestView,
      onErrorMicro = () => {}
    } = args;

    if (e.skill?.type === SKILL_TYPE_SPEAKING && skillTestView !== GameStatus.REVIEW) {
      let micError = false;
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } catch (err) {
        onErrorMicro(err);
        micError = true;
      }
      if (micError) return;
    }
    const skillValues = (topicSetting.skills ?? [])
      .filter((skill) => skill._id === e.skillId || skill.parentId === e.skillId)
      .map((skill) => skill.value);
    dispatch(setCurrentSkillConfig(Object.assign({}, e.skill as Skill, { skillTestView })));
    dispatch(fetchCards({ topicId: topic._id, skillValues }));
  }

  return {
    skillItems,
    topicSetting,
    goToGame
  };
}

export function getSkillItemProgress(args: {
  topicId: string; userId: string; skillId: string;
  topicProgresses: MapTopicProgress;
}) {
  const {
    topicId,
    skillId,
    userId,
    topicProgresses 
  } = args;
  const _topicProgress = topicProgresses[`${topicId}_${skillId}`];
  const topicProgress = _topicProgress?.userId === userId ? ClientTopicProgress.clone(_topicProgress) : undefined;
  return {
    inProgress: [EXAM_SCORE_PLAY, EXAM_SCORE_PAUSE].includes(topicProgress?.status),
    completed: topicProgress?.status === EXAM_SCORE_FINISH
  }
}