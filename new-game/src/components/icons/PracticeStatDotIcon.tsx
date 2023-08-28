import { memo, PropsWithoutRef } from "react";

const PracticeStatDotIcon = memo(({ fill = "#000" }: PropsWithoutRef<{ fill?: string; }>) => <svg xmlns="http://www.w3.org/2000/svg" width="12" height="13" viewBox="0 0 12 13" fill="none">
  <circle cx="6.28342" cy="6.48361" r="5.68967" fill={fill} />
</svg>)

export default PracticeStatDotIcon;