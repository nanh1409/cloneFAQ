import React from "react";
import ReactHtmlParser from "react-html-parser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { MathJaxContext, MathJax } from "better-react-mathjax";
import "./style.scss";

interface Card {
  _id: string;
  question: string;
  answer: string;
}

interface Post {
  _id: string;
  name: string;
  cards: Card[];
}

interface FAQPageProps {
  posts: Post[];
  expandedCards: string[];
  toggleCard: (cardId: string) => void;
}

const FAQPage = ({ posts, expandedCards, toggleCard }: FAQPageProps) => {
  return (
    <MathJaxContext>
      <div className="container">
        <h1 className="faq-h1">FAQs</h1>
        <ul>
          {posts.map((post) => (
            <div key={post._id}>
              <h2 className="faq-h2">{post.name}</h2>
              <div>
                {post.cards.map((card) => {
                  const isExpanded = expandedCards.includes(card._id);
                  return (
                    <div
                      key={card._id}
                      className={`one ${isExpanded ? "expanded" : ""}`}
                    >
                      <div className="item">
                        <div
                          className="question"
                          onClick={() => toggleCard(card._id)}
                        >
                          <h3 className="faq-h3">
                            {ReactHtmlParser(card.question)}
                          </h3>
                          <div
                            className={`arrow ${isExpanded ? "expanded" : ""}`}
                          >
                            <FontAwesomeIcon icon={faChevronDown} />
                          </div>
                        </div>
                        <div className="answer">
                          <MathJax>{ReactHtmlParser(card.answer)}</MathJax>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </ul>
      </div>
    </MathJaxContext>
  );
};

export default FAQPage;
