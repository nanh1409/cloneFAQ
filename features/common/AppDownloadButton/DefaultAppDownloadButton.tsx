import { memo, PropsWithoutRef } from "react";
import AppDownloadButton from ".";
import { useSelector } from "../../../app/hooks";
import AppSetting from "../../../modules/share/model/appSetting";

const DefaultAppDownloadButton = memo((props: PropsWithoutRef<{
  source: "chplay" | "appstore"
}>) => {
  const { source } = props;
  const { linkGooglePlay, linkAppStore } = useSelector((state) => state.appInfos.appInfo || {} as AppSetting);
  return <AppDownloadButton
    source={source}
    link={source === "chplay" ? linkGooglePlay : linkAppStore}
    color={`var(--appTextColor)`}
    hoverColor={`var(--appHoverColor)`}
    background={`var(--appBackground)`}
    hoverBackround={`var(--appHoverBackground)`}
    border={`var(--appBorder)`}
  />
});

export default DefaultAppDownloadButton;