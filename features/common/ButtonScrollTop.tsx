import ArrowUpwardTwoTone from "@mui/icons-material/ArrowUpwardTwoTone";
import { styled } from "@mui/styles";
import { useEffect, useState } from "react";

const ButtonScrollTopRoot = styled("button")({
  display: "none",
  "&.show": {
    position: "fixed",
    bottom: 100,
    right: 24,
    zIndex: 1400,
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: 0,
    boxShadow: "0 0 6px 2px var(--titleColor)",
    color: "var(--titleColor)"
  }
})

const ButtonScrollTop = () => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 1000) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
    window.addEventListener("scroll", toggleVisibility);
    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    }
  }, [])

  return <ButtonScrollTopRoot
    onClick={() => {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }}
    className={visible ? "show" : ""}
  >
    <ArrowUpwardTwoTone />
  </ButtonScrollTopRoot>
}

export default ButtonScrollTop;