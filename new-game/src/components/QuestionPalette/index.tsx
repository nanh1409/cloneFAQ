import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { styled } from "@mui/styles";
import classNames from "classnames";
import _ from "lodash";
import { Fragment, memo, PropsWithoutRef, ReactNode, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { scroller } from "react-scroll";
import { OnRestartGameFunction, OnSubmitGameFunction } from "../../context/gameContextTypes";
import { useGameSelector } from "../../hooks";
import useCheckTOEICLRSimulator from "../../hooks/useCheckTOEICLRSimulator";
import useRestartGame from "../../hooks/useRestartGame";
import useSubmitGame from "../../hooks/useSubmitGame";
import { FlashCardView, GameDisplayMode, GameObjectStatus, GameStatus, GameTypes, QuestionItem } from "../../models/game.core";
import Skill from "../../models/skill";
import { changeQuestionItem, ReplayMode, setFlashCardView } from "../../redux/reducers/game.slice";
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, SKILL_TYPE_LISTENING, SKILL_TYPE_READING, SKILL_TYPE_SPEAKING, SKILL_TYPE_WRITING } from "../../utils/constraints";
import QuestionProgress from "../QuestionProgress";
import QuestionStat from "../QuestionStat";
import PaletteNextIcon from "./PaletteNextIcon";
import PalettePrevIcon from "./PalettePrevIcon";
import RestartGameIcon from "./RestartGameIcon";
import GameMarkMenuIcon from "../GameObjectMenu/GameMarkMenuIcon";

type MapSkillQuestion = {
  [skillValue: number]: {
    name: string;
    questionItems: QuestionItem[];
  }
}

export type QuestionPaletteProps = {
  // Customizable
  renderTitle?: () => ReactNode;
  renderBody?: (questionItems: QuestionItem[]) => ReactNode;
  /** If `false` (by default), the question palette will show 3 rows of questions at once. */
  expand?: boolean;
  /** Id of question list element. Default to `question-list-scroll` */
  questionListId?: string;
  questionItemPrefixId?: string;
  /** Number items of a row */
  chunkSize?: number;
  clickItemCallback?: () => void;
  classes?: {
    root?: string;
    header?: string;
    body?: string;
    footer?: string;
    gameTitle?: string;
    mainTable?: string;
    questionNavLeft?: string;
    questionNavRight?: string;
    questionListRoot?: string;
    questionListRow?: string;
    questionItem?: string;
    questionStatProgress?: string;
    flashCardStatTitle?: string;
  },
  /** Add callback after pause game. TODO: Callback with args and callback for submit */
  onPauseCallback?: () => void;
  /** Add a custom nav for skill-based game. May be back or quit immediately */
  renderCustomNavForSkillBasedGame?: () => ReactNode;
  /** Force Show Functions, despite of `gameStatus` value. */
  forceShowFunctions?: boolean;
  // Non-customizable
  onRestartGame?: OnRestartGameFunction;
  onSubmitGame?: OnSubmitGameFunction;
}

