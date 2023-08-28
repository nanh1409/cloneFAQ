import { createSelector } from "@reduxjs/toolkit";
import { GameModuleState } from "../hooks";

export const gameLanguageSelector = createSelector(
  (state: GameModuleState) => state.gameState,
  (state) => state.gameSetting?.language
)