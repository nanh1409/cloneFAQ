import { ReactNode, memo } from "react"
import "./PlanItem.scss"
import classNames from "classnames"
import Image from "next/future/image";
import { useRouter } from "next/router";

const PlanItem = memo((props: {
    icon: ReactNode,
    title: string,
    subTitle: string,
    services: string[],
    button: ReactNode,
    isRecommend?: boolean,
    className?: string,
    lang?: string
}) => {
    const { icon, title, subTitle, services, button, isRecommend = false, className, lang } = props
    return (
        <div className={classNames("plan-box", className)}>
            {isRecommend && <Image src="/images/get-pro/icon-plan-like.svg" width="65" height="65" className="icon-plan-like" loading="lazy" alt="recommend icon" />}
            <div className="plan-box-header">
                <div className="first-header">
                    {icon}
                    <p>{title}</p>
                </div>
                <div className="plan-box-sub-title">
                    {subTitle}
                </div>
            </div>
            <div className={classNames("plan-box-body", lang)}>
                {
                    services?.map((service, indx) => (
                        <div key={indx} className="plan-box-body-service">
                            <Image src="/images/get-pro/icon-plan-service.svg" loading="lazy" alt="service icon" width={30} height={27} />
                            <span>{service}</span>
                        </div>
                    ))
                }
            </div>
            <div className="plan-box-button">
                {button}
            </div>
        </div>
    )
})

export default PlanItem