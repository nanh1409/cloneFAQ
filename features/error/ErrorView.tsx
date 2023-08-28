import { Button, Grid } from "@mui/material";
import { PropsWithoutRef } from "react";
import RawLink from "../../components/RawLink";
import "./errorView.scss";
import NotFoundImage from "./NotFoundImage";

export type ErrorViewProps = {
  errorCode?: number;
  message?: string
}

const ErrorView = (props: PropsWithoutRef<ErrorViewProps>) => {
  const { errorCode = 500, message = 'Internal Server Error' } = props;
  return <Grid container className="error-view">
    <Grid item xs={12} sm={6} className="error-info error-general-info">
      {message === "Not Found"
        ? <NotFoundImage color={`var(--titleColor)`} />
        : <span style={{ fontSize: 28, fontWeight: "bold" }}>¯\_(ツ)_/¯</span>}
      <div className="error-name">{
        message === "Not Found"
          ? <>Page <b>Not Found</b></>
          : <>{message}</>
      }</div>
    </Grid>

    <Grid item xs={12} sm={6} className="error-info error-details">
      <div className="alert">Oops!</div>
      <div className="error-code">Error code: {message === "Not Found" ? 404 : errorCode}</div>
      <div className="error-message">{message === "Not Found"
        ? "We can’t find the page you’re looking for!"
        : ""}</div>

      <RawLink href="/">
        <Button className="error-back-button">GO BACK HOME</Button>
      </RawLink>
    </Grid>
  </Grid>
};

export default ErrorView;