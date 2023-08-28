import { useRouter } from "next/router";
import { useMemo } from "react";
import { useSelector } from "../../app/hooks";

const useSeoInfo = () => {
  const mapSeoInfo = useSelector((state) => state.appInfos.mapSeoInfo);
  const isClient = typeof window !== "undefined";
  const path = useMemo(() => {
    if (!isClient) return null;
    const { pathname } = window.location;
    return pathname
  }, [isClient])
  const router = useRouter();
  return mapSeoInfo[path];
}

export default useSeoInfo;