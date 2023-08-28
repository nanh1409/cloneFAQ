import Check from "@mui/icons-material/Check";
import { Box, Button, Typography } from "@mui/material";
import { styled } from "@mui/styles";
import { PropsWithoutRef, useMemo } from "react";
import { SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING } from "../../../../modules/share/constraint";
import SpeakingIcon from "../ielts/SpeakingIcon";
import WritingIcon from "../ielts/WritingIcon";

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

const TOEICSkill = (props: PropsWithoutRef<{
  skillType: number;
  completed?: boolean;
  inProgress?: boolean;
  onClickPlay?: () => void;
  onClickReview?: () => void;
  hideSkillName?: boolean;
}>) => {
  const {
    skillType,
    completed,
    inProgress,
    onClickPlay = () => { },
    onClickReview = () => { },
    hideSkillName
  } = props;

  const config = useMemo(() => {
    let skillName = "", icon = <></>, bgcolor = "", color = "";

    switch (skillType) {
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
      skillName,
      icon,
      bgcolor,
      color
    }
  }, [skillType]);

  const testLabel = useMemo(() => inProgress ? "CONTINUE" : "TAKE TEST", [inProgress]);

  return <Box>
    <SkillContainer p="16px">
      {!hideSkillName && <SkillTitle>{config.skillName}</SkillTitle>}

      <SkillBox m="0 auto" mt="16px" bgcolor={config.bgcolor}>
        <Box height="52px">{config.icon}</Box>
        {completed && <SkillScore color={config.color}>
          <Box display="flex" alignItems="center">Completed <Check color="inherit" fontSize="small" /></Box>
        </SkillScore>}
      </SkillBox>

      <SkillActions mt="35px" justifyContent="flex-end">
        {completed && <ReviewButton onClick={onClickReview}>REVIEW</ReviewButton>}
        <TestButton onClick={onClickPlay}>{testLabel}</TestButton>
      </SkillActions>
    </SkillContainer>
  </Box>
}

export default TOEICSkill;