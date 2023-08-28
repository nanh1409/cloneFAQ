import CircleIcon from "@mui/icons-material/Circle";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Container, Divider, Drawer, IconButton, InputBase, List, ListItem, Menu, MenuItem, Paper, Select, Theme, Typography } from "@mui/material";
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { SxProps } from "@mui/system";
import classNames from "classnames";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithoutRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_DEACTIVE_USER, ROUTER_GET_PRO, ROUTER_LOGIN, ROUTER_MY_LEARNING, ROUTER_PRACTICE, ROUTER_PROFILE, ROUTER_STUDY, ROUTER_TEST } from "../../app/router";
import { LOCALE_SESSION_KEY } from "../../config/MapContraint";
import { logout } from "../../features/auth/auth.slice";
import { setCurrentBlogPostCategoryLink, setUseDynamicNav } from "../../features/common/layout.slice";
import UserAvatar from "../../features/common/UserAvatar";
import { loadUserSubscriptionByApp } from "../../features/get-pro/payment.slice";
import useAppConfig from "../../hooks/useAppConfig";
import { openUrl } from "../../utils/system";
import BadgeCont from "../BadgeCont";
import NextLink from "../NextLink";
import GlobalLangIcon from "./GlobalLangIcon";
import localeInfo from "./locale-info.json";
import NavItemLink from "./NavItemLink";
import "./style.scss";

const NAV_STICKY_CLASS = "nav-sticky";

const desktopMenuItemStyle: SxProps<Theme> = {
  my: 2, display: 'block', textAlign: 'left', padding: '0', fontWeight: 700, flex: "0 0 auto", cursor: "pointer",
  "&:hover": {
    color: 'var(--menuHoverColor)'
  }
}

