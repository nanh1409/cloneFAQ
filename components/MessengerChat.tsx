import MessengerCustomerChat from "react-messenger-customer-chat";
import useAppConfig from "../hooks/useAppConfig";

const MessengerChat = () => {
  const { facebookId } = useAppConfig();
  return facebookId
    ? <>
      <MessengerCustomerChat
        pageId={`${facebookId}`}
        appId=""
      />
    </>
    : <></>
}

export default MessengerChat;