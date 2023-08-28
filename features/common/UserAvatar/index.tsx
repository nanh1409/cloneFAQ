import AccountCircle from "@mui/icons-material/AccountCircle";
import Box from "@mui/material/Box";
import { styled } from "@mui/styles";
import { SxProps } from "@mui/system";
import { DOMAttributes, memo, PropsWithChildren } from "react";

const UserAvatarContainer = memo(styled("span")({ display: "inline-flex", position: "relative" }));

const UserAvatar = memo((props: PropsWithChildren<{
  url?: string;
  size?: number;
  sx?: SxProps;
  className?: string;
  pro?: boolean;
} & Pick<DOMAttributes<HTMLSpanElement>, "onClick">>) => {
  const {
    url = "",
    size,
    sx,
    children,
    className,
    pro,
    ...containerProps
  } = props;

  return <UserAvatarContainer className={className} {...containerProps}>
    {pro && <>
      <img
        src="/images/get-pro/pro-account-crown.png" alt="pro-crown"
        style={{
          position: "absolute",
          left: "50%", top: "-9px",
          transform: "translateX(-50%)"
        }}
      />
      <img
        src="/images/get-pro/pro-account-frame.png" alt="pro-frame"
        style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        width={size + 2}
        height={size + 2}
      />
    </>}
    {!url
      ? <AccountCircle
        sx={{
          ...sx,
          fontSize: size,
          borderRadius: "100%"
        }}
      />
      : <Box
        component="img"
        src={url}
        alt="user-avatar"
        referrerPolicy="no-referrer"
        width={size}
        height={size}
        borderRadius="100%"
        sx={sx}
      />}
    {children}
  </UserAvatarContainer>
})

export default UserAvatar;