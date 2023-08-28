import { Container } from '@mui/material'
import React, { useEffect } from 'react'

const RegisterSuccess = (props: { redirectURI: string }) => {
  const { redirectURI } = props;
  useEffect(() => {
    setTimeout(() => {
      window.location.replace(redirectURI);
    }, 1000);
  }, []);

  return (
    <div className="auth-form">
      <Container maxWidth="xl" style={{ padding: "50px 0" }}>
        <div className="title">REGISTER SUCCESSFULLY</div>
      </Container>
    </div>
  )
}

export default RegisterSuccess