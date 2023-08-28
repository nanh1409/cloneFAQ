import { Grid, Slider } from "@mui/material";
import { withStyles } from "@mui/styles";
import moment from "moment";
import { PropsWithoutRef } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import UserAvatar from "../../features/common/UserAvatar";
import { TOEICOverviewDataProps } from "../../modules/new-game/src/components/toeic/TOEICOverview";
import { SKILL_TYPE_LISTENING, SKILL_TYPE_READING } from "../../modules/new-game/src/utils/constraints";
import "./style.scss";

const ScoreSlider = withStyles({
  root: {
    marginTop: "30px"
  },
  rail: {
    height: "10px",
    borderRadius: 0,
    backgroundColor: "#F0F0F0",
    opacity: 1
  },
  track: {
    height: "10px",
    borderRadius: 0,
    backgroundColor: "#19CE7A",
    border: "none"
  },
  thumb: {
    height: 0
  },
  mark: {
    display: "none"
  },
  markLabel: {
    color: "var(--textColor)",
    fontWeight: 600,
    fontSize: "16px"
  },
  valueLabel: {
    backgroundColor: "#19CE7A",
    borderRadius: "12px",
    width: "45px",
    fontWeight: 700
  }
})(Slider);

const CustomTOEICOverview = (props: PropsWithoutRef<TOEICOverviewDataProps & {
  userAvatar?: string;
  userName?: string;
  examTimes?: number;
  testDate?: number;
}>) => {
  const {
    score,
    mapStats,
    userAvatar,
    userName,
    examTimes = 1,
    testDate = 0
  } = props;
  const momentTestDate = moment(testDate);
  const renderScoreSlider = (value: number) => (<ScoreSlider
    value={value}
    valueLabelDisplay="on" min={5} max={495}
    marks={[
      { value: 5, label: <>5</> }, { value: 495, label: <>495</> }
    ]}
    disabled
  />)

  return <div className="custom-toeic-overview-panel">
    <Grid container className="custom-toeic-overview-panel-main">
      <Grid item xs={12} md={6} className="toeic-score-user-data">
        <div className="user-avatar">
          <UserAvatar url={userAvatar} size={128} />
        </div>
        <div className="test-profile">
          <div className="test-profile-item">
            <div className="test-profile-item-label">Name</div>
            <div className="test-profile-item-value">{userName}</div>
          </div>

          <div className="test-profile-item">
            <div className="test-profile-item-label">Attempt</div>
            <div className="test-profile-item-value">{examTimes}</div>
          </div>


          <div className="test-profile-item">
            <div className="test-profile-item-label">
              Test Date
              <br />
              {`(yyyy/mm/dd)`}
            </div>
            <div className="test-profile-item-value">{testDate
              ? (momentTestDate.isValid() ? momentTestDate.format("YYYY/MM/DD") : "")
              : ""}</div>
          </div>
        </div>
      </Grid>

      <Grid item xs={12} md={6}>
        <Grid container className="toeic-score">
          <Grid item xs={9} className="toeic-score-left">
            <div className="toeic-score-panel toeic-score-listing-score">
              <div className="count-questions">
                <div className="label-wrap">
                  <div className="label">Listening</div>
                  <div className="number">
                    {mapStats[SKILL_TYPE_LISTENING]?.correct}/{mapStats[SKILL_TYPE_LISTENING]?.count}
                  </div>
                </div>

                <div className="score-slider">
                  {renderScoreSlider(mapStats[SKILL_TYPE_LISTENING]?.score ?? 5)}
                </div>
              </div>
            </div>

            <div className="toeic-score-panel toeic-score-reading-score">
              <div className="count-questions">
                <div className="label-wrap">
                  <div className="label">Reading</div>
                  <div className="number">
                    {mapStats[SKILL_TYPE_READING]?.correct}/{mapStats[SKILL_TYPE_READING]?.count}
                  </div>
                </div>

                <div className="score-slider">
                  {renderScoreSlider(mapStats[SKILL_TYPE_READING]?.score ?? 5)}
                </div>
              </div>
            </div>
          </Grid>

          <Grid item xs={3} className="toeic-score-right">
            <div className="title-score">TOTAL SCORE</div>
            <div className="total-score-wrap">
              <CircularProgressbar
                className="total-score-circle"
                minValue={0}
                maxValue={990}
                value={score}
                strokeWidth={5}
                styles={buildStyles({
                  textSize: "30px",
                  strokeLinecap: "butt",
                  pathColor: "#19CE7A",
                  trailColor: "#F0F0F0",
                })}
              />
              <div className="total-score-text">{score}</div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </div>
}

export default CustomTOEICOverview;