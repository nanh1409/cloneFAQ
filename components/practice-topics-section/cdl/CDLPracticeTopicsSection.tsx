import { Grid, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import { Fragment, memo, useMemo } from "react";
import useCheckState from "../../../hooks/useCheckState";
import usePracticeData from "../../../hooks/usePracticeData";
import Topic from "../../../modules/share/model/topic";
import { MapSlugData } from "../../../types/appPracticeTypes";
import TestItem from "../../test-item";
import "./cdlPracticeTopicsSection.scss";

const CDLPracticeTopicsSection = memo(() => {
  const { mapSlugData = {} } = usePracticeData();

  const data = useMemo(() =>
    Object.entries(mapSlugData).map(([slug, data]) => ({ ...data, slug, name: `CDL ${data.fullName || data.name}` }))
    , [mapSlugData]);

  const chunks: Array<Array<MapSlugData[string] & { slug: string; }>> = useMemo(() => {
    return [data.slice(0, 3), data.slice(3)];
  }, [data]);

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down("sm"));
  const { checkState } = useCheckState();

  return <div className="practice-topics-section cdl">
    {chunks.map((chunk, i) => {
      return <div key={i}>
        <Grid container spacing="30px">
          {chunk.map(({ meta, ...topic }, cI) => {
            return <Fragment key={cI}>
              <Grid item xs={12} sm={4}>
                <div onClick={() => checkState({ practiceSlug: `cdl-${topic.slug}-full-test` })}>
                  <TestItem
                    item={topic as Topic}
                    meta={meta}
                    useShortDesc
                    classes={{
                      root: "cdl-topic",
                      shortDesc: "cdl-topic-short-desc dot-8"
                    }}
                  />
                </div>
              </Grid>
            </Fragment>
          })}
        </Grid>
        {!i && <div className={classNames(
          "practice-introduction",
          isMobileUI ? "mobile" : ""
        )}>
          <Image
            src="/images/app/cdl/bg-practice-intro.png"
            layout="fill"
            className="practice-introduction-image"
          />
          <div className={classNames(
            "practice-introduction-content",
            isMobileUI ? "mobile" : ""
          )}>
            <div className="cta">Doing Multiple Practice Tests</div>
            <div className="cta-content">Promotes More Effective Results For The</div>
            <div className="cta-app-name">CDL EXAM</div>
          </div>
        </div>}
      </div>
    })}
  </div>
})

export default CDLPracticeTopicsSection;