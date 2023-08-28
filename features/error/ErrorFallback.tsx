import { Container } from "@mui/material";
import { PropsWithoutRef } from "react";
import Layout from "../common/Layout";
import ErrorView, { ErrorViewProps } from "./ErrorView";

const ErrorFallback = (props: PropsWithoutRef<ErrorViewProps>) => {
  return <Layout title="Error" disableAds disableAuth disableDefaultHeader disableFBMessenger>
    <Container>
      <ErrorView {...props} />
    </Container>
  </Layout>
}

export default ErrorFallback;