import { Container, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import Image from 'next/image';
import { useRouter } from "next/router";
import { ForwardedRef, forwardRef, PropsWithoutRef, useMemo } from "react";
import { useSelector } from "../../app/hooks";
import Navigation from "../../components/navigation";
import NextLink from "../../components/NextLink";
import useAppConfig from "../../hooks/useAppConfig";
import AppSetting from "../../modules/share/model/appSetting";
import AppDownloadButton from "./AppDownloadButton";
import DefaultAppDownloadButton from "./AppDownloadButton/DefaultAppDownloadButton";
import "./Header.scss";

const Header = forwardRef((props: PropsWithoutRef<{ disableAuth?: boolean, enableSearch?: boolean; disableNav?: boolean; homeHref?: string }>, ref: ForwardedRef<HTMLDivElement>) => {
  const { enableSearch, disableNav, homeHref = "/" } = props
  const { appLogo, appName, linkGooglePlay, linkAppStore } = useSelector((state) => state.appInfos.appInfo || {} as AppSetting);
  const appConfig = useAppConfig();
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const router = useRouter();
  const targetLocale = useMemo(() => {
    return appConfig.multiLocales ? router.locale : router.defaultLocale;
  }, [router.locale, appConfig.multiLocales, router.defaultLocale])

  return <header>
    <div className="app-bar-header">
      <Container maxWidth="xl">
        <div className="app-bar-header-nav">
          <NextLink href={homeHref} locale={targetLocale}>
            <div className={classNames("app-main-logo", isTabletUI ? "tablet" : "")}>
              {!!appLogo && <Image
                layout="fill"
                objectFit="contain"
                objectPosition="left"
                src={appLogo} alt="logo"
              />}
            </div>
          </NextLink>

          <div className="app-bar-header-app-buttons">
            <DefaultAppDownloadButton source="chplay" />
            <DefaultAppDownloadButton source="appstore" />
          </div>
        </div>
      </Container>
    </div >
    {!disableNav && <div className="nav-bar-header" ref={ref}>
      <Navigation disableAuth={props.disableAuth} enableSearch = {enableSearch}/>
    </div>}
  </header>
});

export default Header;