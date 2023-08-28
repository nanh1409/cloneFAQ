import React, { PropsWithoutRef } from "react";
import ReactHtmlParser, { processNodes, Transform } from "react-html-parser";
import ImageWidget from "./ImageWidget";

const RegexUnicodeEmail = /^(?!\.)((?!.*\.{2})[a-zA-Z0-9\u00E0-\u00FC.!#$%&'*+-/=?^_`{|}~\-\d]+)@(?!\.)([a-zA-Z0-9\u00E0-\u00FC\-\.\d]+)((\.([a-zA-Z]){2,63})+)$/g;

const transform: Transform = (node, index) => {
  if (node.type === "tag" && node.name == "img") {
    return <ImageWidget src={node.attribs?.src} key={index} width={300} />
  } else if (node.type === "tag" && !!node.name?.match(RegexUnicodeEmail)?.length) {
    return <span key={index}>{processNodes(node.children, transform)}</span>
  } else if (node.type === "text" && !!node.next?.name?.match(RegexUnicodeEmail)?.length) {
    node.data = `${node.data} <${node.next?.name}>`;
  }
}

const HTMLContent = (props: PropsWithoutRef<{ content?: string }>) => {
  return <>{ReactHtmlParser(props.content || '', {
    transform
  })}</>
}

export default HTMLContent;