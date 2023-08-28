import { useEffect, useRef, useState } from "react";

const useCountdown = (args: {
  key?: string;
  total?: number;
  stop?: boolean;
  onChange?: (timeLeft: number) => void;
  onEnd?: () => void;
}) => {
  const {
    key,
    total,
    stop,
    onChange = () => { },
    onEnd = () => { }
  } = args;
  const [value, setValue] = useState(total);
  const timeoutRef = useRef(null);

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
    }
    timeoutRef.current = setTimeout(() => {
      setValue((value) => {
        const newValue = value - 1;
        onChange(newValue);
        return newValue;
      })
    }, 1000)
    return () => {
      clearTimeout(timeoutRef.current)
    }
  }, [value, stop])

  useEffect(() => {
    if (total > 0) setValue(total);
  }, [key, total]);

  return {
    value
  }
}

export default useCountdown;