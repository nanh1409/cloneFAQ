  import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useRef, useState } from "react";
import "./detectAdBlock.scss";
import DetectAdBlockIcon from "./DetectAdBlockIcon";

const DetectAdBlock = (props: PropsWithoutRef<{ disabled?: boolean; }>) => {
  const { disabled } = props;
  const [detected, setDetected] = useState(false);
  const adsRef = useRef<HTMLModElement>();
  const router = useRouter();

  useEffect(() => {
    if (!disabled && !!adsRef.current && getComputedStyle(adsRef.current).display === "none") {
      setDetected(true);
    }
  }, [adsRef.current, disabled]);


  return <>
    <ins ref={adsRef} className="ad ads adsbox doubleclick ad-placement carbon-ads adsbygoogle"
      style={{ width: 0, height: 0, overflow: "hidden" }}
    // style={{ backgroundColor: "red", height: "300px", width: "250px", position: "absolute", left: 0, top: 0 }}
    />
    <Dialog
      open={detected}
      fullWidth
      maxWidth="md"
      PaperProps={{ id: "adblock-detected-dialog" }}
    >
      <DialogTitle className="adblock-title">AdBlock Detected!</DialogTitle>
      <DialogContent className="adblock-content">
        <DetectAdBlockIcon />
        We depend on ad revenue to create free and high-quality content for users. Support us by turning off your adblock
      </DialogContent>
      <DialogActions className="adblock-actions">
        <Button className="adblock-actions-btn" onClick={() => router.reload()}>
          I have turned off Adblock
        </Button>
      </DialogActions>
    </Dialog>
  </>;
}

export default DetectAdBlock;