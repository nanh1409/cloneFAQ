import Check from "@mui/icons-material/Check";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { PropsWithoutRef, useMemo } from "react";
import {
  SKILL_TYPE_LISTENING, SKILL_TYPE_READING, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING
} from "../../../../modules/share/constraint";
import ListeningIcon from "./ListeningIcon";
import ReadingIcon from "./ReadingIcon";
import SpeakingIcon from "./SpeakingIcon";
import WritingIcon from "./WritingIcon";

const SkillContainer = styled(Box)({
  backgroundColor: "#fff", boxShadow: "0px 4px 40px rgba(95, 73, 118, 0.1)"
});

const SkillTitle = styled("div")({
  fontSize: "18px", color: "#a59fad", textAlign: "center"
});

const SkillBox = styled(Box)({
  height: "120px", width: "120px",
  display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "9px",
  borderRadius: "40px"
});

const SkillScore = styled(Box)({
  fontSize: "15px", fontWeight: 600
});

const SkillActions = styled(Box)({
  display: "flex", flexDirection: "column", gap: "10px", minHeight: "80px"
});

const ReviewButton = styled(Button)({
  height: "35px", fontSize: "14px", backgroundColor: "#fff", color: "#1E2959", borderRadius: "10px", border: "0.5px solid #b8b8b8"
});

const TestButton = styled(Button)({
  height: "35px", fontWeight: 700, fontSize: "14px", backgroundColor: "#fff", color: "#1E2959", borderRadius: "10px", boxShadow: "0px 4px 20px rgba(95, 73, 118, 0.1)"
});

const IeltsSkill = (props: PropsWithoutRef<{
  skillType: number;
  completed?: boolean;
  inProgress?: boolean;
  score?: number;
  progress?: number;
  onClickPlay?: () => void;
  onClickReview?: () => void;
}>) => {
  const {
    skillType,
    completed,
    inProgress,
    score,
    progress = 0,
    onClickPlay = () => { },
    onClickReview = () => { }
  } = props;

  const config = useMemo(() => {
    let skillName = "", icon = <></>, bgcolor = "#fff", color = "#fff";
    switch (skillType) {
      case SKILL_TYPE_LISTENING:
        skillName = "Listening";
        icon = <ListeningIcon />;
        bgcolor = "#EDFBF3";
        color = "#00A659";
        break;
      case SKILL_TYPE_READING:
        skillName = "Reading";
        icon = <ReadingIcon />;
        bgcolor = "#FDF3FF";
        color = "#FF55BB"
        break;
      case SKILL_TYPE_SPEAKING:
        skillName = "Speaking";
        icon = <SpeakingIcon />;
        bgcolor = "#EAFBFF";
        color = "#00BEF9"
        break;
      case SKILL_TYPE_WRITING:
        skillName = "Writing";
        icon = <WritingIcon />;
        bgcolor = "#FFF7F1";
        color = "#FF6A52";
      default:
        break;
    }
    return {
      skillName, icon, bgcolor, color
    }
  }, [skillType]);

  const testLabel = useMemo(() => inProgress ? "CONTINUE" : "TAKE TEST", [inProgress]);

  const isQuiz = useMemo(() => [SKILL_TYPE_LISTENING, SKILL_TYPE_READING].includes(skillType), [skillType]);

  return <Box>
    <SkillContainer p="16px">
      <SkillTitle>{config.skillName}</SkillTitle>
      <SkillBox m="0 auto" mt="16px" bgcolor={config.bgcolor}>
        <Box height="52px">{config.icon}</Box>
        {completed && <SkillScore color={config.color}>{
          isQuiz
            ? <>Band Score: {score}</>
            : <Box display="flex" alignItems="center">Completed <Check color="inherit" fontSize="small" /></Box>
        }</SkillScore>}
      </SkillBox>

      <SkillActions mt="35px" justifyContent="flex-end">
        {completed && <ReviewButton onClick={onClickReview}>REVIEW</ReviewButton>}
        <TestButton onClick={onClickPlay}>{testLabel}</TestButton>
      </SkillActions>

    </SkillContainer>
    <Box height="6px" bgcolor="#e8e8e8" position="relative">
      <Box height="6px" position="absolute" width={completed ? "100%" : `${progress}%`} bgcolor="red" />
    </Box>
  </Box>
}

export default IeltsSkill;