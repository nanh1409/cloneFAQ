import { Container } from '@mui/material'
import React, { useEffect } from 'react'

const LoginSuccess = (props: { redirectURI?: string }) => {
  const { redirectURI } = props;
  useEffect(() => {
    setTimeout(() => {
      window.location.replace(redirectURI);
    }, 1000);
  }, []);

  return (
    <div className="auth-form">
      <Container maxWidth="xl" style={{ padding: "50px 0" }}>
        <div className="title">LOGIN SUCCESSFULLY</div>
      </Container>
    </div>
  )
}

export default LoginSuccess