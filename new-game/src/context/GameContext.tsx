import React, { createContext, MutableRefObject, PropsWithChildren, ReactElement, useCallback, useRef } from 'react';
import { AdditionalGameObjectMenuProps } from "../components/GameObjectMenu";
import { TestClockRef } from "../components/test-clock";
import { TOEICOverviewDataProps } from "../components/toeic/TOEICOverview";
import {
  OnAnswerFunction,
  OnFinishShowResultOnAnswerGame,
  OnReplayAnsweredQuestions,
  OnRestartGameFunction,
  OnStartTestGameFunction,
  OnSubmitGameFunction,
  OnSubmitListAnswer,
  OnUpdateCardBookmarksFunction,
  OnUpdateGameProgressFunction,
  OnUpdateTopicBoxCardFunction
} from "./gameContextTypes";
import { getStorageURL as _getStorageURL, getFormattedContentWithImg as _getFormattedContentWithImg } from '../utils/format';

interface GameContextProps {
  onAnswer: OnAnswerFunction;
  onSubmitListAnswer: OnSubmitListAnswer;
  onUpdateProgress: OnUpdateGameProgressFunction
  onRestartGame: OnRestartGameFunction;
  onSubmitGame: OnSubmitGameFunction;
  onStartTestGame: OnStartTestGameFunction;
  onUpdateTopicBoxCard: OnUpdateTopicBoxCardFunction;
  onUpdateCardBookmarks: OnUpdateCardBookmarksFunction;
  onFinishShowResultOnAnswerGame: OnFinishShowResultOnAnswerGame;
  onReplayAnsweredQuestions: OnReplayAnsweredQuestions;
  unlockFeatureAction: () => void;

  playedTime: number;
  testClockRef: MutableRefObject<TestClockRef>;
  /** Ads Component that shown below the Quiz explanation, only in Pragraph Game */
  ExplanationAdsComponent?: ReactElement;
  /** Custom render TOEIC Overview Panel function */
  renderTOEICOverview?: (_props: TOEICOverviewDataProps) => JSX.Element;
  /** Render Additional GameObjectMenu */
  renderAdditionalGameObjectMenu?: (_props: AdditionalGameObjectMenuProps) => JSX.Element;
  getCDNUrl?: (url: string) => string;
  getStorageURL?: (url: string) => string;
  getFormattedContentWithImg?: (url: string) => string
}

export const GameContext = createContext<Omit<GameContextProps, "getCDNUrl">>({
  onAnswer: () => { },
  onSubmitListAnswer: () => { },
  onUpdateProgress: () => { },
  onRestartGame: () => { },
  onSubmitGame: () => { },
  onStartTestGame: () => { },
  onUpdateTopicBoxCard: () => { },
  onUpdateCardBookmarks: () => { },
  onFinishShowResultOnAnswerGame: () => { },
  onReplayAnsweredQuestions: () => { },
  unlockFeatureAction: () => { },
  getStorageURL: () => "",
  getFormattedContentWithImg: () => "",
  testClockRef: null,
  playedTime: 0
});

export const GameContextProvider = (props: PropsWithChildren<Partial<Omit<GameContextProps, "testClockRef" | "getStorageURL" | "getFormattedContentWithImg">>>) => {
  const {
    onAnswer = () => { },
    onSubmitListAnswer = () => { },
    onUpdateProgress = () => { },
    onRestartGame = () => { },
    onSubmitGame = () => { },
    onStartTestGame = () => { },
    onUpdateTopicBoxCard = () => { },
    onUpdateCardBookmarks = () => { },
    onFinishShowResultOnAnswerGame = () => { },
    onReplayAnsweredQuestions = () => { },
    unlockFeatureAction = () => { },
    playedTime: _playedTime,
    ExplanationAdsComponent = <></>,
    renderTOEICOverview,
    renderAdditionalGameObjectMenu: _renderAdditionalGameObjectMenu = () => <></>,
    getCDNUrl = (url: string) => url
  } = props;

  const testClockRef = useRef<TestClockRef>({ playedTime: _playedTime });
  const renderAdditionalGameObjectMenu = useCallback((props: AdditionalGameObjectMenuProps) =>
    _renderAdditionalGameObjectMenu(props)
    , []);

  const getStorageURL = useCallback((url: string) => {
    return getCDNUrl(_getStorageURL(url))
  }, [getCDNUrl, _getStorageURL])

  const getFormattedContentWithImg = useCallback((url: string) => {
    return getCDNUrl(_getFormattedContentWithImg(url, getCDNUrl))
  }, [getCDNUrl, _getFormattedContentWithImg])

  return (
    <GameContext.Provider
      value={{
        onAnswer,
        onSubmitListAnswer,
        onUpdateProgress,
        onRestartGame,
        onSubmitGame,
        onStartTestGame,
        onUpdateTopicBoxCard,
        onUpdateCardBookmarks,
        onFinishShowResultOnAnswerGame,
        onReplayAnsweredQuestions,
        unlockFeatureAction,
        ExplanationAdsComponent,
        renderTOEICOverview,
        renderAdditionalGameObjectMenu,
        playedTime: testClockRef.current?.playedTime ?? 0,
        testClockRef,
        getStorageURL,
        getFormattedContentWithImg
      }}
    >
      {props.children}
    </GameContext.Provider>
  );
};
