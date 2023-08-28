import { createAsyncThunk, createSlice, isAnyOf, PayloadAction, current } from "@reduxjs/toolkit";
import _ from "lodash";
import { HYDRATE } from "next-redux-wrapper";
import { persistReducer } from "redux-persist";
import { reduxPersistTimeout } from "../../app/redux/config";
import { QuizClientCardProgress } from "../../modules/new-game/src/components/quiz/QuizGameObject";
import { SpellingClientCardProgress } from "../../modules/new-game/src/components/spelling/SpellingGameObject";
import { OnUpdateCardBookmarksArgs } from "../../modules/new-game/src/context/gameContextTypes";
import { MapCardBox, GameStatus, MapCardProgress, ClientCardProgress } from "../../modules/new-game/src/models/game.core";
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY, EXAM_SCORE_WAITING, STUDY_SCORE_DETAIL_CORRECT, STUDY_SCORE_DETAIL_IN_CORRECT, STUDY_SCORE_DETAIL_NO_STUDY, STUDY_SCORE_DETAIL_SKIP, TOPIC_TYPE_TEST } from "../../modules/share/constraint";
import { Card, CardGames } from "../../modules/share/model/card";
import MyCardData from "../../modules/share/model/myCardData";
import Skill from "../../modules/share/model/skill";
import { StudyScore } from "../../modules/share/model/studyScore";
import { StudyScoreData } from "../../modules/share/model/studyScoreData";
import StudyScoreDetail, { IStudyScoreDetail } from "../../modules/share/model/studyScoreDetail";
import Topic from "../../modules/share/model/topic";
import TopicExercise from "../../modules/share/model/topicExercise";
import TopicProgress from "../../modules/share/model/topicProgress";
import { HydrateAppAction } from "../../types/nextReduxTypes";
import { apiBulkUpdateTopicProgresses, apiCreateSkillGame, apiCreateStudyData, apiGetCardsByIds, apiGetCardsByTopicId, apiGetSkillBasedExamData, apiGetSkillsByExamType, apiGetStudyData, apiGetTopicById, apiGetTopicProgresses, apiGetTopicsByParentSlug, apiGetTopicSetting, apiOffsetTopicsByParentId, apiResetCardStudyData, apiSyncBoxCard, apiUpdateListStudyScoreDetail, apiUpdateStudyData, apiUpdateStudyScoreDetail, apiUpdateStudyScoreDetailBookmarks } from "./topic.api";
import { ClientTopicProgress, CreateAppPracticeDataArgs, CreateSkillGameArgs, GetTopicsByParentSlugArgs, OffsetTopicsByParentIdArgs, UpdateAppPracticeDataArgs, _TopicSetting } from "./topic.model";
import { gameLocalStore, getRelaTopicList, LocalGameTimeUtils } from "./topic.utils";

export type TopicItem = Topic & {
  topicProgress?: TopicProgress;
  topicExercise: Pick<TopicExercise, "questionsNum" | "contentType" | "duration">;
}

export type MapParentTopics = {
  [parentId: string]: {
    fetched: boolean;
    data: Topic[];
  }
}

export type MapTopicProgress = {
  [examId: string]: ClientTopicProgress
}

export type MapCurrentProgress = {
  [topicId: string]: {
    currentProgress?: ClientTopicProgress
    relaProgress: number;
    totalParts: number;
    parentId: string | null;
  }
}

export type MapExamTypeSkills = {
  [examType: number]: {
    fetched: boolean;
    data: Skill[];
  }
}

// export type StudyScoreDetailSync = StudyScoreDetail & {
//   updateCardData?: boolean;
//   boxCardValue?: number;
// }

export class StudyScoreDetailSync extends StudyScoreDetail {
  updateCardData?: boolean;
  boxCardValue?: number;
  constructor(args?: IStudyScoreDetail
    & {
      updateCardData?: boolean;
      boxCardValue?: number;
    }) {
    super(args);
    this.updateCardData = args.updateCardData;
    this.boxCardValue = args.boxCardValue;
  }

