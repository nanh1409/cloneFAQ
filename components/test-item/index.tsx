import classNames from "classnames";
import Image from "next/image";
import { PropsWithoutRef } from "react";
import Topic from "../../modules/share/model/topic";
import { TestMeta } from "../../types/appPracticeTypes";
import PersonIcon from '@mui/icons-material/Person';
import "./testItem.scss";
import { TopicWithUser } from "../../features/study/topic.model";
import ProTopicIcon from "./ProTopicIcon";
import useAppConfig from "../../hooks/useAppConfig";
import { EXAM_SCORE_FINISH, EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY } from "../../modules/share/constraint";
import { Button } from "@mui/material";

const TestItem = (props: PropsWithoutRef<{
  item: TopicWithUser;
  meta?: TestMeta[];
  useShortDesc?: boolean;
  classes?: {
    root?: string;
    shortDesc?: string;
    metaItem?: string;
  };
  score?: number;
  itemNew?: boolean;
  getProLocked?: boolean;
  bgrTest?:string;
  status?:number
}>) => {
  const {
    item,
    meta = [],
    useShortDesc,
    classes = {
      root: '',
      shortDesc: '',
      metaItem: ''
    },
    score,
    itemNew,
    getProLocked,
    bgrTest,
    status
  } = props;

  const { uiVersion, appName } = useAppConfig();

  return <div className={classNames("topic-item-component", typeof score !== 'undefined' && 'topic-item-component--hover', classes.root)}>
    {typeof score === 'undefined' ? (item.avatar &&
      <div className="topic-avatar-container">
        <Image
          src={item.avatar}
          layout="fill"
          className="topic-avatar"
          quality={100}
        />
      </div>
    ) : (
      <div 
        className={classNames("topic-score", uiVersion === 2 && appName === 'toeic' ? "topic-score-ver2" : "")}
      >
        <div 
          style={uiVersion === 2 && appName === 'toeic' ? {
            background: `url(${bgrTest ? bgrTest : "/images/bgr-test.png"})`
          } : {}}
          className={uiVersion === 2 && appName === 'toeic' ? "topic-score-ver2-background" : ""}
        >
        </div>
        {
          itemNew && <div className="topic-score--newitem">NEW!</div>
        }
        {
          status === EXAM_SCORE_FINISH ? (
            <>
              <div className="topic-score--num">{score}</div>
              <div className="topic-score--content">SCORE</div>
            </>
          ) : [EXAM_SCORE_PAUSE, EXAM_SCORE_PLAY].includes(status) && (
            <Button variant="contained" 
              style={{
                position: 'absolute',
                right: 6,
                bottom: 6,
                borderRadius: 35,
                backgroundColor: "#AEB8CB",
                padding: "7px 14px",
                fontSize: "12px",
                height: 30, 
                color: '#fff'
            }}
            >Continue</Button>
          )
        }
      </div>
    )}
    {getProLocked && <div className="locked-topic-icon">
      <ProTopicIcon id={item._id} />
    </div>}
    <div className="topic-meta">
      <div className="topic-name-text dot-2">
        {item.name}
        {/* {
          showCountUser && <div className="topic-name-text-view">
            <PersonIcon style={{ color: "#828282", fontSize: 15 }} />
            <div className="countPracticedUsers">{item.countPracticedUsers ?? 0}</div>
          </div>
        } */}
      </div>
      {!!useShortDesc && <div className={classNames(
        "topic-short-desc",
        classes.shortDesc
      )}
        dangerouslySetInnerHTML={{ __html: item.shortDescription }}
      />}
      <div className="topic-meta-content">
        {meta.map((metaItem, metaIndex) => {
          return <div key={metaIndex} className={classNames("topic-meta-item", classes.metaItem)}>
            <div className="topic-meta-value">{metaItem.value}</div>
            <div className="topic-meta-name">{metaItem.name}</div>
          </div>
        })}
      </div>
    </div>
  </div>
}

export default TestItem;