import { Button, Grid, MenuItem, Select, Slider } from "@mui/material";
import { withStyles } from "@mui/styles";
import _ from "lodash";
import { useSnackbar } from "notistack";
import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../../hooks";
import { CardStudyOrder, FlashCardView } from "../../../models/game.core";
import { onStartFlashCardGame, setCardStudyOrder, setFlashCardView, setQuestionsPlayNum } from "../../../redux/reducers/game.slice";
import "./flashCardOverview.scss";
import SelectIcon from './SelectIcon';
import Overview from "../../Overview";
import OverviewButton from "../../Overview/OverviewButton";
import NewContinueBox, { NewContinueBoxProps } from "../../ContinueBox/NewContinueBox";
import DividerContinueBox from "../../ContinueBox/DividerContinueBox";

export const questionsPlayNumKey = "flash_card_q";

// const ProgressSlider = withStyles({
//   rail: {
//     height: "10px",
//     borderRadius: 0,
//     backgroundColor: "#F0F0F0",
//     opacity: 1
//   },
//   track: {
//     height: "10px",
//     borderRadius: 0,
//     backgroundColor: "#19CE7A",
//     border: "none"
//   },
//   thumb: {
//     height: 0
//   },
//   mark: {
//     display: "none"
//   },
//   markLabel: {
//     color: "var(--textColor)",
//     fontWeight: 600,
//     fontSize: "16px"
//   },
//   valueLabel: {
//     backgroundColor: "#19CE7A",
//     borderRadius: "12px",
//     width: "45px",
//     fontWeight: 700
//   }
// })(Slider);

export const flashCardTrans = {
  en: {
    overview: "Overview", totalCards: "Total cards", cards: "cards",
    practice: "Practice", priority: "Priority", default: "Default",
    practiceNow: "Practice now", playGame: "Play game", next: "Next",
    memorized: "Memorized", unmemorized: "Unmemorized",
    new: "New", marked: "Marked", seeMore: "See More", wordList: "Word List",
    end: "End", doneViewTitle: "Congratulations!",
    explaination: "Press to see explanation and example",
    submitMem: "Got It", submitUnmem: "Study Again",
    labelLearn: "Learn",
    labelCategory: "Category",
    labelTotalCard: "Total",
    labelNew: "New",
    labelUnmemorized: "Unmemorized",
    labelMemorized: "Memorized",
    labelMarked: "Marked"
  },
  vi: {
    overview: "Thông tin chung", totalCards: "Tổng", cards: "Từ",
    practice: "Luyện tập", priority: "Ưu tiên", default: "Mặc định",
    practiceNow: "Luyện tập", playGame: "Làm bài", next: "Tiếp tục",
    memorized: "Đã nhớ", unmemorized: "Chưa nhớ",
    new: "Chưa học", marked: "Đánh dấu", seeMore: "Xem thêm", wordList: "Từ mới",
    end: "Kết thúc", doneViewTitle: "Bạn làm tốt lắm!",
    explaination: "Nhấn để xem giải thích và ví dụ",
    submitMem: "Đã nhớ", submitUnmem: "Học lại sau",
    labelLearn: "Số từ",
    labelCategory: 'Danh mục',
    labelTotalCard: "Tổng",
    labelNew: "Từ mới",
    labelUnmemorized: "Chưa thuộc",
    labelMemorized: "Đã thuộc",
    labelMarked: "Đánh dấu"
  }
};

