import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { memo } from "react";
import { useSelector } from "../../../app/hooks";
import useCheckState from "../../../hooks/useCheckState";
import useSubjectData from "../../../hooks/useSubjectData";
import { DMVSubject } from "../../../types/appPracticeTypes";
import DMVSubjectItem from "./DMVSubjectItem";
import CarTestsIcon from "./icons/CarTestsIcon";
import CDLTestsIcon from "./icons/CDLTestsIcon";
import MotorTestsIcon from "./icons/MotorTestsIcon";

const DMVPracticeTopicsSection = memo(() => {
  const { currentState, checkState } = useCheckState();
  const statesList = useSelector((state) => state.state.statesList);
  const router = useRouter();
  const subjects = useSubjectData();
  const onClickSubjectItem = (subject: DMVSubject) => {
    if (subject === "dmv-motorcycle" || subject === "dmv-cdl-permit") {
      const subjectData = subjects.find(({ key }) => key === subject);
      if (subjectData) router.push(`/${subjectData.slug}`);
    } else {
      const postFix = `-${subject}-practice-test`;
      checkState({
        onSelectCallback: (stateSlug) => {
          const state = statesList.find(({ slug }) => stateSlug === slug);
          if (state) router.push(`/${state.slug}/${state.shortSlug}${postFix}`);
        },
        action: () => {
          if (currentState) router.push(`/${currentState.slug}/${currentState.shortSlug}${postFix}`);
        }
      });
    }
  }

  return <Grid container spacing={4}>
    <Grid item xs={12} md={4}>
      <DMVSubjectItem
        icon={<CarTestsIcon fill="#0085FF" />}
        name="Car Tests"
        ctaColor="#fff"
        ctaBgColor="#0085FF"
        ctaLayerBgColor="#006CD0"
        desc="It’s impossible to drive a car in the United States without a driving license. The best option for you is to take our DMV practice test now. Our selected practice questions definitely help you familiarize with the actual exam and conquer it with flying colors."
        onClick={() => onClickSubjectItem("dmv-permit")}
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <DMVSubjectItem
        icon={<MotorTestsIcon fill="#F5C718" />}
        name="Motorcycle Tests"
        ctaColor="#fff"
        ctaBgColor="#F5C718"
        ctaLayerBgColor="#CE9400"
        desc="It’s stated that taking practice tests can help learners memorize knowledge better by 70% than only reading the handbook. Why not enter our Motorcycle DMV Practice test now to get a remarkable actual test score, because it’s totally FREE!"
        onClick={() => onClickSubjectItem("dmv-motorcycle")}
      />
    </Grid>
    <Grid item xs={12} md={4}>
      <DMVSubjectItem
        icon={<CDLTestsIcon fill="#0FC0A0" />}
        name="CDL Tests"
        ctaColor="#fff"
        ctaBgColor="#0FC0A0"
        ctaLayerBgColor="#00987C"
        desc="Commercial transportation is a good option for those who enjoy driving jobs. There are several roles and endorsements for you to apply for. Let’s start our CDL Practice test now to know which suits you most and ace the CDL successfully!"
        onClick={() => onClickSubjectItem("dmv-cdl-permit")}
      />
    </Grid>
  </Grid>;
});

export default DMVPracticeTopicsSection;