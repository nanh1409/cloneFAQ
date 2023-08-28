import { GetStaticPathsResult } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "../../../app/hooks";
import { setCurrentState, setStatesList } from "../../../app/redux/reducers/states.slice";
import { wrapper } from "../../../app/store";
import Footer from "../../../components/footer";
import SelectStateDialog from "../../../components/SelectStateDialog";
import CDLStateView from "../../../components/state-view/cdl/CDLStateView";
import { apiGetSEOInfo } from "../../../features/appInfo/appInfo.api";
import { setTestList } from "../../../features/appInfo/appInfo.slice";
import Layout from "../../../features/common/Layout";
import { setUseDynamicNav } from "../../../features/common/layout.slice";
import useAppConfig from "../../../hooks/useAppConfig";
import useServerAppInfo from "../../../hooks/useServerAppInfo";
import useServerPracticeData from "../../../hooks/useServerPracticeData";
import useServerStateData from "../../../hooks/useServerStateData";
import Topic from "../../../modules/share/model/topic";
import WebSeo from "../../../modules/share/model/webSeo";
import { StateData } from "../../../types/StateData";
import { getWebAppProps, getWebSEOProps } from "../../../utils/getSEOProps";

type StatePageProps = {
  seoInfo?: WebSeo;
  currentState: StateData;
}

const StatePage = (props: StatePageProps) => {
  const {
    seoInfo,
    currentState
  } = props;
  const appInfo = useSelector(state => state.appInfos.appInfo)
  const statesList = useSelector((state) => state.state.statesList);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentState(currentState || null));
  }, [statesList.length, currentState]);

  useEffect(() => {
    dispatch(setUseDynamicNav(true));
    return () => {
      dispatch(setUseDynamicNav(false));
    }
  }, []);

  function renderStateView() {
    switch (appInfo.appName) {
      case "cdl":
        return <CDLStateView stateSlug={currentState.slug} seoInfo={seoInfo} />
      default:
        return <></>
    }
  }

  return <Layout
    {...getWebSEOProps(seoInfo)}
    {...getWebAppProps(appInfo)}
  >
    {renderStateView()}
    <Footer />
    <SelectStateDialog />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true }
  const appName = appInfo.appName;
  const state = params.state as string;
  const states = useServerStateData(appName);
  const currentState = states.find((s) => s.slug === state) || null;
  if (!currentState) return { notFound: true };
  const seoInfo = await apiGetSEOInfo(appInfo._id, `/${state}`);

  if (!["cdl"].includes(appName)) return { notFound: true }
  if (appName === "cdl") {
    const { mapSlugData = {} } = useServerPracticeData(appName);
    store.dispatch(setStatesList(states));
    store.dispatch(setTestList(Object.keys(mapSlugData).map((slug) => ({
      ...mapSlugData[slug], slug
    } as Topic & { fullName?: string }))))
  }

  return {
    props: {
      seoInfo,
      currentState
    }
  }
})

export const getStaticPaths = async () => {
  const { appName } = useAppConfig();
  if (!appName) throw new Error("appName is not defined");
  const paths: GetStaticPathsResult["paths"] = [];
  if (["cdl", "dmv"].includes(appName)) {
    const states = useServerStateData(appName);
    paths.push(...states.map((item: { slug: string }) => ({ params: { state: item.slug } })))
  }
  return {
    paths,
    fallback: false
  }
}

export default StatePage;