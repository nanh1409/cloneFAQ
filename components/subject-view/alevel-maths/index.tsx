import { Container, Grid, Typography } from "@mui/material";
import { memo, PropsWithoutRef } from "react";
import { useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import useSeoInfo from "../../../features/appInfo/useSeoInfo";
import WebSeo from "../../../modules/share/model/webSeo";
import Introduction from "../../introduction";
import RawLink from "../../RawLink";
import TestItem from "../../test-item";
import "./alevelMathsSubjectView.scss";

const ALevelMathsSubjectView = memo((props: PropsWithoutRef<{
  useMapSeo?: boolean;
  seoInfo?: WebSeo;
}>) => {
  const { useMapSeo, seoInfo } = props;
  const practiceSlugList = useSelector((state) => state.appInfos.practiceSlugList);
  const practiceSlug = useSelector((state) => state.appInfos.practiceSlug);
  const { titleH1, summary } = seoInfo || (useMapSeo ? useSeoInfo() : useSelector((state) => state.appInfos.seoInfo || {} as WebSeo)) || {} as WebSeo;

  return <Container maxWidth="xl">
    <div className="alevel-maths-prep-subject-view">
      <Typography component="h1" className="title-h1">{titleH1 || practiceSlug?.name}</Typography>
      <div className="summary" dangerouslySetInnerHTML={{ __html: summary }} />
      <div className="subject-data-list">
        <Grid container spacing={2}>
          {practiceSlugList.map((subject, i) => {
            const itemSlug = `/${ROUTER_STUDY}/${practiceSlug?.slug}/${subject.slug}`;
            const avatar = practiceSlug?.avatar;
            return <Grid
              key={i}
              item xs={12} sm={6} md={2.4}
            >
              <RawLink href={itemSlug}>
                <TestItem item={{ ...subject, avatar }} />
              </RawLink>
            </Grid>
          })}
        </Grid>
      </div>
    </div>
    <Introduction useMapSeo={useMapSeo} />
  </Container >
});

export default ALevelMathsSubjectView;