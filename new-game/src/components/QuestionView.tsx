import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Collapse, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Popover, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import React, { ForwardedRef, forwardRef, memo, MouseEvent, PropsWithoutRef, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../hooks";
import useCheckCurrentAudio from "../hooks/useCheckCurrentAudio";
import useCheckTOEICLRSimulator from "../hooks/useCheckTOEICLRSimulator";
import { CLASS_GAME_LAYOUT_LEFT_RIGHT, Face } from "../models/game.core";
import { setIsCheckShowCollapse } from "../redux/reducers/game.slice";
// import { getFormattedContentWithImg, getStorageURL } from "../utils/format";
import GameAudioPlayer from "./GameAudioPlayer";
import HTMLContent from "./HTMLContent";
import FullScreenIcon from './icons/FullScreenIcon';
import SmallScreenIcon from './icons/SmallScreenIcon';
import ImageWidget from "./ImageWidget";
import "./questionView.scss";
import RichContent from "./RichContent";
import useGameContext from '../hooks/useGameContext';
const QuestionView = memo(forwardRef((props: PropsWithoutRef<{
  gameObjectId?: string;
  questionLabel?: string;
  question: Face;
  isPara?: boolean,
  defaultTextSize?: number,
  isRoot?: boolean;
  className?: string;
}>, ref: ForwardedRef<HTMLDivElement>) => {
  const { gameObjectId, questionLabel, question, isPara, defaultTextSize, isRoot, className } = props;
  const mathJax = useGameSelector((state) => state.gameState.gameSetting?.mathJax);
  const userPlaying = useGameSelector((state) => state.gameState.userPlaying);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language ?? "en");
  const hideParaQuestionLabel = useGameSelector((state) => state.gameState.gameSetting?.hideParaQuestionLabel);
  const useParaTopDownScrollDefault = useGameSelector((state) => state.gameState.gameSetting?.useParaTopDownScrollDefault);
  const useParaLeftRightDefault = useGameSelector((state) => state.gameState.gameSetting?.useParaLeftRightDefault);
  const defaultParaLeftRightFontSize = useGameSelector((state) => state.gameState.gameSetting?.defaultParaLeftRightFontSize ?? 16);
  const gameObjects = useGameSelector((state) => state.gameState.gameObjects);
  const [isOpen, setisOpen] = useState(false)
  const [widthText, setWidthText] = useState(100)
  const [menuEl, setMenuEl] = useState<HTMLDivElement | null>(null);
  const [textSizeChangeEl, setTextSizeChangeEl] = useState<HTMLButtonElement | null>(null);
  const [sizeTextPara, setSizeTextPara] = useState(defaultTextSize ?? defaultParaLeftRightFontSize);
  const dispatch = useDispatch();
  const [maxWidthModal, setMaxWidthModal] = useState<any>()
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));
  const isLayoutLeftRight = useMemo(() => question?.isLayoutLeftRight || question?.content?.includes(CLASS_GAME_LAYOUT_LEFT_RIGHT) || useParaLeftRightDefault, [question?.content, useParaLeftRightDefault, question]);
  const questText = useMemo(() => language === "vi" ? "Câu" : "Question", [language]);
  const enableSetCurrentAudio = useCheckCurrentAudio();
  const {
    isPlayingSimulatorListening,
    useDefaultPrepareTime,
    onNextGameListening
  } = useCheckTOEICLRSimulator();

  const { getFormattedContentWithImg , getStorageURL} = useGameContext();

  const showPopupContentParaFullScreen = () => {
    if (!question.content) return;
    setisOpen(true);
    setMaxWidthModal('xl');
  }
  const showPopupContentParaMedium = () => {
    setExpanded(!expanded)
    setShow(!show)
    dispatch(setIsCheckShowCollapse(expanded))
  }

  const showPopupContentParaSmall = (event: MouseEvent<HTMLButtonElement>) => {
    if (!question.content) return;
    setTextSizeChangeEl(event.currentTarget);
  }

  const ascSize = () => {
    setSizeTextPara(sizeTextPara + _.divide(defaultTextSize, 10))
    setWidthText(widthText + 10)
  }

  const descSize = () => {
    setSizeTextPara(sizeTextPara - _.divide(defaultTextSize, 10))
    setWidthText(widthText - 10)
  }
  const reSizeText = () => {
    setSizeTextPara(defaultTextSize)
    setWidthText(100)
  }
  const [expanded, setExpanded] = useState(true);
  const open = Boolean(textSizeChangeEl);
  const gameObjectSkill = useMemo(() => gameObjects.find((go) => go.id === gameObjectId)?.skill, [gameObjectId]);
  return <div ref={ref} className={classNames(
    "game-object-question",
    isPara && isRoot ? "question-para" : "",
    isPara && isRoot && isLayoutLeftRight ? "para-root" : "",
    isTabletUI ? "tablet" : "",
    !question.content && !question.urlImage ? "no-content" : "",
    className
  )}>
    {!!question.urlSound && !(isPara && isRoot) && <div className="game-object-question-sound">
      <GameAudioPlayer
        src={getStorageURL(question.urlSound)}
        // playOnRender={!!userPlaying && !!isRoot}
        playOnRender={isRoot && (userPlaying || isPlayingSimulatorListening)}
        enableSetCurrentAudio={enableSetCurrentAudio}
        audioId={gameObjectId}
        disableLoop={isPlayingSimulatorListening && isRoot}
        disableSeek={isPlayingSimulatorListening && isRoot}
        disableControl={isPlayingSimulatorListening && isRoot}
        hideSeek={isPlayingSimulatorListening && isRoot}
        hideSpeedRate={isPlayingSimulatorListening && isRoot}
        onEnd={() => {
          if (isRoot && isPlayingSimulatorListening) {
            // TODO: implement control nextGame UI state
            onNextGameListening()
          }
        }}
        delay={isPlayingSimulatorListening && isRoot
          ? (useDefaultPrepareTime ? (gameObjectSkill?.timePrepare || 5) : (gameObjectSkill?.timePrepare || 0))
          : 0}
      />
    </div>}

    {!!question.urlImage && !(isPara && isRoot) && !isPlayingSimulatorListening && <div className="game-object-question-image">
      <ImageWidget src={getStorageURL(question.urlImage)} width={300} />
    </div>}

    {(!!question.content || (isPara && isRoot && !!question.urlImage)) &&
      <>
        {/* <RichContent mathJax={mathJax}> */}
        {isPara && isRoot && (isLayoutLeftRight || useParaTopDownScrollDefault)
          ? <div className={classNames(
            "content-para-scroll",
            isTabletUI ? "tablet" : "",
            !!textSizeChangeEl ? "open-menu" : ""
          )} ref={setMenuEl}>
            <Collapse
              collapsedSize="50px"
              in={expanded}
              classes={{
                root: "content-para-scroll-collapse-root",
                wrapper: "content-para-scroll-collapse-wrapper",
                wrapperInner: "content-para-scroll-collapse-wrapper-inner"
              }}
            >
              <div
                style={{ fontSize: `${sizeTextPara}px`, padding: '0 4px' }}
                className="game-object-question-text content-game-para-custom"
              >
                {!hideParaQuestionLabel && <div style={{
                  color: '#1d1d1d',
                  fontWeight: 'bold',
                }}>{questText} {questionLabel}: </div>}
                <div className="game-object-question-image">
                  <ImageWidget src={getStorageURL(question.urlImage)} width={300} />
                </div>
                <RichContent mathJax={mathJax && isPara}>
                  <HTMLContent content={getFormattedContentWithImg(question.content)} />
                </RichContent>
              </div>

            </Collapse>
            <div className="zoom-para">
              <IconButton className="change-text-size" onClick={showPopupContentParaSmall}>
                <SmallScreenIcon />
              </IconButton>
              <Popover className="show-zoom-in-out"
                classes={{
                  paper: "change-text-size-pop-paper"
                }}
                open={open}
                anchorEl={textSizeChangeEl}
                onClose={() => setTextSizeChangeEl(null)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                container={menuEl}
              >
                <div className="custom-popover">
                  <span>{widthText}%</span>
                  <button onClick={() => ascSize()}> + </button>
                  <button onClick={() => descSize()}> - </button>
                  <button onClick={() => reSizeText()}> Reset </button>
                </div>
              </Popover>
              <IconButton onClick={() => showPopupContentParaFullScreen()}>
                <FullScreenIcon />
              </IconButton>
              <div onClick={() => showPopupContentParaMedium()} className="show-content-gamepara">
                {!show ? <ExpandLessIcon className="down" /> : <ExpandMoreIcon className="up" />}
              </div>
            </div>
          </div>
          : <>
            <div className="game-object-question-text" style={{ marginRight: "17px" }}>
              <HTMLContent content={getFormattedContentWithImg(question.content)} />
            </div>
          </>
        }
        {/* </RichContent> */}
      </>}

    <Dialog
      open={isOpen}
      onClose={() => setisOpen(false)}
      fullWidth
      maxWidth={maxWidthModal}
      id="dialog-content-para"
    >
      <DialogTitle className="submit-game-confirm-modal-title"></DialogTitle>
      <DialogContent sx={{ textAlign: "justify" }} className="dialog-question-text-content">
        <div
          className='game-object-question-text'
          dangerouslySetInnerHTML={{ __html: getFormattedContentWithImg(question?.content) }}
        >
        </div>
      </DialogContent>
      <DialogActions className="submit-game-confirm-modal-actions">
      </DialogActions>
    </Dialog>

  </div>
}));

export default QuestionView;