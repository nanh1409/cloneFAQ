import { PropsWithoutRef } from "react";
import { wrapper } from "../app/store";
import ErrorFallback from "../features/error/ErrorFallback";

const Error = (props: PropsWithoutRef<{ statusCode?: number }>) => {
  const { statusCode = 500 } = props;
  return <ErrorFallback errorCode={statusCode} message={`Error (${statusCode})`} />
}

export const getServerSideProps = wrapper.getServerSideProps(({ res }) => {
  const statusCode = res?.statusCode ?? 500;

  return {
    props: {
      statusCode
    }
  }
})

export default Error;