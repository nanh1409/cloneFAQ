import { Container, Grid, useMediaQuery, useTheme } from '@mui/material'
import classNames from "classnames"
import Image from 'next/image'
import { useRouter } from "next/router"
import { Fragment, useMemo } from "react"
import { useSelector } from '../../app/hooks'
import useAppConfig from "../../hooks/useAppConfig"
import useCompanyInfo from "../../hooks/useCompanyInfo"
import { getRouterLink } from "../../utils/format"
import NextLink from "../NextLink"
import SocialIcon from "./SocialIcon"
import './style.scss'

type SocialItem = { name: string; link: string };

const renderSocialItem = (item: SocialItem) => {
  return <a href={item.link} rel="nofollow noopener" target="_blank">
    <SocialIcon name={item.name} className="social-item-icon" />
  </a>
}

const Footer = () => {
  const { appLogo, dmcaScript } = useSelector((state) => state.appInfos.appInfo);
  const { menu = [], social = [], multiLocales = false, license = '' } = useAppConfig();
  const menuFooter = useCompanyInfo();
  const router = useRouter();
  const _menu = useMemo(() => (
    multiLocales
      ? menu.filter((item) => item.locale === router.locale)
      : menu
  )
    .filter((item) => item.type !== "extra" && !item.dynamic)
    , [router.locale]);
  const _footer = useMemo(() => {
    return menuFooter.filter(({ locale }) => multiLocales ? router.locale === locale : router.defaultLocale === locale);
  }, [router.locale])
  const theme = useTheme();
  const isTabletUI = useMediaQuery(theme.breakpoints.down('lg'));
  const targetLocale = useMemo(() => {
    return multiLocales ? router.locale : router.defaultLocale;
  }, [router.locale, multiLocales, router.defaultLocale])

  return (
    <footer id="colophon">
      <div className="main-footer">
        <Container maxWidth="xl">
          <Grid container spacing={2} textAlign="left" alignItems="center">
            <Grid item xs={12} md={4}>
              <NextLink href="/" locale={targetLocale}>
                <div style={{ width: '100%', height: isTabletUI ? '60px' : '71px', marginBottom: '10px', position: 'relative' }}>
                  {appLogo && <Image
                    layout='fill'
                    objectFit="contain"
                    objectPosition="left"
                    src={appLogo} alt="logo"
                  />}
                </div>
              </NextLink>
              <div dangerouslySetInnerHTML={{ __html: dmcaScript }}></div>
            </Grid>
            <Grid item xs={6} md={4} className="menu">
              <div>
                {_menu.map((item, index) => (
                  <div key={index} className="menu-item"><NextLink href={getRouterLink(item.slug)}>{item.name}</NextLink></div>
                ))}
              </div>
            </Grid>
            <Grid item xs={6} md={4} className="menu">
              <div>
                {_footer.map((item, index) => (
                  <div key={index} className="menu-item"><NextLink href={getRouterLink(item.slug)}>{item.name}</NextLink></div>
                ))}
              </div>
            </Grid>
          </Grid>
        </Container>
      </div>
      <div className="footer-below">
        <Container maxWidth="xl" classes={{ root: classNames("footer-below-wrap", isTabletUI ? "tablet" : "") }}>
          <div className="license" dangerouslySetInnerHTML={{__html: license}} />
          <div className={classNames("social-main-panel", isTabletUI ? "tablet" : "")}>
            <div className="social-label">Connect with us</div>
            <div className="social-link-icons">
              {(social as Array<SocialItem>).map((item) => {
                return <Fragment key={item.name}>
                  {renderSocialItem(item)}
                </Fragment>
              })}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}

export default Footer