import { useRouter } from "next/router";
import { useMemo } from "react";
import { useDispatch, useSelector } from "../app/hooks"
import { setOpenSelectStateDialog, stateSlugKey } from "../app/redux/reducers/states.slice";

const useCheckState = (args: { localCheck?: boolean } = {}) => {
  const { localCheck = false } = args;
  const currentState = useSelector((state) => state.state.currentState);
  const statesList = useSelector((state) => state.state.statesList);
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const isClient = typeof window !== "undefined";
  const dispatch = useDispatch();
  const router = useRouter();

  const localState = useMemo(() => {
    return isClient
      ? statesList.find(({ slug }) => slug === localStorage.getItem(stateSlugKey))
      : null;
  }, [statesList.length, localCheck, isClient]);

  const checkState = (args: {
    practiceSlug?: string;
    onClickSamePath?: () => void;
    onSelectCallback?: (stateSlug: string) => void;
    action?: () => void;
  } = { practiceSlug: '', onClickSamePath: undefined, onSelectCallback: undefined, action: undefined }) => {
    const { practiceSlug, onClickSamePath = () => { }, onSelectCallback, action } = args;
    const _currentState = localCheck ? localState : currentState;
    if (!_currentState) {
      if (appInfo?.appName === "cdl" && router.pathname !== "/") {
        router.push("/");
      } else {
        dispatch(setOpenSelectStateDialog({ open: true, onSelect: onSelectCallback }));
      }
    } else {
      if (router.query.state === _currentState.slug) {
        // CDL Logic
        if (!!onClickSamePath) onClickSamePath();
        else if (!!action) action();
      } else {
        if (!!action) action();
        else {
          // CDL Logic
          router.push({
            pathname: _currentState.slug,
            hash: practiceSlug
          }, undefined, { scroll: true });
        }
      }
    }
  }
  return {
    checkState,
    currentState: localCheck ? localState : currentState
  }
}


export default useCheckState;