import { PropsWithChildren, ReactNode, useEffect, useRef, useState } from "react";

type DelayProps = {
  delay: number;
  onRender?: () => void;
  placeholder?: ReactNode;
};

const DelayRender = (props: PropsWithChildren<DelayProps>) => {
  const { children, delay, onRender = () => { }, placeholder = <></> } = props;
  const [show, setShow] = useState(false);
  const timer = useRef(null);
  useEffect(() => {
    timer.current = setTimeout(() => {
      onRender();
      setShow(true);
      clearTimeout(timer.current);
    }, delay);
    return () => {
      clearTimeout(timer.current);
    };
  }, [delay]);

  useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    }
  }, [])

  return show ? <>{children}</> : <>{placeholder}</>;
}

export default DelayRender;