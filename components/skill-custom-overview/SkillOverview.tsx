import ChevronRight from "@mui/icons-material/ChevronRight";
import { Button } from "@mui/material";
import classNames from "classnames";
import _ from "lodash";
import { useRouter } from "next/router";
import { PropsWithoutRef, useMemo } from 'react';
import { useSelector } from "../../app/hooks";
import { ROUTER_PRACTICE } from "../../app/router";
import { LOCALE_SESSION_KEY } from "../../config/MapContraint";
import useAppConfig from "../../hooks/useAppConfig";
import usePracticeData from "../../hooks/usePracticeData";
import { GameObjectStatus, QuestionItem } from "../../modules/new-game/src/models/game.core";
import Skill from "../../modules/share/model/skill";
import { openUrl } from "../../utils/system";
import './index.scss';

// OVERVIEW TOEIC LR
const SkillOverview = (props: PropsWithoutRef<{
  questionItems: Array<QuestionItem>;
  skills: Array<Skill>;
}>) => {
  const hasGtag = typeof gtag !== "undefined";
  const { questionItems, skills } = props;
  const { appName } = useAppConfig();
  const { mapSlugData = {} } = usePracticeData(appName);
  const router = useRouter();
  const topic = useSelector((state) => state.topicState.currentTopic);
  const data = useMemo(() => {
    const correctQuestions = questionItems.filter(({ correct, status }) => status === GameObjectStatus.ANSWERED && correct);
    return skills
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((skill) => {
        const _correctQuestions = correctQuestions.filter(({ skillValue }) => skillValue === skill.value);
        const _totalQuestions = questionItems.filter(({ skillValue }) => skillValue === skill.value);
        const corectPercent = Math.round((100 * _correctQuestions.length) / (_totalQuestions.length || 1));
        return {
          skill,
          corectPercent
        }
      })
  }, [skills, questionItems]);
  const links = useMemo(() => {
    const links: string[] = [];
    Object.entries(mapSlugData).forEach(([slug, { tag, children }]) => {
      if (["listening", "reading"].includes(tag)) {
        const hasChild = !_.isEmpty(children);
        links.push(`/${ROUTER_PRACTICE}/${hasChild ? Object.keys(children)[0] : slug}`);
      }
    })
    return links;
  }, [mapSlugData]);

  return <div className="custom-skill-overview-view">
    {data.map(({ skill, corectPercent }, index) => {
      return <div className='skill-overview-item' key={index}>
        <div className="skill-overview-item-name">{skill.name}</div>
        <div className={classNames("skill-overview-item-percent", corectPercent === 100 ? "completed" : "")}>{corectPercent}%</div>
        <Button
          className="skill-overview-item-practice-button"
          variant="contained"
          endIcon={<ChevronRight />}
          onClick={() => {
            let url = links[index];
            if (url) {
              const locale = sessionStorage.getItem(LOCALE_SESSION_KEY);
              if (locale !== router.defaultLocale) {
                url = `/${locale}${url}`
              }
              if (hasGtag) {
                gtag("event", "study", {
                  event_category: "nav_from_test_to_practice",
                  event_label: topic?._id,
                  value: skill.value
                })
              }
              openUrl(url);
            }
          }}
        >
          Practice now
        </Button>
      </div>
    })}
  </div>
}

export default SkillOverview