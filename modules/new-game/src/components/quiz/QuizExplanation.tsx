import { Button, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import React, { PropsWithoutRef, useMemo, useState } from "react";
import { useGameSelector } from "../../hooks";
import useGameContext from "../../hooks/useGameContext";
import { ExplanationType } from "../../models/game.core";
import ExplanationLockIcon from "../icons/ExplainationLockIcon";
import "./quizExplanation.scss";
// import { setShowLoginPopup } from "../../../../../features/auth/auth.slice";

const QuizExplanation = (props: PropsWithoutRef<{
  explanation?: string;
  type?: ExplanationType;
  enableChildGameAds?: boolean;
}>) => {
  const { unlockFeatureAction, ExplanationAdsComponent } = useGameContext();

  const [show, setShow] = useState(true);
  const language = useGameSelector((state) => state.gameState.gameSetting?.language ?? "en");
  const disableHideExplanation = useGameSelector((state) => state.gameState.gameSetting?.disableHideExplanation ?? "");
  const lockType = useGameSelector((state) => state.gameState.gameSetting?.featureLockType);

  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));

  const label = useMemo(() => {
    if (language === "vi") {
      return props.type === "explanation-example" ? "Giải thích / Ví dụ" : (props.type === "example" ? "Ví dụ" : "Giải thích")
    }
    return props.type === "explanation-example" ? "Explanation / Example" : (props.type === "example" ? "Example" : "Explanation")
  }, [props.type, language]);

  const LockView = useMemo(() => {
    let lockView = <></>;
    if (lockType === "login") {
      lockView = <div>
        <div className="explanation-text">{language === "vi"
          ? "Hãy đăng nhập ngay để được xem giải chi tiết!"
          : "Please login to view detailed explanation!"
        }
        </div>
        <div className="app-bar-header-auth">
          <Button
            // TODO: implement external login
            onClick={unlockFeatureAction}
            sx={{ display: "block", textAlign: "left", fontWeight: 700, flex: "0 0 auto", cursor: "pointer", padding: "4px 12px" }}
          >
            {language === "vi" ? "Đăng nhập" : "Login"}
          </Button>
        </div>
      </div>;
    } else if (lockType === "upgrade-plan") {
      if (language === "vi") {
        lockView = <>Vui lòng <span className="unlock-link" onClick={unlockFeatureAction}>nâng cấp</span> tài khoản của bạn để xem lời giải chi tiết!</>;
      } else {
        lockView = <>Please <span className="unlock-link" onClick={unlockFeatureAction}>upgrade</span> your account to view detailed explanation!</>;
      }
    }
    return lockView;
  }, [lockType, language]);

  const actions = useMemo(() => {
    let actionShow = "Show"; let actionHide = "Hide";
    if (language === "vi") {
      actionShow = "Hiện"; actionHide = "Ẩn"
    }
    return { actionShow, actionHide }
  }, [language]);

  return props.explanation
    ? <div className="game-object-explanation quiz-explanation">
      <div className="quiz-explanation-button-wrap">
        <Button
          className={`quiz-explanation-button${disableHideExplanation ? "" : " default"}`}
          size="small"
          onClick={() => setShow(!show)}
          {...(disableHideExplanation ? { sx: { color: "var(--primaryColor)" } } : {})}
        >
          {disableHideExplanation
            ? label
            : (show ? `${actions.actionHide} ${label}` : `${actions.actionShow} ${label}`)}
        </Button>
      </div>
      <div className={classNames("game-object-main-explanation", !show ? "hidden" : "")}>
        {!isTabletUI && !!props.enableChildGameAds && ExplanationAdsComponent}
        {/* <GameGoogleAdsense clientId={ads.clientId} slot={ads.slot} height={60} style={{ margin: "8px 0" }} />} */}
        {!lockType
          ? <>
            <div className="game-object-explanation-content" dangerouslySetInnerHTML={{
              __html: props.explanation
            }}></div>
          </>
          : <div className="game-object-explanation-content locked">
            <ExplanationLockIcon />
            <div className="game-object-locked-title">{LockView}</div>
          </div>}
      </div>
    </div>
    : <></>;
}

export default QuizExplanation;