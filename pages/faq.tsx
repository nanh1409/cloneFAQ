import React, { useState } from "react";
import { wrapper } from "../app/store";
import useServerAppInfo from "../hooks/useServerAppInfo";
import { apiGetSEOInfo } from "../features/appInfo/appInfo.api";
import FAQPage from "../features/faq/FAQPageView";
import Layout from "../features/common/Layout";
import { getWebAppProps, getWebSEOProps } from "../utils/getSEOProps";
import Footer from "../components/footer";
import AppSetting from "../modules/share/model/appSetting";
import WebSeo from "../modules/share/model/webSeo";

const faqPage = ({ appInfo, seoInfo, posts }) => {
  const [expandedCards, setExpandedCards] = useState<string[]>([]);

  const toggleCard = (cardId: string) => {
    setExpandedCards((prevState) => {
      if (prevState.includes(cardId)) {
        return prevState.filter((id) => id !== cardId);
      } else {
        return [...prevState, cardId];
      }
    });
  };

  return (
    <Layout
      {...getWebAppProps(appInfo)}
      {...getWebSEOProps(seoInfo || {})}
      title={seoInfo?.seoTitle ?? appInfo.title}
      description={seoInfo?.descriptionSeo ?? appInfo.description}
      backgroundColor="#E5E5E5"
    >
      <FAQPage
        posts={posts}
        expandedCards={expandedCards}
        toggleCard={toggleCard}
      />
      <Footer />
    </Layout>
  );
};

export const getStaticProps = wrapper.getStaticProps(async ({ store }) => {
  const appInfo = await useServerAppInfo(store);
  if (!appInfo) return { notFound: true };
  if (["toeic", "ielts"].includes(appInfo.appName)) return { notFound: true };
  const seoInfo = (await apiGetSEOInfo(appInfo._id, "/faq")) || null;

  const response = await fetch(
    "https://gedtestpro.com/api/app-faq-course?courseId=62f5be90d75a245b62bad0fc&isGroup=false"
  );
  const data = await response.json();

  return {
    props: {
      appInfo,
      seoInfo,
      posts: data,
    },
  };
});

export default faqPage;
