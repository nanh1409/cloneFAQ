import { Tab, Tabs } from "@mui/material";
import classNames from 'classnames';
import React from 'react';
import { MapSlugData } from "../../../../types/appPracticeTypes";
import "./style.scss";

interface Props {
  subject: string;
  onChangeSubject: (newValue: string) => void;
  mapSlugData: MapSlugData;
}

const NclexSubjectTabs: React.FC<Props> = ({ subject, onChangeSubject, mapSlugData }) => (
  <div className="nclex-subjects-tabs">
    <Tabs
      className="subject-tab-root"
      value={subject} onChange={(_evt, newValue) => onChangeSubject(newValue)}
      variant="fullWidth"
      TabIndicatorProps={{ className: "subject-tab-indicator" }}
    >
      {Object.entries(mapSlugData).map(([slug, { name }]) => (
        <Tab
          key={slug}
          label={(name as string).toUpperCase()}
          value={slug}
          className={classNames("subject-tab-button", subject === slug ? "selected" : "")}
        />
      ))}
    </Tabs>
  </div>
);

export default NclexSubjectTabs;
