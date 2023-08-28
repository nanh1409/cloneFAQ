import { Grid, Typography } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { ElementType, memo, PropsWithoutRef } from "react";
import { useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import RawLink from "../../RawLink";
import TestItem from "../../test-item";
import "./subjectTestList.scss";

const SubjectTestList = memo((props: PropsWithoutRef<{
  subjectPrefix?: string;
  subjectTitleHeading?: ElementType,
  listSize?: number;
}>) => {
  const {
    subjectPrefix = '',
    subjectTitleHeading = "h2",
    listSize = 5
  } = props;
  const subjectTestList = useSelector((state) => state.appInfos.testList);
  const mapParentTopics = useSelector((state) => state.topicState.mapParentTopics);

  return <>
    <div id="subject-test-list">
      {subjectTestList.map((subject, i) => {
        return <div className={classNames("subject-test-list-item", i === 0 ? "first" : "")} key={subject.slug}>
          <Typography component={subjectTitleHeading} className="subject-test-list-item-title">{`${subjectPrefix ? `${subjectPrefix} ` : ''}${subject.name}`}</Typography>
          <div className="subject-test-list-item-data">
            <Grid container spacing={2}>
              {(mapParentTopics[subject.slug]?.data ?? []).map((topic) => {
                const testSlug = `/${ROUTER_STUDY}/test/${topic.slug}-${topic._id}`;
                return <Grid
                  key={topic._id}
                  className="subject-data-item"
                  item
                  xs={12}
                  sm={6}
                  md={_.round(12 / listSize, 1)}
                >
                  <RawLink href={testSlug}>
                    <TestItem
                      item={topic}
                      meta={[
                        { name: "Questions", value: topic?.topicExercise?.questionsNum ?? 0 },
                        { name: "Time", value: topic?.topicExercise?.duration ?? 0 }
                      ]}
                    />
                  </RawLink>
                </Grid>
              })}
            </Grid>
          </div>
        </div>
      })}
    </div>
  </>
});

export default SubjectTestList;
