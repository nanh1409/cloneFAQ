import { TypedUseSelectorHook, useSelector } from "react-redux";
import { CombinedState } from "redux";
import { GameState } from "../redux/reducers/game.slice";

export type GameModuleState = CombinedState<{
  gameState: GameState;
}>

export const useGameSelector: TypedUseSelectorHook<GameModuleState> = useSelector;