const Navigation = (props: PropsWithoutRef<{ disableAuth?: boolean, enableSearch: boolean }>) => {
  const data = useAppConfig();
  const { menu = [], multiLocales } = data;
  const { enableSearch } = props
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));
  const { user, token, loading: authLoading, userId } = useSelector((state) => state.authState);
  const accountPayment = useSelector((state) => state.paymentState.accountPayment);
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const useDynamicNav = useSelector((state) => state.layoutState.useDynamicNav);
  const currentBlogPostCategoryLink = useSelector((state) => state.layoutState.currentBlogPostCategoryLink);
  const dispatch = useDispatch();
  const router = useRouter();
  const { data: session } = useSession();
  const defaultSearchValue = useMemo(() => router.pathname === "/search" ? router.query.q as string : "", [router.pathname, router.query?.q]);

  const _menu = useMemo(() =>
    (multiLocales ? menu.filter((item) => item.locale === router.locale) : menu)
      .filter((item) => useDynamicNav ? true : !item.dynamic),
    [router.locale, useDynamicNav]
  );
  const searchPlaceholder = useMemo(() => {
    if (!multiLocales) return "Search";
    if (router.locale === "vi") return "Tìm kiếm";
    return "Search";
  }, [router.locale])
  const [anchorElNav, setAnchorElNav] = useState(false);
  const [search, setSearch] = useState("");
  const [lang, setLang] = useState(router.locale);
  const [openSelectLang, setOpenSelectLang] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const langRef = useRef<HTMLDivElement | null>(null);

  const trans = useMemo(() => {
    let updateEmailNote = "We can't reach you at the email address on your account. Update it to keep your account secure.";
    if (router.locale === "vi") {
      updateEmailNote = "Chúng tôi không thể liên lạc với bạn theo địa chỉ email trên tài khoản của bạn. Cập nhật địa chỉ email để giữ an toàn cho tài khoản của bạn."
    }
    return {
      updateEmailNote
    }
  }, [router.locale]);

  const isProAcc = useMemo(() => !!user && userId === accountPayment?.userId && !accountPayment?.isExpired, [accountPayment?.userId, userId, !!user, accountPayment?.isExpired])

  useEffect(() => {
    const navScroll = (_: Event) => {
      if (window.scrollY > 130) {
        if (navRef.current) {
          navRef.current.classList.add(NAV_STICKY_CLASS);
        }
      } else {
        if (navRef.current) {
          navRef.current.classList.remove(NAV_STICKY_CLASS);
        }
      }
    }
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", navScroll);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", navScroll);
      }
      dispatch(setUseDynamicNav(false));
    }
  }, []);

  useEffect(() => {
    setLang(router.locale);
    sessionStorage.setItem(LOCALE_SESSION_KEY, router.locale);
  }, [router.locale]);

  useEffect(() => {
    if ([
      ROUTER_STUDY,
      ROUTER_PRACTICE,
      ROUTER_TEST,
      ROUTER_PROFILE
    ].some((slug) => router.asPath.startsWith(`/${slug}`))) return;
    if (!!user && !props.disableAuth && !authLoading && accountPayment?.userId !== userId) {
      dispatch(loadUserSubscriptionByApp({ token, appName: data.appName }))
    }
  }, [props.disableAuth, accountPayment?.userId, authLoading])

  const handleClickLogin = () => {
    const { pathname, search, hash } = window.location;
    let currentURI = pathname;
    if (currentURI?.includes(`${ROUTER_LOGIN}`)) return;
    const redirectURI = `${currentURI}${search}${hash}`;
    router.push(`/${ROUTER_LOGIN}?redirect_uri=${encodeURIComponent(redirectURI)}`, undefined, { locale: router.locale });
  }

  const handleSearch = () => {
    const content = search.trim();
    const searchString = content ? encodeURIComponent(content).replace(/%20/g, '+') : '';
    // Wordpress Search Blog
    router.push({ pathname: "/search", query: { q: searchString } });
    // openUrl(`/search?q=${searchString}`);
  }

  const handleLogout = () => {
    dispatch(logout({ token }));
    // window.location.replace('/');
    // router.replace("/")
    if (session) {
      signOut({ redirect: false })
        .finally(() => {
          router.reload();
        })
    } else {
      setTimeout(() => {
        router.reload();
      }, 300);
    }
  }

  const handleChangeLang = (locale: string) => {
    setOpenSelectLang(false);
    setAnchorElNav(false);
    // window.location.href = `/${locale}${router.asPath}`;
    if (currentBlogPostCategoryLink) {
      dispatch(setCurrentBlogPostCategoryLink(""));
      openUrl(`${locale === router.defaultLocale ? "" : `/${locale}`}${currentBlogPostCategoryLink}`);
      return;
    }
    router.push(router.asPath, undefined, { locale });
  }

  const handleGoToProfile = () => {
    setAnchorElNav(false);
    router.push(`/${ROUTER_PROFILE}`);
  }

  const handleGoToMyLearning = () => {
    setAnchorElNav(false);
    router.push(`/${ROUTER_MY_LEARNING}`);
  }

  const handleGoToDeactiveUser = () => {
    setAnchorElNav(false);
    router.push(`/${ROUTER_DEACTIVE_USER}`);
  }

  const loginText = router.locale === "en" ? "Login" : router.locale === "vi" ? "Đăng nhập" : '';

  const renderButtonGetPro = useCallback(() => {
    return appInfo?.usingGetPro && !isProAcc && <div className="btn-get-pro">
      <NextLink href={`/${ROUTER_GET_PRO}`} passHref>
        <img src="/images/get-pro/btn-get-pro.png" alt="btn-get-pro" height="26" width="auto" />
      </NextLink>
    </div>
  }, [appInfo?.usingGetPro, isProAcc])

  return (
    <div id="web-nav" ref={navRef}>
      <Container maxWidth="xl" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", paddingLeft: 10, paddingRight: 10 }} >
        {isTabletUI &&
          <Box display="flex" alignItems="center">
            <IconButton size="large" aria-controls="menu-appbar" aria-haspopup="true" sx={{ color: "#fff" }}
              onClick={() => setAnchorElNav(true)}
            >
              <BadgeCont variant="dot" color="default" classes={{ dot: "menu-appbar-not" }} sx={{ "& .menu-appbar-not": { bgcolor: "red" } }}
                hidden={!user || !!user.email}
              >
                <MenuIcon />
              </BadgeCont>
            </IconButton>
            {renderButtonGetPro()}
            <Drawer
              anchor="left"
              open={anchorElNav}
              onClose={() => setAnchorElNav(false)}
              PaperProps={{ id: "mobile-nav" }}
            >
              <Box
                sx={{ width: 310 }}
                role="presentation"
                position="relative"
              >
                <div className="collapse-icon-wrap">
                  <IconButton onClick={() => setAnchorElNav(false)}><CloseIcon fontSize="small" style={{ fill: 'var(--menuTextColor)' }} /></IconButton>
                </div>
                <List className="list-menu-tablet">
                  {_menu.map((item, index) => {
                    return (
                      <ListItem key={index} className="list-menu-tablet-item">
                        <NavItemLink {...item} type="toggle" onClickCallback={() => setAnchorElNav(false)} />
                      </ListItem>
                    )
                  })}
                  {(props.disableAuth || authLoading)
                    ? <></>
                    : <>
                      <Divider sx={{ borderColor: 'var(--menuTextColor)' }} />
                      {!user
                        ? <ListItem onClick={() => setAnchorElNav(false)}>
                          <Typography textAlign="center" sx={{ color: 'var(--menuTextColor)' }} component="div" onClick={handleClickLogin}>Login</Typography>
                        </ListItem>
                        : <>
                          <ListItem onClick={() => setAnchorElNav(false)}>
                            <UserAvatar pro={isProAcc} url={user.avatar} size={24} sx={{ color: "var(--menuTextColor)" }} />
                            <span style={{ marginLeft: "8px" }}>{user.name}</span>
                          </ListItem>
                          <ListItem>
                            <span onClick={() => handleGoToProfile()}>
                              View Profile
                              {!user.email &&
                                <>
                                  <CircleIcon className="user-avatar-menu-dot-note" />
                                  <div className="user-avatar-menu-item-note">{trans.updateEmailNote}</div>
                                </>
                              }
                            </span>
                          </ListItem>
                          {data.userLearningFeature && <ListItem onClick={() => setAnchorElNav(false)}>
                            <span style={{ cursor: "pointer" }} onClick={() => handleGoToMyLearning()}>My Learning</span>
                          </ListItem>}
                          <ListItem onClick={() => setAnchorElNav(false)}>
                            <span style={{ cursor: "pointer" }} onClick={() => handleGoToDeactiveUser()}>Delete Acount</span>
                          </ListItem>
                          <ListItem onClick={() => setAnchorElNav(false)}>
                            <span style={{ cursor: "pointer" }} onClick={() => handleLogout()}>Logout</span>
                          </ListItem>
                        </>}
                    </>
                  }
                  {multiLocales && <>
                    <Divider sx={{ borderColor: 'var(--menuTextColor)' }} />
                    <div className="select-lang-tablet">
                      <div className="select-lang-tablet-label-wrap">
                        <GlobalLangIcon pathClassName="lang-icon-path" />
                        <label className="select-lang-label" htmlFor="select-lang-tablet-options">{localeInfo[router.locale]?.selectLabel}</label>
                      </div>
                      <Select
                        id="select-lang-tablet-options"
                        value={lang}
                        onChange={(evt) => handleChangeLang(evt.target.value)}
                        sx={{ color: 'var(--menuTextColor)', borderRadius: "50px", "& fieldset": { borderColor: `var(--menuTextColor) !important` }, "& svg": { color: 'var(--menuTextColor)' } }}
                        MenuProps={{ id: "nav-select-lang-tablet" }}
                        IconComponent={(props) => <ExpandMoreIcon {...props} />}
                      >
                        {router.locales?.map((locale) =>
                          <MenuItem className="lang-item" key={locale} value={locale}>
                            <img className="lang-item-flag" alt={lang} src={`/images/flag-icons/${locale}.svg`} width="20" height="20" />
                            <div className="lang-item-label">{localeInfo[locale]?.label ?? ''}</div>
                          </MenuItem>
                        )}
                      </Select>
                    </div>
                  </>}
                </List>
              </Box>
            </Drawer>
          </Box>
        }
        {!isTabletUI &&
          <Box className="main-menu" sx={{ height: "60px" }}>
            <div className="main-menu-wrap">
              {_menu.map((item, index) => {
                return (<div className="menu-item-desktop-wrap" key={index}>
                  <NavItemLink {...item} type="nav" />
                </div>)
              })}
              {renderButtonGetPro()}
              {props.disableAuth || authLoading
                ? <></>
                : <>
                  {!user
                    ? <Box
                      className="main-menu-item-desktop"
                      onClick={() => {
                        handleClickLogin();
                        setAnchorElNav(false);
                      }}
                      sx={desktopMenuItemStyle}
                    >
                      {loginText}
                    </Box>
                    : <BadgeCont variant="dot" color="warning" hidden={!!user.email}
                      classes={{ dot: "user-avatar-note-icon" }}
                      sx={{ "& .user-avatar-note-icon": { bgcolor: "red", top: 2, right: 2, width: 10, height: 10, borderRadius: "100%" } }}
                    >
                      <UserAvatar pro={isProAcc} url={user.avatar} size={30} sx={{ color: "#fff", cursor: "pointer" }} className="user-avatar-desktop">
                        <Paper className="user-avatar-menu" elevation={1}>
                          <div className="user-avatar-menu-info username">
                            <UserAvatar pro={isProAcc} url={user.avatar} size={30} />
                            {user.name}
                          </div>
                          <Divider />
                          <div className="user-avatar-menu-item view-profile" onClick={() => handleGoToProfile()}>
                            View Profile
                            {!user.email && <>
                              <CircleIcon className="user-avatar-menu-dot-note" />
                              <div className="user-avatar-menu-item-note">{trans.updateEmailNote}</div>
                            </>}
                          </div>
                          {data.userLearningFeature && <div className="user-avatar-menu-item my-learning" onClick={() => handleGoToMyLearning()}>My Learning</div>}
                          <div className="user-avatar-menu-item deactive" onClick={() => handleGoToDeactiveUser()}>Delete Account</div>
                          <div className="user-avatar-menu-item logout" onClick={() => handleLogout()}>Logout</div>
                        </Paper>
                      </UserAvatar>
                    </BadgeCont>
                  }
                </>}
            </div>
          </Box>
        }
        <div className="search-and-language-column">
          {multiLocales && !isTabletUI && <>
            <div className="select-lang" ref={langRef} style={{
              border: `1.5px solid var(--borderLangBackground)`, background: `var(--langBackground)`
            }}
              onClick={() => setOpenSelectLang(true)}
            >
              <img alt={lang} src={`/images/flag-icons/${lang}.svg`} width="20" height="20" />
              <ExpandMoreIcon style={{ width: 16 }} htmlColor={'var(--menuTextColor)'} />
            </div>
            <Menu id="nav-select-lang" open={openSelectLang} onClose={() => setOpenSelectLang(false)} anchorEl={langRef.current} autoFocus={false}>
              {router.locales?.map((locale) =>
                <MenuItem
                  key={locale} className={classNames("lang-item", locale === router.locale ? "active" : "")}
                  onClick={() => handleChangeLang(locale)}
                >
                  <img className="lang-item-flag" alt={lang} src={`/images/flag-icons/${locale}.svg`} width="20" height="20" />
                  <div className="lang-item-label">{localeInfo[locale]?.label ?? ''}</div>
                </MenuItem>
              )}
            </Menu>
          </>}
          {enableSearch && <div className="search" style={{ background: 'var(--searchBackground)', borderColor: `var(--menuTextColor)` }}>
            <div className="icon-search" style={{ color: 'var(--menuTextColor, #fff)' }}><SearchIcon onClick={handleSearch} sx={{ cursor: "pointer" }} /></div>
            <InputBase
              placeholder={searchPlaceholder}
              className="search-post"
              style={{ color: 'var(--menuTextColor)' }}
              defaultValue={defaultSearchValue}
              onChange={(e) => {
                e.preventDefault();
                setSearch(e.target.value);
                return false;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>}
        </div>
      </Container>
    </div>
  )
}

export default Navigation