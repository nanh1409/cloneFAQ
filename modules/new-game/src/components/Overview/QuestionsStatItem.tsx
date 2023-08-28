import classNames from "classnames";
import { PropsWithoutRef, memo } from "react";
import PracticeStatDotIcon from "../icons/PracticeStatDotIcon";

const QuestionsStatItem = memo((props: PropsWithoutRef<{ label: string; value: number; color: string; className?: string; }>) => {
    const { label, value, color, className } = props;
    return <div className={classNames("main-stats-data-questions-stat-item", className)}>
      <div className="questions-stat-item-value" style={{ color }}>
        <PracticeStatDotIcon fill={color} />
        {value}
      </div>
      <div className="questions-stat-item-label">
        {label}
      </div>
    </div>
  })
  export default QuestionsStatItem