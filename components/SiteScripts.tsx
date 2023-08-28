import Script from "next/script";
import { PropsWithoutRef } from "react";
import MessengerChat from "./MessengerChat";

export type SiteScriptsProps = {
  disableFBMessenger?: boolean;
  addFBComment?: boolean;
}

const SiteScripts = (props: PropsWithoutRef<SiteScriptsProps>) => {
  const {
    disableFBMessenger,
    addFBComment
  } = props;

  return <>
    {!disableFBMessenger && (
      <>
        <MessengerChat />
      </>
    )}
    {addFBComment && <Script async defer crossOrigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v16.0" nonce="fiOjmpm5" />}
  </>
}

export default SiteScripts;