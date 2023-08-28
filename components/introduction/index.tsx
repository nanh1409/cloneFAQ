import { Container } from '@mui/material';
import { useRouter } from "next/router";
import { PropsWithoutRef, useRef, useState } from 'react';
import { useSelector } from '../../app/hooks';
import useSeoInfo from "../../features/appInfo/useSeoInfo";
import useAppConfig from "../../hooks/useAppConfig";
import WebSeo from "../../modules/share/model/webSeo";
import './style.scss';

const Introduction = (props: PropsWithoutRef<{
    useMapSeo?: boolean;
    content?: string;
}>) => {
    const { useMapSeo, content } = props;
    // const { seoInfo } = useSelector((state) => state.appInfos);
    const seoInfo = useMapSeo ? (useSeoInfo() || {} as WebSeo) : useSelector((state) => state.appInfos.seoInfo);
    const _content = typeof content !== "undefined" ? content : seoInfo?.content;
    const data = useAppConfig();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const [showContent, setShowContent] = useState(false);

    const router = useRouter();

    return (
        <div id="introduction">
            <Container maxWidth="xl">
                <div className="list-intro read-more" ref={contentRef} dangerouslySetInnerHTML={{ __html: _content }}></div>
                {!!_content && (!showContent
                    ? <div className="btn-show-content" onClick={() => {
                        setShowContent(true)
                        contentRef.current.classList.remove('read-more')
                    }}>{data.multiLocales && router.locale === "vi" ? "Xem thêm" : "Show more"}</div>
                    : <div className="btn-show-content" onClick={() => {
                        setShowContent(false)
                        contentRef.current.classList.add('read-more')
                    }}>{data.multiLocales && router.locale === "vi" ? "Ẩn bớt" : "Show less"}</div>
                )}
            </Container>
        </div>
    )
}

export default Introduction