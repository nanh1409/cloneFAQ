import { PropsWithChildren } from "react";
import { Scrollbars, ScrollbarProps } from "react-custom-scrollbars-2";

const ScrollContainer = (props: PropsWithChildren<ScrollbarProps & {
  className?: string;
  id?: string;
  disableOverflowX?: boolean;
  disableOverflowY?: boolean;
}>) => {
  const { id, className, children, disableOverflowX, disableOverflowY, ...scrollProps } = props;
  return (<Scrollbars
    {...scrollProps}
    renderView={() => <div id={id} style={{
      position: "absolute", inset: 0, marginRight: disableOverflowY ? undefined : "-17px", marginBottom: disableOverflowX ? undefined : "-17px",
      overflowX: disableOverflowX ? "hidden" : "auto",
      overflowY: disableOverflowY ? "hidden" : "auto"
    }}></div>}
    className={className}
  >
    {children}
  </Scrollbars>)
}

export default ScrollContainer;