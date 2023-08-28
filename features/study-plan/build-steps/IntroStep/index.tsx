import {
  Grid
} from "@mui/material";
import "./introStep.scss";

const introItems = [
  {
    image: "/images/study-plan/study-plan-1.png",
    desc: "Master your knowledge"
  },
  {
    image: "/images/study-plan/study-plan-2.png",
    desc: "Pass your test with flying colours"
  },
  {
    image: "/images/study-plan/study-plan-3.png",
    desc: "Manage your learning schedule effectively"
  },
]

const StudyPlanIntroStep = () => {
  return <div className="study-plan-intro">
    <div className="study-plan-intro-title study-plan-title">Study Plan</div>
    <Grid container spacing={3}>
      {introItems.map((item, i) => {
        return <Grid item xs={12} sm={4} key={i}>
          <div className="study-plan-intro-item">
            <div className="study-plan-intro-item-image">
              <img alt={item.desc} src={item.image} width={56} />
            </div>
            <div className="study-plan-intro-item-desc">{item.desc}</div>
          </div>
        </Grid>
      })}
    </Grid>
  </div>
}

export default StudyPlanIntroStep;