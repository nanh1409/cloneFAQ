import { Grid, Link, Pagination } from "@mui/material";
import { useDispatch, useSelector } from "../../../../app/hooks";
import { ROUTER_STUDY } from "../../../../app/router";
import { customTestPageKey, CUSTOM_TEST_LIMIT, fetchCustomTests, setCurrentCustomTestList, setCustomTestPage, setMouseOnCta, setOpenCreateModal } from "../../../../features/custom-test/customTest.slice";
import useCustomTestConfig from "../../../../features/custom-test/useCustomTestConfig";
import AppSetting from "../../../../modules/share/model/appSetting";
import Topic from "../../../../modules/share/model/topic";
import TestItem from "../../../test-item";
import "./customTestList.scss";

const CustomTestList = () => {
  const { appName, courseIds } = useSelector((state) => state.appInfos.appInfo || {} as AppSetting);
  const { user, userId, loading } = useSelector((state) => state.authState);
  const data = useSelector((state) => state.customTestState.data);
  const list = useSelector((state) => state.customTestState.list);
  const page = useSelector((state) => state.customTestState.page);
  const total = useSelector((state) => state.customTestState.total);
  const mouseOnCta = useSelector((state) => state.customTestState.mouseOnCta);
  const dispatch = useDispatch();

  const config = useCustomTestConfig();

  const handleChangePage = (page: number) => {
    if (!user) {
      const _data = list.slice((page - 1) * CUSTOM_TEST_LIMIT, page * CUSTOM_TEST_LIMIT);
      dispatch(setCurrentCustomTestList(_data));
    } else {
      dispatch(fetchCustomTests({ courseId: (courseIds || [])[config.courseIndex], userId, skip: (page - 1) }))
    }
    window.localStorage.setItem(customTestPageKey, `${page}`);
    dispatch(setCustomTestPage(page));
  }

  return loading
    ? <></>
    : <>
      <Grid container spacing={2}>
        {data.map((test, i) => {
          const avatar = `/images/app/${appName}/test/1.png`;
          return <Grid key={test._id} item xs={12} sm={6} md={2.4}>
            <Link href={`/${ROUTER_STUDY}/custom-test/${test._id}`} underline="none" color="inherit">
              <TestItem
                item={new Topic({ _id: test._id, slug: "", name: test.title, avatar })}
                meta={[
                  { name: "Questions", value: test.questionsNum },
                  { name: "Time", value: test.duration },
                ]}
              />
            </Link>
          </Grid>
        })}
        {!!list.length && <Grid item xs={12} sm={6} md={2.4}>
          <div className="create-test-indicator"
            onMouseEnter={() => dispatch(setMouseOnCta(true))} onMouseLeave={() => dispatch(setMouseOnCta(false))}
            onClick={() => dispatch(setOpenCreateModal(true))}
          >
            <svg width="30" height="31" viewBox="0 0 30 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd" clipRule="evenodd"
                d="M15 0.582031C13.7574 0.582031 12.75 1.58939 12.75 2.83203V13.332H2.25C1.00736 13.332 0 14.3394 0 15.582C0 16.8247 1.00736 17.832 2.25 17.832H12.75V28.332C12.75 29.5747 13.7574 30.582 15 30.582C16.2426 30.582 17.25 29.5747 17.25 28.332V17.832H27.75C28.9926 17.832 30 16.8247 30 15.582C30 14.3394 28.9926 13.332 27.75 13.332H17.25V2.83203C17.25 1.58939 16.2426 0.582031 15 0.582031Z"
                fill={mouseOnCta ? "#AAA" : "#D9D9D9"}
              />
            </svg>
          </div>
        </Grid>}
      </Grid>

      <div className="custom-test-list-pagination">
        {total > CUSTOM_TEST_LIMIT && <Pagination
          count={Math.ceil((total || 1) / CUSTOM_TEST_LIMIT)}
          page={page}
          onChange={(_evt, page) => handleChangePage(page)}
          shape="rounded"
        />}
      </div>
    </>
}

export default CustomTestList;