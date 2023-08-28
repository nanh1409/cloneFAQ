import { useMemo } from "react";
import { useSelector } from "../../app/hooks";
import Topic from "../../modules/share/model/topic";

export default function useUserPaymentInfo() {
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const paymentInfo = useSelector((state) => state.paymentState.paymentInfo);
  const loading = useSelector((state) => state.paymentState.loading);
  const accountPayment = useSelector((state) => state.paymentState.accountPayment);
  const { user, userId } = useSelector((state) => state.authState);
  const planAccessLevel = useMemo(() => paymentInfo?.isExpired ? 0 : (paymentInfo?.accessLevel ?? 0), [paymentInfo?._id]);

  const isValidTopicAccess = (topic: Topic) => {
    return !appInfo.usingGetPro || ((topic.accessLevel ?? 0) <= planAccessLevel)
  }

  const paymentLoading = useMemo(() =>
    appInfo?.usingGetPro && loading
    , [loading, appInfo?.usingGetPro]);

  const isProAcc = useMemo(() => {
    return !!user && accountPayment?.userId === userId && !accountPayment?.isExpired
  }, [!!user, userId, accountPayment?.userId, accountPayment?.isExpired])

  return {
    paymentLoading,
    planAccessLevel,
    isValidTopicAccess,
    isProAcc
  }
}