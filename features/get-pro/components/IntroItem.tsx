import { memo } from "react";
import "./IntroItem.scss";
import Image from "next/future/image";
import { useRouter } from "next/router";

const IntroItem = memo((props: {
    title: string,
    des: string,
    img: string,
    /** phan tram */
    widthContent?: number,
    style?: React.CSSProperties,
    colorText?: string,
    colorDes?: string,
    styleImg: React.CSSProperties,
    alt?: string,
    lang?: string
}) => {
    const { title, des, img, style = {}, widthContent = 70, colorText = "var(--titleColor)", colorDes = "var(--descriptionColor)", styleImg, alt = "...loading", lang } = props;
    return (
        <div className="intro-item" style={style}>
            <div className="title" style={{ width: `${widthContent}%`, color: colorText }}>
                {title}
            </div>
            <div className="description" style={{ width: `${widthContent}%`, color: colorDes, fontSize: lang === "fr" ? 18 : 22 }}>{des}</div>
            {/* <img className="image" src={img} style={styleImg} alt={alt} loading="lazy" /> */}
            <Image className="image" src={img} style={styleImg} alt={alt} loading="lazy" />
        </div>
    )
})

export default IntroItem;