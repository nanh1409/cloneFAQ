import { GetStaticPathsResult } from "next"
import { useEffect } from "react"
import { useDispatch, useSelector } from "../../../app/hooks"
import { setCurrentState } from "../../../app/redux/reducers/states.slice"
import { wrapper } from "../../../app/store"
import Footer from "../../../components/footer"
import SelectStateDialog from "../../../components/SelectStateDialog"
import DMVStateView from "../../../components/state-view/dmv/DMVStateView"
import { apiGetSEOInfo } from "../../../features/appInfo/appInfo.api"
import { setChildApp } from "../../../features/appInfo/appInfo.slice"
import Layout from "../../../features/common/Layout"
import { setUseDynamicNav } from "../../../features/common/layout.slice"
import useAppConfig from "../../../hooks/useAppConfig"
import useServerAppInfo from "../../../hooks/useServerAppInfo"
import useServerStateData from "../../../hooks/useServerStateData"
import AppSetting from "../../../modules/share/model/appSetting"
import WebSeo from "../../../modules/share/model/webSeo"
import { DMVSubject } from "../../../types/appPracticeTypes"
import { StateData } from "../../../types/StateData"
import { getWebAppProps, getWebSEOProps } from "../../../utils/getSEOProps"

type SubjectInStatePageProps = {
  seoInfo?: WebSeo;
  currentState: StateData;
  subject: DMVSubject;
  subjectSlug: string;
}

const SubjectInStatePage = (props: SubjectInStatePageProps) => {
  const {
    seoInfo,
    currentState,
    subject,
    subjectSlug
  } = props;
  const appInfo = useSelector(state => state.appInfos.appInfo);
  const statesList = useSelector(state => state.state.statesList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentState(currentState || null));
  }, [statesList.length, currentState]);

  useEffect(() => {
    dispatch(setUseDynamicNav(true));
    dispatch(setChildApp(new AppSetting({ appName: subject })))
    return () => {
      dispatch(setUseDynamicNav(false));
    }
  }, []);

  function renderView() {
    switch (appInfo.appName) {
      case "dmv":
        return <DMVStateView
          stateSlug={currentState.slug}
          subject={subject}
          subjectSlug={subjectSlug}
          seoInfo={seoInfo}
        />
      default:
        return <></>
    }
  }

  return <Layout
    {...getWebAppProps(appInfo)}
    {...getWebSEOProps(seoInfo)}
  >
    {renderView()}
    <Footer />
    <SelectStateDialog />
  </Layout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true }
  const appName = appInfo.appName;
  const state = params.state as string;
  const subjectSlug = params.subjectInState as string;
  const states = useServerStateData(appName);
  const currentState = states.find((s) => s.slug === state) || null;
  if (!currentState) return { notFound: true };
  const subjectMatch = subjectSlug.match(/^(.*)-(dmv-permit|dmv-motorcycle|dmv-cdl-permit)-practice-test$/u);
  if (!subjectMatch) return { notFound: true }
  const subject = subjectMatch[2];
  const seoInfo = await apiGetSEOInfo(appInfo._id, `/${state}/${subjectSlug}`);

  return {
    props: {
      seoInfo,
      currentState,
      subject,
      subjectSlug
    }
  }
})

export const getStaticPaths = async () => {
  const { appName } = useAppConfig();
  if (!appName) throw new Error("appName is not defined");
  const paths: GetStaticPathsResult["paths"] = [];
  if (["dmv"].includes(appName)) {
    const states = useServerStateData(appName);
    const dmvSubjects: DMVSubject[] = ['dmv-cdl-permit', 'dmv-motorcycle', 'dmv-permit'];
    paths.push(...states.flatMap((state => dmvSubjects.map(subject => ({
      params: { state: state.slug, subjectInState: `${state.shortSlug}-${subject}-practice-test` }
    })))))
  }
  return {
    paths,
    fallback: false
  }
}

export default SubjectInStatePage;