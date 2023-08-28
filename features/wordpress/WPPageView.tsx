import { Breadcrumbs, Container } from "@mui/material";
import { PropsWithoutRef, useMemo } from "react";
import RawLink from "../../components/RawLink";
import { getPurifiedContent } from "../../utils/format";
import { getWPLink, WPPage } from "./wordpress.model";
import "./wp.scss";

const WPPageView = (props: PropsWithoutRef<{
  page: WPPage;
}>) => {
  const { page } = props;
  const pageTitle = useMemo(() => getPurifiedContent(page.title.rendered), [page]);
  return <Container maxWidth="xl" id="wp-page-view">
    <Breadcrumbs separator="-" className="site-breadcrumbs">
      <RawLink href="/">Home</RawLink>
      <RawLink href={getWPLink(page.link)}><span dangerouslySetInnerHTML={{ __html: pageTitle }} /></RawLink>
    </Breadcrumbs>

    <h1 className="page-title" dangerouslySetInnerHTML={{ __html: pageTitle }} />
    <div className="page-content" dangerouslySetInnerHTML={{ __html: getPurifiedContent(page.content.rendered) }} />
  </Container>
}

export default WPPageView;