import React, { Fragment, useCallback, useMemo } from "react";
import { Button, Card, Grid, Select } from "@mui/material";
import { onStartFlashCardGame, setCardStudyOrder, setFlashCardView } from "../../../redux/reducers/game.slice";
import "./flashCardEndView.scss";
import { flashCardTrans as _flashCardTrans } from "../FlashCardOverview";
import { useGameSelector } from "../../../hooks";
import { useDispatch } from "react-redux";
import { CardStudyOrder, FlashCardView } from "../../../models/game.core";
import Overview from "../../Overview";
import OverviewButton from "../../Overview/OverviewButton";
import NewContinueBox, { NewContinueBoxProps } from "../../ContinueBox/NewContinueBox";
import DividerContinueBox from "../../ContinueBox/DividerContinueBox";
import QuestionsStatItem from "../../Overview/QuestionsStatItem";
import { useSnackbar } from "notistack";

const FlashCardEndView = () => {
  const { enqueueSnackbar } = useSnackbar();
  const language = useGameSelector((state) => state.gameState.gameSetting?.language);
  const dispatch = useDispatch();
  const flashCardTrans = useMemo(() => _flashCardTrans[language], [language]);

  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const questionsPlayNum = useGameSelector((state) => state.gameState.questionsPlayNum);
  const cardStudyOrder = useGameSelector((state) => state.gameState.cardStudyOrder);
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const boxCard = useGameSelector((state) => state.gameState.boxCard);
  // const cardBookmarks = useGameSelector((state) => state.gameState.cardBookmarks);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const { mapCardBox } = useMemo(() => {
    // const topicProgress = topicProgresses[topic?._id]?.userId === userId ? topicProgresses[topic?._id] : undefined;
    // const boxCard = topicProgress?.boxCard ?? {};
    const mapCardBox: Map<CardStudyOrder, number> = new Map<CardStudyOrder, number>();
    const mapBoxNum: { [x: number]: string[] } = {};
    Object.keys(boxCard).map((cardId) => {
      const boxNum = boxCard[cardId] > 0 ? 1 : 0;
      mapBoxNum[boxNum] = [...mapBoxNum[boxNum] || [], cardId];
    });
    const correctArr = mapBoxNum[1] ?? [];
    const incorrectArr = mapBoxNum[0] ?? [];
    const cardBookmarks = Object.values(cardProgresses).filter(cardProgress => cardProgress?.topicId === topicId && cardProgress?.bookmark);
    mapCardBox.set(CardStudyOrder.MEMORIZED, correctArr.length);
    mapCardBox.set(CardStudyOrder.UNMEMORIZED, incorrectArr.length);
    const newCount = totalQuestions - (correctArr.length + incorrectArr.length);
    mapCardBox.set(CardStudyOrder.NEW, newCount < 0 ? 0 : newCount);
    mapCardBox.set(CardStudyOrder.MARKED, cardBookmarks?.length ?? 0);
    return {
      // progress: topicProgress?.progress ?? 0,
      mapCardBox
    }
  }, [boxCard, topicId, userId, totalQuestions, cardProgresses]);
  const percent = useMemo(() => {
    return totalQuestions ? Math.round(mapCardBox.get(CardStudyOrder.MEMORIZED) * 100 / totalQuestions) : 0
  }, [mapCardBox, totalQuestions])

  const handleClickContinueBoxes = (cardStudyOrder: CardStudyOrder) => {
    if (cardStudyOrder !== CardStudyOrder.DEFAULT) {
      if (
        (cardStudyOrder === CardStudyOrder.MEMORIZED && (mapCardBox.get(CardStudyOrder.MEMORIZED) || 0) <= 0)
        || (cardStudyOrder === CardStudyOrder.UNMEMORIZED && (mapCardBox.get(CardStudyOrder.UNMEMORIZED) || 0) <= 0)
        || (cardStudyOrder === CardStudyOrder.NEW && (mapCardBox.get(CardStudyOrder.NEW) || 0) <= 0)
        || (cardStudyOrder === CardStudyOrder.MARKED && (mapCardBox.get(CardStudyOrder.MARKED) || 0) <= 0)
      ) {
        enqueueSnackbar("No Data!", { variant: "info" });
        return;
      }
    }
    dispatch(setCardStudyOrder(cardStudyOrder));
    dispatch(setFlashCardView(FlashCardView.CARD));
    dispatch(onStartFlashCardGame());
  }

  const renderContinueBoxes = useCallback(() => {
    const data: Array<Partial<NewContinueBoxProps>> = [
      {
        label: flashCardTrans.labelTotalCard, value: totalQuestions, stroke: "#fff", bgcolor: "#849BB6", textColor: "#fff", labelColor: "#849BB6",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.DEFAULT) }
      },
      {
        label: flashCardTrans.labelNew, value: mapCardBox.get(CardStudyOrder.NEW), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#FFC412", labelColor: "#FFC412",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.NEW) }
      },
      {
        label: flashCardTrans.labelUnmemorized, value: mapCardBox.get(CardStudyOrder.UNMEMORIZED), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#FF5454", labelColor: "#FF5454",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.UNMEMORIZED) }
      },
      {
        label: flashCardTrans.labelMemorized, value: mapCardBox.get(CardStudyOrder.MEMORIZED), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#82BC24", labelColor: "#82BC24",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.MEMORIZED) }
      },
      {
        label: flashCardTrans.labelMarked, value: mapCardBox.get(CardStudyOrder.MARKED), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#02C2E8", labelColor: "#02C2E8",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.MARKED) }
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
  }, [totalQuestions, mapCardBox, flashCardTrans]);

  return <Overview
    percent={percent}
    Statistics={<>
      <div className="main-statistics-questions-stat">
        <QuestionsStatItem label="Total" value={questionsPlayNum} color="#849BB6" className="item-total" />
        <QuestionsStatItem label="Memorized" value={mapCardBox.get(CardStudyOrder.MEMORIZED)} color="#82BC24" className="item-correct" />
        <QuestionsStatItem label="Unmemorized" value={mapCardBox.get(CardStudyOrder.UNMEMORIZED)} color="#FF5454" className="item-incorrect" />
        <QuestionsStatItem label="Marked" value={mapCardBox.get(CardStudyOrder.MARKED)} color="#02C2E8" className="item-incorrect" />
      </div>

      <div className="main-statistics-questions-button" style={{ justifyContent: "space-around" }}>
        <OverviewButton name="secondary" onClick={() => {
          dispatch(setFlashCardView(FlashCardView.OVERVIEW))
        }}>END</OverviewButton>
        <OverviewButton onClick={() => {
          dispatch(setFlashCardView(FlashCardView.CARD));
          dispatch(onStartFlashCardGame());
        }}>RE-PLAY</OverviewButton>
      </div>
    </>}
    QuestionCategory={renderContinueBoxes()}
  />

  // return <div id="flash-card-end-view">
  //   <div className="done-view-title">{flashCardTrans.doneViewTitle}</div>
  //   <div className="done-view-image-wrap">
  //     <img className="done-view-image" alt="congratulations" src="/images/practice-done.svg" />
  //   </div>

  //   <div className="flash-card-end-buttons">
  //     <Button
  //       className="flash-card-end-btn end-btn"
  //       onClick={() => dispatch(setFlashCardView(FlashCardView.OVERVIEW))}
  //     >
  //       {flashCardTrans.end}
  //     </Button>

  //     <Button
  //       className="flash-card-end-btn play-game-btn"
  //       onClick={() => {
  //         dispatch(setFlashCardView(FlashCardView.GAME));
  //         dispatch(onStartFlashCardGame());
  //       }}
  //     >
  //       {flashCardTrans.playGame}
  //     </Button>
  //   </div>
  // </div>
}

export default FlashCardEndView;