import { Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress } from "@mui/material";
import { withStyles } from "@mui/styles";
import { BubbleDataPoint, Chart as ChartJs, ChartTypeRegistry, ScatterDataPoint } from "chart.js";
import classNames from "classnames";
import _ from "lodash";
import moment from "moment";
import { useRouter } from "next/router";
import { PropsWithoutRef, useEffect, useMemo, useState } from "react";
import { Chart, ChartProps } from "react-chartjs-2";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { ROUTER_STUDY } from "../../../../app/router";
import CtaButton from "../../../../components/CtaButton";
import DialogTransitionDown from "../../../../components/DialogTransitionDown";
import useAppConfig from "../../../../hooks/useAppConfig";
import usePracticeData from "../../../../hooks/usePracticeData";
import useStateData from "../../../../hooks/useStateData";
import useSubjectData from "../../../../hooks/useSubjectData";
import DailyGoal from "../../../../modules/share/model/dailyGoal";
import { StudyPlanTargetLevel } from "../../../../modules/share/model/studyPlan";
import Topic from "../../../../modules/share/model/topic";
import { DMVSubject } from "../../../../types/appPracticeTypes";
import { openUrl } from "../../../../utils/system";
import { apiGetTopicById } from "../../../study/topic.api";
import { useStudyPlanQuestionsNum, useUserStudyPlan } from "../../hooks/useUserStudyPlan";
import StudyPlanAdjustIcon from "../../icons/StudyPlanAdjustIcon";
import StudyPlanChartLegendItemIcon from "../../icons/StudyPlanChartLegendItemIcon";
import StudyPlanMessageIcon from "../../icons/StudyPlanMessageIcon";
import { bulkUpdateDailyGoals, changeKeyMapStudyPlanQuestionsNum, requestBulkUpdateDailyGoals } from "../../studyPlan.slice";
import { forecastStudyPlan, genGoalSequence, getPlanQuestionsNum } from "../../studyPlan.util";
import useStudyPlanConfig, { DAILY_GOAL_RATIO } from "../../useStudyPlanConfig";
import "./userStudyPlan.scss";

const ChartKeys = {
  Target: "Target",
  Correct: "Correct",
  Incorrect: "Incorrect"
}

const family = "SVN-Poppins";

const StudyPlanProgress = withStyles({
  root: { height: "8px", borderRadius: 50 },
  bar1Determinate: { borderRadius: 50 }
})(LinearProgress);

