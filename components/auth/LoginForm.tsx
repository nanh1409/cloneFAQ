import { Button, CircularProgress, Container, Divider, InputAdornment } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PropsWithoutRef, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from '../../app/hooks';
import { login, setFetching } from '../../features/auth/auth.slice';
import useRenderGoogleSignInButton from "../../features/auth/useRenderGoogleSignInButton";
import { encodePassword } from '../../utils/encryption';
import AppleIcon from "./AppleIcon";
import AuthInput from './AuthInput';
import './style.scss';

type AuthFormLogin = {
  account: string,
  password: string
}

const LoginForm = (props: PropsWithoutRef<{
  onChangeViewRegister?: () => void;
  onClickForgotPassword?: () => void;
  defaultAccount?: string;
}>) => {
  const { onChangeViewRegister = () => { }, onClickForgotPassword = () => { }, defaultAccount } = props;
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthFormLogin>();
  const dispatch = useDispatch();
  const { fetchingAPI } = useSelector((state) => state.authState);
  const app = useSelector((state) => state.appInfos.appInfo);
  useRenderGoogleSignInButton({ buttonContainerId: "login-with-google-button" });
  const handleLogin = (values: AuthFormLogin) => {
    if (fetchingAPI) return;
    dispatch(setFetching(true))
    const { account: _account, password: _password } = values;
    const account = _account.trim().toLowerCase();
    dispatch(login({ account, password: encodePassword(account, _password), appId: app._id }));
    reset({ account: '', password: '' });
  }
  const router = useRouter();
  const trans = useMemo(() => {
    let account = "Account", accountPlaceholder = "Enter your account";
    let password = "Password", passwordPlaceHolder = "Enter your password";
    let forgotPassword = "Forgot password"; let login = "LOGIN"; let or = "Or Login with";
    let noAccount = "Do you have any accounts?", signUp = "Sign up";
    if (router.locale === "vi") {
      account = "Tài khoản"; accountPlaceholder = "Nhập tài khoản";
      password = "Mật khẩu"; passwordPlaceHolder = "Nhập mật khẩu";
      forgotPassword = "Quên mật khẩu"; login = "ĐĂNG NHẬP"; or = "Hoặc Đăng nhập với";
      noAccount = "Bạn chưa có tài khoản?"; signUp = "Đăng ký ngay";
    }
    return {
      account, accountPlaceholder, password, passwordPlaceHolder, forgotPassword, login, or, noAccount, signUp,
    }
  }, [router.locale]);

  return (
    <div className="auth-form" onKeyDown={(event) => {
      if(event.key === "Enter") { 
        (handleSubmit((values) => handleLogin(values)))()
      }
    }}>
      <Container maxWidth="xl">
        <div className="title">{trans.login}</div>
        <div className="auth-form-item">
          {/* <label htmlFor="" className="item-name">{_account} (*)</label> */}
          <div className="input-item">
            <AuthInput
              startAdornment={(<InputAdornment position="start">
                <Image width={25} height={25} src="/images/app/account.png" alt="user" />
              </InputAdornment>)}
              autoComplete="username"
              fullWidth
              placeholder={trans.accountPlaceholder}
              {...register("account", { required: true })}
              defaultValue={defaultAccount}
            />
          </div>
        </div>
        <div className="auth-form-item">
          {/* <label htmlFor="" className="item-name">{_password} (*)</label> */}
          <div className="input-item">
            <AuthInput
              startAdornment={(<InputAdornment position="start">
                <Image width={25} height={25} src="/images/app/password.png" alt="password" />
              </InputAdornment>)}
              type="password"
              autoComplete="new-password"
              fullWidth
              placeholder={trans.passwordPlaceHolder}
              {...register("password", { required: true })}
            />
          </div>
        </div>
        <div className="auth-form-item forgot-password" onClick={onClickForgotPassword}>
          <span>{trans.forgotPassword}</span>
        </div>
        <div className="auth-form-btn">
          <Button
            variant="outlined"
            className="btn-submit"
            onClick={handleSubmit((values) => handleLogin(values))}
          >{fetchingAPI ? <CircularProgress style={{ color: "white", width: '30px', height: '30px' }} /> : trans.login}</Button>
        </div>
        <div className="divider">
          <Divider>{trans.or}</Divider>
        </div>
        <div className="auth-login-sso">
          <div id="login-with-google-button" className="auth-login-with-google auth-login-sso-button" />
          {/* <div className="auth-login-with-apple auth-login-sso-button">
            <Button
              variant="outlined" color="inherit"
            ><AppleIcon /></Button>
          </div> */}
        </div>
        <div className="auth-form-nav">
          <span>{trans.noAccount}</span>
          <span style={{ cursor: "pointer", color: "#507DD4" }} onClick={onChangeViewRegister}>{` ${trans.signUp}`}</span>
        </div>
      </Container>
    </div>
  )
}

export default LoginForm