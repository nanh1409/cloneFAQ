import { IconButton, Tooltip } from "@mui/material";
import { memo } from "react";
import { useDispatch } from "../../app/hooks";
import { AdditionalGameObjectMenuProps } from "../../modules/new-game/src/components/GameObjectMenu";
import { FeedbackRefs } from "../../modules/share/constraint";
import { setFeedbackDialogData, setOpenFeedbackDialog } from "./feedback.slice";
import FeedbackIcon from "./FeedbackIcon";

const FeedbackCardMenu = memo((props: AdditionalGameObjectMenuProps) => {
  const {
    cardId,
    isChildCard
    // language
  } = props;
  const dispatch = useDispatch();
  return !isChildCard && <Tooltip title="Feedback">
    <IconButton
      className="feedback-report-item game-object-menu-item" size="small"
      onClick={() => {
        dispatch(setOpenFeedbackDialog(true));
        dispatch(setFeedbackDialogData({ tableName: FeedbackRefs.CARD, tableId: cardId }))
      }}
    >
      <FeedbackIcon id={cardId} />
    </IconButton>
  </Tooltip>
})

export default FeedbackCardMenu;