const FlashCardOverview = () => {
  const totalQuestions = useGameSelector((state) => state.gameState.totalQuestions);
  const questionsPlayNum = useGameSelector((state) => state.gameState.questionsPlayNum);
  const cardStudyOrder = useGameSelector((state) => state.gameState.cardStudyOrder);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language ?? "en");
  const userId = useGameSelector((state) => state.gameState.gameSetting?.userId);
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const boxCard = useGameSelector((state) => state.gameState.boxCard);
  // const cardBookmarks = useGameSelector((state) => state.gameState.cardBookmarks);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const { enqueueSnackbar } = useSnackbar();
  const trans = useMemo(() => flashCardTrans[language], [language]);
  const dispatch = useDispatch();

  const questionsPlayNumOpts = useMemo(() => {
    if (totalQuestions <= 10) return [totalQuestions];
    return [...(_.range(10, totalQuestions, 5)), totalQuestions];
  }, [totalQuestions]);

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

  useEffect(() => {
    if (!!topicId && !!totalQuestions) {
      const mapQuestionsPlayNum = JSON.parse(localStorage.getItem(questionsPlayNumKey) || "{}");
      dispatch(setQuestionsPlayNum(mapQuestionsPlayNum[topicId] || totalQuestions))
    }
  }, [topicId, totalQuestions]);

  const onChangeQuestionsPlayNum = (value: number) => {
    dispatch(setQuestionsPlayNum(value));
    const mapQuestionsPlayNum = JSON.parse(localStorage.getItem(questionsPlayNumKey) || "{}");
    if (!!topicId) {
      localStorage.setItem(questionsPlayNumKey, JSON.stringify({
        ...mapQuestionsPlayNum, [topicId]: value
      }));
    }
  }

  const handleClickGameButton = (args: {
    flashCardView: FlashCardView;
  }) => {
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
    dispatch(setFlashCardView(args.flashCardView));
    dispatch(onStartFlashCardGame());
  }

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
        label: trans.labelTotalCard, value: totalQuestions, stroke: "#fff", bgcolor: "#849BB6", textColor: "#fff", labelColor: "#849BB6",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.DEFAULT) }
      },
      {
        label: trans.labelNew, value: mapCardBox.get(CardStudyOrder.NEW), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#FFC412", labelColor: "#FFC412",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.NEW) }
      },
      {
        label: trans.labelUnmemorized, value: mapCardBox.get(CardStudyOrder.UNMEMORIZED), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#FF5454", labelColor: "#FF5454",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.UNMEMORIZED) }
      },
      {
        label: trans.labelMemorized, value: mapCardBox.get(CardStudyOrder.MEMORIZED), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#82BC24", labelColor: "#82BC24",
        onClick: () => { handleClickContinueBoxes(CardStudyOrder.MEMORIZED) }
      },
      {
        label: trans.labelMarked, value: mapCardBox.get(CardStudyOrder.MARKED), stroke: "#fff", bgcolor: "#fff", borderBg: true, textColor: "#02C2E8", labelColor: "#02C2E8",
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
  }, [totalQuestions, mapCardBox, trans]);

  return (
    <Overview
      percent={percent}
      Statistics={<>
        <div className="main-statistics-questions-stat">
          <Grid container spacing={2}>
            <Grid item xs={6} sx={{
              display: 'flex',
              flexDirection: "column"
            }}>
              <label>{trans.labelLearn}</label>
              <Select
                id="fc-question-play-nums"
                size="small"
                IconComponent={SelectIcon}
                value={questionsPlayNum}
                onChange={(evt) => onChangeQuestionsPlayNum(evt.target.value as number)}
                classes={{
                  select: "select_question_play"
                }}
              >
                {questionsPlayNumOpts.map((value) =>
                  <MenuItem key={value} value={value}>{value} {trans.cards}</MenuItem>
                )}
              </Select>
            </Grid>
            <Grid item xs={6} sx={{
              display: 'flex',
              flexDirection: "column"
            }}>
              <label>{trans.labelCategory}</label>
              <Select
                id="fc-card-study-order"
                size="small"
                IconComponent={SelectIcon}
                classes={{
                  select: "select_question_play"
                }}
                value={cardStudyOrder}
                onChange={(evt) => {
                  dispatch(setCardStudyOrder(evt.target.value as CardStudyOrder));
                }}
              >
                <MenuItem value={CardStudyOrder.DEFAULT}>{trans.default}</MenuItem>
                <MenuItem value={CardStudyOrder.NEW}>{trans.new}</MenuItem>
                <MenuItem value={CardStudyOrder.MEMORIZED}>{trans.memorized}</MenuItem>
                <MenuItem value={CardStudyOrder.UNMEMORIZED}>{trans.unmemorized}</MenuItem>
                <MenuItem value={CardStudyOrder.MARKED}>{trans.marked}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </div>

        <div className="main-statistics-questions-button" style={{ justifyContent: "space-around" }}>
          <OverviewButton name="secondary" onClick={() => handleClickGameButton({ flashCardView: FlashCardView.CARD })}>LEARN</OverviewButton>
          <OverviewButton onClick={() => { handleClickGameButton({ flashCardView: FlashCardView.GAME }) }}>PLAY GAME</OverviewButton>
        </div>
      </>}
      QuestionCategory={renderContinueBoxes()}
    />
  )

  // return <div id="flash-card-overview">
  //   <div className="title">{trans.overview}</div>

  //   <div className="list-overview-item">
  //     <div className="overview-item">
  //       <div className="overview-item-label">{trans.totalCards}</div>
  //       <div className="overview-item-value fixed-value">{totalQuestions} {trans.cards}</div>
  //     </div>

  //     <div className="overview-item">
  //       <div className="overview-item-label">{trans.practice}</div>
  //       <div className="overview-item-value option-value">
  //         <Select

  //           IconComponent={SelectIcon}
  //           size="small" className="option-value-selector" id="fc-question-play-nums" value={questionsPlayNum} onChange={(evt) => onChangeQuestionsPlayNum(evt.target.value as number)}>
  //           {questionsPlayNumOpts.map((value) =>
  //             <MenuItem key={value} value={value}>{value} {trans.cards}</MenuItem>
  //           )}
  //         </Select>
  //       </div>
  //     </div>

  //     <div className="overview-item">
  //       <div className="overview-item-label">{trans.priority}</div>
  //       <div className="overview-item-value option-value">
  //         <Select
  //           IconComponent={SelectIcon}
  //           size="small" className="option-value-selector" id="fc-card-study-order" value={cardStudyOrder} onChange={(evt) => {
  //             dispatch(setCardStudyOrder(evt.target.value as CardStudyOrder));
  //           }}>
  //           <MenuItem value={CardStudyOrder.DEFAULT}>{trans.default}</MenuItem>
  //           <MenuItem value={CardStudyOrder.NEW}>{trans.new}</MenuItem>
  //           <MenuItem value={CardStudyOrder.MEMORIZED}>{trans.memorized}</MenuItem>
  //           <MenuItem value={CardStudyOrder.UNMEMORIZED}>{trans.unmemorized}</MenuItem>
  //           <MenuItem value={CardStudyOrder.MARKED}>{trans.marked}</MenuItem>
  //         </Select>
  //       </div>
  //     </div>
  //   </div>
  //   {/* 
  //   <div className="overview-progress">
  //     <div className="overview-progress-label">Progress</div>
  //     <ProgressSlider value={progress} valueLabelDisplay="on" valueLabelFormat={(value) => <>{value}%</>} />
  //   </div> */}

  //   <div className="overview-game-buttons">
  //     <Button className="play-button practice"
  //       onClick={() => handleClickGameButton({ flashCardView: FlashCardView.CARD })}
  //     >
  //       {trans.practiceNow}
  //     </Button>

  //     <Button className="play-button game"
  //       onClick={() => handleClickGameButton({ flashCardView: FlashCardView.GAME })}
  //     >
  //       {trans.playGame}
  //     </Button>
  //   </div>
  // </div>
}

export default FlashCardOverview;