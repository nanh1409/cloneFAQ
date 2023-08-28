import { memo, PropsWithoutRef } from "react";

const StudyPlanChartLegendItemIcon = memo((props: PropsWithoutRef<{ fill?: string }>) => {
  return <svg width="11" height="11" viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.328125" y="0.120117" width="10" height="10" rx="3" fill={props.fill ?? "#000"} />
  </svg>
});
export default StudyPlanChartLegendItemIcon;