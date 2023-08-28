import { Button, Chip, TextField } from "@mui/material";
import { unwrapResult } from "@reduxjs/toolkit";
import Bowser from "bowser";
import classNames from "classnames";
import { useSnackbar } from "notistack";
import { PropsWithoutRef, useMemo } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import DrawerDialog from "../../components/dialog/DrawerDialog";
import DialogTransitionDown from "../../components/DialogTransitionDown";
import { FeedbackTags } from "../../modules/share/constraint";
import { checkFeedbackTag, resetFeedbackState, setFeedbackContent, setOpenFeedbackDialog, submitFeedback } from "./feedback.slice";
import "./feedbackDialog.scss";

const mapFeedbackLabel = {
  [FeedbackTags.INCORRECT_QUESTION]: "Incorrect question",
  [FeedbackTags.INCORRECT_ANSWER]: "Incorrect answer",
  [FeedbackTags.IN_APPROPRIATE_CONTENT]: "Inappropriate content",
  [FeedbackTags.UNABLE_TO_USE_FEATURES]: "Unable to use features",
  [FeedbackTags.POOR_PROGRESS_TRACKING]: "Poor progress tracking",
  [FeedbackTags.POOR_INTERFACE]: "Poor interface"
}

const FeedBackDialog = (props: PropsWithoutRef<{
  courseId?: string;
  userId?: string;
}>) => {
  const {
    courseId = "",
    userId = ""
  } = props;
  const open = useSelector((state) => state.feedbackState.openDialog);
  const mapCheckedTags = useSelector((state) => state.feedbackState.mapCheckedTags);
  const feedbackContent = useSelector((state) => state.feedbackState.feedbackContent);
  const tableName = useSelector((state) => state.feedbackState.tableName);
  const tableId = useSelector((state) => state.feedbackState.tableId);
  const isOnSubmit = useSelector((state) => state.feedbackState.isOnSubmit);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const tags = useMemo(() => Object.entries(mapCheckedTags).reduce((_tags, [tag, checked]) => {
    if (checked) _tags.push(+tag);
    return _tags;
  }, [] as number[]), [mapCheckedTags]);

  const handleCloseDialog = () => {
    dispatch(resetFeedbackState());
    dispatch(setOpenFeedbackDialog(false));
  }

  const handleSubmit = () => {
    if (!tableId || !courseId || !userId) return;
    if (!tags.length && !feedbackContent) {
      return;
    }
    const { browser } = Bowser.parse(window.navigator.userAgent) ?? {};
    dispatch(submitFeedback({
      tableName,
      tableId,
      content: feedbackContent,
      tags,
      sourceName: browser.name,
      sourceNum: browser.version,
      link: window.location.href,
      courseId,
      userId
    }))
      .then(unwrapResult)
      .then(() => {
        enqueueSnackbar(<div style={{ display: "flex", flexDirection: "column" }}>
          <div><b>Send feedback successfully</b></div>
          <div>We've received your feedback and reply soon.</div>
        </div>, { variant: "info", autoHideDuration: 3000 })
      })
      .finally(() => { handleCloseDialog(); })
  }

  return <DrawerDialog
    open={open}
    onClose={handleCloseDialog}
    drawerAnchor="bottom"
    dialogTransitionComponent={DialogTransitionDown}
    breakpoint="lg"
    classes={{ container: "feedback-dialog-root" }}
  >
    <div className="feedback-dialog-title">WHAT PROBLEMS ARE YOU FACING WITH?</div>
    <div className="feedback-dialog-tags">
      {Object.entries(mapFeedbackLabel).map(([tag, label], key) => {
        const checked = !!mapCheckedTags[tag];
        return <Chip
          key={key}
          label={label}
          className={classNames("feedback-tag-chip", checked ? "checked" : "")}
          clickable
          onClick={() => {
            dispatch(checkFeedbackTag({ tag: +tag, checked: !checked }))
          }}
        />
      })}
    </div>

    <div className="feedback-dialog-content">
      <TextField
        multiline
        minRows={3}
        className="feedback-dialog-input"
        placeholder="Type your problem here..."
        value={feedbackContent} onChange={(evt) => {
          dispatch(setFeedbackContent(evt.target.value))
        }} />
    </div>

    <div className="feedback-dialog-functions">
      <p>Your feedback will be highly appreciated!</p>
      <Button
        className={classNames("feedback-dialog-submit-button", !tags.length && !feedbackContent ? " disabled" : "")}
        onClick={handleSubmit}
        disabled={isOnSubmit || (!tags.length && !feedbackContent)}
      >
        Submit
      </Button>
    </div>
  </DrawerDialog>;
}

export default FeedBackDialog;