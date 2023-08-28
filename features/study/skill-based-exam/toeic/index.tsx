import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useSelector } from "../../../../app/hooks";
import LoadingGameIcon from "../../../../modules/new-game/src/components/LoadingGameIcon";
import { GameStatus } from "../../../../modules/new-game/src/models/game.core";
import { SkillSettingInfo } from "../../../../modules/share/model/topicSetting";
import useSkillBasedExamData, { getSkillItemProgress } from "../../hooks/useSkillBasedExamData";
import DefaultSkillTestOverview from "../DefaultSkillTestOverview";
import TOEICSkill from "./toeicSkill";

const TOEICSWOverview = () => {
  const fetchedSkillBasedProgress = useSelector((state) => state.topicState.fetchedSkillBasedProgress);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const topic = useSelector((state) => state.topicState.currentTopic);
  const userId = useSelector((state) => state.authState.userId);

  const { enqueueSnackbar } = useSnackbar();
  const { skillItems, topicSetting, goToGame } = useSkillBasedExamData();
  const hideSkillName = skillItems.length <= 1;

  const handleClickPlay = (e: SkillSettingInfo, view: GameStatus) => {
    goToGame({
      skillSettingInfo: e,
      skillTestView: view,
      onErrorMicro: (err) => {
        enqueueSnackbar("Your microphone is not available!", { variant: "warning" });
        console.warn("Microphone Error", err);
      }
    })
  }

  const handleClickReview = (e: SkillSettingInfo) => {
    goToGame({
      skillSettingInfo: e,
      skillTestView: GameStatus.REVIEW
    })
  }


  const renderSkillItems = () => {
    if (skillItems.length === 1) {
      const item = skillItems.at(0);
      const { completed, inProgress } = getSkillItemProgress({ topicId: topic._id, userId, skillId: item.skillId, topicProgresses });

      return <Grid item xs={12}
        display="flex"
        flexDirection="column"
        alignItems="center"
      >
        <DefaultSkillTestOverview
          completed={completed}
          inProgress={inProgress}
          onClickPlay={() => handleClickPlay(item, inProgress ? GameStatus.CONTINUE : GameStatus.PLAY)}
          onClickReview={() => handleClickReview(item)}
        />
      </Grid>
    }
    return skillItems.map((e) => {
      const { completed, inProgress } = getSkillItemProgress({ topicId: topic._id, userId, skillId: e.skillId, topicProgresses });

      return <Grid key={e.skillId} item xs={12} sm={6}>
        <TOEICSkill
          hideSkillName={hideSkillName}
          skillType={e.skill.type}
          completed={completed}
          inProgress={inProgress}
          onClickPlay={() => () => handleClickPlay(e, inProgress ? GameStatus.CONTINUE : GameStatus.PLAY)}
          onClickReview={() => handleClickReview(e)}
        />
      </Grid>
    })
  }

  return !!topicSetting && fetchedSkillBasedProgress
    ? <Grid container spacing={2} justifyContent="center">
      {renderSkillItems()}
    </Grid>
    : <LoadingGameIcon />
}

export default TOEICSWOverview;