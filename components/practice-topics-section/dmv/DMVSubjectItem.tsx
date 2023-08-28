import { Button } from "@mui/material";
import { memo, PropsWithoutRef } from "react";
import CtaButton from "../../CtaButton";
import "./dmvSubjectItem.scss";

const DMVSubjectItem = memo((props: PropsWithoutRef<{
  name?: string;
  icon?: JSX.Element;
  desc?: string;
  onClick?: () => void;
  ctaColor?: string;
  ctaBgColor?: string;
  ctaLayerBgColor?: string;
}>) => {
  const {
    name = '',
    icon = <></>,
    desc = '',
    onClick = () => { },
    ctaColor,
    ctaBgColor,
    ctaLayerBgColor
  } = props;
  
  return <div className="dmv-subject-item" title={desc}>
    <div className="dmv-subject-item-icon">
      {icon}
    </div>
    <div className="dmv-subject-item-main-button">
      <CtaButton
        backgroundColor={ctaBgColor}
        backgroundLayerColor={ctaLayerBgColor}
        color={ctaColor}
        title={name}
        onClick={onClick}
        width={250}
        breakpoint={1170}
        borderRadius={15}
        buttonClassName="dmv-subject-item-cta"
      />
    </div>
    <div className="dmv-subject-item-desc dot-7">
      {desc}
    </div>
  </div>
});

export default DMVSubjectItem;