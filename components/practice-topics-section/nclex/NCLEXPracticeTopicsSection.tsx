import { Grid, Link, Typography } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import usePracticeData from "../../../hooks/usePracticeData";
import Topic from "../../../modules/share/model/topic";
import { NCLEXSubject } from "../../../types/appPracticeTypes";
import TestItem from "../../test-item";
import "./NCLEXPracticeListStyle.scss";
import NclexSubjectTabs from "./NCLEXSubjectTabs";

const nclexSubjectKey = "nclex-subject";

const NCLEXPracticeTopicsSection = memo(() => {
  const practiceList = useSelector((state) => state.appInfos.practiceList);
  const [subject, setSubject] = useState<NCLEXSubject>("nclex-rn");
  const { mapSlugData = {} } = usePracticeData();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const subject = sessionStorage.getItem(nclexSubjectKey);
      if (typeof subject === "string") {
        const _subject = subject as NCLEXSubject;
        setSubject((_subject === "nclex-pn" || _subject === "nclex-rn") ? _subject : "nclex-rn");
      }
    }
  }, []);

  const onChangeSubject = (subject: NCLEXSubject) => {
    setSubject(subject);
    sessionStorage.setItem(nclexSubjectKey, `${subject}`);
  }

  const renderSubject = useCallback(() => {
    return <>{Object.entries(mapSlugData).filter(([_, { tag }]) => tag !== "flash-card").map(([_subject, { name, children = {} }], cIdx) => {
      const isHidden = _subject !== subject;
      const topics = practiceList.filter(({ slug }) => Object.keys(children).includes(slug));
      return <div key={cIdx} className={classNames("nclex-subject-item", isHidden ? "hidden" : "")}>
        <Typography component="h2" className="nclex-subject-item-title">{`${name} Practice Test`}</Typography>
        <Grid container spacing={2}>
          {topics.map((item, i) => {
            const meta = (children[item.slug] ?? {}).meta ?? [];
            return <Grid key={i} item xs={12} sm={6} md={3}>
              <Link href={`/${ROUTER_STUDY}/${item.slug}`} underline="none" color="inherit">
                <TestItem
                  classes={{ root: "topic-item-transition" }}
                  item={new Topic({ name: item.name, avatar: item.avatar, slug: item.slug })}
                  meta={meta}
                />
              </Link>
            </Grid>
          })}
        </Grid>
      </div>;
    })}</>;
  }, [practiceList.length, subject]);

  return <div className="practice-topics-section nclex">
    <NclexSubjectTabs
      mapSlugData={_.pickBy(mapSlugData, ({ tag }) => tag !== "flash-card")}
      onChangeSubject={onChangeSubject}
      subject={subject}
    />
    <div className="subjects-content">{renderSubject()}</div>
  </div >
});

export default NCLEXPracticeTopicsSection;