import { Container, Grid } from '@mui/material';
import classNames from "classnames";
import Image from 'next/image';
import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useSelector } from '../../app/hooks';
import "./style.scss";
import TitleReviewIcon from "./TitleReviewIcon";
import TitleReviewLeftIcon from "./TitleReviewLeftIcon";

const Review = () => {
  const { appName } = useSelector((state) => state.appInfos.appInfo);
  const titleReviewConf = useMemo(() => {
    let borderColor = "#fff"; let title1Color = "#fff"; let title2Color = "#fff";
    if (appName === "dmv") {
      borderColor = "#F5C718"; title2Color = "#FFDB20"
    } else if (appName === "toeic") {
      title2Color = "#828AFF";
    } else if (appName === "ged") {
      borderColor = "#FDCA33";
    } else if (appName === "hvac") {
      borderColor = "#6FB976"
    } else if (appName === "alevel") {
      borderColor = "#58CAF0"
    }
    return {
      borderColor, title1Color, title2Color
    }
  }, [appName]);
  return (
    <div id="review">
      <Image
        className="review-bg"
        src={`/images/app/${appName}/bg-review.png`}
        alt="background-review-section"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
      />
      <Container maxWidth="xl" className="review-main-section">
        {["hvac"].includes(appName) ?
          <div className="title-review left">
            <TitleReviewLeftIcon fill={titleReviewConf.title1Color} />
          </div>
          : <div className="title-review">
            <TitleReviewIcon
              borderColor={titleReviewConf.borderColor}
              title1Color={titleReviewConf.title1Color}
              title2Color={titleReviewConf.title2Color}
            />
          </div>}
        <Grid container spacing={2} gap="15px" className={classNames("main-reviewers-slides", appName)}>
          <Grid item xs={12} lg={8}>
            <Swiper
              key={1}
              autoplay={{ delay: 5000, disableOnInteraction: false }}
              slidesPerView={1}
              slidesPerGroup={1}
              spaceBetween={15}
              className="swiper-achievement"
              pagination={{
                clickable: true,
                el: ".swiper-pagination",
                renderBullet: function (index, className) {
                  return '<span class="' + className + '">' + (index + 1) + "</span>";
                }
              }}
            // pagination={true}
            >
              {[1, 2].map((item) => (
                <SwiperSlide key={item} style={{ width: "100%", height: "100%" }}>
                  <div className="ac-item" style={{ position: "relative", width: "100%", height: "100%" }} >
                    <img src={`/images/app/${appName}/review-${item}.png`} alt={`reviewer-${item}`} className="img-review" />
                    {/* <Image width="100%" height="100%" objectFit='contain' layout='responsive' src={`/images/app/${appName}/review-${item}.png`} alt={`reviewer-${item}`} className="img-review" /> */}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Review