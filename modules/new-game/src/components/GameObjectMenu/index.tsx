import { IconButton, Tooltip } from "@mui/material";
import classNames from "classnames";
import { PropsWithoutRef, memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGameSelector } from "../../hooks";
import useBookmarkCard from "../../hooks/useBookmarkCard";
import useGameContext from "../../hooks/useGameContext";
import { GameLanguage, GameObject } from "../../models/game.core";
import { gameLanguageSelector } from "../../redux/selectors";
import GameMarkMenuIcon from "./GameMarkMenuIcon";
import "./gameObjectMenu.scss";

export type AdditionalGameObjectMenuProps = PropsWithoutRef<{
  cardId: string;
  language: GameLanguage;
  isChildCard?: boolean;
}>;

const GameObjectMenu = memo((props: PropsWithoutRef<{
  gameObject: GameObject;
  className?: string;
  showBookmark?: boolean;
  isChildGame?: boolean;
}>) => {
  const {
    gameObject,
    className,
    showBookmark,
    isChildGame
  } = props;
  const topicId = useGameSelector((state) => state.gameState.gameSetting?.topicId);
  const cardProgresses = useGameSelector((state) => state.gameState.cardProgresses);
  const language = useGameSelector(gameLanguageSelector);
  const [_bookmark, setBookmark] = useState(false);
  const { onMark: onMarkCard } = useBookmarkCard();
  const { renderAdditionalGameObjectMenu = () => <></> } = useGameContext();

  useEffect(() => {
    setBookmark(cardProgresses[`${topicId}_${gameObject.id}`]?.bookmark ?? false);
  }, [gameObject.id]);

  const onMark = () => {
    const newBookmark = !_bookmark;
    setBookmark(newBookmark);
    onMarkCard({
      gameObject: gameObject,
      bookmark: newBookmark
    })
  }

  const handleClickMenuMark = () => {
    onMark();
  }

  return <div className={classNames("game-object-menu", className)} >
    {showBookmark && <Tooltip title={_bookmark ? "Remove bookmark" : "Add bookmark"} >
      <IconButton className="mark-item game-object-menu-item" size="small" onClick={handleClickMenuMark}>
        <GameMarkMenuIcon isMarked={_bookmark} />
      </IconButton>
    </Tooltip>}
    {renderAdditionalGameObjectMenu({
      cardId: gameObject.id,
      language,
      isChildCard: isChildGame
    })}
  </div>
})

export default GameObjectMenu;