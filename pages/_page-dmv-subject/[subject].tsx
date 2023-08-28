import { GetStaticPathsResult } from "next";
import { useEffect } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { setCurrentState, setStatesList } from "../../app/redux/reducers/states.slice";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import SelectStateDialog from "../../components/SelectStateDialog";
import DMVSubjectView from "../../components/subject-view/dmv";
import { apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { setChildApp } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import { setUseDynamicNav } from "../../features/common/layout.slice";
import useAppConfig from "../../hooks/useAppConfig";
import useCheckState from "../../hooks/useCheckState";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import useServerStateData from "../../hooks/useServerStateData";
import useServerSubjectData from "../../hooks/useServerSubjectData";
import AppSetting from "../../modules/share/model/appSetting";
import WebSeo from "../../modules/share/model/webSeo";
import { SubjectData } from "../../types/SubjectData";
import { getWebAppProps, getWebSEOProps } from "../../utils/getSEOProps";

type DMVSubjectPageProps = {
  currentSubject: SubjectData;
  seoInfo?: WebSeo;
}

const DMVSubjectPage = (props: DMVSubjectPageProps) => {
  const {
    currentSubject,
    seoInfo
  } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const statesList = useSelector((state) => state.state.statesList);
  const dispatch = useDispatch();
  const { checkState, currentState } = useCheckState({ localCheck: true });

  useEffect(() => {
    dispatch(setUseDynamicNav(true));
    dispatch(setChildApp(new AppSetting({ appName: currentSubject.key })))
    return () => {
      dispatch(setUseDynamicNav(false));
    }
  }, []);

  useEffect(() => {
    dispatch(setCurrentState(currentState || null));
  }, [statesList.length, currentState]);

  return <Layout
    {...getWebSEOProps(seoInfo)}
    {...getWebAppProps(appInfo)}
  >
    <DMVSubjectView seoInfo={seoInfo} subjectData={currentSubject} />;
    <Footer />
    <SelectStateDialog />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true }
  const appName = appInfo.appName;
  const subject = params.subject as string;
  const states = useServerStateData(appName);
  store.dispatch(setStatesList(states));
  const seoInfo = await apiGetSEOInfo(appInfo._id, `/${subject}`);
  const subjects = useServerSubjectData(appName);
  const currentSubject = subjects.find(s => s.slug === subject) || null;
  if (!currentSubject) return { notFound: true }

  return {
    props: {
      currentSubject,
      seoInfo
    }
  }
})

export const getStaticPaths = async () => {
  const { appName } = useAppConfig();
  if (!appName) throw new Error("appName is not defined");
  const paths: GetStaticPathsResult["paths"] = [];
  if (appName === "dmv") {
    const subjects = useServerSubjectData(appName);
    paths.push(...subjects.map((e) => ({ params: { subject: e.slug } })))
  }
  return {
    paths,
    fallback: false
  }
}

export default DMVSubjectPage;