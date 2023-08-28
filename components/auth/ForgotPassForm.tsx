import { Button, Container } from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useSnackbar } from "notistack";
import { PropsWithoutRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "../../app/hooks";
import { ROUTER_RESET_PASSWORD } from "../../app/router";
import { requestResetPassword } from "../../features/auth/auth.slice";
import { LOGIN_SUCCESS } from "../../modules/share/constraint";
import { isValidEmail } from "../../utils/format";
import AuthInput from "./AuthInput";
import './style.scss';

type AuthFormForgotPass = {
  email: string;
}

const getSiteName = (siteAddress: string) => {
  try {
    return new URL(siteAddress).hostname;
  } catch (e) {
    return "";
  }
}

const ForgotPassForm = (props: PropsWithoutRef<{
  onClickBack?: () => void;
}>) => {
  const { onClickBack } = props;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthFormForgotPass>();
  const appInfo = useSelector((state) => state.appInfos.appInfo);
  const dispatch = useDispatch();

  const onClickSubmit = (values: AuthFormForgotPass) => {
    const { email } = values;
    const host = (process.env.NODE_ENV !== "production" ? '' : (appInfo.siteAddress ?? ''));
    dispatch(requestResetPassword({
      email,
      clientUrl: `${host || 'http://localhost:3000'}/${ROUTER_RESET_PASSWORD}`,
      appName: getSiteName(appInfo.siteAddress)
    }));

    reset({ email: '' })
  }

  return <div className="auth-form" onKeyDown={(event) => {
    if(event.key === "Enter") { 
      (handleSubmit((values) => onClickSubmit(values)))()
    }
  }}>
    <Container maxWidth="xl">
      <div className="title">Reset your password</div>
      <div style={{ marginBottom: '10px' }}>
        <Button onClick={onClickBack} size='large' color="inherit" startIcon={<ArrowBackIosNewIcon />}>
          Back
        </Button>
      </div>
      <div className="desc">Lost your password? Please enter your email address. You will receive a link to create a new password via email.</div>
      <div className="auth-form-item">
        <label htmlFor="email" className="item-name">Email</label>
        <div className="input-item">
          <AuthInput
            id="email"
            autoComplete="email"
            fullWidth
            placeholder="Email"
            {...register("email", { required: true, validate: (email) => isValidEmail(email) })}
          />
          {errors.email?.type === "validate" && <div className="auth-error-msg">Invalid email</div>}
        </div>
      </div>

      <div className="auth-form-btn">
        <Button
          className="btn-submit"
          onClick={handleSubmit((values) => onClickSubmit(values))}
        >
          RESET PASSWORD
        </Button>
      </div>
    </Container>
  </div>
}

export default ForgotPassForm;