const UserStudyPlan = (props: PropsWithoutRef<{
  // For server side studyplan Id
  initStudyPlanId?: string;
  initTotalQuestions?: number;
}>) => {
  const {
    initStudyPlanId,
    initTotalQuestions
  } = props;
  const { user, userId } = useSelector((state) => state.authState);
  const dailyGoals = useSelector((state) => state.studyPlanState.dailyGoals);
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const dispatch = useDispatch();

  const router = useRouter();

  const [openAdjustDialog, setOpenAdjustDialog] = useState(false);
  const [goalsData, setGoalsData] = useState<{ key: number; userGoals: DailyGoal[] }>({ key: 0, userGoals: [] });
  const [state, setState] = useState<Topic | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [chartRef, setChartRef] = useState<ChartJs<keyof ChartTypeRegistry, (number | ScatterDataPoint | BubbleDataPoint)[], string>>(null);

  const { appName, practiceViewType } = useAppConfig();
  const { initTopicSlugs, isTopicQuestion } = useStudyPlanConfig()
  const { mapSlugData = {} } = usePracticeData(
    appName === "dmv" && router.query.app as DMVSubject === "dmv-cdl-permit"
      ? "cdl"
      : (router.query.app as string || appName)
  );
  const statesData = useStateData();
  const subjectsData = useSubjectData();
  useUserStudyPlan({ courseId: studyPlan.courseId, userId, client: !user, fetchedPlan: !!studyPlan });
  // const { overallProgress } = useStudyPlanProgress({ studyPlan, userId });
  useStudyPlanQuestionsNum({
    courseId: studyPlan.courseId,
    topicIds: studyPlan.topicIds,
    isTopicQuestion,
    studyPlanId: studyPlan._id,
    initTotalQuestionsNum: initTotalQuestions,
    callback: ({ totalQuestions }, e) => {
      if (!e) {
        if (typeof initStudyPlanId !== "undefined" && !!user) {
          dispatch(changeKeyMapStudyPlanQuestionsNum({ oldKey: initStudyPlanId, newKey: studyPlan._id }))
        }
        setTotalQuestions(getPlanQuestionsNum({ totalQuestions, target: studyPlan.target }));
      }
    }
  });

  const currentDate = useMemo(() => new Date(), []);
  const {
    labels,
    datasets,
    options,
    todayGoal,
    todayProgress,
    isArchievedTodayGoal,
    overallProgress,
    forecastValue,
    spMessage
  } = useMemo(() => {
    const goals = goalsData.userGoals;
    const labels = goals.map(({ date }) => moment(date).isSame(currentDate, "day") ? "Today" : moment(date).format("DD/MM"));
    const masteredQuestions = goals.map((e) => e.masteredQuestion ?? 0);
    const datasets = [
      {
        type: 'line' as const,
        label: ChartKeys.Target,
        data: goals.map((e) => e.dailyGoal),
        fill: false,
        backgroundColor: "#CE99FF",
        borderColor: "#9B51E0", borderWidth: 2
      },
      {
        type: 'bar' as const,
        label: ChartKeys.Correct,
        data: masteredQuestions,
        backgroundColor: "#33CD99",
        borderRadius: 4,
        stack: "Learned"
      },
      {
        type: 'bar' as const,
        data: goals.map((e) => (e.learned ?? 0) - (e.masteredQuestion ?? 0)),
        label: ChartKeys.Incorrect,
        backgroundColor: "#FA6666",
        borderRadius: 4,
        stack: "Learned"
      },
      {
        type: 'line' as const,
        label: "",
        data: masteredQuestions,
        fill: true,
        backgroundColor: "rgba(207, 248, 234, 0.5)", borderColor: "#DBF9EF", borderWidth: 1,
      }
    ] as ChartProps["data"]["datasets"];
    const options = {
      responsive: true,
      backgroundColor: "white",
      scales: {
        xAxes: {
          stacked: true,
          ticks: { autoSkip: true, maxRotation: 0, minRotation: 0, font: { family } }
        },
        yAxes: {
          ticks: { precision: 0, font: { family } },
          min: 0,
          beginAtZero: true
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          titleFont: { family },
          bodyFont: { family },
          footerFont: { family }
        },
        zoom: {
          pan: { enabled: true, mode: "x" },
          zoom: {
            pinch: { enabled: true },
            wheel: { enabled: true },
            mode: "x"
          }
        }
      }
    } as ChartProps["options"];
    const todayGoal = goals.find((e) => moment(e.date).isSame(currentDate, "day"));
    const todayProgress =
      !!todayGoal && !!todayGoal.dailyGoal
        ? 100 * (todayGoal?.masteredQuestion ?? 0) / (todayGoal?.dailyGoal ?? 1)
        : 0;
    const isArchievedTodayGoal = (todayGoal?.masteredQuestion ?? 0) >= (todayGoal?.dailyGoal ?? 1);
    const masteredQuestionCount = goals.reduce((total, { masteredQuestion }) => (total += (masteredQuestion ?? 0), total), 0);
    const overallProgressRatio = masteredQuestionCount / (totalQuestions || 1);
    const overallProgress = (overallProgressRatio > 1 ? 1 : overallProgressRatio) * 100;
    const {
      forecastValue,
    } = forecastStudyPlan({
      totalQuestions,
      dailyGoals: goalsData.userGoals, startDate: new Date(studyPlan.startDate), currentDate, endDate: new Date(studyPlan.testDate)
    });

    const spMessage = forecastValue > 1 // 
      ? `You're below the target. You should practice more. Push yourself! Stick to your goal by clicking on the "Adjust Plan" button.`
      : (forecastValue < -1
        ? `You're ahead of schedule. It's time to review your work thoroughly. Great work! You're ready to sit for your exam on ${-forecastValue} (days) earlier.`
        : "You’re on the right track. That's a good effort. Keep working hard!");

    return {
      goals,
      labels,
      datasets,
      options,
      todayGoal,
      todayProgress,
      isArchievedTodayGoal,
      overallProgress,
      forecastValue,
      spMessage
    }
  }, [goalsData.key, currentDate]);

  useEffect(() => {
    if (chartRef) {
      const idx = goalsData.userGoals.findIndex((e) => moment(e.date).isSame(currentDate, "day"));
      if (idx !== -1) {
        const minZoom = idx <= 7 ? 0 : idx - 7;
        const maxZoom = minZoom + 14;
        chartRef.zoomScale("xAxes", { min: minZoom, max: maxZoom }, "resize");
      }
    }
  }, [goalsData.key, currentDate, chartRef]);

  const passRate = useMemo(() => {
    let passRate = 0;
    switch (studyPlan.target) {
      case StudyPlanTargetLevel.Pass: passRate = 50; break;
      case StudyPlanTargetLevel.Advanced: passRate = 70; break;
      case StudyPlanTargetLevel.Master: passRate = 90; break;
      default: break;
    }
    return passRate;
  }, [studyPlan.target]);

  const dayLeft = useMemo(() => moment(studyPlan.testDate ?? currentDate).diff(currentDate, "days") + 1, [studyPlan.testDate, currentDate]);

  useEffect(() => {
    if (!!studyPlan.courseId && !!studyPlan.stateId) {
      apiGetTopicById({ topicId: studyPlan.stateId, withExercise: false })
        .then((state) => setState(state));
    }
  }, [studyPlan.courseId, studyPlan.stateId]);

  useEffect(() => {
    if (!!studyPlan) {
      const userGoals = dailyGoals
        .filter(({ studyPlanId }) => studyPlanId === studyPlan._id)
        .sort((a, b) => moment(a.date).isBefore(b.date, "day") ? -1 : 1);
      setGoalsData((prev) => ({ key: prev.key + 1, userGoals }))
    }
  }, [studyPlan._id]);


  const handleClickStudyNow = () => {
    let url = "";
    if (!!router.query.app) {
      if (appName === "dmv") {
        const app = router.query.app as DMVSubject;
        if (app === "dmv-cdl-permit") {
          const firstSlug = Object.keys(mapSlugData ?? {})[0];
          if (state && firstSlug) {
            url = `/${ROUTER_STUDY}/${app}/${state.slug}/${firstSlug}/`
          }
        } else if (app === "dmv-motorcycle" || app === "dmv-permit") {
          if (state) {
            const stateData = statesData.find((e) => e.slug === state.slug);
            if (stateData) {
              url = `/${ROUTER_STUDY}/${app}/${stateData.shortSlug}-${app}-practice-test/`
            }
          }
        }
      }
    } else if (practiceViewType === "page") {
      url = `/practice/`
    } else if (practiceViewType === "subject") {
      const firstSubject = subjectsData[0];
      if (firstSubject) {
        const { dataSlug, childSubjects = [] } = firstSubject;
        const firstChildSubject = childSubjects[0];
        if (!dataSlug && !!firstChildSubject) {
          url = `/${ROUTER_STUDY}/${firstChildSubject.slug}`
        } else if (!!dataSlug) {
          url = `/${ROUTER_STUDY}/${dataSlug}/${firstChildSubject ? `${firstChildSubject.slug}` : ""}`
        }
      }
    } else {
      const practiceSlugs = Object.keys(mapSlugData ?? {});
      const firstSlug = !!initTopicSlugs?.length ? practiceSlugs.find((e) => e === initTopicSlugs[0]) : practiceSlugs[0];
      if (firstSlug) {
        if (studyPlan.stateId && state) {
          url = `/${ROUTER_STUDY}/${state.slug}/${firstSlug}`;
        } else {
          if (!!mapSlugData[firstSlug].children) {
            const firstChildSlug = Object.keys(mapSlugData[firstSlug].children)[0];
            if (firstChildSlug) url = `/${ROUTER_STUDY}/${firstChildSlug}`;
          } else {
            url = `/${ROUTER_STUDY}/${firstSlug}`;
          }
        }
      }
    }
    if (url) {
      openUrl(url);
    }
  }

  const handleAdjustStudyPlan = () => {
    if (todayGoal) {
      const masteredQuestionCount = _.reduce(goalsData.userGoals, (total, { masteredQuestion }) => total + (masteredQuestion ?? 0), 0);
      // Gen for nextDay to end
      const _dayLeft = moment(studyPlan.testDate).diff(moment(todayGoal.date).add(1, "day"), "day") + 1;
      if (_dayLeft < 1) {
        onCloseAdjustDialog();
        return;
      }

      const newGoalValues = _dayLeft === 1
        ? [totalQuestions - masteredQuestionCount]
        : genGoalSequence({
          total: totalQuestions - masteredQuestionCount,
          ratio: DAILY_GOAL_RATIO,
          elementsNum: _dayLeft
        });
      console.log(newGoalValues);

      const newDailyGoals = newGoalValues.map((e, i) => new DailyGoal({
        date: moment(todayGoal.date).add(i + _dayLeft === 1 ? 0 : 1, "day").valueOf(),
        userId: studyPlan.userId,
        dailyGoal: e,
        studyPlanId: studyPlan._id,
        masteredQuestion: _dayLeft === 1 ? (todayGoal.masteredQuestion ?? 0) : 0
      }));

      const newUserGoals = [...goalsData.userGoals.filter(({ date }) =>
        _dayLeft === 1
          ? moment(date).isBefore(currentDate, "day")
          : moment(date).isSameOrBefore(currentDate, "day")
      ), ...newDailyGoals];
      setGoalsData((prev) => ({ key: prev.key + 1, userGoals: newUserGoals }));
      dispatch(bulkUpdateDailyGoals(newDailyGoals));
      if (!!user) {
        dispatch(requestBulkUpdateDailyGoals(newDailyGoals));
      }
      onCloseAdjustDialog();
    }
  }

  const onCloseAdjustDialog = () => {
    setOpenAdjustDialog(false);
  }

  const onOKAdjustPlan = () => {
    handleAdjustStudyPlan();
  }

  return !!totalQuestions && <>
    <div className="user-study-plan">
      <div className="user-study-plan-current-date-info-wrap">
        <div className="user-study-plan-current-date-info">
          <div className="study-plan-cta-label">Complete To Get {passRate}% Pass Rate</div>
          <div className="study-plan-current-date-info">
            <div className="study-plan-goal-icon">
              <img src="/images/study-plan/study-plan-today-goal.png" alt="today-goal" width={42} />
            </div>
            <div className="study-plan-today-progress">
              <div className="study-plan-today-progress-top">
                <span className="study-plan-today-progress-title">Today's Plan:</span>
                <span className="study-plan-today-progress-value">{todayGoal ? `${todayGoal.masteredQuestion ?? 0} / ${todayGoal.dailyGoal}` : ""}</span>
              </div>

              <div className="study-plan-today-progress-bot">
                <StudyPlanProgress variant="determinate" value={todayProgress >= 100 ? 100 : todayProgress} color="inherit" style={{ width: "100%" }} />
              </div>

            </div>
          </div>
          <div className="study-plan-day-left-info">
            You have <span style={{ color: dayLeft <= 10 ? "red" : "inherit", fontWeight: "bold" }}>{dayLeft} day{dayLeft === 1 ? "" : "s"}</span> left to complete the study plan
          </div>

          <div className="study-plan-overall">
            <div className="study-plan-overall-left">
              <div className="study-plan-overall-label">Overall Progress</div>
              <div className="study-plan-overall-progress">
                <span className="study-plan-overall-progress-label" style={{ left: `${overallProgress}%` }}>{overallProgress.toFixed(2).replace(/[.,](00)|0$/, "")}%</span>
                <StudyPlanProgress className="sp-main-progress" color="inherit" variant="determinate" value={overallProgress} />
              </div>
            </div>
            <div className="study-plan-overall-right">
              <div className="study-plan-overall-test-month">{studyPlan ? moment(studyPlan.testDate).format("MMM").toUpperCase() : ""}</div>
              <div className="study-plan-overall-test-date">{studyPlan ? moment(studyPlan.testDate).format("DD") : ""}</div>
            </div>
          </div>

          <div className={classNames("cta-study-plan", isArchievedTodayGoal ? "archieved-today-goal" : "")}>
            {isArchievedTodayGoal
              ? <div className="cta-study-plan-archieved">You have achieved your today's target!</div>
              : <CtaButton
                title="STUDY NOW"
                color="var(--btnTestTitleColor)"
                backgroundColor="var(--btnTestBackground)"
                backgroundLayerColor="var(--btnTestBackgroundLayer)"
                borderRadius={10}
                width={200}
                breakpoint={320}
                onClick={handleClickStudyNow}
                titleClassName="cta-study-plan-title"
              />
            }
          </div>
        </div>
      </div>

      <div className="user-study-plan-chart">
        <div className="user-study-plan-chart-header">
          <div className="sp-chart-label">Study Progress</div>
          {(forecastValue < -1 || forecastValue > 1) && <Button className="sp-adjust-btn" onClick={() => setOpenAdjustDialog(true)}>
            <div className="sp-adjust-btn-wrap">
              <span className="sp-adjust-btn-label">Adjust Plan</span>
              <span className="sp-adjust-btn-icon"><StudyPlanAdjustIcon /></span>
            </div>
          </Button>}
        </div>
        <Chart
          type="bar"
          data={{ labels, datasets }}
          options={options}
          style={{ marginTop: 12 }}
          ref={setChartRef}
        />
        <div className="user-study-plan-chart-footer">
          <div className="sp-msg">
            <StudyPlanMessageIcon />
            <span>{spMessage}</span>
          </div>
          <div className="sp-chart-legend">
            <div className="sp-chart-legend-item item-correct">
              <StudyPlanChartLegendItemIcon fill="#33CD99" /> <span>Correct</span>
            </div>
            <div className="sp-chart-legend-item item-incorrect">
              <StudyPlanChartLegendItemIcon fill="#FA6666" /> <span>Incorrect</span>
            </div>
            <div className="sp-chart-legend-item item-target">
              <StudyPlanChartLegendItemIcon fill="#9B51E0" /> <span>Target</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Dialog
      open={openAdjustDialog}
      onClose={onCloseAdjustDialog}
      fullWidth
      maxWidth="sm"
      PaperProps={{ id: "study-plan-adjust-modal" }}
      TransitionComponent={DialogTransitionDown}
    >
      <DialogTitle className="study-plan-adjust-title">Adjust Plan</DialogTitle>
      <DialogContent className="study-plan-adjust-content">Are you sure to change your study plan now?</DialogContent>
      <DialogActions>
        <Button variant="contained" color="error" onClick={onCloseAdjustDialog}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={onOKAdjustPlan}>OK</Button>
      </DialogActions>
    </Dialog>
  </>;
}

export default UserStudyPlan;

