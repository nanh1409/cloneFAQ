import { PropsWithoutRef, ReactNode } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "./style.scss"

const Overview = (props: PropsWithoutRef<{
    percent: number,
    Statistics: ReactNode,
    QuestionCategory: ReactNode
}>) => {
    const { percent, Statistics, QuestionCategory } = props;

    return (
        <div className="module-game-overview-component">
            <div className="main-game-overview-bgr">
                <span className="bubble-top-left" />
                <span className="small-bubble-left" />
                <span className="ellipse-left" />
                <span className="ellipse-right" />
                <span className="bubble-right" />
            </div>
            <div className="main-game-overview-data">
                <div className="main-progress">
                    <div className="main-progress-box" />
                    <div className="box-layer-2" />
                    <div className="box-layer-3">
                        <CircularProgressbar
                            className="progress-main"
                            minValue={0}
                            maxValue={100}
                            value={percent}
                            strokeWidth={6}
                            styles={buildStyles({
                                pathColor: "#6C81FE",
                                trailColor: "rgba(220, 226, 238, 1)"
                            })}
                        />
                    </div>
                    <span className="percent-text">
                        {percent}%
                    </span>
                </div>
                <div className="main-statistics">
                    {Statistics}
                </div>
            </div>

            <div className="main-game-overview-question-categories">
                <div className="question-categories-title">
                    Press and Practice Your Category Again Below
                </div>
                <div className="question-categories-list">
                    {QuestionCategory}
                </div>
            </div>
        </div>
    )
}

export default Overview; 