import { Container, Rating, useMediaQuery, useTheme } from "@mui/material"
import classNames from "classnames"
import _ from "lodash"
import { useSelector } from "../../app/hooks"
import { apiLoadReviews } from "../../features/review/review.api"
import AppReview from "../../modules/share/model/appReview"
import { useEffect, useState } from "react"
import moment from "moment"
import BoxReview from "./BoxReview"

const bgrTexts = ["#F5F5F5", "#E5E5E5", "#D5D5D5", "#FFFF99", "#FFE5B4", "#CCCCCC", "#E6E6FA", "#FAEBD7", "#F0FFF0", "#FFE4E1"]

const ReviewVerTwo = () => {
    const theme = useTheme();
    const isPCUI = useMediaQuery(theme.breakpoints.up('xl'));
    const isTabletUI = useMediaQuery(theme.breakpoints.between("sm", "lg"));
    const isMobileUI = useMediaQuery(theme.breakpoints.down('sm'));
    const appInfo = useSelector((state) => state.appInfos)
    const [dataReview, setDataReview] = useState<AppReview[]>([]);
    const [bgrColor, setBgrColor] = useState<{ [_id: string]: string }>();

    useEffect(() => {
        setBgrColor(dataReview?.reduce((prev, data) => {
            return {
                ...prev,
                [data._id]: bgrTexts[Math.floor(Math.random() * bgrTexts.length)]
            }
        }, {}))
    }, [dataReview])

    return (
        <Container maxWidth="xxl">
            <div id="review-ver2">
                <div className="review-title">
                    <p>Happy customers are our true wealth</p>
                </div>
                <div className="sub-title">Thank you for your comments and experiences</div>
                <BoxReview className="bgr-linear"/>
            </div>
        </Container>
    )
}

export default ReviewVerTwo