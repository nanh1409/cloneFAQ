import { ClientCardProgress, MapCardBox } from "../models/game.core"
import { MapSkillStats } from "../utils/game.scoreUtils";

export type OnAnswerFunction = (args: ClientCardProgress, disableSync?: boolean) => void;
export type OnSubmitListAnswer = (args: Array<ClientCardProgress>) => void;

export type OnUpdateGameProgessArgs = {
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  boxCard?: MapCardBox;
}

export type OnUpdateGameProgressFunction = (args: OnUpdateGameProgessArgs) => void;

export type OnRestartGameArgs = {
  cardOrder: string[];
  totalCardStudy?: number;
}

export type OnRestartGameFunction = (args: OnRestartGameArgs) => void;

export type OnSubmitGameArgs = {
  progress: number;
  score: number;
  totalQuestions: number;
  totalCorrect: number;
  totalIncorrect: number;
  status?: number;
  mapStats?: MapSkillStats;
}

export type OnSubmitGameFunction = (args: OnSubmitGameArgs) => void;

export type OnStartTestGameArgs = {
  continueMode: boolean;
  replay: boolean;
  totalQuestions?: number;
}

export type OnStartTestGameFunction = (args: OnStartTestGameArgs) => void;

export type OnUpdateTopicBoxCardArgs = {
  topicId: string;
  boxCard?: MapCardBox;
}

export type OnUpdateTopicBoxCardFunction = (args: OnUpdateTopicBoxCardArgs) => void;
export type OnFinishShowResultOnAnswerGame = (args: OnUpdateGameProgessArgs) => void;
export type OnReplayAnsweredQuestions = (args: OnUpdateGameProgessArgs) => void;

export type OnUpdateCardBookmarksArgs = {
  topicId: string;
  cardId: string;
  bookmark: boolean;
}

export type OnUpdateCardBookmarksFunction = (args: OnUpdateCardBookmarksArgs, disableSync?: boolean) => void;