  static fromClientCardProgress(args: ClientCardProgress, isFlashCard = false) {
    const studyScoreCorrect = !_.isNil(args.correct)
      ? (args.skip
        ? STUDY_SCORE_DETAIL_SKIP
        : (args.correct ? STUDY_SCORE_DETAIL_CORRECT : STUDY_SCORE_DETAIL_IN_CORRECT)
      )
      : STUDY_SCORE_DETAIL_NO_STUDY;
    const studyScoreDetail = new StudyScoreDetailSync({
      userId: args.userId, cardId: args.cardId,
      topicId: args.topicId,
      // courseId
      // studyScoreDataId
      correct: studyScoreCorrect,
      cardHistory: (args.history || []).map((value) => value ? STUDY_SCORE_DETAIL_CORRECT : STUDY_SCORE_DETAIL_IN_CORRECT),
      answerOptional: args.answerOptional,
      updateCardData: !args.skip,
      boxCardValue: (args.history ?? []).filter((value) => value).length
    });
    if (!isFlashCard) {
      if (args instanceof QuizClientCardProgress) {
        studyScoreDetail.answer = args.selectedChoices[0] ?? -1;
        studyScoreDetail.answers = args.selectedChoices.map((choiceId) => ({ answer: choiceId, correct: studyScoreCorrect }));
        studyScoreDetail.gameType = CardGames.quiz;
      } else if (args instanceof SpellingClientCardProgress) {
        studyScoreDetail.gameType = CardGames.spelling;
        studyScoreDetail.answerText = args.answer;
      }
    }
    return studyScoreDetail;
  }
}

export type OnUpdateCardBookmarksSync = OnUpdateCardBookmarksArgs & {
  userId: string;
  studyScoreDataId: string;
}

export type MapSkillStudyScoreData = {
  [skillId: string]: StudyScoreData;
}

export const fetchTopicProgresses = createAsyncThunk("topic/fetchTopicProgresses", async (args: {
  topicIds: string[];
  userId: string;
  currentTopicId?: string;
  currentTopicType?: number;
  isSkillBasedExam?: boolean;
}) => {
  const { currentTopicId, currentTopicType, isSkillBasedExam, ...rest } = args;

  const progresses = await apiGetTopicProgresses(rest);
  let currentStudyScore: StudyScore & { myCardData?: MyCardData } | null = null;
  if (currentTopicId && !isSkillBasedExam) {
    currentStudyScore = await apiGetStudyData({ topicId: currentTopicId, userId: rest.userId });
  }
  return {
    progresses,
    currentStudyScore,
    userId: rest.userId,
    currentTopicId,
    currentTopicType
  };
});

export const createAppPracticeData = createAsyncThunk("topic/createAppPracticeData", async (args: CreateAppPracticeDataArgs) => {
  const createdData = await apiCreateStudyData(args);
  return createdData;
});

export const updateAppPracticeData = createAsyncThunk("topic/updateAppPracticeData", async (args: UpdateAppPracticeDataArgs) => {
  const updated = await apiUpdateStudyData(args);
  return updated;
});

export const bulkUpdateTopicProgresses = createAsyncThunk("topic/bulkUpdateTopicProgresses", async (args: TopicProgress[]) => {
  await apiBulkUpdateTopicProgresses({ topicProgresses: args });
});

export const updateStudyScoreDetail = createAsyncThunk("topic/updateStudyScoreDetail", async (args: StudyScoreDetailSync) => {
  await apiUpdateStudyScoreDetail(args);
});

export const updateStudyScoreDetailBookmarks = createAsyncThunk("topic/updateStudyScoreDetailBookmarks", async (args: OnUpdateCardBookmarksSync) => {
  await apiUpdateStudyScoreDetailBookmarks(args);
});

export const createSkillGame = createAsyncThunk("topic/createSkillGame", async (args: CreateSkillGameArgs) => {
  const data = await apiCreateSkillGame(args);
  return data;
})

