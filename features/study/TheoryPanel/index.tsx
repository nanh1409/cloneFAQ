import ExpandLess from '@mui/icons-material/ExpandLess';
import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Popover from '@mui/material/Popover';
import _ from "lodash";
import React, { useEffect, useState } from 'react';
import { useSelector } from "../../../app/hooks";
import Topic from "../../../modules/share/model/topic";
import { getFormattedContentWithImg } from "../../../utils/format";
import ScrollContainer from "../../common/ScrollContainer";
import "./style.scss";

interface Props {
  topic?: Topic;
}

const DEFAULT_THEORY_TEXT_SIZE = 12;

const TheoryPanel: React.FC<Props> = ({ topic }) => {
  const [expandTheory, setExpandTheory] = useState(true);
  const [openTheoryDialog, setOpenTheoryDialog] = useState(false);
  const [popperTheoryEl, setPopperTheoryEl] = useState<HTMLElement | null>(null);
  const [theoryTextSize, setTheoryTextSize] = useState(DEFAULT_THEORY_TEXT_SIZE);
  const [theoryTextZoom, setTheoryTextZoom] = useState(100);
  const openPopperTheory = Boolean(popperTheoryEl);

  const fetchedTopicProgresses = useSelector((state) => state.topicState.fetchedTopicProgresses);
  const topicProgresses = useSelector((state) => state.topicState.topicProgresses);
  const userId = useSelector((state) => state.authState.userId);

  useEffect(() => {
    if (topic?._id && fetchedTopicProgresses) {
      const subProgress = topicProgresses[topic._id]?.userId === userId
        ? (topicProgresses[topic._id]?.progress ?? 0) : 0
      if (!subProgress) {
        try {
          const _mapCollapsedTheory = JSON.parse(localStorage.getItem("map-collapsed-theory") || "{}");
          setExpandTheory(!(_mapCollapsedTheory[topic._id] || false));
        } catch (_) {
          setExpandTheory(true);
        }
      } else {
        setExpandTheory(false);
      }
    }
  }, [topic?._id, fetchedTopicProgresses]);

  const changeExpandTheory = () => {
    const _expandTheory = !expandTheory;
    setExpandTheory(_expandTheory);
    const _mapCollapsedTheory = JSON.parse(localStorage.getItem("map-collapsed-theory") || "{}");
    if (topic?._id) {
      localStorage.setItem("map-collapsed-theory", JSON.stringify({ ..._mapCollapsedTheory, [topic._id]: !_expandTheory }));
    }
  }

  const showPopupContentParaSmall = (event: React.MouseEvent<HTMLElement>) => {
    if (!topic?.description) return;
    setPopperTheoryEl(event.currentTarget)
  }

  const ascSize = () => {
    setTheoryTextSize((theoryTextSize) => theoryTextSize + _.divide(DEFAULT_THEORY_TEXT_SIZE, 10))
    setTheoryTextZoom((theoryTextZoom) => theoryTextZoom + 10);
  }

  const descSize = () => {
    setTheoryTextSize((theoryTextSize) => theoryTextSize - _.divide(DEFAULT_THEORY_TEXT_SIZE, 10))
    setTheoryTextZoom((theoryTextZoom) => theoryTextZoom - 10);
  }

  const reSizeText = () => {
    setTheoryTextSize(DEFAULT_THEORY_TEXT_SIZE)
    setTheoryTextZoom(100);
  }

  const showPopupContentParaFullScreen = () => {
    if (!topic?.description) return;
    setOpenTheoryDialog(true);
  }

  return <>
    <div className="sub-topic-theory-control">
      <Button
        className="sub-topic-theory-control-button"
        onClick={() => changeExpandTheory()}
        endIcon={<ExpandLess sx={{
          transform: `rotate(${expandTheory ? 0 : -180}deg)`,
          transition: "transform 0.4s ease"
        }} />}
      >
        Theory
      </Button>
    </div>
    <Collapse in={expandTheory}>
      <div id="sub-topic-theory">
        <ScrollContainer thumbSize={50} style={{ height: "calc(100% - 8px)" }}>
          <div
            style={{ fontSize: `${theoryTextSize}px` }}
            className="sub-topic-theory-main"
            dangerouslySetInnerHTML={{ __html: topic?.description }}
          />
        </ScrollContainer>
        <div className="zoom-theory">
          <img className="change-size-text" onClick={showPopupContentParaSmall} src="/images/smallscreen.svg" alt="SmallScreen" />
          <Popover
            className="show-zoom-in-out-theory"
            open={openPopperTheory}
            anchorEl={popperTheoryEl}
            onClose={() => setPopperTheoryEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <div className="custom-popover-theory">
              <span>{theoryTextZoom}%</span>
              <button onClick={() => ascSize()}> + </button>
              <button onClick={() => descSize()}> - </button>
              <button onClick={() => reSizeText()}> Reset </button>
            </div>
          </Popover>
          <img onClick={() => showPopupContentParaFullScreen()} src="/images/fullscreen.svg" alt="fullscreen" />
        </div>
      </div>
    </Collapse>
    <Dialog
      open={openTheoryDialog}
      onClose={() => setOpenTheoryDialog(false)}
      fullWidth
      maxWidth="xl"
      PaperProps={{ className: "dialog-theory-modal" }}
      id="dialog-theory-modal"
    >
      <DialogTitle className="dialog-theory-modal-title"></DialogTitle>
      <DialogContent sx={{ textAlign: "justify" }} className="dialog-theory-modal-content">
        <div
          className='dialog-theory-modal-content-text'
          dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(topic?.description) }}
        >
        </div>
      </DialogContent>
      <DialogActions style={{ padding: "16px" }} className="dialog-theory-modal-actions">
      </DialogActions>
    </Dialog>
  </>
}

export default TheoryPanel;