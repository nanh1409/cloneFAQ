import { Button } from "@mui/material";
import classNames from "classnames";
import Image from "next/image";
import { useRouter } from "next/router";
import { PropsWithoutRef } from "react";
import NextLink from "../../../NextLink";
import "./testItem.scss";

export type TestItemPanelProps = {
  title: string;
  description?: string;
  slug?: string;
  bgImage?: string;
  classes?: {
    title?: string;
    description?: string;
    joinButtonWrap?: string;
    joinButton?: string;
  }
}

const TestItemPanel = (props: PropsWithoutRef<TestItemPanelProps>) => {
  const { title, description = '', slug = '', bgImage, classes = {
    title: '',
    description: '',
    joinButtonWrap: '',
    joinButton: ''
  } } = props;
  const router = useRouter();
  const join_ = router.locale === "en"
    ? "Join"
    : router.locale === "vi" ? "Luyện tập" : ''
  return <div className="test-item-panel">
    {bgImage && <Image
      src={bgImage}
      layout="fill"
      className="test-tiem-panel-bg-image"
      objectFit="cover"
      objectPosition="right"
    />}
    <div className="test-item-panel-main">
      <div className={classNames("test-item-main-title", classes.title)}>{title}</div>
      <div className={classNames("test-item-main-desc dot-3", classes.description)}>{description}</div>
    </div>
    <div className={classNames("test-item-func-join-button-wrap", classes.joinButtonWrap)}>
      <NextLink href={slug}>
        <Button className={classNames("test-item-func-join-button", classes.joinButton)}>{join_}</Button>
      </NextLink>
    </div>
  </div>
}

export default TestItemPanel;