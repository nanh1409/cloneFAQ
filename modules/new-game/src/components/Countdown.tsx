import React, { CSSProperties, memo, PropsWithoutRef, useEffect, useRef, useState } from "react";
import { secondsToHHMMSS } from "../utils/format";

export type CountdownProps = {
  /** Seconds */
  total: number;
  stop?: boolean;
  id?: any;
  onChange?: (timeLeft: number) => void;
  onEnd?: () => void;
  defaultTotal?: number;
  color?: string;
  style?: CSSProperties;
}

const Countdown = memo((props: PropsWithoutRef<CountdownProps>) => {
  const { total, stop, id, onChange = (timeLeft: number) => { console.log(timeLeft) }, onEnd = () => { }, defaultTotal = -1,
    style
  } = props;
  // console.log("re-render count down");

  const [value, setValue] = useState(total || defaultTotal);

  let timeoutRef = useRef(null);
  useEffect(() => {
    if (stop) {
      clearTimeout(timeoutRef.current);
      return;
    };
    if (value === 0) {
      clearTimeout(timeoutRef.current);
      if (total > 0) {
        onEnd();
      }
      return;
    };
    timeoutRef.current = setTimeout(() => {
      setValue((value) => {
        const newValue = value - 1;
        onChange(newValue);
        return newValue;
      });
    }, 1000);

    return () => {
      clearTimeout(timeoutRef.current);
    }
  }, [value, stop]);

  useEffect(() => {
    // console.log("change id");

    if (total > 0)
      setValue(total);
  }, [id, total]);

  return <span style={{ color: "#26C048", fontSize: 16, fontWeight: "bold", ...style }}>{secondsToHHMMSS(value)}</span>
}, (prevProps, nextProps) => {
  const renderProps: Array<keyof CountdownProps> = ["color", "defaultTotal", "style", "id", "stop", "total"];

  return !renderProps.some(prop => nextProps[prop] !== prevProps[prop])
});

export default Countdown;