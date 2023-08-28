import { Button, Container } from "@mui/material";
import { useSnackbar } from "notistack";
import { PropsWithoutRef, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "../../app/hooks";
import { resetPassword } from "../../features/auth/auth.slice";
import { LOGIN_SUCCESS } from "../../modules/share/constraint";
import { encodePassword } from "../../utils/encryption";
import AuthInput from "./AuthInput";
import "./style.scss";

type AuthFormResetPass = {
  password: string;
  confirmPassword: string;
}

const ResetPassForm = (props: PropsWithoutRef<{
  onSuccess?: () => void,
  account?: string;
  userId?: string;
  token?: string;
}>) => {
  const {
    onSuccess = () => { },
    account,
    userId,
    token
  } = props;
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AuthFormResetPass>();
  const { enqueueSnackbar } = useSnackbar();
  const loginCode = useSelector((state) => state.authState.loginCode);
  const dispatch = useDispatch();
  const passwordRef = useRef<string>("");
  passwordRef.current = watch("password", "");

  const onClickSubmit = (values: AuthFormResetPass) => {
    const { password: _password } = values;
    dispatch(resetPassword({
      token, password: encodePassword(userId, _password)
    }));
  }

  useEffect(() => {
    if (loginCode !== null && loginCode !== LOGIN_SUCCESS) {
      enqueueSnackbar("Something went wrong!!", { variant: "error" })
    } else if (loginCode === LOGIN_SUCCESS) {
      enqueueSnackbar("Password has been reset successfully!!", { variant: "success" })
      onSuccess();
    }
  }, [loginCode]);

  return <div className="auth-form">
    <Container maxWidth="xl">
      <div className="title">Reset your password</div>
      <div className="desc">{account}</div>
      <div className="auth-form-item">
        <label htmlFor="password" className="item-name">New Password</label>
        <div className="input-item">
          <AuthInput
            type="password"
            autoComplete="new-password"
            fullWidth
            {...register("password", {
              required: true,
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            })}
          />
          {errors.password?.type === "pattern" && <div className="auth-error-msg">Minimum eight characters, at least one letter, one number and no special characters</div>}
        </div>
      </div>

      <div className="auth-form-item">
        <label htmlFor="password" className="item-name">Confirm Password</label>
        <div className="input-item">
          <AuthInput
            type="password"
            autoComplete="new-password"
            fullWidth
            {...register("confirmPassword", {
              required: true,
              validate: (value) => value === passwordRef.current || "Pasword mismatch",
              pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
            })}
          />
          {errors.confirmPassword?.type === "pattern" && <div className="auth-error-msg">Minimum eight characters, at least one letter, one number and no special characters</div>}
          {errors.confirmPassword?.type === "validate" && <div className="auth-error-msg">Password mismatch!!</div>}
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

export default ResetPassForm;