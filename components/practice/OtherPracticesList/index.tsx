import ChevronRight from "@mui/icons-material/ChevronRight";
import { useRouter } from "next/router";
import { Fragment, memo, PropsWithoutRef, useCallback } from "react";
import { ROUTER_PRACTICE, ROUTER_PRACTICE_SW } from "../../../app/router";
import useAppConfig from "../../../hooks/useAppConfig";
import usePracticeData from "../../../hooks/usePracticeData";
import { MapLocaleString, MapSlugData } from "../../../types/appPracticeTypes";
import NextLink from "../../NextLink";
import "./otherPracticesList.scss";

const OtherPracticeListItem = memo((props: PropsWithoutRef<MapSlugData[string]
  & { baseSlug?: string; slug: string; locale?: string; multiLocales?: boolean; parentName?: string | MapLocaleString; }>
) => {
  const {
    baseSlug = '',
    slug,
    name: _name,
    fullName: _fullName,
    locale,
    multiLocales,
    parentName: _parentName
  } = props;
  const href = `${baseSlug ? `/${baseSlug}` : ''}/${slug}`;
  const name = multiLocales ? (((_name as MapLocaleString) ?? {})[locale] ?? "") : _name as string;
  const fullName = multiLocales ? (((_fullName as MapLocaleString) ?? {})[locale] ?? "") : _fullName as string;
  const parentName = multiLocales ? ((_parentName as MapLocaleString ?? {})[locale] ?? "") : _parentName as string;
  return <NextLink key={slug} href={href} locale={locale}>
    <div key={slug} className="list-item">
      <div className="list-item-name">{`${parentName ? `${parentName}: ` : ""}${name}${fullName ? `: ${fullName}` : ""}`}</div>
      <div className="list-item-icon">
        <ChevronRight color="inherit" fontSize="small" />
      </div>
    </div>
  </NextLink>
});

const OtherPracticesList = memo((props: PropsWithoutRef<{
  baseSlug?: string;
}>) => {
  const { baseSlug = '' } = props;
  const appConfig = useAppConfig();
  const { mapSlugData = {} } = usePracticeData();
  const router = useRouter();
  
  let filterMapSlug = Object.entries(mapSlugData);
  if(appConfig.appName === 'toeic') {
    if(baseSlug === ROUTER_PRACTICE_SW) {
      filterMapSlug = filterMapSlug.filter(([slug, data]) => {
        return ['speaking', 'writing'].includes(data.tag)
      })
    } else if(baseSlug === ROUTER_PRACTICE) { 
      filterMapSlug = filterMapSlug.filter(([slug, data]) => {
        return ['listening', 'reading'].includes(data.tag)
      })
    }
  }

  return <div id="other-practices-list">
    <div className="title">Other Practices</div>
    <div className="list">
      {filterMapSlug.map(([slug, data]) => {
        return <Fragment key={slug}>
          {!data.children
            ? <OtherPracticeListItem
              slug={slug} baseSlug={baseSlug} locale={router.locale} {...data} multiLocales={appConfig.multiLocales}
            />
            : <>{Object.entries(data.children).map(([cSlug, cData]) =>
              <OtherPracticeListItem
                key={cSlug}
                slug={cSlug} baseSlug={baseSlug} locale={router.locale} {...cData} multiLocales={appConfig.multiLocales}
                parentName={data.name}
              />
            )}</>
          }
        </Fragment>
      })}
    </div>
  </div>
})

export default OtherPracticesList;