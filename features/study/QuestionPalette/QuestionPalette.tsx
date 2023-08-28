import { memo, PropsWithoutRef } from "react";
import { useSelector } from "../../../app/hooks";
import { TOPIC_TYPE_LESSON } from "../../../modules/share/constraint";
import QuestionPaletteSkeleton from "./QuestionPaletteSkeleton";

const QuestionPalette = memo((props: PropsWithoutRef<{
  baseComponent?: JSX.Element;
}>) => {
  const {
    baseComponent
  } = props;
  const topic = useSelector((state) => state.topicState.currentTopic);
  const isSkillBasedExam = useSelector((state) => state.topicState.isSkillBasedExam);
  const currentSkillConfig = useSelector((state) => state.topicState.currentSkillConfig);
  const isInitGame = useSelector((state) => state.topicState.isInitGame);

  return !topic
    ? <></>
    : (isSkillBasedExam && !currentSkillConfig
      ? <></>
      : (isInitGame
        ? <QuestionPaletteSkeleton />
        : (topic.type === TOPIC_TYPE_LESSON
          ? <></>
          : <>
            {baseComponent}
          </>
        )
      )
    )
})

export default QuestionPalette;