import { memo } from "react";
import "./loaderIcon.scss";

const LoaderIcon = memo((props: { size?: number; strokeWidth?: number; className?: string; }) => {
  const {
    size = 24,
    strokeWidth = 8,
    className
  } = props;
  return <div className={`module-game-loader-icon${className ? ` ${className}` : ""}`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderWidth: `${strokeWidth}px`
    }}
  />
})

export default LoaderIcon;