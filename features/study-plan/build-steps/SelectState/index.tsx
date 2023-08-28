import { Grid, InputBase, useMediaQuery, useTheme } from "@mui/material";
import Search from "@mui/icons-material/Search";
import classNames from "classnames";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "../../../../app/hooks";
import Topic from "../../../../modules/share/model/topic";
import { chunkArr } from "../../../../utils/api/common";
import { fetchTopicsOrStates, setCanNextStep, setStudyPlanStateId, updatePlan } from "../../studyPlan.slice";
import "./selectState.scss";
import { stateSlugKey } from "../../../../app/redux/reducers/states.slice";

const StudyPlanSelectStateStep = () => {
  const stateId = useSelector((state) => state.studyPlanState.stateId);
  const states = useSelector((state) => state.studyPlanState.states);
  const canNext = useSelector((state) => state.studyPlanState.canNext);
  const studyPlan = useSelector((state) => state.studyPlanState.currentStudyPlan);
  const courseId = studyPlan?.courseId;

  const dispatch = useDispatch();

  const [searchStr, setSearchStr] = useState("");
  const [searchStates, setSearchStates] = useState<Topic[]>([]);

  const theme = useTheme();
  const isMobileUI = useMediaQuery(theme.breakpoints.down("sm"));

  const stateChunks = useMemo(() => {
    return chunkArr(searchStates, isMobileUI ? 1 : 4);
  }, [searchStates, searchStr, isMobileUI]);

  useEffect(() => {
    if (!searchStr) setSearchStates(states);
    else {
      const filtered = states.filter((e) => e.name.trim().toLowerCase().includes(searchStr.trim().toLowerCase()));
      setSearchStates(filtered);
    }
  }, [searchStr, states]);

  useEffect(() => {
    if (!states.length && !!courseId) {
      dispatch(fetchTopicsOrStates({ parentId: null, courseId, isState: true }));
    }
  }, [states.length, courseId]);

  useEffect(() => {
    const _canNext = !!stateId;
    if (_canNext !== canNext) {
      dispatch(setCanNextStep(_canNext));
    }
  }, [stateId]);

  const handleChangeState = (stateId: string) => {
    dispatch(updatePlan({ ...studyPlan, stateId }));
    dispatch(setStudyPlanStateId(stateId));
    const state = states.find((e) => e._id === stateId);
    if (state) {
      localStorage.setItem(stateSlugKey, state.slug);
    }
  }

  return <div className="study-plan-select-state">
    <div className="study-plan-select-state-header">
      <div className="study-plan-select-state-header-title">
        Select your state
      </div>
      <div className="study-plan-select-state-header-search">
        <InputBase
          placeholder="Search"
          className="input-search-state"
          value={searchStr}
          onChange={(e) => {
            e.preventDefault();
            setSearchStr(e.target.value)
          }}
          endAdornment={<Search />}
        />
      </div>
    </div>

    <div className="study-plan-select-state-list-state">
      <Grid container spacing="10px">
        {stateChunks.map((col, i) => {
          return <Grid key={i} item xs={12} sm={6} md={3}>
            {col.map((state, stateIdx) => {
              const isSelected = state._id === stateId;
              return <div key={stateIdx}
                className={classNames(
                  "study-plan-state-item",
                  isSelected ? "selected" : ""
                )}
                onClick={() => handleChangeState(state._id)}
              >
                {state.name}
              </div>
            })}
          </Grid>
        })}
      </Grid>
    </div>
  </div>;
}

export default StudyPlanSelectStateStep;