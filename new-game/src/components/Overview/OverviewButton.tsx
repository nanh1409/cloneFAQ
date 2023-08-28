import { Button, ButtonProps } from "@mui/material";
import { memo, useMemo } from "react";

const OverviewButton = memo((props: ButtonProps & {
  name?: "primary" | "secondary"
}) => {
  const { name = "primary", ...buttonProps } = props;
  const bgr = useMemo(() => {
    let _bgr = "linear-gradient(180deg, #2CE1C1 0%, #23CAEF 100%)";
    if (name === "secondary") {
      _bgr = "linear-gradient(0deg, #F869B6 0%, #FF948C 100%)"
    }
    return `${_bgr} !important`;
  }, [name]);

  return <Button
    {...buttonProps}
    sx={{
      ...(buttonProps.sx ?? {}),
      width: "170px", height: "45px", borderRadius: "50px", color: "#fff !important",
      boxShadow: "0px 2px 6px 0px #D3D9E5", background: bgr,
      fontSize: "16px", fontWeight: 700, textShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.05)",
    }}
  />
});

export default OverviewButton;