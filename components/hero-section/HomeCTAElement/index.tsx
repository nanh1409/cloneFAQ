import { Button, Rating, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { setCurrentState, setOpenSelectStateDialog, stateSlugKey } from "../../../app/redux/reducers/states.slice";
import useAppConfig from "../../../hooks/useAppConfig";
import NextLink from "../../NextLink";
import "./homeCTAElement.scss";

const appRatingKey = "your-edu-app-rating";

const HomeCTAElement = () => {
  const appConfig = useAppConfig();
  const { appName } = appConfig;
  const router = useRouter();
  const [ratingPoint, setRatingPoint] = useState(0);
  const [loadedState, setLoadedState] = useState(false);

  const statesList = useSelector((state) => state.state.statesList);
  const currentState = useSelector((state) => state.state.currentState);

  const dispatch = useDispatch();

  const ratingMsgColor = useMemo(() => {
    let color = "#fff";
    if (appName === "asvab") color = "#DEE780";
    return color;
  }, [appName]);


  useEffect(() => {
    if (typeof window !== "undefined") {
      const rating = sessionStorage.getItem(appRatingKey);
      if (typeof rating === "string") {
        setRatingPoint(!!rating.match(/^[0-5]$/g) && !isNaN(parseInt(rating)) ? parseInt(rating) : 0);
      }
    }

    return () => {
      setLoadedState(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stateSlug = localStorage.getItem(stateSlugKey);
      if (typeof stateSlug === "string") {
        const currentState = statesList.find((e) => e.slug === stateSlug) || null;
        dispatch(setCurrentState(currentState));
      }
      setTimeout(() => {
        setLoadedState(true);
      }, 300);
    }
  }, [statesList.length]);

  const thanksRating = router.locale === "en" ? "Thank you for voting 5 stars!" : router.locale === "vi" ? "Cảm ơn bạn đã bình chọn 5 sao!" : ''
  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));

  switch (appName) {
    case "cscs":
      return <div className="cta-home cscs">
        {/* <NextLink href={appConfig.testSlug}>
          <Button sx={{
            width: 300, height: 70, backgroundColor: "#00C9E4", color: "#fff !important",
            fontSize: 30, fontWeight: "bold", lineHeight: "45px",
            boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.25)", borderRadius: 0,
            transition: "transform 0.2s linear",
            "&:hover": {
              backgroundColor: "#00C9E4",
              transform: "translateY(-6px)"
            }
          }}>Mock Test</Button>
        </NextLink> */}
      </div>;
    case "nclex":
      return <div className="cta-home nclex">
        {/* <NextLink href={appConfig.testSlug}>
          <Button sx={{
            width: 300, height: 70, backgroundColor: "#007AFF", color: "#fff !important",
            fontSize: 28, fontWeight: "bold", lineHeight: "32px",
            borderRadius: "20px", mt: "16px",
            transition: "transform 0.2s linear",
            "&:hover": {
              backgroundColor: "#007AFF",
              transform: "translateY(-6px)"
            }
          }}>Exam Simulator</Button>
        </NextLink> */}
      </div>
    case "ged":
      return <div className="cta-home ged">
        {/* <NextLink href={appConfig.testSlug}>
          <Button sx={{
            width: 300, height: 70, backgroundColor: "#FDCA33", color: "#fff !important",
            fontSize: 28, fontWeight: "bold", lineHeight: "32px",
            borderRadius: "20px", mt: "16px",
            transition: "transform 0.2s linear",
            "&:hover": {
              backgroundColor: "#FDCA33",
              transform: "translateY(-6px)"
            }
          }}>Full Test</Button>
        </NextLink> */}
      </div>
    case "toeic":
    case "asvab":
      return <div className={classNames("cta-home rating", appName)}>
        <div className="rating-container">
          <div className="rating-divider" />
          <div className="rating-background">
            <Rating className="rating-main"
              size={isMobileUI ? "small" : "large"}
              value={ratingPoint}
              onChange={(_e, value) => {
                setRatingPoint(value);
                sessionStorage.setItem(appRatingKey, `${value}`);
              }} />
          </div>
          {ratingPoint === 5 && <div className="rating-msg" style={{ color: ratingMsgColor }}>{thanksRating}</div>}
        </div>
      </div>
    case "hvac":
      return <div className="cta-home hvac">
        {/* <NextLink href={appConfig?.testSlug ?? ''}>
          <Button sx={{
            width: 260, height: 70, backgroundColor: "#90C083", color: "#fff !important",
            fontSize: 24, fontWeight: 700, lineHeight: "36px",
            borderRadius: "20px", mt: "16px",
            transition: "transform 0.2s linear",
            "&:hover": {
              backgroundColor: "#90C083",
              transform: "translateY(-6px)"
            }
          }}>Exam Simulator</Button>
        </NextLink> */}
      </div>;
    case "alevel":
      return <div className="cta-home alevel-maths">
        {/* <NextLink href={appConfig?.testSlug ?? "#"}>
          <Button sx={{
            width: 248, height: 68, background: "linear-gradient(99.1deg, #AEE6DF -2.03%, #3DD9FF 100%) !important", color: "#18212D !important",
            fontSize: 30, fontWeight: "bold", lineHeight: "45px",
            boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.25)", borderRadius: 40,
            transition: "transform 0.2s linear",
            "&:hover": {
              transform: "translateY(-6px)"
            }
          }}>Mock Test</Button>
        </NextLink> */}
      </div>;
    case "cdl":
      return <div className="cta-home cdl">
        {loadedState
          ? <>
            <Button
              sx={{
                width: 384, height: 70, background: "#00c9e4 !important", color: "#fff !important", borderRadius: 50,
                fontSize: 30, fontWeight: 700,
                boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.25)"
              }}
              onClick={() => {
                dispatch(setOpenSelectStateDialog({ open: true }));
              }}
            >
              {!!currentState ? "Change your state" : "Select your state"}
            </Button>
          </>
          : <span style={{ minHeight: "70px" }}></span>}
      </div>;
    default:
      return <></>;
  }
}

export default HomeCTAElement;