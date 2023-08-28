import ExpandMore from "@mui/icons-material/ExpandMore";
import { Box, Paper, Theme, Typography } from "@mui/material";
import { SxProps } from "@mui/system";
import classNames from "classnames";
import _ from "lodash";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { Fragment, MouseEvent, PropsWithChildren, PropsWithoutRef, useMemo } from "react";
import { useSelector } from "../../app/hooks";
import { ROUTER_PRACTICE, ROUTER_STUDY_PLAN } from "../../app/router";
import ScrollContainer from "../../features/common/ScrollContainer";
import useAppConfig, { AppMenu } from "../../hooks/useAppConfig";
import useCheckState from "../../hooks/useCheckState";
import usePracticeData from "../../hooks/usePracticeData";
import NextLink from "../NextLink";
import RawLink from "../RawLink";
import MobileMegaNav from "./MobileMegaNav";


const desktopMenuItemStyle: SxProps<Theme> = {
  my: 2, display: 'block', textAlign: 'left', padding: '0', fontWeight: 700, color: 'var(--menuTextColor)', flex: "0 0 auto", cursor: "pointer",
  "&:hover": {
    color: 'var(--menuHoverColor)'
  }
}

const NavItemLink = (props: PropsWithoutRef<AppMenu & {
  onClickCallback?: () => void;
  type: "nav" | "toggle"
}>) => {
  const { type, onClickFunction, onClickCallback, ...item } = props;
  const {
    name,
    slug,
    childs
  } = item;

  const hasChild = useMemo(() => !!childs?.length, [childs?.length]);
  const totalChilds = useMemo(() => childs?.length ?? 0, [childs?.length]);
  const { checkState, currentState } = useCheckState();
  const childApp = useSelector((state) => state.appInfos.childApp);
  const { appName = "" } = useAppConfig();
  const router = useRouter();
  const { mapSlugData = {} } = usePracticeData();
  const { functionLink, hiddenLink } = useMemo(() => {
    let _slug = slug;
    let hidden = false;
    if (onClickFunction === "cdl-manual-book") {
      _slug = currentState ? `/${currentState?.slug}/${currentState?.slug}-cdl-manual-book` : '';
      hidden = !currentState;
    } else if (onClickFunction === "dmv-manual-book") {
      _slug = currentState ? `/${currentState?.slug}/${currentState?.slug}-${childApp?.appName}-manual-book` : '';
      hidden = !currentState
    } else if (onClickFunction === "study-plan") {
      _slug = "";
      hidden = !currentState
    };
    return {
      functionLink: _slug,
      hiddenLink: hidden
    };
  }, [onClickFunction, slug, currentState?.slug, childApp]);

  const activeClass = useMemo(() => {
    const { locale, defaultLocale, asPath } = router;
    const _slug = slug === '/' ? slug : `${slug}/`;
    const routePath = `${locale === defaultLocale ? "" : `/${locale}`}${asPath}`;
    const homePath = `/${locale === defaultLocale ? "" : `${locale}/`}`;

    if (_slug === homePath && routePath === _slug) return "active";
    else if (_slug !== homePath) {
      if (routePath.startsWith(_slug)) {
        if (appName === "toeic") {
          if (_slug === `/${ROUTER_PRACTICE}/` && [`/${ROUTER_PRACTICE}/grammar/`, `/${ROUTER_PRACTICE}/vocabulary/`].includes(routePath)) return "";
          else if (_slug === `/${locale}/${ROUTER_PRACTICE}/` && [`/${locale}/${ROUTER_PRACTICE}/grammar/`, `/${locale}/${ROUTER_PRACTICE}/vocabulary/`].includes(routePath)) return "";
        }
        return "active";
      }
      else if (hasChild && _.some(childs, child => routePath.startsWith(`${child.slug}/`))) return "active";
      else if (_slug === "/#practice" && _.some(_.keys(mapSlugData), (key) => routePath.includes(key))) return "active";
    };
    return "";
  }, [slug]);

  const handleClickFunction = (evt: MouseEvent<HTMLAnchorElement> | MouseEvent<HTMLSpanElement>) => {
    evt.preventDefault();
    if (onClickFunction === "select-state") {
      checkState({
        practiceSlug: `${currentState?.slug}-full-test`,
        onClickSamePath: () => {
          router.push({ hash: `${currentState?.slug}-full-test` }, undefined, { shallow: true });
        }
      });
    } else if (onClickFunction === "scroll") {
      const id = item.slug?.startsWith("#") ? (item.slug?.slice(1) ?? '') : '';
      if (!id) return;
      const element = document.getElementById(id);
      if (element) {
        router.push({ hash: item.slug }, undefined, { shallow: true });
      } else {
        router.push(`/${item.slug}`);
        // openUrl(`/${item.slug}`);

        // router.push({ pathname: "/", hash: item.slug });
      }
    } else if (onClickFunction === "cdl-manual-book") {
      if (currentState) {
        const url = `/${currentState.slug}/${currentState.slug}-cdl-manual-book`;
        // openUrl(url);
        router.push(url);
        // router.push({ pathname: url });
      }
    } else if (onClickFunction === "dmv-manual-book") {
      if (currentState && childApp) {
        const url = `/${currentState?.slug}/${currentState?.slug}-${childApp?.appName}-manual-book`;
        // openUrl(url);
        router.push(url);
        // router.push({ pathname: url });
      }
    } else if (onClickFunction === "study-plan") {
      if (childApp) {
        const url = `/${ROUTER_STUDY_PLAN}/?app=${childApp.appName}`;
        // openUrl(url);
        router.push(url);
      }
    }
    if (typeof onClickCallback !== "undefined") onClickCallback();
  }

  const linkWrap = ({ slug, children }: PropsWithChildren<{ slug: string; }>) => {
    return slug.startsWith("/#") ? <NextLink href={slug} scroll onClick={onClickCallback}>{children}</NextLink> : <NextLink onClick={onClickCallback} href={slug}>{children}</NextLink>
  }

  const renderChildItemDesktop = (cI: AppMenu, last = false) => {
    return <NextLink href={cI.slug}>
      <div className={classNames("sub-menu-desktop-title", last ? "last" : "")}>
        {cI.newFeature && <Image src="/images/icon/sub-menu-new.png" width="30" height="30" className="sub-menu-new-icon" alt="sub-menu-new-icon" />}
        {cI.name}
      </div>
    </NextLink>
  }

  return type === "nav"
    // Desktop
    ? (!!onClickFunction
      ? <><Box className={classNames("main-menu-item-desktop", hiddenLink ? "hidden" : "")} sx={desktopMenuItemStyle}>
        {!!functionLink
          ? <RawLink
            href={functionLink}
            className="menu-item-desktop-title"
            onClick={handleClickFunction}>
            <span>{name}</span>
          </RawLink>
          : <span onClick={handleClickFunction} className="menu-item-desktop-title">{name}</span>}
      </Box></>
      : <><Box className={classNames("main-menu-item-desktop", hiddenLink ? "hidden" : "")} sx={desktopMenuItemStyle}>
        {linkWrap({
          slug, children: <div className={classNames("menu-item-desktop-title", activeClass)}>
            <span>{name}</span>
            {hasChild && <ExpandMore />}
          </div>
        })}
      </Box>
        {hasChild && <Paper className="sub-menu-desktop" elevation={1}>
          {totalChilds > 9
            ? <><ScrollContainer thumbSize={50} style={{ height: 513 }} className="sub-menu-desktop-scroll-container" disableOverflowX>
              {childs.map((childItem, i) => {
                return <Fragment key={i}>
                  {renderChildItemDesktop(childItem, i === childs.length - 1)}
                </Fragment>
                // const isLast = i === childs.length - 1;
                // return <NextLink href={childItem.slug} key={i}><div className={classNames("sub-menu-desktop-title", isLast ? "last" : "")}>{childItem.name}</div></NextLink>
              })}
            </ScrollContainer></>
            : <>{childs.map((childItem, i) => {
              return <Fragment key={i}>
                {renderChildItemDesktop(childItem, i === childs.length - 1)}
              </Fragment>
              // const isLast = i === childs.length - 1;
              // return <NextLink href={childItem.slug} key={i}><div className={classNames("sub-menu-desktop-title", isLast ? "last" : "")}>{childItem.name}</div></NextLink>
            })}</>
          }
        </Paper>}
      </>)
    // Mobile
    : (<div className={classNames("toggle-menu-item", hiddenLink && "hidden")}>
      {hasChild ?
        <MobileMegaNav item={item} onClickCallback={onClickCallback} />
        : <Typography textAlign="center">
          <Box onClick={(evt: MouseEvent<HTMLSpanElement>) => {
            if (!!onClickFunction) {
              handleClickFunction(evt);
            }
          }} component="span" color={`var(--menuTextColor)`}>
            {!!onClickFunction
              ? item.name
              : <>{linkWrap({ slug: item.slug, children: item.name })}</>
            }
          </Box>
        </Typography>
      }
    </div>);
}

export default NavItemLink;