const QuestionPaletteContainer = styled("div")({
  position: "relative",
  width: "100%",
  "& .current-topic-label": {
    height: "32px",
    backgroundColor: "#fafafb",
    borderRadius: "15px 15px 0px 0px",
    fontWeight: 600,
    fontSize: 16,
    color: "#1d1d1d",
    position: "absolute",
    bottom: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 22px"
  },
  "& .question-palette-main": {
    padding: "16px 22px",
    backgroundColor: "#fff",
    borderRadius: "0 15px 15px 15px"
  },
  "& .question-palette-header": {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& .question-palette-title": {
      fontWeight: 400,
      fontSize: 16,
      color: "#1d1d1d"
    },
    "& .question-palette-nav": {
      "&-button": {
        backgroundColor: "#fff",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.1)",
        width: 20,
        height: 20,
        "&.button-left": { marginRight: 17 }
      }
    }
  },

  "& .question-palette-body": {
    "& .questions-list": {
      width: "100%",
      marginTop: 16,
      height: 111,
      "&.expand": {
        height: "auto"
      },

      "& .question-list-row": {
        display: "grid",
        justifyItems: "center",
        gap: "5px",
        width: "100%",
        "&.hidden": {
          height: 0,
          overflow: "hidden"
        }
      }
    },
    "& .question-item": {
      position: "relative",
      minWidth: "unset",
      padding: "unset",
      fontFamily: "inherit",
      borderRadius: 10,
      backgroundColor: "#f2f3f7",
      color: "#777777",
      fontSize: 14,
      fontWeight: 600,
      marginBottom: 5,
      width: "100%",
      "&::after": {
        content: '""',
        display: "block",
        paddingBottom: "100%"
      },
      "&.p-item-current-game": {
        border: "2px solid #007aff"
      },
      "&.p-item-current-index": {
        backgroundColor: "#fff",
        color: "#1d1d1d"
      },
      "&.p-item-review-other-game": {
        border: "1px solid #007aff"
      },
      "&.p-item-current-bookmark": {
        border: "2px solid #FFAD00",
      },
      "&.p-item-correct": {
        backgroundColor: "#4caf50 !important",
        color: "#fff !important",
        border: "none !important",
      },
      "&.p-item-played": {
        backgroundColor: "#007aff !important",
        color: "#fff !important",
        border: "none !important",
      },
      "&.p-item-incorrect": {
        backgroundColor: "#ff5252 !important",
        color: "#fff !important",
        border: "none !important",
      }
    },
    "& .p-bookmark-icon": {
      position: "absolute",
      top: "-6px",
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "14px",
      width: "14px",
      borderRadius: "50%",
      backgroundColor: "#fff",
      boxShadow: "0px 2px 8px 0px #7D7D7D40",
    },
    "& .question-palette-body__skillName": {
      fontWeight: 700,
      margin: "10px 0"
    }
  },

  "& .question-palette-footer": {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "20px",
    "& .question-palette-function-buttons": {
      display: "flex",
      gap: 10
    },
    "& .button-restart-game": {
      fontWeight: 500,
      border: "1.5px solid #007aff",
      color: "#007aff",
      borderRadius: 20,
      height: 30,
      width: 90,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "&:hover": {
        color: "#007aff"
      }
    },
    "& .button-pause-game": {
      background: "#ffffff",
      color: "#1d1d1d",
      border: "1.5px solid #777777",
      borderRadius: 20,
      fontWeight: 600,
      height: 30,
      width: 90,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "&:hover": {
        background: "#777777",
        color: "#ffffff"
      }
    },
    "& .button-submit-game": {
      background: "#ffffff",
      color: "#007aff",
      border: "1.5px solid #007aff",
      borderRadius: 20,
      fontWfeight: 600,
      height: 30,
      width: 90,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",

      "&:hover": {
        background: "#007aff",
        color: "#ffffff"
      }
    }
  },

  "& .flash-card-question-stat": {
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
    "&-box": {
      backgroundColor: "#fff",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      fontSize: 14,
      width: "40%",
      "&:first-child::after": {
        position: "absolute",
        content: '""',
        right: "50%",
        bottom: 0,
        transform: "translateX(50%)",
        width: "1px",
        height: "80%",
        backgroundColor: "#f2f3f7"
      }
    },
    "& .stat-value": {
      fontSize: 28,
      margin: "16px 0",
      fontWeight: 700
    },
    "& .stat-title": {
      width: "120px",
      fontWeight: 600,
      textAlign: "center",
      paddingTop: "7px",
      paddingBottom: "7px",
      borderRadius: 10,
    }
  }
})

const QuestionPaletteDialog = styled(Dialog)({
  "& .submit-game-confirm-modal": {
    borderRadius: "19px !important",
    "&-title": {
      fontWeight: 600,
      fontSize: 20
    },
    "&-content": {
      fontSize: 16
    },
    "&-actions": {
      padding: "12px",
      "& .restart-game-button": {
        borderRadius: 10,
        width: 100,
        height: 30,
        fontSize: 16,
        fontWeight: 400
      },
      "& .restart-game-button-cancel": {
        background: "#d9dde3",
        color: "#000",
        "&:hover": {
          background: "#d9dde3",
          color: "#000"
        }
      },
      "& .restart-game-button-ok": {
        background: "#007aff",
        color: "#fff",
        "&:hover": {
          background: "#007aff",
          color: "#fff"
        }
      }
    }
  }
});

const ID_QUESTION_LIST_CONTAINER = "question-list-scroll";

