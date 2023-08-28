import { MathJax } from "better-react-mathjax";
import React, { PropsWithChildren, useEffect, useState } from "react";

const RichContent = (props: PropsWithChildren<{ mathJax?: boolean }>) => {
  const [_mathJax, setMathJax] = useState(false);
  useEffect(() => {
    setMathJax(props.mathJax);
    return () => {
      setMathJax(false);
    }
  }, [props.mathJax])
  return _mathJax
    ? <MathJax style={{ height: "100%" }} dynamic>
      {props.children}
    </MathJax>
    : <>{props.children}</>
}

export default RichContent;