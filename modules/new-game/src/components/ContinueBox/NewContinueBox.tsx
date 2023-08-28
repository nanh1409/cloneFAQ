import { Box, IconButton, Typography } from "@mui/material";
import { memo, PropsWithoutRef, useMemo } from "react";

export type NewContinueBoxProps = {
  stroke?: string;
  bgcolor?: string;
  textColor?: string;
  labelColor?: string;
  onClick?: () => void;
  value?: number;
  className?: string;
  label?: string;
  mapScreenSize?: Record<number, number>;
  mapScreenFontSize?: Record<number, number>;
  mapScreenLabelFontSize?: Record<number, number>;
  borderBg?: boolean;
}

const NewContinueBox = memo((props: PropsWithoutRef<NewContinueBoxProps>) => {
  const {
    stroke = "#fff",
    bgcolor = "#000",
    textColor = "#fff",
    labelColor = "#000",
    onClick = () => { },
    value = 0,
    className,
    label = "",
    mapScreenSize = {},
    mapScreenFontSize = {},
    mapScreenLabelFontSize = {},
    borderBg
  } = props;
  const { cssBorderSize, cssSize } = useMemo(() => {
    const _mapScreenSize = Object.keys(mapScreenSize).length ? { ...mapScreenSize, 0: 80 } : { 0: 80 };
    const baseBorderWidth = 20;
    return Object.entries(_mapScreenSize).reduce((sxProps, [sWidth, size]) => {
      if (isNaN(+sWidth) || +sWidth <= 0) {
        sxProps.cssSize["width"] = `${size}px`;
        sxProps.cssSize["height"] = `${size}px`;
        sxProps.cssBorderSize["width"] = `${size + baseBorderWidth}px`;
        sxProps.cssBorderSize["height"] = `${size + baseBorderWidth}px`;
      } else {
        const borderWidth = size / 80 * baseBorderWidth;
        sxProps.cssSize[`@media (max-width: ${sWidth}px)`] = {
          width: `${size}px`,
          height: `${size}px`
        }
        sxProps.cssBorderSize[`@media (max-width: ${sWidth}px)`] = {
          width: `${size + borderWidth}px`,
          height: `${size + borderWidth}px`
        }
      }
      return sxProps;
    }, {
      cssBorderSize: {} as any,
      cssSize: {} as any
    })
  }, [mapScreenSize]);

  const cssFontSize = useMemo(() => {
    const _mapScreenFontSize = Object.keys(mapScreenFontSize).length ? { ...mapScreenFontSize, 0: 24 } : { 0: 24 };
    return Object.entries(_mapScreenFontSize).reduce((sxProps, [sWidth, size]) => {
      if (isNaN(+sWidth) || +sWidth <= 0) {
        sxProps["fontSize"] = `${size}px`;
      } else {
        sxProps[`@media (max-width: ${sWidth}px)`] = {
          fontSize: `${size}px`
        }
      }
      return sxProps;
    }, {} as any)
  }, [mapScreenFontSize]);

  const cssLabelFontSize = useMemo(() => {
    const _mapScreenLabelFontSize = Object.keys(mapScreenLabelFontSize).length ? { ...mapScreenLabelFontSize, 0: 18 } : { 0: 18 };
    return Object.entries(_mapScreenLabelFontSize).reduce((sxProps, [sWidth, size]) => {
      if (isNaN(+sWidth) || +sWidth <= 0) {
        sxProps["fontSize"] = `${size}px`;
      } else {
        sxProps[`@media (max-width: ${sWidth}px)`] = {
          fontSize: `${size}px`
        }
      }
      return sxProps;
    }, {} as any)
  }, [mapScreenLabelFontSize]);

  return <Box textAlign="center" display="inline-flex" flexDirection="column" alignItems="center">
    <Box sx={{
      boxShadow: "0 2px 10px 0px rgba(0, 0, 0, 0.15)",
      // border: `10px solid ${stroke}`,
      borderRadius: "100%",
      display: "flex", alignItems: "center", justifyContent: "center",
      ...cssBorderSize,
    }}>
      <IconButton
        onClick={onClick}
        className={className}
        sx={{
          borderRadius: "100%",
          bgcolor: `${bgcolor} !important`,
          color: `${textColor} !important`,
          ...(borderBg ? { border: `2px solid ${textColor}` } : {}),
          ...cssSize,
          ...cssFontSize,
          fontWeight: 700
        }}
      >
        {value}
      </IconButton>
    </Box>
    {label && <Typography component="span" mt="15px"
      sx={{ ...cssLabelFontSize }}
      fontWeight={700} color={labelColor}>{label}</Typography>}
  </Box>
})

export default NewContinueBox;