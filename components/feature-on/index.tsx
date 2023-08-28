import DownloadAppVerTwo from "../download-app/indexVer2"
import "./style.scss"
import dynamic from "next/dynamic";

const DynamicFeatureOnContainer = dynamic(() => import('./FeatureOnContainer'), {
    ssr: false,
})

const FeatureApp = () => {
    return (
        <div id="app-feature">
            <DynamicFeatureOnContainer />
            <DownloadAppVerTwo />
        </div>
    )
}

export default FeatureApp