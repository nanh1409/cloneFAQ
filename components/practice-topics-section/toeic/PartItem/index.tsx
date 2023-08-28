import { Link, Typography } from "@mui/material";
import classNames from "classnames";
import { PropsWithoutRef } from "react";
import "./partItem.scss";
import Image from "next/image";
import NextLink from "../../../NextLink";

export type PartItemDataProps = {
  shortName?: string,
  name: string,
  slug?: string,
  avatar?: string,
  shortDescription: string,
  childs?: Array<{ name: string; slug?: string }>
}

const _PartItemData = (props: PropsWithoutRef<Omit<PartItemDataProps, "slug" | "childs">>) => {
  const {
    shortName,
    name,
    avatar,
    shortDescription,
  } = props;
  return <>
    <div className="part-item-data-avatar-wrap">
      {avatar && <Image
        layout="fill"
        src={avatar}
        alt={shortName || name}
        objectFit="cover"
        sizes="75vw"
        className="part-item-data-avatar"
      />}
    </div>
    <div className="part-item-data-content">
      <div className="part-item-data-short-name dot-1">{shortName}</div>
      <div className="part-item-data-name dot-2">{name}</div>
      <div className="part-item-data-desc dot-6">{shortDescription}</div>
    </div>
  </>
}

const PartItemData = (props: PropsWithoutRef<PartItemDataProps>) => {
  const {
    slug,
    childs,
    ...data
  } = props;
  const title = `${data.shortName ? `${data.shortName} - ` : ""}${data.name}: ${data.shortDescription}`;
  return slug
    ? <NextLink href={slug}>
      <div className="part-item-data" title={title}>
        <_PartItemData {...data} />
      </div>
    </NextLink>
    : <div className="part-item-data">
      <_PartItemData {...data} />
      {childs?.length && <div className="part-item-data-childs">
        {childs.map(({ name, slug }, i) => {
          return <NextLink href={slug} key={i}>
            <div className={classNames("part-item-data-childs-item", i === childs.length - 1 ? "last" : "")} title={title}>
              <span className="part-item-data-childs-item-name">{name}</span>
            </div>
          </NextLink>
        })}
      </div>}
    </div>
}

export default PartItemData;