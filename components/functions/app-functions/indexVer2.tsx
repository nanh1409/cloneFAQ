import { Grid } from "@mui/material";
import Image from "next/future/image";
import { useRouter } from "next/router";
import React, { CSSProperties, PropsWithoutRef } from "react";

type MapLocaleString = {
    [locale: string]: string;
}

type MapScreenStyle = { 
    [screen: string] : CSSProperties
}
  
type AppFunctionItemData = {
    icon: string;
    nameFunction: MapLocaleString; // title
    des: MapLocaleString;
    style?: MapScreenStyle
}

const appFunctionData: AppFunctionItemData[] = [
    {
        icon: "/images/app/toeic/icon-appfunction-1.svg", 
        nameFunction: {
            en: "Numerous practice questions",
            vi: "Nhiều câu hỏi thực hành"
        },
        des: {
            en: "A large number of practice questions with detailed explanations will help you become familiar with the test format and fully prepare for your test day.",
            vi: "Một số lượng lớn các câu hỏi thực hành với lời giải chi tiết sẽ giúp bạn làm quen với dạng bài kiểm tra và chuẩn bị đầy đủ cho ngày thi của mình."
        }, 
        style: {
            pc: {
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: "end",
            }, 
            tablet: {}
        }
    }, 
    {
        icon: "/images/app/toeic/icon-appfunction-2.svg", 
        nameFunction: {
            en: "Learning reminder",
            vi: "nhắc nhở học tập"
        },
        des: {
            en: "You will receive notifications reminding you to practice according to your own learning progress.",
            vi: "Bạn sẽ nhận được thông báo nhắc nhở luyện tập theo tiến độ học tập của bản thân."
        },
        style: {
            pc: {
                marginTop: 50,
                display: 'flex',
                flexDirection: 'column',
                alignItems: "end",
                textAlign: 'right'
            },
            tablet: {}
        }
    }, 
    {
        icon: "/images/app/toeic/icon-appfunction-4.svg", 
        nameFunction: {
            en: "Dark mode",
            vi: "Chế độ tối"
        },
        des: {
            en: "Dark mode will ease the strain on your eyes and enhance your user experience.",
            vi: "Chế độ tối sẽ giúp giảm mỏi mắt và nâng cao trải nghiệm người dùng của bạn."
        },
        style: {
            pc: {
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: "start",
            },
            tablet: {}
        }
    }, 
    {
        icon: "/images/app/toeic/icon-appfunction-3.svg", 
        nameFunction: {
            en: "Community connection",
            vi: "Kết nối cộng đồng"
        },
        des: {
            en: "You can discuss with other learners from around the world, which will broaden your knowledge and understanding.",
            vi: "Bạn có thể thảo luận với những người học khác từ khắp nơi trên thế giới, điều này sẽ mở rộng kiến ​​thức và hiểu biết của bạn."
        },
        style: {
            pc: {
                marginTop: 50,
                textAlign: 'left',
                display: 'flex',
                flexDirection: 'column',
                alignItems: "start",
            },
            tablet: {}
        }
    }, 
]

const AppFunctionItem = (props: PropsWithoutRef<{ icon: string, nameFunction: MapLocaleString, des: MapLocaleString, style?: MapScreenStyle, isTabletUI?: boolean }>) => {
    const { icon, nameFunction, des, style = {}, isTabletUI = false } = props
    const router = useRouter();
    
    return (
        <>
            {
                isTabletUI
                    ? (
                        <div style={{display: 'flex', alignItems: 'center', marginTop: 20}}>
                            <div className="app-function-item__icon">
                                <img alt={nameFunction[router.locale]} src={icon} width="40" height="40" />
                            </div>
                            <div className="app-function-item tablet" style={style[isTabletUI ? "tablet" : "pc"]}>
                            <div className="app-function-item__name">
                                {nameFunction[router.locale]}
                            </div>
                            <div className="app-function-item__des">
                                {des[router.locale]}
                            </div>
                        </div>
                        </div>
                    )
                    : (
                        <div className="app-function-item" style={style[isTabletUI ? "tablet" : "pc"]}>
                            <div className="app-function-item__icon">
                                <img alt={nameFunction[router.locale]} src={icon} width="40" height="40" />
                            </div>
                            <div className="app-function-item__name">
                                {nameFunction[router.locale]}
                            </div>
                            <div className="app-function-item__des">
                                {des[router.locale]}
                            </div>
                        </div>
                    )
            }
        </>
    )
}

const AppFunctionsVerTwo = (props: { isTabletUI: boolean }) => {
    const { isTabletUI } = props
    
    return (
        <div className="box-app-function">
            {
                isTabletUI
                    ? (
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <div className="app-function-center app-function-center-tablet">
                                    <div className="app-function-center__bg app-function-center-tablet__bg">
                                        <Image src="/images/app/toeic/bg-function-app.svg" />
                                    </div>
                                    <div className="app-function-center__phone app-function-center-tablet__phone">
                                        <Image src="/images/app/toeic/app.png" />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                {
                                    appFunctionData.map((data, i) => {
                                        return <AppFunctionItem key={i} {...data} isTabletUI/>
                                    })
                                }
                            </Grid>
                        </Grid>
                    )
                    : (
                        <Grid container spacing={0}>
                            <Grid item xs={3.2}>
                                <AppFunctionItem
                                    {...appFunctionData[0]}
                                />
                                <AppFunctionItem
                                    {...appFunctionData[1]}
                                />
                            </Grid>
                            <Grid item xs={5.6} position='relative'>
                                <div className="app-function-center">
                                    <div className="app-function-center__bg">
                                        <Image src="/images/app/toeic/bg-function-app.svg" />
                                    </div>
                                    <div className="app-function-center__phone">
                                        <Image src="/images/app/toeic/app.png" />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={3.2}>
                                <AppFunctionItem
                                    {...appFunctionData[2]}
                                />
                                <AppFunctionItem
                                    {...appFunctionData[3]}
                                />
                            </Grid>
                        </Grid>
                    )
            }
        </div>
    )
}

export default AppFunctionsVerTwo