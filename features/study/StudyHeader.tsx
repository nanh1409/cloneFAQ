import AccountCircleTwoTone from "@mui/icons-material/AccountCircleTwoTone";
import Circle from "@mui/icons-material/Circle";
import Close from "@mui/icons-material/Close";
import { AppBar, Box, Container, Divider, Drawer, Grid, IconButton, Paper, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { useRouter } from "next/router";
import { KeyboardEvent, MouseEvent, useMemo } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_DEACTIVE_USER, ROUTER_GET_PRO, ROUTER_MY_LEARNING, ROUTER_PROFILE, ROUTER_STUDY_PLAN } from "../../app/router";
import BadgeCont from "../../components/BadgeCont";
import NextLink from "../../components/NextLink";
import RawLink from "../../components/RawLink";
import { LOCALE_SESSION_KEY } from "../../config/MapContraint";
import useAppConfig from "../../hooks/useAppConfig";
import { openUrl } from "../../utils/system";
import { logout } from "../auth/auth.slice";
import AppDownloadButton from "../common/AppDownloadButton";
import UserAvatar from "../common/UserAvatar";
import useUserPaymentInfo from "../get-pro/useUserPaymentInfo";
import MenuBarIcon from "./icons/MenuBarIcon";
import "./StudyHeader.scss";
import { setOpenTabletMenu } from "./studyLayout.slice";


