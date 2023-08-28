import { PropsWithoutRef } from "react";
import useAppConfig from "../hooks/useAppConfig";

const FBComments = (props: PropsWithoutRef<{ href: string; hidden?: boolean; }>) => {
  const { href, hidden } = props;
  const { testMode } = useAppConfig();
  const isTest = process.env.NODE_ENV !== "production" || testMode;
  return typeof window !== "undefined" && !hidden && <div style={{
    margin: "10px 0",
    position: "relative",
    ...(hidden ? { opacity: 0 } : {}),
    ...(isTest ? { minHeight: 50, border: "1px solid #ccc" } : {})
  }}>
    {isTest && <span
      style={{
        position: "absolute",
        top: 0, left: 0, color: "#fff", backgroundColor: "#007aff", fontSize: 12
      }}
    >FBComments</span>}
    <div
      className="fb-comments"
      data-href={href}
      data-width="100%"
      data-numposts="5"
      data-order-by="reverse-time"
    />
  </div>
}

export default FBComments;