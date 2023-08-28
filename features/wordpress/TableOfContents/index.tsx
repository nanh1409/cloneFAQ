import ExpandMore from "@mui/icons-material/ExpandMore";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import classNames from "classnames";
import { Fragment, PropsWithoutRef, useEffect, useRef, useState } from "react";
import RawLink from "../../../components/RawLink";
import { HeadingData } from "../useHeadingsData";
import "./toc.scss";

const TableOfContents = (props: PropsWithoutRef<{
  headings: Array<HeadingData>;
  className?: string;
}>) => {
  const { headings, className } = props;
  const tocRef = useRef<HTMLDivElement | null>(null);
  const [tocListRef, setTocListRef] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!!tocListRef) {
      const getLinkHash = (href: string) => {
        try { return new URL(href).hash; } catch (e) { return ""; }
      }
      const createObserver = (links: NodeListOf<Element>) => new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          const { target, isIntersecting, intersectionRatio } = entry;
          if (isIntersecting && intersectionRatio >= 1) {
            const id = `#${target.id}`;
            links.forEach((link: HTMLAnchorElement) => {
              const hash = getLinkHash(link.href);
              link.parentElement.classList.remove("active");
              if (hash === id) link.parentElement.classList.add("active");
            })
          }
        })
      }, {
        rootMargin: "0px 0px -150px 0px", threshold: 1
      })
      const links = tocListRef.querySelectorAll(".post-toc-list-item a[href]");
      const observer = createObserver(links);
      headings.map((heading) => {
        const headingEl = document.getElementById(heading.id);
        if (headingEl) { observer.observe(headingEl as Element); }
        if (heading.nested) {
          heading.nested.map((childHeading) => {
            const childHeadingEl = document.getElementById(childHeading.id);
            if (childHeadingEl) { observer.observe(childHeadingEl as Element); }
          })
        }
      });
    }
  }, [tocListRef]);

  return <div id="post-toc" ref={tocRef} className={classNames(className)}>
    {!!headings.length && <>
      <Accordion
        defaultExpanded
        elevation={0}
        className="post-toc-container"
      >
        <AccordionSummary expandIcon={<ExpandMore />} className="post-toc-header">
          Table of Contents
        </AccordionSummary>

        <AccordionDetails
          id="post-toc-details"
          className="post-toc-details"
          style={{ overflow: "auto", maxHeight: 'calc(100vh - 150px)' }}
          ref={setTocListRef}
        >
          {headings.map((heading, i) => {
            return <Fragment key={i}>
              <section className="post-toc-list-item" key={i} >
                <RawLink href={`#${heading.id}`}>{heading.title}</RawLink>
              </section>

              {!!heading.nested && <div className="post-toc-nested">
                {heading.nested.map((childHeading, key) => {
                  return <section key={key} className="post-toc-list-item child-item">
                    <RawLink id={`#${childHeading.id}`} href={`#${childHeading.id}`}>{childHeading.title}</RawLink>
                  </section>
                })}
              </div>}
            </Fragment>
          })}
        </AccordionDetails>
      </Accordion>
    </>}
  </div >
}

export default TableOfContents;