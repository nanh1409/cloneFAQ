import ExpandMore from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { memo, PropsWithoutRef } from "react";
import { getPurifiedContent } from "../../../utils/format";
import "./style.scss";

const FAQMain = memo((props: PropsWithoutRef<{ question: string; answer: string; }>) => {
  const { question, answer } = props;

  return <Accordion defaultExpanded={false} elevation={0} classes={{ root: "faq-main-item" }}>
    <AccordionSummary expandIcon={<ExpandMore />} classes={{ root: "faq-main-item-summary", content: "faq-main-item-summary-content", expanded: "expand" }}>
      <span dangerouslySetInnerHTML={{ __html: getPurifiedContent(question) }} />
    </AccordionSummary>
    <AccordionDetails classes={{ root: "faq-main-item-details" }}>
      <span dangerouslySetInnerHTML={{ __html: getPurifiedContent(answer) }} />
    </AccordionDetails>
  </Accordion>
});

export default FAQMain;