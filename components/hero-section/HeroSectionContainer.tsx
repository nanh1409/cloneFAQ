import { PropsWithChildren, ReactNode, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

const HeroSectionContainer = (props: PropsWithChildren<{
  useSlide?: boolean;
  slideItems?: Array<ReactNode>
}>) => {
  const {
    useSlide,
    slideItems = [],
    children
  } = props;
  const renderView = useCallback(() => {
    if (useSlide && !!slideItems.length) {
      return <div className="hero-section-swiper-slides-container">
        <Swiper
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          slidesPerView={1}
          spaceBetween={80}
          className="hero-section-swiper"
          autoHeight={true}
        >
          <SwiperSlide className="hero-section-swiper-slide">
            <div className="hero-section-swiper-slide-item">
              {children}
            </div>
          </SwiperSlide>

          {slideItems.map((item, index) => <SwiperSlide key={index} className="hero-section-swiper-slide">
            <div className="hero-section-swiper-slide-item">
              {item}
            </div>
          </SwiperSlide>)}
        </Swiper>
      </div>
    }
    return <>{children}</>
  }, [useSlide, slideItems, children])

  return <>{renderView()}</>
}

export default HeroSectionContainer;