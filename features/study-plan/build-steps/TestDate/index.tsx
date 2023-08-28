import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";
import EventAvailable from "@mui/icons-material/EventAvailable";
import { IconButton, InputBase } from "@mui/material";
import classNames from "classnames";
import moment from "moment";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Calendar from "react-calendar";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { setCanNextStep, updatePlan } from "../../studyPlan.slice";
import "./testDate.scss";

const StudyPlanTestDateStep = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [testDate, setTestDate] = useState<Date | null>(null);
  const [activeStartDate, setActiveStartDate] = useState(currentDate);
  const [inputTestDate, setInputTestDate] = useState("");

  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const canNext = useSelector((state) => state.studyPlanState.canNext);
  const dispatch = useDispatch();

  const dayLeft = useMemo(() => {
    return testDate ? moment(testDate).diff(currentDate, "days") + 1 : 0;
  }, [currentDate, testDate]);

  useEffect(() => {
    if (studyPlan?.startDate) {
      setCurrentDate(new Date(studyPlan.startDate))
    }
  }, []);

  useEffect(() => {
    if (!!testDate) {
      dispatch(updatePlan({ ...studyPlan, testDate: testDate.getTime() }));
    }
    if (!!testDate !== canNext) {
      dispatch(setCanNextStep(!!testDate))
    }
  }, [testDate]);


  const handleChangeTestDate = (date: Date) => {
    const _currentMoment = moment(currentDate);
    const _moment = moment(date);
    if (_currentMoment.isSameOrAfter(_moment, "day")) return;
    setTestDate(date);
    setInputTestDate(moment(date).format("DD/MM/YYYY"));
  }

  const handleChangeInputTestDate = (evt: ChangeEvent<HTMLInputElement>) => {
    // @ts-ignore
    const inputValue = evt.nativeEvent.data;
    if (!!inputValue && !/[0-9\/]/.test(inputValue)) {
      return;
    }
    const value = evt.target.value;
    setInputTestDate(value);
    const dateMoment = moment(value, "DD/MM/YYYY", true);
    if (dateMoment.isValid() && dateMoment.isAfter(currentDate, "day")) {
      setActiveStartDate(dateMoment.toDate());
      setTestDate(dateMoment.toDate())
    }
  }

  return <div className="study-plan-test-date">
    <div className="study-plan-test-date-header-title study-plan-title">
      Choose your Exam date
    </div>

    <div className="study-plan-test-date-body">
      <div className="study-plan-test-date-body-info">
        <div className="study-plan-user-exam-date">
          <div className="study-plan-info-label">Your Exam Date</div>
          <div className="study-plan-info-value">
            {moment(testDate || activeStartDate).format("MMM DD, YYYY")}
          </div>
        </div>

        <div className="study-plan-day-left">
          <div className="study-plan-info-label">Day left</div>
          <div className="study-plan-info-value">
            {dayLeft} day{dayLeft === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="study-plan-test-date-body-date-input">
        <div className="date-input-item">
          <div className="date-input-label">
            <EventAvailable />
            From
          </div>
          <InputBase
            className="date-input-main"
            type="tel"
            value={moment(currentDate).format("DD/MM/YYYY")}
            readOnly
          />
        </div>

        <div className="date-input-item">
          <div className="date-input-label">
            <EventAvailable />
            To
          </div>
          <InputBase
            className="date-input-main"
            type="tel"
            placeholder="dd/mm/yyyy"
            value={inputTestDate}
            onChange={handleChangeInputTestDate}
          />
        </div>
      </div>

      <div className="study-plan-test-date-body-calendar">
        <div className="study-plan-calendar-header">
          <IconButton className="calendar-nav-button" onClick={() => {
            setActiveStartDate((prev) => moment(prev).startOf("month").subtract(1, "month").toDate())
          }}><ChevronLeft color="inherit" /></IconButton>
          <div className="label-current-month">{moment(activeStartDate).format("MMM YYYY")}</div>
          <IconButton className="calendar-nav-button" onClick={() => {
            setActiveStartDate((prev) => moment(prev).startOf("month").add(1, "month").toDate())
          }}><ChevronRight color="inherit" /></IconButton>
        </div>
        <Calendar
          value={[currentDate, testDate]}
          onChange={handleChangeTestDate}
          minDate={currentDate}
          showNavigation={false}
          activeStartDate={activeStartDate}
          className="study-plan-calendar"
          tileClassName={({ date }) => classNames(
            "study-plan-calendar-item",
            moment(date).isBefore(currentDate, "day") ? "item-disabled" : "",
            moment(date).isSame(currentDate, "day") ? "item-current" : "",
            testDate && moment(date).isSame(testDate, "day") ? "item-end-range" : "",
            testDate && moment(date).isAfter(currentDate, "day") && moment(date).isBefore(testDate, "day") ? "item-in-range" : ""
          )}
        />
      </div>
    </div>
  </div>;
}

export default StudyPlanTestDateStep;