export const requestSyncBoxCard = createAsyncThunk("topic/syncBoxCard", async (args: { topicId: string; userId: string; boxCard: MapCardBox }) => {
  const data = await apiSyncBoxCard(args);
  return data;
})

export const updateListStudyScoreDetail = createAsyncThunk("topic/updateListStudyScoreDetail", async (args: Array<StudyScoreDetailSync>) => {
  await apiUpdateListStudyScoreDetail(args);
});

export const resetCardStudyData = createAsyncThunk("topic/resetCardStudyData", async (args: { studyScoreDataId: string }) => {
  await apiResetCardStudyData(args);
});

export const fetchRelaTopics = createAsyncThunk("topic/fetchRelaTopics", async (topic: TopicItem & { topicTypes?: number[] }) => {
  const topics = await getRelaTopicList(topic, false, topic.topicTypes);
  return topics;
});

export const fetchTopicsByParentId = createAsyncThunk("topic/fetchTopicsByParentId", async (args: OffsetTopicsByParentIdArgs) => {
  const topics = await apiOffsetTopicsByParentId(args);
  return {
    parentId: args.parentId,
    topics
  }
});

export const fetchTopicsByParentSlug = createAsyncThunk("topic/fetchTopicsByParentSlug", async (args: GetTopicsByParentSlugArgs) => {
  const data = await apiGetTopicsByParentSlug(args);
  return data;
});

export const fetchCurrentTopic = createAsyncThunk("topic/fetchCurrentTopic", async (args: { topicId: string; }) => {
  const topic = await apiGetTopicById({ topicId: args.topicId });
  return topic;
});

export const fetchCards = createAsyncThunk("topic/study/fetchCards", async (args: { topicId: string, skillValues?: number[] }) => {
  const { topicId, skillValues } = args;
  const cards = await apiGetCardsByTopicId({ topicId, cardTypes: skillValues });
  return cards;
});

export const fetchCardsByIds = createAsyncThunk("topic/study/fetchCardsByIds", async (cardIds: string[]) => {
  const cards = await apiGetCardsByIds({ cardIds });
  return cards;
});

export const fetchSkillsByExamType = createAsyncThunk("topic/study/fetchSkillsByExamType", async (args: { examType: number }) => {
  const data = await apiGetSkillsByExamType(args);
  return {
    examType: args.examType,
    data
  }
});

export const fetchTopicSetting = createAsyncThunk("topic/study/fetchTopicSetting", async (args: { topicSettingId: string; includeSkills?: boolean; topicId?: string; }) => {
  const data = await apiGetTopicSetting(args);
  return data;
});

export const fetchSkillBasedProgress = createAsyncThunk("topic/fetchSkillBasedProgress", async (args: {
  topicId: string;
  userId: string;
  skillIds: string[];
  client?: boolean;
}) => {
  const { client, ...payload } = args;
  const data = client ? new StudyScore() : await apiGetSkillBasedExamData(payload);
  return {
    data,
    client
  };
});

export type TopicState = {
  list: TopicItem[];
  rootTopic: Topic;
  subTopic: TopicItem;
  currentTopic: TopicItem;
  loading: boolean;
  hasSub: boolean;
  fetchedTopicProgresses: boolean;
  fetchedSkillBasedProgress: boolean;
  topicProgresses: MapTopicProgress;
  mapParentTopics: MapParentTopics;
  mapCurrentProgress: MapCurrentProgress | null;
  courseId: string;
  studyScoreId: string;
  studyScoreDataId: string;
  topicProgressId: string;
  topicProgressesToUpdate: ClientTopicProgress[] | null;
  studyBaseSlug: string;
  cards: Card[];
  fetchedCard: boolean;
  sortedCard: boolean;
  mapExamTypeSkills: MapExamTypeSkills;
  isSkillBasedExam: boolean | null;
  topicSetting: _TopicSetting | null;
  currentSkillConfig: Skill & { skillTestView?: GameStatus } | null;
  mapSkillStudyScoreData: MapSkillStudyScoreData;
  totalSkills: number;
  isInitGame: boolean;
  mapCardProgresses: MapCardProgress | null | "unfetched";
}

