import dynamic from "next/dynamic";
import { wrapper } from "../app/store";
import { setAppInfo } from "../features/appInfo/appInfo.slice";
import StudyLayout from "../features/study/StudyLayout";
import usePageAuth from "../hooks/usePageAuth";
import useServerAppInfo from "../hooks/useServerAppInfo";
import AppSetting from "../modules/share/model/appSetting";
import { isDMVSubjectName } from "../utils/checkApp";
import { getWebAppProps } from "../utils/getSEOProps";

const StudyPlanPageView = dynamic(() => import("../features/study-plan/StudyPlanPageView"), { ssr: false });

const StudyPlanPage = (props: {
  appInfo: AppSetting
}) => {
  usePageAuth();

  return <StudyLayout
    {...getWebAppProps(props.appInfo)}
    title="Study Plan"
  >
    <StudyPlanPageView />
  </StudyLayout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, query }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo || ["toeic", "ielts"].includes(appInfo.appName)) return { notFound: true };

  if (appInfo.appName === "dmv") {
    const childAppSlug = query.app;
    if (!isDMVSubjectName(childAppSlug as string)) {
      return { notFound: true }
    }
  }

  return {
    props: {
      appInfo
    }
  }
});

export default StudyPlanPage;