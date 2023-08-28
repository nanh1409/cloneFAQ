import { Rating, useMediaQuery, useTheme } from "@mui/material"
import classNames from "classnames"
import _ from "lodash"
import { useSelector } from "../../app/hooks"
import { apiLoadReviews } from "../../features/review/review.api"
import AppReview from "../../modules/share/model/appReview"
import { memo, useEffect, useState } from "react"
import moment from "moment"
import "./style.scss"
import Image from "next/image";

const bgrTexts = ["#F5F5F5", "#E5E5E5", "#D5D5D5", "#FFFF99", "#FFE5B4", "#CCCCCC", "#E6E6FA", "#FAEBD7", "#F0FFF0", "#FFE4E1"]

const BoxReview = memo((props: { className?: string, height?: number }) => {
    const theme = useTheme();
    const isPCUI = useMediaQuery(theme.breakpoints.up('xl'));
    const isTabletUI = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));
    const appInfo = useSelector((state) => state.appInfos)
    const [dataReview, setDataReview] = useState<AppReview[]>([]);
    const [bgrColor, setBgrColor] = useState<{ [_id: string]: string }>();

    useEffect(() => {
        handleLoadReview();
    }, [])

    useEffect(() => {
        setBgrColor(dataReview?.reduce((prev, data) => {
            return {
                ...prev,
                [data._id]: bgrTexts[Math.floor(Math.random() * bgrTexts.length)]
            }
        }, {}))
    }, [dataReview])

    const handleLoadReview = async () => {
        const dataReview = await apiLoadReviews({
            appId: appInfo.appInfo._id,
            keySort: {
                "lastUpdate": -1
            }
        })
        setDataReview(dataReview.data);
    }
    return (
        <div className={classNames("review-box", props.className)} style={{ height: isMobileUI ? (props.height || 500) : (props.height || 650) }}>
            <div className={classNames("review-container", isMobileUI ? "review-container-mobile" : "")} style={{ columnCount: isTabletUI ? 2 : (isMobileUI ? 1 : 3) }}>
                {
                    dataReview?.map((data, key) => (
                        <div className="item-wrapper" key={key}>
                            <div className="review-box-item">
                                <div className="review-box-info" style={{ display: isPCUI || isMobileUI ? 'flex' : 'block', alignItems: 'center' }}>
                                    <div className="review-box-info__avatar">
                                        {data.avatar ? <Image
                                            src={data.avatar}
                                            alt={data.author}
                                            layout="fill"
                                            loading="lazy"
                                        /> : <div
                                            className="avatar-text"
                                            style={{ backgroundColor: bgrColor[data._id] }}
                                        >{data.author.charAt(0)}</div>}
                                    </div>
                                    <div>
                                        <div className="review-box-info__name">{data.author}</div>
                                        <div className="review-box-info__lastupdate">{data.lastUpdate}</div>
                                    </div>
                                </div>
                                <div className="review-box-content">
                                    {data.content}
                                </div>
                                <div className="review-box-rating">
                                    <Rating name="half-rating-read" value={data.rating} readOnly size="small" />
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
})

export default BoxReview