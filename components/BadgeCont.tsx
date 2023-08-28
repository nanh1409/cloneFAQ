import { Badge, BadgeProps } from "@mui/material";

const BadgeCont = (props: {
  hidden?: boolean;
  useBigDot?: boolean;
  colorDot?: string;
} & BadgeProps) => {
  const {
    hidden,
    useBigDot,
    colorDot,
    children,
    ...badgeProps } = props;
  return hidden ? <>{children}</> : <Badge {...badgeProps}>
    {children}
  </Badge>
}

export default BadgeCont;