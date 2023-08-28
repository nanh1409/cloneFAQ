import { Container } from "@mui/material";
import Layout from "../features/common/Layout";
import ErrorView from "../features/error/ErrorView"

const ErrorNotFound = () => {
  return <Layout title="Page Not Found" disableDefaultHeader disableAds disableAuth disableFBMessenger>
    <Container maxWidth="xl">
      <ErrorView message="Not Found" />
    </Container>
  </Layout>
}

export default ErrorNotFound;