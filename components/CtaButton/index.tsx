import { Box, Button, Link } from "@mui/material";
import classNames from "classnames";
import { memo, MouseEventHandler, PropsWithChildren, PropsWithoutRef, ReactNode, useMemo } from "react";
import NextLink from "../NextLink";
import RawLink from "../RawLink";
import "./ctaButton.scss";

const CtaButton = memo((props: PropsWithoutRef<{
  url?: string;
  title?: string;
  color?: string;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  backgroundColor?: string;
  backgroundLayerColor?: string;
  width?: number;
  breakpoint?: number;
  className?: string;
  titleClassName?: string;
  startIconClassName?: string;
  endIconClassName?: string;
  buttonClassName?: string;
  borderRadius?: number;
  externalLink?: boolean;
  background?: string;
}>) => {
  const {
    url,
    title = '',
    color,
    startIcon = <></>,
    endIcon = <></>,
    onClick,
    backgroundColor,
    backgroundLayerColor,
    width = 600,
    breakpoint = 768,
    className,
    titleClassName,
    startIconClassName,
    endIconClassName,
    buttonClassName,
    borderRadius = 0,
    externalLink,
    background
  } = props;
  const ButtonContainer = useMemo(() => (_props: PropsWithChildren<{}>) => {
    if (url) return externalLink
      ? <RawLink href={url}>{_props.children}</RawLink>
      : <NextLink href={url}>{_props.children}</NextLink>
    return <>{_props.children}</>
  }, [url, externalLink]);

  const sxBtn = useMemo(() => {
    const bgCss = backgroundColor ? { backgroundColor } : { background };
    return {...bgCss, "&:hover": bgCss, borderRadius: `${borderRadius}px`, transition: "transform 0.2s linear" } 
  }, [backgroundColor, background, borderRadius])

  return <Box
    className={classNames("cta-btn-component", className)}
    sx={{ width, [`@media(max-width: ${breakpoint}px)`]: { width: "100%" } }}
  >
    <ButtonContainer>
      <Button
        className={classNames("cta-btn-component-main", buttonClassName)} onClick={onClick}
        sx={sxBtn}
      >
        <span className={startIconClassName}>{startIcon}</span>
        <span className={classNames("cta-btn-component-title", titleClassName)} style={{ color }}>{title}</span>
        <span className={endIconClassName}>{endIcon}</span>
      </Button>
    </ButtonContainer>
    <Box className="cta-btn-component-bg-layer" sx={{
      backgroundColor: backgroundLayerColor, borderRadius: `${borderRadius}px`,
      width, [`@media(max-width: ${breakpoint}px)`]: { width: "100%" }
    }}></Box>
  </Box>
})

export default CtaButton;