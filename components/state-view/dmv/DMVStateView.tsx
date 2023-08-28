import { PropsWithoutRef } from "react";
import WebSeo from "../../../modules/share/model/webSeo";
import { DMVSubject } from "../../../types/appPracticeTypes";
import CarMotorStateView from "./CarMotorStateView";
import DMVCDLStateView from "./DMVCDLStateView";

const DMVStateView = (props: PropsWithoutRef<{
  stateSlug: string;
  subject: DMVSubject;
  subjectSlug: string;
  useMapSeo?: boolean;
  seoInfo?: WebSeo;
}>) => {
  const { subject } = props;
  return <>
    {subject === "dmv-cdl-permit"
      ? <DMVCDLStateView {...props} />
      : <CarMotorStateView {...props} />}
  </>
}

export default DMVStateView;