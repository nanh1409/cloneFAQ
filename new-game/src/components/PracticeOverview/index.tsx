import classNames from "classnames";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { Fragment, memo, PropsWithoutRef, useCallback, useContext, useMemo } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { useDispatch } from "react-redux";
import { GameContext } from "../../context/GameContext";
import { useGameSelector } from "../../hooks";
import { PracticeView } from "../../models/game.core";
import { onStartGame, ReplayMode, resetCardProgresses, setLoadingGame, setPracticeView, setshowQuestionsOnReview } from "../../redux/reducers/game.slice";
import DividerContinueBox from "../ContinueBox/DividerContinueBox";
import NewContinueBox, { NewContinueBoxProps } from "../ContinueBox/NewContinueBox";
import { GAME_REVIEW_SECTION_ID } from "../GameView";
import "./practiceOverview.scss";
import OverviewButton from "../Overview/OverviewButton";
import Overview from "../Overview";
import QuestionsStatItem from "../Overview/QuestionsStatItem";

const PracticeOverview = (props: PropsWithoutRef<{
  review?: boolean;
}>) => {
  const { onRestartGame, onReplayAnsweredQuestions } = useContext(GameContext);
  const {
    review
  } = props;

  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language);
  const _gameSettingShowQuestionsOnReview = useGameSelector((state) => state.gameState.gameSetting?.showQuestionsOnReview);
  // const sync = useGameSelector((state) => state.gameState.sync);
  const cards = useGameSelector((state) => state.gameState.cards);
  const showQuestionsOnReview = useGameSelector((state) => state.gameState.showQuestionsOnReview);
  const usePracticeOverview = useGameSelector((state) => state.gameState.gameSetting?.usePracticeOverview);
  const totalCorrect = useGameSelector((state) => state.gameState.totalCorrect);
  const totalIncorrect = useGameSelector((state) => state.gameState.totalIncorrect);
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const shuffleQuestion = useGameSelector((state) => state.gameState.gameSetting?.shuffleQuestion);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const gameStatus = useGameSelector((state) => state.gameState.gameStatus);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const percent = useMemo(() => {
    return totalQuestions ? Math.round(totalCorrect * 100 / totalQuestions) : 0;
  }, [totalQuestions, totalCorrect]);

  const trans = useMemo(() => {
    let labelTotal = "Total", labelNew = "New", labelCorrect = "Correct", labelIncorrect = "Incorrect";
    if (language === "vi") {
      labelTotal = "Tổng số"; labelNew = "Chưa học"; labelCorrect = "Đúng"; labelIncorrect = "Sai";
    }
    return {
      labelTotal, labelNew, labelCorrect, labelIncorrect
    }
  }, [language]);

  const handleReplay = (replayMode?: ReplayMode) => {
    if ((replayMode === ReplayMode.CORRECT && !totalCorrect)
      || (replayMode === ReplayMode.INCORRECT && !totalIncorrect)
      || (replayMode === ReplayMode.NEW && !(totalQuestions - (totalCorrect + totalIncorrect)))) {
      enqueueSnackbar("No Data!", { variant: "info" });
      return;
    }
    dispatch(setLoadingGame(true));
    if (replayMode === ReplayMode.NONE) {
      // const newTopicProgress = ClientTopicProgress.clone(topicProgresses[topic._id]);
      let _cards = cards;
      if (shuffleQuestion) {
        _cards = _.shuffle(cards);
      }
      onRestartGame({ cardOrder: _cards.map((e) => e._id) });
      // newTopicProgress.setCardOrder(_cards.map((e) => e._id));
      // newTopicProgress.setProgress(0);
      // newTopicProgress.setQuestionStats({ totalQuestions: newTopicProgress.totalCardNum, totalCorrect: 0 });
      // newTopicProgress.setUserId(userId);
      // dispatch(updateTopicProgress(newTopicProgress));
      dispatch(resetCardProgresses({ topicId }));
      // if (!!user) {
      //   dispatch(updateAppPracticeData({ progress: 0, totalCorrect: 0, totalQuestions: newTopicProgress.totalCardNum, studyScoreDataId, totalIncorrect: 0, cardOrder: newTopicProgress.cardOrder }));
      //   dispatch(resetCardStudyData({ studyScoreDataId }));
      // }
      // TODO: Reseting game State
      setTimeout(() => {
        dispatch(onStartGame({
          cards: _cards,
          cardProgresses: {},
          userId,
          topicId
        }));
      }, 500);
    } else {
      dispatch(onStartGame({ replayMode }));
      onReplayAnsweredQuestions({ totalCorrect, totalIncorrect, totalQuestions });
    }
    dispatch(setPracticeView(PracticeView.DEFAULT));
    if (!_gameSettingShowQuestionsOnReview) {
      dispatch(setshowQuestionsOnReview(false));
    }
  }

  const scrollToReviewSection = () => {
    const reviewSection = document.getElementById(GAME_REVIEW_SECTION_ID);
    if (reviewSection) {
      reviewSection.scrollIntoView({ behavior: "smooth" });
    }
  }

  const handleClickReview = () => {
    if (usePracticeOverview && !showQuestionsOnReview) {
      dispatch(setshowQuestionsOnReview(true));
      setTimeout(() => {
        scrollToReviewSection()
      }, 300);
    } else {
      scrollToReviewSection()
    }
  }

  const handleClickContinue = () => {
    dispatch(setPracticeView(PracticeView.DEFAULT));
    if (!_gameSettingShowQuestionsOnReview) {
      dispatch(setshowQuestionsOnReview(false));
    }
  }

  const renderContinueBoxes = useCallback(() => {
    const data: Array<Partial<NewContinueBoxProps>> = [
      {
        label: trans.labelTotal, value: totalQuestions, stroke: "#fff", bgcolor: "#849BB6", textColor: "#fff", labelColor: "#849BB6",
        onClick: () => handleReplay(ReplayMode.ALL)
      },
      {
        label: trans.labelNew, value: totalQuestions - (totalCorrect + totalIncorrect), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#FFC412", labelColor: "#FFC412",
        onClick: () => handleReplay(ReplayMode.NEW)
      },
      {
        label: trans.labelCorrect, value: totalCorrect, stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#82BC24", labelColor: "#82BC24",
        onClick: () => handleReplay(ReplayMode.CORRECT)
      },
      {
        label: trans.labelIncorrect, value: totalIncorrect, stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#FF5454", labelColor: "#FF5454",
        onClick: () => handleReplay(ReplayMode.INCORRECT)
      }
    ];
    const lastIndex = data.length - 1;
    return data.map((props, i) => <Fragment key={i}>
      <NewContinueBox
        {...props}
        mapScreenSize={{ 600: 35 }}
        mapScreenLabelFontSize={{ 600: 12 }}
      />
      {i !== lastIndex && <DividerContinueBox />}
    </Fragment>)
  }, [totalQuestions, totalCorrect, totalIncorrect, trans]);

  const isNew = useMemo(() => !((totalCorrect || 0) + (totalIncorrect || 0)), [totalCorrect, totalIncorrect])

  return <Overview 
    percent={percent}
    Statistics={
      <>
        <div className="main-statistics-questions-stat">
          <QuestionsStatItem label="Total" value={totalQuestions} color="#849BB6" className="item-total" />
          <QuestionsStatItem label="Correct" value={totalCorrect} color="#82BC24" className="item-correct" />
          <QuestionsStatItem label="Incorrect" value={totalIncorrect} color="#FF5454" className="item-incorrect" />
        </div>

        <div className="main-statistics-questions-button">
          {review
            ? <>
              <OverviewButton name="secondary" onClick={handleClickReview}>REVIEW</OverviewButton>
              <OverviewButton onClick={() => handleReplay(ReplayMode.NONE)}>PRACTICE NOW</OverviewButton>
            </>
            : (isNew
              ? <>
                <OverviewButton onClick={handleClickContinue} sx={{ m: "0 auto" }}>PRACTICE NOW</OverviewButton>
              </>
              : <>
                <OverviewButton name="secondary" onClick={handleClickContinue}>PRACTICE NOW</OverviewButton>
                <OverviewButton onClick={() => handleReplay(ReplayMode.NONE)}>RESTART</OverviewButton>
              </>)
          }
        </div>
      </>
    }
    QuestionCategory={renderContinueBoxes()}
  />

  // return <div className="module-game-overview-component">
  //   <div className="main-game-overview-bgr">
  //     <span className="bubble-top-left" />
  //     <span className="small-bubble-left" />
  //     <span className="ellipse-left" />
  //     <span className="ellipse-right" />
  //     <span className="bubble-right" />
  //   </div>
  //   <div className="main-game-overview-data">
  //     <div className="main-progress">
  //       <div className="main-progress-box" />
  //       <div className="box-layer-2" />
  //       <div className="box-layer-3">
  //         <CircularProgressbar
  //           className="progress-main"
  //           minValue={0}
  //           maxValue={100}
  //           value={percent}
  //           strokeWidth={6}
  //           styles={buildStyles({
  //             pathColor: "#6C81FE",
  //             trailColor: "rgba(220, 226, 238, 1)"
  //           })}
  //         />
  //       </div>
  //       <span className="percent-text">
  //         {percent}%
  //       </span>
  //     </div>
  //     <div className="main-statistics">
  //       <div className="main-statistics-questions-stat">
  //         <QuestionsStatItem label="Total" value={totalQuestions} color="#849BB6" className="item-total" />
  //         <QuestionsStatItem label="Correct" value={totalCorrect} color="#82BC24" className="item-correct" />
  //         <QuestionsStatItem label="Incorrect" value={totalIncorrect} color="#FF5454" className="item-incorrect" />
  //       </div>

  //       <div className="main-statistics-questions-button">
  //         {review
  //           ? <>
  //             <OverviewButton name="secondary" onClick={handleClickReview}>REVIEW</OverviewButton>
  //             <OverviewButton onClick={() => handleReplay(ReplayMode.NONE)}>TRY AGAIN</OverviewButton>
  //           </>
  //           : (isNew
  //             ? <>
  //               <OverviewButton onClick={handleClickContinue} sx={{ m: "0 auto" }}>START</OverviewButton>
  //             </>
  //             : <>
  //               <OverviewButton name="secondary" onClick={handleClickContinue}>CONTINUE</OverviewButton>
  //               <OverviewButton onClick={() => handleReplay(ReplayMode.NONE)}>RESTART</OverviewButton>
  //             </>)
  //         }
  //       </div>
  //     </div>
  //   </div>

  //   <div className="main-game-overview-question-categories">
  //     <div className="question-categories-title">
  //       Press and Practice Your Category Again Below
  //     </div>
  //     <div className="question-categories-list">
  //       {renderContinueBoxes()}
  //     </div>
  //   </div>
  // </div>

  // return <div id="game-done-view">
  //   <div className="done-view-title">Congratulations</div>
  //   <div className="done-view-image-wrap">
  //     <img className="done-view-image" alt="congratulations" src="/images/practice-done.svg" />
  //   </div>

  //   <div className="try-again-button-wrap">
  //     <Button
  //       className="try-again-button"
  //       onClick={() => handleReplay(ReplayMode.NONE)}
  //     >
  //       TRY AGAIN
  //     </Button>

  //     {showQuestionsOnReview
  //       && <Button className="try-again-button review-button" onClick={handleClickReview}>REVIEW</Button>}
  //   </div>

  //   <div className="continue-box-buttons">
  //     <ContinueBox
  //       value={totalIncorrect}
  //       label="Incorrect"
  //       color="#FF5252"
  //       onClick={() => handleReplay(ReplayMode.INCORRECT)}
  //     />

  //     <ContinueBox
  //       value={totalCorrect}
  //       label="Correct"
  //       color="#82BC24"
  //       onClick={() => handleReplay(ReplayMode.CORRECT)}
  //     />
  //   </div>
  //   {/* <div>
  //     <Button onClick={() => handleReplay(ReplayMode.NONE)}>All</Button>
  //     <Button onClick={() => handleReplay(ReplayMode.CORRECT)}>Correct</Button>
  //     <Button onClick={() => handleReplay(ReplayMode.INCORRECT)}>Incorrect</Button>
  //   </div> */}
  // </div>
}

export default PracticeOverview;