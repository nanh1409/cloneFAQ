import classNames from "classnames";
import Image from "next/image";
import { PropsWithoutRef } from "react";
import Topic from "../../../modules/share/model/topic";
import { TestMeta } from "../../../types/appPracticeTypes";
import "./practiceBlock.scss";

const PracticeBlock = (props: PropsWithoutRef<{
  item: Topic; meta?: Array<TestMeta>;
  classes?: {
    root?: string;
  }
}>) => {
  const {
    item,
    meta = [],
    classes = {
      root: ''
    }
  } = props;
  return <div className={classNames("practice-block-component", classes.root)}>
    <div className="topic-meta">
      <div className="topic-name-text dot-2">{item.name}</div>
      <div className="topic-meta-content">
        {meta.map((metaItem, metaIndex) => {
          return <div key={metaIndex} className="topic-meta-item">
            <div className="topic-meta-value">{metaItem.value}</div>
            <div className="topic-meta-name">{metaItem.name}</div>
          </div>
        })}
      </div>
    </div>

    <div className="topic-avatar-container">
      {item.avatar && <Image 
        src={item.avatar}
        layout="fill"
        className="topic-avatar"
      />}
    </div>
  </div>
}

export default PracticeBlock;