import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "../../../../app/hooks";
import LoadingGameIcon from "../../../../modules/new-game/src/components/LoadingGameIcon";
import { GameStatus } from "../../../../modules/new-game/src/models/game.core";
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from "../../../../modules/share/constraint";
import useSkillBasedExamData from "../../hooks/useSkillBasedExamData";
import { ClientTopicProgress } from "../../topic.model";
import IeltsSkill from "./IeltsSkill";

const IELTSOverview = () => {
  const userId = useSelector((state) => state.authState.userId);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const fetchedSkillBasedProgress = useSelector((state) => state.topicState.fetchedSkillBasedProgress);

  const { enqueueSnackbar } = useSnackbar();
  const { skillItems, topicSetting, goToGame } = useSkillBasedExamData();

  return !!topicSetting && fetchedSkillBasedProgress
    ? <Grid container spacing={2}>
      {skillItems.map((e) => {
        const _topicProgress = topicProgresses[`${topic._id}_${e.skillId}`];
        const topicProgress = _topicProgress?.userId === userId ? ClientTopicProgress.clone(_topicProgress) : undefined;
        const inProgress = [EXAM_SCORE_PLAY, EXAM_SCORE_PAUSE].includes(topicProgress?.status);
        const completed = topicProgress?.status === EXAM_SCORE_FINISH;
        const progress = completed ? topicProgress?.progress : ((topicProgress?.correctNum || 0 + topicProgress?.incorrectNum || 0) / (topicProgress?.totalCardNum || 1));

        return <Grid key={e.skillId} item xs={12} sm={6} md={3}>
          <IeltsSkill
            skillType={e.skill?.type}
            completed={completed}
            inProgress={inProgress}
            score={topicProgress?.score ?? 0}
            progress={progress}
            onClickPlay={() => goToGame({
              skillSettingInfo: e,
              skillTestView: inProgress ? GameStatus.CONTINUE : GameStatus.PLAY,
              onErrorMicro: (err) => {
                enqueueSnackbar("Your microphone is not available!", { variant: "warning" });
                console.warn("Microphone Error", err);
              }
            })}
            onClickReview={() => goToGame({
              skillSettingInfo: e,
              skillTestView: GameStatus.REVIEW
            })}
          />
        </Grid>
      })}
    </Grid>
    : <LoadingGameIcon />;
}

export default IELTSOverview;