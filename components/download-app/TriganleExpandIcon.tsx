import { memo, PropsWithoutRef } from "react";

const TriangleExpandIcon = memo((props: PropsWithoutRef<{ fill?: string }>) => {
  return <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.03817 9.31784C6.82452 9.64331 6.39258 9.73058 6.07211 9.5136C5.99547 9.46171 5.92929 9.39449 5.87936 9.31784L0.678633 1.39565C0.464984 1.07018 0.552069 0.631496 0.871381 0.414514C0.986334 0.336684 1.12103 0.29541 1.25804 0.29541H11.6595C12.0438 0.29541 12.3562 0.612628 12.3562 1.00296C12.3562 1.14211 12.3155 1.2789 12.2389 1.39565L7.03817 9.31784Z" fill={props.fill || "white"} />
  </svg>
});

export default TriangleExpandIcon;