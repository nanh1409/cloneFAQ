import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { returnEndGameState } from "../../redux/reducers/game.slice";

const EssayEndView = () => {
  let endTimer: any = null;
  const dispatch = useDispatch();
  useEffect(() => {
    endTimer = setTimeout(() => {
      dispatch(returnEndGameState({ essayEnd: false, returnFirstGame: true }));
    }, 1000);

    return () => {
      if (endTimer) clearTimeout(endTimer);
    }
  }, []);

  return <div style={{ padding: "10px" }}>Completed</div>
}

export default EssayEndView;