const initialState: TopicState = {
  list: [],
  rootTopic: null,
  subTopic: null,
  currentTopic: null,
  loading: true,
  hasSub: false,
  fetchedTopicProgresses: false,
  fetchedSkillBasedProgress: false,
  topicProgresses: {},
  mapParentTopics: {},
  mapCurrentProgress: null,
  courseId: '',
  studyScoreId: '',
  studyScoreDataId: '',
  topicProgressId: '',
  topicProgressesToUpdate: null,
  studyBaseSlug: '',
  cards: [],
  fetchedCard: false,
  sortedCard: false,
  mapExamTypeSkills: {},
  isSkillBasedExam: null,
  topicSetting: null,
  currentSkillConfig: null,
  mapSkillStudyScoreData: {},
  totalSkills: 0,
  isInitGame: true,
  mapCardProgresses: "unfetched"
}

const topicSlice = createSlice({
  name: "topic",
  initialState,
  reducers: {
    setTopics: (state, action: PayloadAction<TopicItem[]>) => {
      state.list = action.payload;
    },
    setRootTopic: (state, action: PayloadAction<Topic>) => {
      state.rootTopic = action.payload
    },
    setSubTopic: (state, action: PayloadAction<TopicItem>) => {
      state.subTopic = action.payload
    },
    setCurrentTopic: (state, action: PayloadAction<TopicItem>) => {
      state.currentTopic = action.payload;
    },
    setTopicLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setHasSub: (state, action: PayloadAction<boolean>) => {
      state.hasSub = action.payload
    },
    setFetchedTopicProgresses: (state, action: PayloadAction<boolean>) => {
      state.fetchedTopicProgresses = action.payload;
    },
    setFetchedSkillBasedProgress: (state, action: PayloadAction<boolean>) => {
      state.fetchedSkillBasedProgress = action.payload;
    },
    initClientTopicProgress: (state, action: PayloadAction<{ userId: string }>) => {
      const progressIds = Object.keys(state.topicProgresses);
      progressIds.forEach((id) => {
        if (state.topicProgresses[id]?.userId !== action.payload.userId) state.topicProgresses[id] = undefined;
      });
      state.fetchedTopicProgresses = true;
    },
    setCurrentStudyInfo: (state: TopicState, action: PayloadAction<{
      courseId?: string;
      studyScoreId?: string;
      studyScoreDataId?: string;
      topicProgressId?: string;
    }>) => {
      [
        "courseId",
        "studyScoreId",
        "studyScoreDataId",
        "topicProgressId"
      ].forEach((key) => {
        if (typeof action.payload[key] !== "undefined") {
          state[key] = action.payload[key] ?? '';
        }
      });
    },
    updateTopicProgress: (state, action: PayloadAction<ClientTopicProgress>) => {
      const updated: ClientTopicProgress[] = [];
      updateCurrentProgressRecursive({ updated, mapCurrentProgress: state.mapCurrentProgress, item: action.payload });
      updated.forEach((progress) => {
        state.topicProgresses[progress.id] = progress;
      });
      state.topicProgressesToUpdate = updated;
    },
    removeTopicProgressesToUpdate: (state) => {
      state.topicProgressesToUpdate = null;
    },
    setMapCurrentProgress: (state, action: PayloadAction<MapCurrentProgress | null>) => {
      state.mapCurrentProgress = action.payload;
    },
    initCardOrderPractice: (state, action: PayloadAction<ClientTopicProgress>) => {
      state.topicProgresses[action.payload.id] = action.payload;
    },
    updateTopicBoxCard: (state, action: PayloadAction<{ topicId: string; boxCard: MapCardBox; }>) => {
      const { topicId, boxCard } = action.payload;
      if (state.topicProgresses[topicId]) {
        state.topicProgresses[topicId].boxCard = boxCard;
      }
    },
    updateTopicCardBookmarks: (state, action: PayloadAction<{ topicId: string; cardBookmark: string; bookmark: boolean; }>) => {
      const { topicId, cardBookmark, bookmark } = action.payload;
      if (state.topicProgresses[topicId]) {
        const cardBookmarks = state.topicProgresses[topicId].cardBookmarks;
        bookmark
          ? state.topicProgresses[topicId].cardBookmarks = _.union(cardBookmarks, [cardBookmark])
          : state.topicProgresses[topicId].cardBookmarks = cardBookmarks.filter(e => e !== cardBookmark);
      }

    },
    setStudyBaseSlug: (state, action: PayloadAction<string>) => {
      state.studyBaseSlug = action.payload;
    },
    setCardsList: (state, action: PayloadAction<Card[]>) => {
      state.cards = action.payload;
    },
    setFetchedCard: (state, action: PayloadAction<boolean>) => {
      state.fetchedCard = action.payload;
    },
    setSortedCard: (state, action: PayloadAction<boolean>) => {
      state.sortedCard = action.payload;
    },
    setSkillBasedExam: (state, action: PayloadAction<boolean | null>) => {
      state.isSkillBasedExam = action.payload;
    },
    setCurrentSkillConfig: (state, action: PayloadAction<Skill & { skillTestView?: GameStatus } | null>) => {
      state.currentSkillConfig = action.payload;
    },
    setStudyScoreDataId: (state, action: PayloadAction<string>) => {
      state.studyScoreDataId = action.payload;
    },
    updateSkillStudyScoreData: (state, action: PayloadAction<{ skillId: string; studyScoreData: StudyScoreData }>) => {
      state.mapSkillStudyScoreData[action.payload.skillId] = action.payload.studyScoreData;
    },
    setInitGame: (state, action: PayloadAction<boolean>) => {
      state.isInitGame = action.payload;
    },
    resetOnChangeCurrentTopic: (state) => {
      state.fetchedTopicProgresses = false;
      state.fetchedSkillBasedProgress = false;
      state.mapCurrentProgress = null;
      state.studyScoreId = "";
      state.studyScoreDataId = "";
      state.topicProgressId = "";
      state.cards = [];
      state.fetchedCard = false;
      state.sortedCard = false;
      state.isSkillBasedExam = null;
      state.topicSetting = null;
      state.currentSkillConfig = null;
      state.mapSkillStudyScoreData = {};
      state.totalSkills = 0;
      state.isInitGame = true;
    },
    goBackSkillBasedExamOverview: (state) => {
      state.studyScoreDataId = "";
      state.cards = [];
      state.fetchedCard = false;
      state.sortedCard = false;
      state.currentSkillConfig = null;
      state.mapCardProgresses = "unfetched";
    },
    setMapCardProgressInit: (state, action: PayloadAction<MapCardProgress | null | "unfetched">) => {
      state.mapCardProgresses = action.payload;
    },
    setDataSimulationMode: (state, action: PayloadAction<{ topicId: string; userId: string; simulationMode: boolean; }>) => {
      const { topicId, userId, simulationMode } = action.payload;
      if (state.topicProgresses[topicId]) {
        if (state.topicProgresses[topicId].userId === userId) {
          state.topicProgresses[topicId].simulationMode = simulationMode
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(HYDRATE, (state, action: HydrateAppAction) => {
      state.list = action.payload?.topicState?.list ?? initialState.list;
      state.loading = action.payload?.topicState?.loading ?? initialState.loading;
    });
    builder.addCase(fetchTopicProgresses.fulfilled, (state, action) => {
      const { topicIds } = action.meta.arg;
      const { progresses, currentStudyScore, currentTopicId, currentTopicType, userId } = action.payload;
      let clientTopicProgresses = progresses.map((e) => ClientTopicProgress.fromServerTopicProgress(e));
      if (!!currentTopicId) {
        clientTopicProgresses = clientTopicProgresses.filter((e) => e.topicId !== currentTopicId);
        if (currentTopicType !== TOPIC_TYPE_TEST) {
          if (!!currentStudyScore) {
            state.studyScoreId = currentStudyScore._id;
            state.studyScoreDataId = currentStudyScore.studyScoreData?._id;
            clientTopicProgresses.push(ClientTopicProgress.fromServerStudyScore(currentStudyScore));
          }
        } else {
          if (!!currentStudyScore) {
            state.studyScoreId = currentStudyScore._id;
            state.studyScoreDataId = currentStudyScore.studyScoreData?._id;
          }
          const currentTestProgress = state.topicProgresses[currentTopicId];
          if ([EXAM_SCORE_PAUSE, EXAM_SCORE_FINISH].includes(currentStudyScore?.status)) {
            // USING SERVER SIDE PROGRESS
            LocalGameTimeUtils.clear({ topicId: currentTopicId });
            if (!!currentTestProgress && currentTestProgress.userId === userId) {
              clientTopicProgresses.push(Object.assign(
                currentTestProgress,
                !!currentStudyScore ? ClientTopicProgress.fromServerStudyScore(currentStudyScore) : {} as ClientTopicProgress
              ));
            } else {
              clientTopicProgresses.push(ClientTopicProgress.fromServerStudyScore(currentStudyScore));
            }
          } else {
            // USING CLIENT SIDE PROGRESS
            if (!!currentTestProgress && currentTestProgress.userId === userId) {
              clientTopicProgresses.push(currentTestProgress);
            }
          }
        }
      }
      topicIds.forEach((topicId) => {
        const newProgress = clientTopicProgresses.find((ctp) => ctp.topicId === topicId && !ctp.skillId);
        if (newProgress?.userId === userId) {
          state.topicProgresses[topicId] = newProgress;
        } else {
          state.topicProgresses[topicId] = undefined;
        }
      })
      // const oldProgressKeys = Object.keys(state.topicProgresses).filter((studyId) => {
      //   if (!isSkillBasedExam) return true;
      //   const [topicId, skillId] = studyId.split("_");
      //   if (topicId === currentTopicId && !!skillId) return false;
      //   return true;
      // });
      // const oldProgresses = oldProgressKeys.reduce((map, e) => {
      //   let oldProgress = state.topicProgresses[e];
      //   const clientTopicProgress = clientTopicProgresses.find((ce) => ce.id === e);
      //   if (oldProgress?.userId === userId && !!clientTopicProgress) map[e] = oldProgress;
      //   return map
      // }, {} as MapTopicProgress)
      // state.topicProgresses = {
      //   ...oldProgresses,
      //   ...(clientTopicProgresses.reduce((map: MapTopicProgress, e) => {
      //     map[e.id] = e;
      //     return map;
      //   }, {} as MapTopicProgress))
      // }
      state.fetchedTopicProgresses = true;
    });
    builder.addCase(fetchSkillBasedProgress.fulfilled, (state, action) => {
      const { data: { studyScoreDatas = [] }, client } = action.payload;
      const topicId = action.meta.arg.topicId;
      const userId = action.meta.arg.userId;
      const skillIds = action.meta.arg.skillIds;
      if (!client) {
        state.mapSkillStudyScoreData = {};
        skillIds.forEach((skillId) => {
          const studyScoreData = studyScoreDatas.find((e) => e.skillId === skillId);
          if (studyScoreData) state.mapSkillStudyScoreData[skillId] = studyScoreData;
          const progressId = `${topicId}_${skillId}`;
          const currentTestProgress = state.topicProgresses[progressId];
          if ([EXAM_SCORE_PAUSE, EXAM_SCORE_FINISH].includes(studyScoreData?.status)) {
            // Using Server Progress
            LocalGameTimeUtils.clear({ topicId, skillId });
            state.topicProgresses[progressId] = ClientTopicProgress.fromServerStudyScoreData(studyScoreData);
          } else {
            // Using Client Progress
            if (studyScoreData) state.topicProgresses[progressId] = currentTestProgress;
            else state.topicProgresses[progressId] = undefined;
          }
        });
        const rootTopicProgress = ClientTopicProgress.fromServerStudyScore(action.payload.data);
        const totalSkills = current(state).totalSkills;
        const completedGames = Object.values(state.mapSkillStudyScoreData).filter((ssd) => ssd.status === EXAM_SCORE_FINISH).length;
        const rootProgress = Math.round(completedGames * 100 / (totalSkills || 1))
        rootTopicProgress.setProgress(rootProgress);
        const oldTopicProgress = state.topicProgresses[topicId];
        state.topicProgresses[topicId] = rootTopicProgress;
        if (oldTopicProgress && oldTopicProgress.userId === userId && oldTopicProgress.progress !== rootProgress) {
          // Sync
          (() => apiUpdateStudyData({
            studyScoreId: action.payload.data._id,
            progress: rootProgress,
            status: rootProgress === 100 ? EXAM_SCORE_FINISH : EXAM_SCORE_PLAY
          }))();
        }
        if (action.payload.data?._id) {
          state.studyScoreId = action.payload.data._id;
        }
      } else {
        let completedGames = 0;
        skillIds.forEach((skillId) => {
          const progressId = `${topicId}_${skillId}`;
          const oldProgress = state.topicProgresses[progressId];
          state.topicProgresses[progressId] = oldProgress?.userId === userId ? oldProgress : undefined;
          if (oldProgress && oldProgress.userId === userId && oldProgress.status === EXAM_SCORE_FINISH) completedGames++;
        })
        const rootTopicProgress = new ClientTopicProgress({ topicId, userId });
        const totalSkills = current(state).totalSkills;
        const rootProgress = Math.round(completedGames * 100 / (totalSkills || 1));
        rootTopicProgress.setProgress(rootProgress);
        if (rootProgress >= 100) rootTopicProgress.setStatus(EXAM_SCORE_FINISH);

        state.topicProgresses[topicId] = rootTopicProgress;
      }
      state.fetchedSkillBasedProgress = true;
    });
    builder.addCase(createAppPracticeData.fulfilled, (state, action) => {
      const clientTopicProgresses = ClientTopicProgress.fromServerStudyScore(action.payload.studyScore);
      state.studyScoreId = action.payload.studyScore?._id;
      state.studyScoreDataId = action.payload.studyScore?.studyScoreData?._id;
      state.topicProgresses[clientTopicProgresses.id] = clientTopicProgresses;
      state.fetchedTopicProgresses = true;
    });
    builder.addCase(updateAppPracticeData.fulfilled, (state, action) => {
      state.topicProgressesToUpdate = null;
    });
    builder.addCase(bulkUpdateTopicProgresses.fulfilled, (state) => {
      state.topicProgressesToUpdate = null;
    });
    builder.addCase(fetchRelaTopics.fulfilled, (state, action) => {
      state.list = action.payload;
    });
    builder.addCase(fetchTopicsByParentId.fulfilled, (state, action) => {
      const { parentId, topics } = action.payload;
      state.mapParentTopics = {
        ...state.mapParentTopics,
        [parentId]: {
          fetched: true,
          data: topics
        }
      }
    });
    builder.addCase(fetchTopicsByParentSlug.fulfilled, (state, action) => {
      const data = action.payload;
      data.forEach(({ children: data, ...parent }) => {
        state.mapParentTopics = {
          ...state.mapParentTopics,
          [parent.slug]: {
            fetched: true,
            data
          }
        }
      });
    });
    builder.addCase(fetchCurrentTopic.fulfilled, (state, action) => {
      if (action.payload) {
        state.currentTopic = action.payload;
      }
    });
    builder.addCase(fetchSkillsByExamType.fulfilled, (state, action) => {
      state.mapExamTypeSkills[action.payload.examType] = {
        fetched: true,
        data: action.payload.data
      }
    });
    builder.addCase(fetchTopicSetting.fulfilled, (state, action) => {
      if (action.payload) {
        state.topicSetting = action.payload;
        state.totalSkills = Object.values(action.payload.mapCardNumSkillType || {}).filter((cardNum) => cardNum > 0).length;
      }
    });
    builder.addCase(createSkillGame.fulfilled, (state, action) => {
      if (action.payload) {
        state.mapSkillStudyScoreData[action.payload.skillId] = action.payload;
        state.studyScoreId = action.payload.studyScoreId;
        state.studyScoreDataId = action.payload._id;
        const { topicId, skillId } = action.meta.arg;
        const progressId = `${topicId}_${skillId}`;
        state.topicProgresses[progressId] = ClientTopicProgress.fromServerStudyScoreData(action.payload);
      }
    });
    builder.addCase(requestSyncBoxCard.fulfilled, (state, action) => {
      const topicId = action.meta.arg.topicId;
      const boxCard = action.meta.arg.boxCard;
      state.topicProgresses[topicId].boxCard = boxCard;
    })
    // card
    builder.addMatcher(isAnyOf(fetchCards.pending, fetchCardsByIds.pending), (state) => {
      state.fetchedCard = false;
    });
    builder.addMatcher(isAnyOf(fetchCards.fulfilled, fetchCardsByIds.fulfilled), (state, action) => {
      state.cards = action.payload;
      state.fetchedCard = true;
    });
  }
});

const updateCurrentProgressRecursive = (args: {
  updated: ClientTopicProgress[];
  mapCurrentProgress: MapCurrentProgress;
  item: ClientTopicProgress;
}) => {
  const { updated, mapCurrentProgress, item } = args;
  if (!mapCurrentProgress && !item) return;
  updated.push(item);
  if (!mapCurrentProgress) return;
  const currentProgress = mapCurrentProgress[item.topicId];
  if (!currentProgress || !currentProgress?.parentId) return;
  const _parentProgress = ((currentProgress?.relaProgress ?? 0) + (item.progress ?? 0)) / (currentProgress?.totalParts || 1);
  const parentProgress = Math.round((_parentProgress / 100 + Number.EPSILON) * 100);
  const parentCurrentProgress = mapCurrentProgress[currentProgress.parentId];
  const parentItem = ClientTopicProgress.clone(parentCurrentProgress?.currentProgress || new ClientTopicProgress({
    userId: item.userId, topicId: currentProgress.parentId
  }));
  parentItem.setProgress(parentProgress ?? 0);
  parentItem.setUserId(item.userId);
  updateCurrentProgressRecursive({ updated, item: parentItem, mapCurrentProgress });
}

export const {
  setTopics,
  setRootTopic,
  setSubTopic,
  setCurrentTopic,
  setTopicLoading,
  setHasSub,
  setFetchedTopicProgresses,
  initClientTopicProgress,
  setCurrentStudyInfo,
  updateTopicProgress,
  removeTopicProgressesToUpdate,
  setMapCurrentProgress,
  initCardOrderPractice,
  updateTopicBoxCard,
  updateTopicCardBookmarks,
  setStudyBaseSlug,
  setCardsList,
  setFetchedCard,
  setSortedCard,
  setSkillBasedExam,
  setCurrentSkillConfig,
  setStudyScoreDataId,
  updateSkillStudyScoreData,
  setInitGame,
  resetOnChangeCurrentTopic,
  goBackSkillBasedExamOverview,
  setMapCardProgressInit,
  setDataSimulationMode
} = topicSlice.actions;


const topicSliceReducer = typeof window === "undefined"
  ? topicSlice.reducer
  : persistReducer({
    key: "topic-progress",
    timeout: reduxPersistTimeout,
    storage: gameLocalStore,
    whitelist: ["topicProgresses"]
  }, topicSlice.reducer);

export default topicSliceReducer;
