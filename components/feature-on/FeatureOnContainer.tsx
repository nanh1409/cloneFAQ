import { Container } from "@mui/material"
import Image from "next/future/image";
import useAppConfig from "../../hooks/useAppConfig";

const FeatureOnContainer = () => {
    const appConfig = useAppConfig();

    return (
        <Container maxWidth="xxl" className="feature-container">
            <div className="feature-box-title">
                Featured on
            </div>
            <div className="feature-box-logo">
                {
                    appConfig.logoFeature?.map((logo, i) => (
                        <div className="feature-box-item" key={logo}><Image src={logo} alt={`featured-on-logo-${i}`} loading="lazy" /></div>
                    ))
                }
            </div>
        </Container>
    )
}

export default FeatureOnContainer