const StudyHeader = (props: { sticky?: boolean }) => {
  const { sticky } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const childApp = useSelector((state) => state.appInfos.childApp);
  const appConfig = useAppConfig();
  const theme = useTheme();
  const isSmallDesktop = useMediaQuery(theme.breakpoints.between("lg", "xl"));
  const isTabletUI = useMediaQuery(theme.breakpoints.down("lg"));
  const token = useSelector((state) => state.authState.token);
  const user = useSelector((state) => state.authState.user);
  const userId = useSelector((state) => state.authState.userId);
  const authLoading = useSelector((state) => state.authState.loading);
  const openTabletMenu = useSelector((state) => state.studyLayoutState.openTabletMenu);
  const accountPayment = useSelector((state) => state.paymentState.accountPayment);
  // const [openTabletMenu, setOpenTabletMenu] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const homeHref = useMemo(() => {
    if (typeof sessionStorage !== "undefined" && appConfig.multiLocales) {
      const locale = sessionStorage.getItem(LOCALE_SESSION_KEY);
      if (router.locales?.includes(locale)) {
        return router.defaultLocale === locale ? "/" : `/${locale}`;
      }
      return "/";
    }
    return "/";
  }, [typeof sessionStorage, appConfig]);

  const locale = useMemo(() => {
    if (typeof sessionStorage !== "undefined") {
      const locale = sessionStorage.getItem(LOCALE_SESSION_KEY);
      if (router.locales?.includes(locale)) {
        return router.defaultLocale === "locale" ? router.defaultLocale : locale;
      }
    }
    return router.defaultLocale;
  }, [typeof sessionStorage, appConfig.multiLocales]);

  const trans = useMemo(() => {
    let updateEmailNote = "We can't reach you at the email address on your account. Update it to keep your account secure.";
    if (locale === "vi") {
      updateEmailNote = "Chúng tôi không thể liên lạc với bạn theo địa chỉ email trên tài khoản của bạn. Cập nhật địa chỉ email để giữ an toàn cho tài khoản của bạn."
    }
    return {
      updateEmailNote
    }
  }, [locale]);

  const { isProAcc } = useUserPaymentInfo();

  const handleClickLogin = () => {
    const { pathname, search, hash } = window.location;
    const redirectURI = `${pathname}${search}${hash}`;
    openUrl(`/login?redirect_uri=${encodeURIComponent(redirectURI)}`);
  }

  const handleGoToMyLearning = () => {
    openUrl(`/${ROUTER_MY_LEARNING}`);
  }

  const handleGoToDeactiveUser = () => {
    openUrl(`/${ROUTER_DEACTIVE_USER}`);
  }

  const handleLogout = () => {
    dispatch(logout({ token }));
    if (session) {
      signOut({ redirect: false })
        .finally(() => {
          router.reload();
        });
    } else {
      setTimeout(() => {
        router.reload();
      }, 300);
    }
  }

  const handleClickStudyPlan = () => {
    dispatch(setOpenTabletMenu(false));
    if (router.asPath.startsWith(`/${ROUTER_STUDY_PLAN}`)) {
      return;
    } else {
      openUrl(`/${ROUTER_STUDY_PLAN}${!!childApp ? `?app=${childApp.appName}` : ""}`);
    }
  }

  const handleGoToProfile = () => {
    dispatch(setOpenTabletMenu(false));
    openUrl(`/${ROUTER_PROFILE}`);
  }

  const handleGoToGetPro = () => {
    dispatch(setOpenTabletMenu(false));
    openUrl(`/${ROUTER_GET_PRO}`);
  }

  const toggleDrawer = (open: boolean) => (evt: KeyboardEvent | MouseEvent) => {
    if (evt.type === "keydown" && ((evt as KeyboardEvent).key === "Tab" || (evt as KeyboardEvent).key === "Shift")) return;
    dispatch(setOpenTabletMenu(open));
  }

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <AppBar position={sticky ? "fixed" : "static"} color="inherit" elevation={isTabletUI ? 1 : 0}>
        <Container maxWidth="xl_game" className={classNames("app-bar-container", isTabletUI ? "tablet" : "")}>
          <Grid container spacing={1} alignItems="center">
            <Grid item xs={3} className={classNames(
              "app-bar-header-left",
              isSmallDesktop ? "small-desktop" : "",
              isTabletUI ? "tablet" : ""
            )}>
              {/* LOGO */}
              <div className={classNames("site-identity", isTabletUI ? "tablet" : "")}>
                <RawLink href={homeHref} suppressHydrationWarning>
                  {/* <div style={{ width: "100%", height: isTabletUI ? "40px" : "71px", position: 'relative', display: "flex", alignItems: "center" }}> */}
                  {appInfo?.appLogo
                    && <Image
                      layout="fill"
                      objectFit="contain"
                      objectPosition="left"
                      src={appInfo.appLogo}
                      alt="logo" />}
                  {/* </div> */}
                </RawLink>
              </div>
            </Grid>

            <Grid item xs={6} className={classNames("app-bar-header-mid")}>
              <div className={classNames("app-buttons", isTabletUI ? "hide-on-mobile" : "")}>
                {/* CH Play & AppStore */}
                <AppDownloadButton
                  source="chplay"
                  link={appInfo?.linkGooglePlay}
                  linkStyle={{ marginRight: "30px" }}
                  color="#000000"
                  hoverColor="#ffffff"
                  background="#F2F3F7"
                  hoverBackround="#2C3546"
                />
                <AppDownloadButton
                  source="appstore"
                  link={appInfo?.linkAppStore}
                  color="#000000"
                  hoverColor="#ffffff"
                  background="#F2F3F7"
                  hoverBackround="#2C3546"
                />
              </div>
            </Grid>

            <Grid item xs={3} className={classNames(
              "app-bar-header-right",
              isSmallDesktop ? "small-desktop" : "",
              isTabletUI ? "tablet" : ""
            )}>
              {/* Menu: HOME & BLOG */}
              <div className={classNames("desktop-menu", isTabletUI ? "hide-on-mobile" : "")} >
                <div className="desktop-menu-link plain-anchor-tag"><NextLink href="/">Home</NextLink></div>
                {!["ielts", "toeic"].includes(appConfig.appName) && <div className="desktop-menu-link plain-anchor-tag" onClick={handleClickStudyPlan}>Study Plan</div>}
                {appInfo?.usingGetPro && !isProAcc && <div className="desktop-menu-link plain-anchor-tag" onClick={handleGoToGetPro}>Get Pro</div>}
                {authLoading
                  ? <></>
                  : (!!user
                    ? <>
                      <div className="desktop-user-wrap">
                        <BadgeCont variant="dot" color="warning" hidden={!!user.email}>
                          <UserAvatar className="user-avatar-desktop" url={user.avatar} size={34} pro={isProAcc}>
                            <Paper className="user-avatar-menu" elevation={1}>
                              <Box display="flex" alignItems="center" p="8px">
                                <AccountCircleTwoTone />
                                <span style={{ marginLeft: "10px" }}>{user.name}</span>
                              </Box>
                              <Divider />
                              <div className="user-avatar-menu-item" onClick={handleGoToProfile}>
                                View Profile
                                {!user.email &&
                                  <>
                                    <Circle className="user-avatar-menu-dot-note" />
                                    <div className="user-avatar-menu-item-note">{trans.updateEmailNote}</div>
                                  </>
                                }
                              </div>
                              <div className="user-avatar-menu-item" onClick={handleGoToMyLearning}>My Learning</div>
                              <div className="user-avatar-menu-item" onClick={handleGoToDeactiveUser}>Delete Account</div>
                              <div className="user-avatar-menu-item" onClick={handleLogout}>Logout</div>
                            </Paper>
                          </UserAvatar>
                        </BadgeCont>
                      </div>
                    </>
                    : <>
                      <div className="desktop-menu-link plain-anchor-tag"
                        onClick={handleClickLogin}
                      >Login</div>
                    </>)}
              </div>

              <div className={classNames("tablet-nav", isTabletUI ? "" : "hide-on-desktop")}>
                <div className="tablet-nav-icon" onClick={toggleDrawer(true)}>
                  <BadgeCont variant="dot" color="warning" hidden={!user || !!user.email}>
                    <MenuBarIcon />
                  </BadgeCont>
                </div>
                <Drawer
                  anchor="left"
                  open={openTabletMenu}
                  onClose={toggleDrawer(false)}
                  PaperProps={{
                    className: "tablet-drawer-wrap"
                  }}
                >
                  <div className="tablet-close-button">
                    <IconButton onClick={toggleDrawer(false)}><Close /></IconButton>
                  </div>
                  {!!user && <div className="tablet-user-info">
                    <UserAvatar url={user.avatar} size={34} pro={isProAcc} />
                    <div className="tablet-user-info-name">{user.name}</div>
                  </div>}
                  <div className={classNames("tablet-menu-link", !user ? "logged-out" : "")}><NextLink href="/">Home</NextLink></div>
                  <div className="tablet-menu-link" onClick={handleClickStudyPlan}>Study Plan</div>
                  {!!user && <div className="tablet-menu-link" onClick={handleGoToProfile}>
                    View Profile
                    {!user.email &&
                      <>
                        <Circle className="user-avatar-menu-dot-note" />
                        <div className="user-avatar-menu-item-note">{trans.updateEmailNote}</div>
                      </>
                    }
                  </div>}
                  {!!user && <div className="tablet-menu-link" onClick={handleGoToMyLearning}>My Learning</div>}
                  {!!user && <div className="tablet-menu-link" onClick={handleLogout}>Logout</div>}
                  {!!user && <div className="tablet-menu-link" onClick={handleGoToDeactiveUser}>Delete Account</div>}
                  {!user && <div className="tablet-menu-link" onClick={handleClickLogin}>Login</div>}
                  {/* <div className="tablet-menu-link plain-anchor-tag"><Link href="/blog">Blog</Link></div> */}
                  <div className="tablet-app-download">
                    <AppDownloadButton source="chplay" link={appInfo?.linkGooglePlay} border="#1d1d1d" hoverBorder="#1d1d1d" />
                  </div>
                  <div className="tablet-app-download">
                    <AppDownloadButton source="appstore" link={appInfo?.linkAppStore} border="#1d1d1d" hoverBorder="#1d1d1d" />
                  </div>
                </Drawer>
              </div>
            </Grid>
          </Grid>
        </Container>
      </AppBar>
    </div >);
}

export default StudyHeader;