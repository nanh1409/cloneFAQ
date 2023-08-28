import { GetStaticPathsResult } from "next";
import { useMemo } from "react";
import { wrapper } from "../../app/store";
import { apiGetSEOInfo } from "../../features/appInfo/appInfo.api";
import { apiGetDocumentByCourseAndSlug } from "../../features/document/document.api";
import ManualBookView from "../../features/document/ManualBookView";
import StudyLayout from "../../features/study/StudyLayout";
import useAppConfig from "../../hooks/useAppConfig";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import useServerPracticeData from "../../hooks/useServerPracticeData";
import useServerStateData from "../../hooks/useServerStateData";
import WebSeo from "../../modules/share/model/webSeo";
import { DMVSubject } from "../../types/appPracticeTypes";
import { StateData } from "../../types/StateData";
import { getWebSEOProps } from "../../utils/getSEOProps";

type ManualBookPageProps = {
  seoInfo?: WebSeo;
  currentState?: StateData;
  subject?: DMVSubject;
  documentURL: string;
}

const ManualBookPage = (props: ManualBookPageProps) => {
  const {
    seoInfo,
    currentState,
    subject,
    documentURL
  } = props;
  const { appName } = useAppConfig();

  const manualBookTitle = useMemo(() => {
    let title = `Free ${currentState?.name} ${appName.toUpperCase()} `;
    if (appName === "cdl") title += "Manual Book";
    else if (appName === "dmv") {
      if (subject === "dmv-permit") title += "Driver's Manual";
      else if (subject === "dmv-cdl-permit") title += "Manual Book";
      else title += "Motorcycle Handbook";
    }
    return seoInfo?.seoTitle ?? title;
  }, [appName, seoInfo?.seoTitle, subject]);

  const practiceURL = useMemo(() => {
    let practiceURL = '';
    const stateSlug = currentState?.slug;
    if (appName === "cdl") practiceURL = `/${stateSlug}`;
    else if (appName === "dmv") practiceURL = `/${stateSlug}/${currentState?.shortSlug}-${subject}-practice-test`;
    return practiceURL;
  }, [appName, subject, currentState]);

  return <StudyLayout {...getWebSEOProps(seoInfo)} title={manualBookTitle} backgroundColor="#fff" stickyHeader>
    <ManualBookView documentURL={documentURL} practiceURL={practiceURL} seoInfo={seoInfo} />
  </StudyLayout>
}

export const getStaticProps = wrapper.getStaticProps(async ({ store, params }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true }
  const appName = appInfo.appName;
  const slugs = params.slugs as string[];
  const path = slugs.join("/");
  if (slugs.length !== 2) return { notFound: true }
  const [stateSlug, bookURI] = slugs;
  const states = useServerStateData(appName);
  const currentState = states.find((s) => s.slug === stateSlug) || null;
  let documentSlug = '';
  let documentCourseId = '';
  let documentURL = '';
  let subject: DMVSubject = null;
  if (appName === "dmv") {
    const documentMatch = bookURI.match(/^(.*)-(dmv-permit|dmv-motorcycle|dmv-cdl-permit)-manual-book/u);
    if (!documentMatch) return { notFound: true }
    subject = documentMatch[2] as DMVSubject;
    if (subject === "dmv-motorcycle") documentSlug = `${stateSlug}-dmv-motor-manual-book`;
    else if (subject === "dmv-permit") documentSlug = `${stateSlug}-dmv-manual-book`;
    else if (subject === "dmv-cdl-permit") documentSlug = `${stateSlug}-dmv-cdl-manual-book`;

    const { mapSubjectCourseIndex = [] } = useServerPracticeData("dmv");
    documentCourseId = (appInfo.courseIds ?? [])[mapSubjectCourseIndex.indexOf(subject)];
  } else if (appName === "cdl") {
    const documentMatch = bookURI.match(/^(.*)-cdl-manual-book/u);
    if (!documentMatch || documentMatch[1] !== stateSlug) return { notFound: true };
    documentSlug = `${stateSlug}-cdl-manual-book`;
    documentCourseId = (appInfo.courseIds ?? [])[0];
  }
  if (!documentSlug || !documentCourseId) return { notFound: true }
  const seoInfo = await apiGetSEOInfo(appInfo._id, `/${path}`);
  const documentObject = await apiGetDocumentByCourseAndSlug({ courseId: documentCourseId, slug: documentSlug });
  documentURL = (documentObject?.itemsDetail ?? [])[0]?.url;

  return {
    props: {
      currentState,
      documentURL,
      seoInfo,
      subject
    }
  }
})

export const getStaticPaths = async () => {
  const { appName } = useAppConfig();
  if (!appName) throw new Error("appName is not defined");
  const paths: GetStaticPathsResult["paths"] = [];
  if (["cdl", "dmv"].includes(appName)) {
    const states = useServerStateData(appName);
    if (appName === "dmv") {
      const subjects: DMVSubject[] = ["dmv-cdl-permit", "dmv-motorcycle", "dmv-permit"];
      paths.push(...states.flatMap((state) => subjects.map((subject) =>
        ({ params: { slugs: [state.slug, `${state.slug}-${subject}-manual-book`] } })
      )))
    } else if (appName === "cdl") {
      paths.push(...states.map((item: { slug: string }) => ({ params: { slugs: [item.slug, `${item.slug}-cdl-manual-book`] } })));
    }
  }
  return {
    paths,
    fallback: false
  }
}

export default ManualBookPage;
