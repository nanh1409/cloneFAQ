import { parseCookies, setCookie } from "nookies";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import moment from "moment";
import { setCheckFinishGame, setCheckStartPractice } from "../../../modules/new-game/src/redux/reducers/game.slice";

const studySessionKey = "_study_session_uid";

const useStudyStatsCookie = () => {
  const hasGtag = typeof gtag !== "undefined";
  const userId = useSelector((state) => state.authState.userId);
  const authLoading = useSelector((state) => state.authState.loading);
  const loggedIn = useSelector((state) => !!state.authState.user);
  const checkFinishGame = useSelector((state) => state.gameState.checkFinishGame);
  const checkStartPractice = useSelector((state) => state.gameState.checkStartPractice);
  const dispatch = useDispatch();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let delay: any = null;
    delay = setTimeout(() => {
      setReady(true);
    }, 100);
    return () => {
      if (delay) clearTimeout(delay);
      setReady(false);
    }
  }, [])

  useEffect(() => {
    if (!authLoading && hasGtag && ready) {
      const cookies = parseCookies();
      // console.log("checking user");
      if (cookies[studySessionKey] !== userId) {
        const now = moment();
        const eod = moment(now).endOf("day");
        const maxAge = Math.abs(now.diff(eod, "seconds"));

        gtag("event", "study", {
          event_category: `user_study_${loggedIn ? "registered" : "unregistered"}`,
          event_label: userId
        });
        setCookie(null, studySessionKey, userId, {
          maxAge, path: "/"
        });
      }
    }
  }, [authLoading, hasGtag, ready]);

  useEffect(() => {
    if (checkFinishGame && hasGtag) {
      sendFinishLearningEvent({ userId });
    }
    dispatch(setCheckFinishGame(false));
  }, [checkFinishGame, hasGtag]);

  useEffect(() => {
    if (checkStartPractice && hasGtag) {
      sendStartLearningEvent({ userId });
    }
    dispatch(setCheckStartPractice(false));
  }, [checkStartPractice, hasGtag])
}

export default useStudyStatsCookie;

export const sendStartLearningEvent = (args: { userId: string; }) => {
  const hasGtag = typeof gtag !== "undefined";
  if (hasGtag) {
    gtag("event", "study", {
      event_category: "start_learning_session",
      event_label: args.userId
    });
  }
}

export const sendFinishLearningEvent = (args: { userId: string }) => {
  const hasGtag = typeof gtag !== "undefined";
  if (hasGtag) {
    // console.log("finish_learning");
    gtag("event", "study", {
      event_category: "finish_learning",
      event_label: args.userId
    });
  }
}