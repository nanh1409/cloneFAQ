import ExpandMore from "@mui/icons-material/ExpandMore"
import LocalLibrary from "@mui/icons-material/LocalLibrary"
import { Accordion, AccordionDetails, AccordionSummary, Grid } from "@mui/material"
import classNames from "classnames"
import { Fragment, memo, useMemo } from "react"
import { useSelector } from "../../../app/hooks"
import { ROUTER_STUDY } from "../../../app/router"
import useUserPaymentInfo from "../../../features/get-pro/useUserPaymentInfo"
import Topic from "../../../modules/share/model/topic"
import { chunkArr } from "../../../utils/api/common"
import { openUrl } from "../../../utils/system"
import "./MainPracticeList.scss"

const MainPracticeList = memo((props: {
  isSubjectType: boolean;
  baseSlug?: string;
  practiceList: Topic[];
  baseStudySlug?: string;
  useCollapseSubject?: boolean;
}) => {
  const {
    isSubjectType,
    baseSlug,
    practiceList,
    baseStudySlug,
    useCollapseSubject
  } = props;
  const mapParentTopics = useSelector((state) => state.topicState.mapParentTopics);
  const { paymentLoading, isValidTopicAccess } = useUserPaymentInfo();
  const list = useMemo(() => {
    const _list: Array<{
      parent: Topic | null;
      children: Array<Topic>
    }> = [];
    if (!isSubjectType) _list.push({ parent: null, children: practiceList });
    else _list.push(...(practiceList.map((parent) => ({ parent, children: (mapParentTopics[parent.slug] || mapParentTopics[parent._id])?.data ?? [] }))));
    return _list;
  }, [isSubjectType, practiceList.length, mapParentTopics]);

  const renderListChildren = (topics: Topic[], parent?: Topic) => {
    return <div className="list-children">
      <Grid container spacing="20px">
        {chunkArr(topics, 2).map((cList, cIndex) => {
          return <Grid key={cIndex} item xs={12} sm={6}>
            {cList.map((item) => {
              return <div className="item" key={item._id} onClick={() => handleClickItem({ parent, item })}>
                <div className="item-left">
                  <div className="item-icon">
                    <LocalLibrary fontSize="small" />
                  </div>
                  <div className="item-name">
                    {item.name}
                  </div>
                </div>
                {/* {!isValidTopicAccess(item) && <Lock fontSize="small" />} */}
              </div>
            })}
          </Grid>
        })}
      </Grid>
    </div>
  }

  const handleClickItem = (args: {
    parent?: Topic;
    item: Topic;
  }) => {
    const { parent, item } = args;
    // if (!isValidTopicAccess(item)) {
    //   window.location.href = `/${ROUTER_GET_PRO}?from=locked`;
    // } else {
    const href = `/${ROUTER_STUDY}${baseStudySlug ? `/${baseStudySlug}` : ""}${baseSlug ? `/${baseSlug}` : ''}${parent?.slug ? `/${parent.slug}` : ''}/${item.slug}`;
    // window.location.href = href;
    openUrl(href);
    // }
  }

  return <div className="main-practice-list-view">
    {
      // !paymentLoading &&
      list.map(({ parent, children }, i) => {
        return <Fragment key={i}>
          {
            useCollapseSubject
              ? <>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <div className={classNames("title", !i ? "first" : "")}>{parent?.name}</div>
                  </AccordionSummary>
                  <AccordionDetails>
                    {renderListChildren(children, parent)}
                  </AccordionDetails>
                </Accordion>
              </>
              : <>
                <div className={classNames("title", !i ? "first" : "")}>{parent?.name}</div>
                {renderListChildren(children, parent)}
              </>
          }
        </Fragment >
      })}
  </div >
});

export default MainPracticeList
