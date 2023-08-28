import { HTMLAttributes, PropsWithChildren, PropsWithoutRef } from "react";
import ReactHtmlParser from "react-html-parser";
import { DomElement } from "domhandler";
import Head from "next/head";

const parser = (html: string) => ReactHtmlParser(html, {
  transform: (node: DomElement, index) => {
    if (node.type === "script" && node.name === "script") {
      const attr = node.attribs || {};
      if (attr.type === "application/ld+json") {
        const _attr = Object.keys(attr).reduce((map, key) => {
          if (key === "class") map.className = attr["class"];
          else map[key] = attr[key];
          return map;
        }, {} as HTMLAttributes<HTMLScriptElement>)
        return <script
          {..._attr}
          key={index}
          dangerouslySetInnerHTML={{ __html: node.children[0]?.data ?? '' }}></script>
      }
    }
  }
})

const ParsedSEO = (props: PropsWithChildren<{
  headerString: string;
  siteAddress: string;
  appName: string;
}>) => {
  const {
    headerString,
    siteAddress,
    appName
  } = props;
  const host = process.env.NODE_ENV === "production" ? siteAddress || "" : "";
  return <Head>
    <link
      rel="icon"
      type="image/png"
      href={`${host}/images/icon/${appName}/favicon.png`}
    />
    <link
      rel="apple-touch-icon"
      href={`${host}/images/icon/${appName}/favicon.png`}
    />
    {parser(props.headerString)}
    {props.children}
  </Head>;
}

export default ParsedSEO;