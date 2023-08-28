import { Grid } from "@mui/material";
import { useRouter } from "next/router";
import { useMemo, useState } from 'react';
import AppFunctionItem from "./AppFunctionItem";
import IconAppFunctionCommunityConnect from "./IconAppFunctionCommunityConnect";
import IconAppFunctionDailyGoal from "./IconAppFunctionDailyGoal";
import IconAppFunctionMultiQuestionsSets from "./IconAppFunctionMultiQuestionsSets";

const iconColor = (indexHover: number, index: number) => {
    return indexHover === index ? "var(--iconHoverAppFcColor)" :"var(--iconAppFcColor)"
}

const AppFunctions = () => {
    const router = useRouter();
    const [indexHover, setIndexHover] = useState<number>();
    const contentAppFunctions = useMemo(() => (
        [
            {
                icon: <IconAppFunctionMultiQuestionsSets iconColor={iconColor(indexHover, 0)} />,
                title: {
                    "en": "Multiple sets of questions",
                    "vi": "Bộ câu hỏi đa dạng"
                },
                des: {
                    "en": "A variety of practice test questions on different topics will help you familiarize with the test format and get 100% ready for your test day.",
                    "vi": "Ngân hàng câu hỏi đa dạng với nhiều chủ đề khác nhau sẽ giúp bạn làm quen với cấu trúc đề thi thật và sẵn sàng 100% cho kỳ thi của mình"
                }
            },
            {
                icon: <IconAppFunctionDailyGoal iconColor={iconColor(indexHover, 1)} />,
                title: {
                    "en": "Daily Review Calendar",
                    "vi": "Nhắc nhở lịch học hằng ngày"
                },
                des: {
                    "en": "Notifications remind you about practicing on a daily basis according to your own study.",
                    "vi": "App sẽ gửi thông báo nhắc nhở bạn lịch học mỗi ngày dựa trên tiến trình học của bạn"
                }
            },
            {
                icon: <IconAppFunctionCommunityConnect iconColor={iconColor(indexHover, 2)} />,
                title: {
                    "en": "Connect To Community",
                    "vi": "Kết nối với cộng đồng"
                },
                des: {
                    "en": "Having discussions with other learners across boundaries helps to broaden your knowledge.",
                    "vi": "Thảo luận với cộng đồng người học sẽ giúp bạn mở mang kiến thức"
                }
            },
            {
                icon: <IconAppFunctionDailyGoal iconColor={iconColor(indexHover, 3)} />,
                title: {
                    "en": "Easy To Access",
                    "vi": "Dễ dàng tiếp cận"
                },
                des: {
                    "en": "Study anywhere and anytime with just a smartphone connected with the Internet. Additionally, the offline mode is also available.",
                    "vi": "Chỉ cần một chiếc điện thoại có kết nối internet, bạn có thể học mọi lúc, mọi nơi. Ngoài ra, bạn còn có thể học offline"
                }
            },
        ]
    ), [indexHover])

    const handleAppFunctionMouseEvent = (index: number, hovering: boolean) => {
        if(!hovering) setIndexHover(-1);
        else setIndexHover(index)
    }

    return <Grid container spacing="3px">
        {
            contentAppFunctions.map((content, index) => (
                <Grid key={index} item xs={12} sm={6} lg={3}>
                    <div 
                        onMouseEnter={() => handleAppFunctionMouseEvent(index, true)}
                        onMouseLeave={() => handleAppFunctionMouseEvent(index, false)}
                    >
                        <AppFunctionItem icon={content.icon} title={content.title[router.locale]} description={content.des[router.locale]}/>
                    </div>
                </Grid>
            ))
        }
    </Grid>
}

export default AppFunctions