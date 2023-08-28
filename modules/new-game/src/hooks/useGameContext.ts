import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export default function useGameContext() {
  return useContext(GameContext);
}