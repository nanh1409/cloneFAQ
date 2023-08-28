import { MouseEventHandler, ReactNode, memo } from "react";
import "./AudienceItem.scss"
import classNames from "classnames";
import { useRouter } from "next/router";
import { useMediaQuery, useTheme } from "@mui/material";

const AudienceItem = memo((props: {
    icon: ReactNode,
    title: string,
    description: string,
    isHighlight?: boolean,
    onMouseOver?: MouseEventHandler<HTMLDivElement>,
    onMouseLeave?: MouseEventHandler<HTMLDivElement>,
    lang?: string
}) => {
    const { icon, title, description, isHighlight = false, onMouseOver = () => { }, onMouseLeave = () => { }, lang } = props;
    const theme = useTheme();
    const downXl = useMediaQuery(theme.breakpoints.down("xl"))
    const isTablet = useMediaQuery('(max-width: 780px)')
    const upSm = useMediaQuery(theme.breakpoints.up("sm"))

    return (
        <div className={classNames("audience-item",
            lang,
            isHighlight ? "audience-item-highlight" : "",
            (!downXl || isTablet && upSm) ? "from-sm-to-tablet-or-downXl" : "",
            isTablet ? "tablet" : ""
        )}
            onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}
        >
            <div className="icon-box">{icon}</div>
            <div className="line-box"></div>
            <div className="content-box">
                <div className="title">
                    {title}
                </div>
                <div className="description">
                    {description}
                </div>
            </div>
        </div>
    )
})

// 780

export default AudienceItem;