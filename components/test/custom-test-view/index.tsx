import Close from "@mui/icons-material/Close";
import { Checkbox, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, Link } from "@mui/material";
import { styled } from "@mui/styles";
import classNames from "classnames";
import _ from "lodash";
import { useSnackbar } from "notistack";
import { PropsWithoutRef, useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "../../../app/hooks";
import { ROUTER_STUDY } from "../../../app/router";
import GoogleAdsense from "../../../features/ads/google-adsense";
import { CreateCustomTestStatus, customTestPageKey, CUSTOM_TEST_LIMIT, fetchCustomTests, fetchCustomTestSamples, requestAddCustomTest, setCreateCustomTestStatus, setCurrentCustomTestList, setCustomTestList, setCustomTestPage, setMouseOnCta, setOpenCreateModal, setSelectedSamples, setTotalCustomTest } from "../../../features/custom-test/customTest.slice";
import useCustomTestConfig from "../../../features/custom-test/useCustomTestConfig";
import { CARD_STUDY_ORDER_NONE } from "../../../modules/share/constraint";
import AppSetting from "../../../modules/share/model/appSetting";
import MockTest from "../../../modules/share/model/mockTest";
import WebSeo from "../../../modules/share/model/webSeo";
import CtaButton from "../../CtaButton";
import DialogTransitionDown from "../../DialogTransitionDown";
import Introduction from "../../introduction";
import Loading from "../../loading/Loading";
import TestItem from "../../test-item";
import CustomTestCheckedIcon from "./CustomTestCheckedIcon";
import CustomTestClockIcon from "./CustomTestClockIcon";
import CustomTestList from "./CustomTestList";
import CustomTestQNumIcon from "./CustomTestQNumIcon";
import CustomTestSlider from "./CustomTestSlider";
import CustomTestUncheckIcon from "./CustomTestUncheckIcon";
import "./customTestView.scss";

const CustomizeTestCheckbox = styled(Checkbox)({ padding: 0 });

const CustomTestView = (props: PropsWithoutRef<{
  disableCustomTest?: boolean;
  seoInfo?: WebSeo
}>) => {
  const { disableCustomTest, seoInfo } = props;
  // const { titleH1 = '', summary = '' } = useMapSeo ? (useSeoInfo() || {} as WebSeo) : useSelector((state) => state.appInfos.seoInfo || {} as WebSeo);
  const { appName, courseIds } = useSelector((state) => state.appInfos.appInfo || {} as AppSetting);
  const { user, userId, loading: authLoading } = useSelector((state) => state.authState);
  const testList = useSelector((state) => state.appInfos.testList);
  const openCreateTestModal = useSelector((state) => state.customTestState.openCreateModal);
  const allCustomTests = useSelector((state) => state.customTestState.list);
  const testSamples = useSelector((state) => state.customTestState.samples);
  const selectedSamples = useSelector((state) => state.customTestState.selectedSamples);
  const fetchedSamples = useSelector((state) => state.customTestState.fetchedSamples);
  const mouseOnCta = useSelector((state) => state.customTestState.mouseOnCta);
  const createCustomTestStatus = useSelector((state) => state.customTestState.createStatus);
  const customTestConfig = useCustomTestConfig();

  const [questionsNum, setQuestionsNum] = useState<number>(customTestConfig?.questionsNum ?? 1);
  const [duration, setDuration] = useState<number>(customTestConfig?.duration ?? 1);

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!!customTestConfig && !fetchedSamples && !!courseIds) {
      const sampleSlugs: string[] = customTestConfig?.sampleSlugs ?? [];
      dispatch(fetchCustomTestSamples({
        courseId: courseIds[customTestConfig?.courseIndex || 0], slugs: sampleSlugs
      }));
    }
  }, [customTestConfig, fetchedSamples]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      let page = +(window.localStorage.getItem(customTestPageKey) || 1);
      if (isNaN(page)) page = 1;
      if (!authLoading && customTestConfig) {
        if (!user) {
          let _list = allCustomTests.filter((e) => e.userId === userId && e.courseId === courseIds[customTestConfig?.courseIndex || 0]);
          _list = [..._list].map((e, i) => { const _e = { ...e }; _e.title = `My Test ${_list.length - i}`; return _e; });
          dispatch(setCustomTestList(_list));
          dispatch(setTotalCustomTest(_list.length));
          let _data: MockTest[] = [];
          if (page > Math.ceil(_list.length || 1) / CUSTOM_TEST_LIMIT) page = 1;
          _data = _list.slice((page - 1) * CUSTOM_TEST_LIMIT, page * CUSTOM_TEST_LIMIT);
          dispatch(setCurrentCustomTestList(_data));
          dispatch(setCustomTestPage(page));
        } else {
          dispatch(fetchCustomTests({ courseId: courseIds[customTestConfig?.courseIndex || 0], userId, skip: (page - 1) * CUSTOM_TEST_LIMIT }));
          dispatch(setCustomTestPage(page));
        }
      }
    }
  }, [authLoading, customTestConfig]);

  useEffect(() => {
    if (createCustomTestStatus === CreateCustomTestStatus.FINISH) {
      enqueueSnackbar("Created!", { variant: "info" });
      handleCloseCreateTestModal();
      dispatch(setCreateCustomTestStatus(CreateCustomTestStatus.INIT));
    } else if (createCustomTestStatus === CreateCustomTestStatus.ERROR) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
      handleCloseCreateTestModal();
      dispatch(setCreateCustomTestStatus(CreateCustomTestStatus.INIT));
    }
  }, [createCustomTestStatus])

  const handleCreateCustomTest = () => {
    if (createCustomTestStatus === CreateCustomTestStatus.CREATING) return;
    dispatch(setCreateCustomTestStatus(CreateCustomTestStatus.CREATING));
    const excludedCardIds: string[] = [];
    if (!user) {
      const _cardIds = allCustomTests[0]?.cardIds ?? [];
      excludedCardIds.push(..._cardIds);
    }
    const courseId = courseIds[customTestConfig?.courseIndex || 0];
    dispatch(requestAddCustomTest({
      userId,
      courseId,
      cardStudyOrder: CARD_STUDY_ORDER_NONE,
      duration,
      questionsNum,
      offline: !user,
      topicIds: selectedSamples.length === testSamples.length ? undefined : selectedSamples,
      excludedCardIds,
      pass: customTestConfig.pass || 0
    }));
  }

  const onClickCustomizeTest = useCallback(() => {
    if (!openCreateTestModal) {
      dispatch(setOpenCreateModal(true));
    }
  }, [openCreateTestModal]);

  const handleCloseCreateTestModal = () => {
    dispatch(setOpenCreateModal(false));
  }

  return <>
    <div id="custom-test-view">
      <Container maxWidth="xl" className="custom-test-view">
        <GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "20px 0" }} />
        <h1 className="custom-test-view-title-h1">{seoInfo?.titleH1}</h1>
        <div className="custom-test-view-summary" dangerouslySetInnerHTML={{ __html: seoInfo?.summary }}></div>

        {!disableCustomTest && <>
          <div className="cta-custom-test-container">
            <div onMouseEnter={() => dispatch(setMouseOnCta(true))} onMouseLeave={() => dispatch(setMouseOnCta(false))}>
              <CtaButton
                title="Customize Test"
                color={`var(--btnTestTitleColor)`}
                startIcon={<svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M33.9927 10.6938C34.4565 10.239 34.8671 10.1371 35.3511 10.35C35.824 10.5556 36.1192 11.0613 35.9542 11.5452C35.6721 12.3753 35.3499 13.1921 35.0277 14.0089C34.9919 14.0997 34.956 14.1905 34.9203 14.2814C34.064 16.458 33.2049 18.6338 32.3457 20.8099C31.9928 21.7039 31.6397 22.598 31.2869 23.4922C30.9789 24.2745 30.7039 24.4655 29.868 24.4655H6.27681C5.45555 24.4655 5.1824 24.2818 4.87259 23.5195C3.30339 19.6645 1.73602 15.8114 0.168653 11.9564C0.113657 11.8199 0.0568286 11.6817 0 11.5452V11.1268C0.342805 10.3918 0.83593 10.0935 1.42988 10.31C1.66086 10.3936 1.87534 10.5665 2.055 10.7411C3.578 12.2313 5.09463 13.7278 6.61127 15.2244C6.91468 15.5237 7.21808 15.8231 7.52154 16.1225C7.58285 16.1833 7.64682 16.2415 7.72277 16.3106C7.75583 16.3406 7.79115 16.3728 7.82951 16.4081C7.94589 16.07 8.06041 15.7377 8.17367 15.409C8.37976 14.8109 8.58165 14.225 8.78277 13.6392C8.9285 13.2162 9.07241 12.7928 9.21631 12.3694C9.36022 11.9459 9.50412 11.5225 9.64986 11.0995C9.978 10.1462 10.6966 9.90427 11.5435 10.4628C12.5958 11.1577 13.648 11.8545 14.7003 12.5513C14.759 12.5909 14.819 12.6292 14.8867 12.6726C14.9373 12.7049 14.9922 12.7401 15.0541 12.7805C15.2746 12.018 15.4925 11.2637 15.7097 10.5117C16.0035 9.49476 16.296 8.48209 16.5921 7.4592C15.5839 6.97892 14.8671 6.23666 14.5481 5.15785C14.3226 4.39922 14.3465 3.64241 14.6288 2.90016C15.1971 1.40656 16.6691 0.487837 18.3116 0.589715C19.7745 0.682497 21.1696 1.86865 21.5087 3.31677C21.8478 4.76671 21.3071 6.54594 19.4152 7.46284C19.9175 9.20022 20.4216 10.9449 20.9349 12.7259C20.9733 12.7033 21.0089 12.6827 21.0426 12.6633C21.12 12.6185 21.1869 12.5798 21.2521 12.5367C21.5998 12.3069 21.9476 12.0768 22.2953 11.8467C22.9906 11.3867 23.686 10.9266 24.3813 10.4682C25.2447 9.89881 25.9542 10.1426 26.2915 11.1232C26.5839 11.9746 26.8758 12.8264 27.1677 13.6783C27.4597 14.5302 27.7516 15.382 28.044 16.2334C28.0642 16.2953 28.0935 16.3571 28.2383 16.51C28.2589 16.4743 28.2773 16.4366 28.2956 16.399C28.3343 16.3194 28.3729 16.24 28.4326 16.1807C30.2841 14.3487 32.1375 12.5204 33.9927 10.6938ZM12.5511 21.0804C12.5761 21.1037 12.6025 21.1283 12.6306 21.1545C12.998 19.8879 13.3586 18.6402 13.7194 17.3916C13.9509 16.5904 14.1825 15.7889 14.4161 14.9818C13.3859 14.3014 12.3758 13.6337 11.3621 12.9624C11.351 12.9814 11.3411 12.997 11.3325 13.0107C11.3155 13.0378 11.3034 13.0571 11.2961 13.0789C11.2508 13.2103 11.2056 13.3416 11.1604 13.473C10.6463 14.9663 10.1321 16.46 9.63336 17.9599C9.60037 18.06 9.67919 18.2419 9.76535 18.3274C10.4913 19.0587 11.2253 19.782 11.9593 20.5054C12.0817 20.6259 12.204 20.7465 12.3263 20.8671C12.3945 20.9347 12.4649 21.0002 12.5511 21.0804ZM23.9138 20.6815C24.7288 19.8616 25.5084 19.0773 26.2805 18.2855C26.3373 18.2273 26.3391 18.0727 26.3116 17.9799C26.1541 17.4873 25.9858 16.9983 25.8173 16.5091C25.7779 16.3948 25.7386 16.2805 25.6994 16.1661C25.5084 15.6089 25.3179 15.0517 25.126 14.4906C24.9515 13.98 24.7758 13.4661 24.5976 12.9461C24.3156 13.1319 24.0365 13.3167 23.7591 13.5004C23.1186 13.9245 22.4873 14.3425 21.8515 14.7526C21.6462 14.8854 21.582 15 21.6572 15.2529C22.0294 16.4942 22.3891 17.74 22.7489 18.986C22.8463 19.3231 22.9436 19.6603 23.0412 19.9975C23.1023 20.2105 23.1645 20.4229 23.2321 20.6536C23.2823 20.8249 23.3354 21.0063 23.3932 21.2054C23.5685 21.029 23.7419 20.8545 23.9138 20.6815ZM30.0804 27.0902C30.1348 27.0898 30.1889 27.0894 30.2438 27.0907C30.9844 27.1107 31.4134 27.5345 31.4226 28.2786C31.4317 28.9644 31.428 29.6501 31.4244 30.3359V30.3362C31.4189 31.1603 30.9972 31.5824 30.1668 31.5824C27.4562 31.5836 24.7455 31.5832 22.0348 31.5828C20.6795 31.5826 19.3242 31.5824 17.9688 31.5824H5.84052C4.88176 31.5824 4.49679 31.2022 4.49496 30.258C4.49496 30.0554 4.49447 29.853 4.49397 29.6507C4.49282 29.1789 4.49166 28.7074 4.49679 28.235C4.50413 27.5382 4.93126 27.1161 5.63703 27.0925C5.70715 27.0897 5.77726 27.0901 5.84737 27.0904C5.87075 27.0905 5.89413 27.0907 5.91751 27.0907H29.9982C30.0257 27.0907 30.0531 27.0904 30.0804 27.0902Z" fill={`var(--btnTestTitleColor)`} />
                </svg>}
                width={384}
                breakpoint={576}
                borderRadius={50}
                backgroundColor={`var(--btnTestBackground)`}
                backgroundLayerColor={`var(--btnTestBackgroundLayer)`}
                titleClassName="cta-custom-test-title"
                buttonClassName={classNames("cta-custom-test-button", mouseOnCta ? "active" : "")}
                onClick={onClickCustomizeTest}
              />
            </div>
          </div>

          <div className="custom-test-view-list">
            <CustomTestList />
          </div>
        </>}

        {!!testList.length && <div className="custom-test-view-sample">
          <h2 className="custom-test-view-title-h2">Full Test</h2>
          <div className="custom-test-view-sample-list">
            <Grid container spacing={2}>
              {testList.map((topic, i) => {
                const link = `/${ROUTER_STUDY}/test/${topic.slug}-${topic._id}`;
                const avatar = `/images/app/${appName}/test/${1 + (i % CUSTOM_TEST_LIMIT)}.png`;
                return <Grid key={topic._id} item xs={12} sm={6} md={2.4}>
                  <Link href={link} underline="none" color="inherit">
                    <TestItem item={{ ...topic, avatar }} meta={[
                      { name: "Questions", value: topic.topicExercise?.questionsNum },
                      { name: "Time", value: topic.topicExercise?.duration }
                    ]} />
                  </Link>
                </Grid>
              })}
            </Grid>
          </div>
        </div>}
        {/* <GoogleAdsense name="TestBannerAds" style={{ marginTop: 50 }} /> */}
        <GoogleAdsense name="The_Leaderboard" height={90} style={{ margin: "20px 0" }} />
      </Container>
      <Introduction content={seoInfo?.content ?? ""} />
    </div>

    <Dialog
      open={openCreateTestModal}
      fullWidth
      maxWidth="lg"
      onClose={handleCloseCreateTestModal}
      TransitionComponent={DialogTransitionDown}
      PaperProps={{ id: "customize-test-modal" }}
    >
      <DialogTitle className="custom-test-modal-title">
        Customize Test
        <IconButton className="custom-test-modal-close" onClick={handleCloseCreateTestModal}>
          <Close color="inherit" fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent className="custom-test-modal-content">
        {fetchedSamples
          ? <>
            <Grid container rowSpacing={{ xs: 1, md: 4 }}>
              {testSamples.map((e) => {
                const checked = _.includes(selectedSamples, e._id);
                return <Grid
                  item xs={12} sm={6} md={4}
                  key={e._id} className="custom-test-sample-item"
                >
                  <CustomizeTestCheckbox
                    className="custom-test-checkbox"
                    checkedIcon={<CustomTestCheckedIcon fill="#81BA23" />}
                    icon={<CustomTestUncheckIcon />}
                    checked={checked}
                    onChange={(evt) => {
                      const checked = evt.target.checked;
                      if (checked) {
                        dispatch(setSelectedSamples([...selectedSamples, e._id]));
                      } else {
                        if (selectedSamples.length === 1) return;
                        dispatch(setSelectedSamples(_.filter(selectedSamples, (s) => s !== e._id)))
                      }
                    }}
                  />
                  <div className="custom-test-sample-title">{e.name}</div>
                </Grid>
              })}
            </Grid>

            <Grid container rowSpacing={2} className="custom-test-options-wrap">
              <Grid item xs={12} sm={6} className="custom-test-option">
                <div className="custom-test-option-label-wrap">
                  <CustomTestQNumIcon />
                  <div className="custom-test-option-label">
                    Question numbers
                  </div>
                </div>

                <div className="custom-test-option-slider">
                  <CustomTestSlider
                    color="#81BA23"
                    value={questionsNum}
                    onChange={(value) => setQuestionsNum(value)}
                    min={1}
                    max={customTestConfig?.questionsNum ?? 200}
                  />
                </div>
              </Grid>

              <Grid item xs={12} md={6} className="custom-test-option">
                <div className="custom-test-option-label-wrap">
                  <CustomTestClockIcon />
                  <div className="custom-test-option-label">
                    Duration (in Minutes)
                  </div>
                </div>

                <div className="custom-test-option-slider">
                  <CustomTestSlider
                    color="#81BA23"
                    value={duration}
                    onChange={(value) => setDuration(value)}
                    min={1}
                    max={customTestConfig?.duration ?? 200}
                  />
                </div>
              </Grid>
            </Grid>
          </>
          : <>
            <Loading />
          </>
        }

        <div className="custom-test-create-button">
          <CtaButton
            title="Create Test"
            width={200}
            breakpoint={0}
            color={`var(--btnTestTitleColor)`}
            backgroundColor={`var(--btnTestBackground)`}
            backgroundLayerColor={`var(--btnTestBackgroundLayer)`}
            borderRadius={15}
            buttonClassName="cta-create-test"
            onClick={handleCreateCustomTest}
          />
        </div>

        {createCustomTestStatus === CreateCustomTestStatus.CREATING && <div className="custom-test-modal-loading">
          <CircularProgress color="inherit" />
        </div>}
      </DialogContent>
    </Dialog>
  </>
}

export default CustomTestView;