const QuestionPalette = memo((props: PropsWithoutRef<QuestionPaletteProps>) => {
  const {
    renderTitle,
    renderBody,
    expand: _expand,
    questionListId = ID_QUESTION_LIST_CONTAINER,
    questionItemPrefixId = "pallete-item-",
    chunkSize: _chunkSize = 8,
    clickItemCallback = () => { },
    classes = {
      root: "",
      header: "",
      body: "",
      footer: "",
      gameTitle: "",
      mainTable: "",
      questionNavLeft: "",
      questionNavRight: "",
      questionListRoot: "",
      questionListRow: "",
      questionItem: "",
      questionStatProgress: "",
      flashCardStatTitle: ""
    },
    onPauseCallback = () => { },
    renderCustomNavForSkillBasedGame = () => <></>,
    forceShowFunctions,
    onRestartGame,
    onSubmitGame,
  } = props;
  const language = useGameSelector((state) => state.gameState.gameSetting?.language);
  const topicName = useGameSelector((state) => state.gameState.gameSetting?.topicName);
  const contentType = useGameSelector((state) => state.gameState.gameSetting?.contentType);
  const currentSkillConfig = useGameSelector((state) => state.gameState.gameSetting?.currentSkill);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const mapExamTypeSkills = useGameSelector((state) => state.gameState.mapExamTypeSkills);
  const displayMode = useGameSelector((state) => state.gameState.displayMode);
  const gameType = useGameSelector((state) => state.gameState.gameType);
  const currentGame = useGameSelector((state) => state.gameState.currentGame);
  const currentQuestion = useGameSelector((state) => state.gameState.currentQuestion);
  const questionItems = useGameSelector((state) => state.gameState.questionItems);
  const currentQuestionIdx = useGameSelector((state) => state.gameState.currentQuestionIdx);
  const showResultOnAnswer = useGameSelector((state) => state.gameState.showResultOnAnswer);
  const showQuestionsOnReview = useGameSelector((state) => state.gameState.gameSetting?.showQuestionsOnReview);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const replayMode = useGameSelector((state) => state.gameState.replayMode);
  const flashCardView = useGameSelector((state) => state.gameState.flashCardView);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const openRestartDialog = useGameSelector((state) => state.gameState.openRestartDialog);
  const openSubmitDialog = useGameSelector((state) => state.gameState.openSubmitDialog);
  const { isPlayingSimulator, allowPause } = useCheckTOEICLRSimulator();
  const dispatch = useDispatch();

  const [lastChunkIndex, setLastChunkIndex] = useState(2);
  const defaultTotalChunks = useMemo(() => Math.ceil(questionItems.length / (_chunkSize || 8)), [questionItems.length, _chunkSize]);
  const trans = useMemo(() => {
    let memorized = "Memorized";
    let unmemorized = "Unmemorized";
    if (language === "vi") {
      memorized = "Đã thuộc"; unmemorized = "Chưa thuộc";
    }
    return {
      memorized, unmemorized
    }
  }, [language]);

  const isToeicLRTest = useMemo(() =>
    gameType === GameTypes.TEST && contentType === EXAM_TYPE_TOEIC && !currentSkillConfig
    , [gameType, currentSkillConfig, contentType])

  const disableSubmitButton = useMemo(() => {
    if (gameType === GameTypes.TEST) {
      if (contentType === EXAM_TYPE_TOEIC) {
        return currentSkillConfig && [SKILL_TYPE_WRITING].includes(currentSkillConfig.type);
      } else if (contentType === EXAM_TYPE_IELTS) {
        return currentSkillConfig && [SKILL_TYPE_WRITING].includes(currentSkillConfig.type);
      }
    }
    return false;
  }, [gameType, contentType, currentSkillConfig])

  const expand = useMemo(() => {
    let isDefaultExpand =
      ((showResultOnAnswer && gameStatus === GameStatus.REVIEW) || (gameType === GameTypes.TEST && gameStatus === GameStatus.REVIEW))
      && displayMode === GameDisplayMode.ALL_IN_PAGE;
    if (isToeicLRTest) {
      isDefaultExpand = true;
    }
    return typeof _expand !== "undefined"
      ? _expand
      : isDefaultExpand;
  }, [typeof _expand, displayMode, isToeicLRTest]);

  const mapArraySkills = useMemo(() => {
    return (mapExamTypeSkills[contentType]
      ?.filter((s) => [SKILL_TYPE_LISTENING, SKILL_TYPE_READING].includes(s.type))
      ?.reduce((arr, s) => (arr.push(...(s.childSkills || [])), arr), [] as Skill[])
      ?.reduce((map, s) => (map[s.value] = {
        name: s.name,
        questionItems: questionItems.filter((e) => e.skillValue === s.value)
      }, map), {} as MapSkillQuestion)) ?? {} as MapSkillQuestion
  }, [mapExamTypeSkills, questionItems, contentType]);

  const { handleCloseRestartDialog, handleOpenRestartDialog, handleRestartGame } = useRestartGame({ onRestartGame });
  const { handleOpenSubmitDialog, handleCloseSubmitDialog, handleSubmitGame, handlePauseGame } = useSubmitGame({ onSubmitGame });

  useEffect(() => {
    const chunkIndex = Math.ceil((currentQuestionIdx + 1) / (_chunkSize || 8)) - 1;
    if (chunkIndex - 2 < 0) setLastChunkIndex(2);
    else setLastChunkIndex(chunkIndex);
  }, [currentQuestionIdx, _chunkSize]);

  // console.log("chunkIndex", lastChunkIndex);

  useEffect(() => {
    gameStatus === GameStatus.PLAY && currentQuestion && scroller.scrollTo(`${questionItemPrefixId}${currentQuestion.id}`, { containerId: questionListId, smooth: true, offset: -30, duration: 400 });
  }, [currentQuestion?.id]);

  const renderPaletteQuestions = (args: {
    items: QuestionItem[];
    getRowClass?: (rowIndex: number) => string
  }) => {
    const chunkSize = _chunkSize || 8;
    const { items, getRowClass = () => "" } = args;
    const totalChunks = Math.ceil(items.length / chunkSize);
    return _.range(totalChunks).map((rowIndex) => {
      return <div key={rowIndex}
        style={{ gridTemplateColumns: `repeat(${chunkSize}, 1fr)` }}
        className={classNames(
          "question-list-row",
          getRowClass(rowIndex),
          classes.questionListRow
        )}>
        {items.slice(rowIndex * chunkSize, (rowIndex + 1) * chunkSize).map((item, i) => {
          const isCurrentIndex = item.index - 1 === currentQuestionIdx;
          const isCurrentGame = (item.path[0] ?? item.id) === currentGame?.id;
          const isBookmarked = cardProgresses[`${topicId}_${item.id}`]?.bookmark ?? false;
          const isAnswered = item.status === GameObjectStatus.ANSWERED;
          const currentQuestionIdxs = currentQuestion?.path?.length ? items.filter((_item) => _item.path[0] === currentQuestion.path[0]).map(({ index }) => index) : [];

          return <IconButton
            id={`${questionItemPrefixId}${item.id}`}
            key={`${item.id}_${item.index}`}
            className={classNames(
              "question-item",
              classes.questionItem,
              isCurrentGame ? "p-item-current-game" : "",
              isCurrentIndex ? "p-item-current-index" : "",
              !isCurrentGame && isCurrentIndex ? "p-item-review-other-game" : "",
              !showResultOnAnswer && gameStatus === GameStatus.PLAY && isBookmarked ? "p-item-current-bookmark" : "",
              showResultOnAnswer || (gameType === GameTypes.TEST && gameStatus === GameStatus.REVIEW)
                ? (isAnswered ? (item.correct ? "p-item-correct" : "p-item-incorrect") : "")
                : "",
              !showResultOnAnswer && isAnswered && gameStatus === GameStatus.PLAY ? "p-item-played" : ""
            )}
            onClick={() => {
              let fillParaId = "";
              let scrollContainerId = "";
              if (item.path.length) {
                const [lastPath] = item.path.slice(-1);
                const childrenOfLastPath = items.filter((e) => {
                  if (!e.path.length) return false;
                  return e.path.slice(-1).at(0) === lastPath;
                })
                const idx = childrenOfLastPath.findIndex((e) => e.id === item.id);
                if (idx !== -1) fillParaId = `${item.id}-${idx}`;
                if (fillParaId) {
                  const el = document.getElementById(fillParaId);
                  if (!el) fillParaId = "";
                  else scrollContainerId = `child-${item.path[0]}`;
                }
              }
              if (showResultOnAnswer) {
                if (fillParaId) {
                  if (gameStatus === GameStatus.REVIEW && showQuestionsOnReview) scrollContainerId = undefined;
                  scroller.scrollTo(fillParaId, { containerId: scrollContainerId, smooth: true, offset: -30, duration: 400 })
                } else if (gameStatus === GameStatus.REVIEW) {
                  if (showQuestionsOnReview) {
                    scroller.scrollTo(`review-${item.path[0] || item.id}`, { smooth: true, offset: 0, duration: 400 });
                    clickItemCallback();
                  } else {
                    return;
                  }
                }
                if (replayMode === ReplayMode.NONE) {
                  if (item.status === GameObjectStatus.ANSWERED ||
                    (!!currentQuestion?.path?.length && currentQuestionIdxs.includes(item.index)) ||
                    (!currentQuestion?.path?.length && isCurrentIndex)
                  ) {
                    // Change CurrentGame Only
                    dispatch(changeQuestionItem({
                      item,
                      gameViewOnly: true,
                      showReviewNav: item.status === GameObjectStatus.ANSWERED
                    }))
                    clickItemCallback();
                  }
                }
              } else {
                dispatch(changeQuestionItem({ item }));
                if (displayMode === GameDisplayMode.ALL_IN_PAGE) {
                  if (gameStatus === GameStatus.PLAY) {
                    scroller.scrollTo(`game-obj-${item.path[0] || item.id}`, { smooth: true, offset: -130, duration: 400 });
                  } else if (gameStatus === GameStatus.REVIEW) {
                    if (fillParaId) {
                      scroller.scrollTo(fillParaId, { smooth: true, offset: -30, duration: 400 });
                    } else {
                      scroller.scrollTo(`review-${item.path[0] || item.id}`, { smooth: true, offset: 0, duration: 400 });
                    }
                  }
                }
                clickItemCallback();
              }
            }}
          >
            {!showResultOnAnswer && gameStatus === GameStatus.PLAY && isBookmarked && <div className="p-bookmark-icon"><GameMarkMenuIcon isMarked width={6} height={7} /></div>}
            {item.index}
          </IconButton>
        })}
      </div>
    });
  }

  const renderMainTable = () => {
    const isFlashCard = gameType === GameTypes.FLASH_CARD;
    if (isFlashCard) {
      return <>
        <div className="flash-card-question-stat">
          <div className="flash-card-question-stat-box" style={{ color: "#4CAF50" }}>
            <div>
              <div className="stat-value">{totalCorrect}/{totalQuestions}</div>
            </div>
            <div className={classNames("stat-title", classes.flashCardStatTitle)} style={{ backgroundColor: "#EAF4EB" }}>
              {trans.memorized}
            </div>
          </div>

          <div className="flash-card-question-stat-box" style={{ color: "#FF5252" }}>
            <div>
              <div className="stat-value">{totalIncorrect}/{totalQuestions}</div>
            </div>
            <div className={classNames("stat-title", classes.flashCardStatTitle)} style={{ backgroundColor: "#FDF0F0" }}>
              {trans.unmemorized}
            </div>
          </div>
        </div>

        <div className="question-palette-footer">
          {[FlashCardView.CARD, FlashCardView.GAME].includes(flashCardView) && <div className="question-palette-function-buttons">
            <Button
              className="button-restart-game"
              onClick={() => {
                dispatch(setFlashCardView(FlashCardView.OVERVIEW));
              }}
            >
              End
            </Button>
          </div>}
        </div>
      </>
    }
    return <>
      <div className={classNames("question-palette-header", classes.header)}>
        <div className={classNames("question-palette-title")}>{
          typeof renderTitle !== "undefined" ? renderTitle() : <>Question Palette</>
        }</div>
        {!expand && defaultTotalChunks > 2 && <div className="question-palette-nav">
          <IconButton
            className={classNames("question-palette-nav-button button-left", classes.questionNavLeft)}
            disabled={lastChunkIndex === 2}
            onClick={() => {
              setLastChunkIndex(lastChunkIndex - 3);
            }}
          >
            <PalettePrevIcon />
          </IconButton>
          <IconButton
            disabled={lastChunkIndex >= defaultTotalChunks - 1}
            className={classNames("question-palette-nav-button button-right", classes.questionNavRight)}
            onClick={() => {
              setLastChunkIndex(lastChunkIndex + 3);
            }}
          >
            <PaletteNextIcon />
          </IconButton>
        </div>}
      </div>

      <div className={classNames("question-palette-body", classes.body)}>
        {typeof renderBody !== "undefined"
          ? <>{renderBody(questionItems)}</>
          : <div className={classNames(
            "questions-list",
            classes.questionListRoot,
            expand ? "expand" : ""
          )}
            id={questionListId}
          >
            {!isToeicLRTest
              ? renderPaletteQuestions({
                items: questionItems,
                getRowClass: (rowIndex) => (rowIndex < lastChunkIndex - 2 || rowIndex > lastChunkIndex) ? "hidden" : ""
              })
              : Object.values(mapArraySkills).map(({ name, questionItems: _items }, sI) => {
                return <Fragment key={sI}>
                  <div>
                    <div className="question-palette-body__skillName">{name}</div>
                    {renderPaletteQuestions({ items: _items })}
                  </div>
                </Fragment>
              })}
          </div>}
        <div className={classes.questionStatProgress}>
          {showResultOnAnswer
            ? <QuestionStat />
            : <QuestionProgress />}
        </div>
      </div>

      <div className={classNames("question-palette-footer", classes.footer)}>
        {showResultOnAnswer
          ? <>{gameStatus !== GameStatus.REVIEW && <div className="question-palette-function-buttons">
            <Button
              startIcon={<RestartGameIcon />}
              className="button-restart-game"
              onClick={handleOpenRestartDialog}
            >
              Restart
            </Button>
          </div>}</>
          : <>{(gameStatus === GameStatus.PLAY || forceShowFunctions) && <div className="question-palette-function-buttons">
            {currentSkillConfig && renderCustomNavForSkillBasedGame()}
            {gameStatus === GameStatus.PLAY && <>
              {!(isPlayingSimulator && !allowPause) && <Button
                className="button-pause-game"
                onClick={() => {
                  handlePauseGame();
                  onPauseCallback();
                }}
              >
                Pause
              </Button>}
              {!disableSubmitButton && <Button
                className="button-submit-game"
                onClick={handleOpenSubmitDialog}
              >
                Submit
              </Button>}
            </>}
          </div>}</>}
      </div>
    </>
  }

  return <>
    <QuestionPaletteContainer className={classes.root}>
      <div className={classNames("current-topic-label", classes.gameTitle)}>{topicName}</div>
      <div className={classNames("question-palette-main", classes.mainTable)}>
        {renderMainTable()}
      </div>
    </QuestionPaletteContainer>

    {/* Restart Game */}
    <QuestionPaletteDialog
      open={openRestartDialog}
      onClose={handleCloseRestartDialog}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: "submit-game-confirm-modal" }}
    >
      <DialogTitle className="submit-game-confirm-modal-title">Restart</DialogTitle>
      <DialogContent sx={{ textAlign: "justify" }} className="submit-game-confirm-modal-content">
        Do you want to restart your test? Your test progress won't be saved.
      </DialogContent>
      <DialogActions className="submit-game-confirm-modal-actions">
        <Button
          className="restart-game-button restart-game-button-cancel"
          onClick={handleCloseRestartDialog}
        >
          Cancel
        </Button>
        <Button
          className="restart-game-button restart-game-button-ok"
          onClick={handleRestartGame}
        >
          Restart
        </Button>
      </DialogActions>

    </QuestionPaletteDialog>

    {/* Submit Game */}
    <QuestionPaletteDialog
      open={openSubmitDialog}
      onClose={handleCloseSubmitDialog}
      fullWidth
      maxWidth="sm"
      PaperProps={{ className: "submit-game-confirm-modal" }}
    >
      <DialogTitle className="submit-game-confirm-modal-title">Submit</DialogTitle>
      <DialogContent sx={{ textAlign: "justify" }} className="submit-game-confirm-modal-content">
        Are you sure you want to submit your test?
      </DialogContent>
      <DialogActions className="submit-game-confirm-modal-actions">
        <Button
          className="restart-game-button restart-game-button-cancel"
          onClick={handleCloseSubmitDialog}
        >
          Cancel
        </Button>
        <Button
          className="restart-game-button restart-game-button-ok"
          onClick={() => {
            handleSubmitGame();
            handleCloseSubmitDialog();
            if (displayMode === GameDisplayMode.ALL_IN_PAGE) {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </QuestionPaletteDialog>
  </>
})

export default QuestionPalette;