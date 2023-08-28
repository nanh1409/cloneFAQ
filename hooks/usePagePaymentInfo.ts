import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "../app/hooks";
import { loadUserSubscriptionByApp, setPaymentInfoLoading } from "../features/get-pro/payment.slice";

type PagePaymentInfoHookProps = {
  loadedCallback?: () => void;
  appName?: string
};

export default function usePagePaymentInfo(args: PagePaymentInfoHookProps = {} as PagePaymentInfoHookProps) {
  const { loadedCallback = () => { }, appName } = args;
  const { loading, token, user } = useSelector((state) => state.authState);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!loading && !!appName) {
      if (!!user) {
        dispatch(loadUserSubscriptionByApp({ token, appName }))
          .then(unwrapResult)
          .finally(() => {
            loadedCallback();
          });
      } else {
        dispatch(setPaymentInfoLoading(false));
        loadedCallback();
      }
    }
  }, [loading, appName]);
}