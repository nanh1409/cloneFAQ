import { Container } from "@mui/material";
import { useMemo } from "react";
import { useDispatch, useSelector } from "../../app/hooks";
import { wrapper } from "../../app/store";
import Footer from "../../components/footer";
import { setAppInfo } from "../../features/appInfo/appInfo.slice";
import Layout from "../../features/common/Layout";
import QuizQuestionPageView from "../../features/seo-questions/QuizQuestionPageView";
import { apiGetQuestionById, apiGetQuestionByParentId } from "../../features/seo-questions/seoQuestion.api";
import { apiGetTopicById } from "../../features/study/topic.api";
import useAppConfig from "../../hooks/useAppConfig";
import useServerAppInfo from "../../hooks/useServerAppInfo";
import { CARD_HAS_CHILD, META_ROBOT_INDEX_FOLLOW, STATUS_OPEN, STATUS_PUBLIC, TOPIC_TYPE_EXERCISE } from "../../modules/share/constraint";
import { Card } from "../../modules/share/model/card";
import { HTMLPartToTextPart } from "../../utils/format";
import { getWebAppProps } from "../../utils/getSEOProps";

const QuizQuestionPage = (props: {
  card: Card,
  relatedCards: Card[],
  questionSlug: string,
  learningSlug: string
}) => {
  const { card, relatedCards, questionSlug, learningSlug } = props;
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const appConfig = useAppConfig();
  const {
    metaTitle,
    metaDescription
  } = useMemo(() => {
    if (!card) return {};
    const metaTitle = HTMLPartToTextPart(card.question.text);
    const metaDescription = `${metaTitle}: ${[...card.answer.texts, ...card.answer.choices].map((content) => HTMLPartToTextPart(content)).join(", ")}`;
    return {
      metaTitle, metaDescription
    }
  }, [card?._id]);

  return <Layout
    {...getWebAppProps(appInfo)}
    addMathJax={appConfig.mathJax}
    title={metaTitle}
    description={metaDescription}
    robots={META_ROBOT_INDEX_FOLLOW}
    backgroundColor="#e5e5e5"
    slug={`/quiz/${questionSlug}`}
  >
    <Container maxWidth="xl" sx={{ pt: "60px", pb: "60px" }}>
      <QuizQuestionPageView
        card={card}
        mathJax={appConfig.mathJax}
        relatedCards={relatedCards}
        learningSlug={learningSlug}
      />
    </Container>
    <Footer />
  </Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store, params, res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=3600, stale-while-revalidate=59'
  );
  const envDisablePageQuiz = process.env.DISABLE_PAGE_QUIZ;
  const isDisablePage = ["true", "false"].includes(envDisablePageQuiz) ? !!JSON.parse(envDisablePageQuiz) : false;
  if (isDisablePage) return {
    notFound: true
  }
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true };
  const questionSlug = params.questionSlug;
  const [cardId] = (questionSlug as string).split("-").slice(-1);
  const card = await apiGetQuestionById(cardId, true);
  if (!card) return { notFound: true };
  if (card.hasChild || !!card.question.text.match(/(@PS@|@PE@)/)) return { notFound: true };

  const relatedCards = (await apiGetQuestionByParentId(card.parentId, true))
    .filter((e) =>
      e._id !== card._id
      && e.hasChild !== CARD_HAS_CHILD
      && !e.question.text.match(/(@PS@|@PE@)/)
    );

  let learningSlug = "";
  let rootSlug = "";
  const topic = await apiGetTopicById({
    serverSide: true,
    topicId: card.parentId,
    withCourse: true,
    withExercise: false,
    populatePaths: true
  });

  if (topic
    && [STATUS_OPEN, STATUS_PUBLIC].includes(topic.status)
    && topic.type === TOPIC_TYPE_EXERCISE
    && (appInfo.courseIds ?? []).includes(topic.courseId)
    && topic.topicPaths?.every((e) => [STATUS_OPEN, STATUS_PUBLIC].includes(e.status))
  ) {
    learningSlug = (topic.topicPaths ?? []).map((e) => e.slug).join("/") + `/${topic.slug}`;
    rootSlug = (topic.topicPaths ?? [])[0]?.slug ?? "";
  }

  if (appInfo.appName === "nclex" && ["nclex-rn", "nclex-pn"].includes(rootSlug)) {
    learningSlug = learningSlug.slice(rootSlug.length + 1);
  }

  return {
    props: {
      card,
      relatedCards,
      questionSlug,
      learningSlug
    }
  }
});


export default QuizQuestionPage;

