import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import { Button, CircularProgress, Container, Divider, InputAdornment } from '@mui/material';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { PropsWithoutRef, useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from '../../app/hooks';
import { LOCAL_REGISTER_TIME_KEY } from "../../features/auth/auth.config";
import { registerUser, setLoginCode } from '../../features/auth/auth.slice';
import useRenderGoogleSignInButton from "../../features/auth/useRenderGoogleSignInButton";
import { LOGIN_ACCOUNT_IS_USED, LOGIN_FAILED, LOGIN_SUCCESS } from '../../modules/share/constraint';
import { encodePassword } from '../../utils/encryption';
import { isValidEmail } from "../../utils/format";
import AppleIcon from "./AppleIcon";
import AuthInput from './AuthInput';
import GoogleIcon from "./GoogleIcon";
import './style.scss';

type AuthFormRegister = {
  account: string,
  name: string,
  password: string,
  confirmPassword: string;
  email: string;
}

const RegisterForm = (props: PropsWithoutRef<{
  onChangeViewLogin?: () => void;
}>) => {
  const [isLoading, setLoading] = useState(false);
  const { onChangeViewLogin = () => { } } = props;
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AuthFormRegister>();
  const passwordRef = useRef<string>("");
  passwordRef.current = watch("password", "");
  const app = useSelector((state) => state.appInfos.appInfo);
  const dispatch = useDispatch();
  useRenderGoogleSignInButton({ buttonContainerId: "signup-with-google-button" });
  const isClient = typeof window !== "undefined";
  const localRegisterTime = useMemo(() => isClient ? localStorage.getItem(LOCAL_REGISTER_TIME_KEY) : "", [isClient]);

  const handleRegister = (values: AuthFormRegister) => {
    setLoading(true);
    setTimeout(() => {
      const { name, password: _password, email: _email } = values;
      const account = _email.trim().toLowerCase();
      dispatch(registerUser({
        account,
        name,
        email: _email,
        password: encodePassword(account, _password),
        appId: app._id,
        localRegisterTime: !isNaN(+localRegisterTime) ? +localRegisterTime : undefined
      }));
      reset({ email: '', name: '', password: '', confirmPassword: '' });
      setLoading(false);
    }, 2000);

  }

  const router = useRouter();
  const trans = useMemo(() => {
    let createAccount = "CREATE AN ACCOUNT";
    let account = "Account", accountPlaceholder = "Enter your account";
    let name = "Name", namePlaceholder = "Enter your name";
    let password = "Password", passwordPlaceHolder = "Enter your password";
    let confirmPassword = "Confirm Password", confirmPasswordPlaceHolder = "Enter your confirm Password";
    let register = "REGISTER", or = "Or Sign up with";
    let haveAccount = "Have an account already?", loginHere = "Please login here";
    if (router.locale === "vi") {
      createAccount = "TẠO TÀI KHOẢN";
      account = "Tài khoản"; accountPlaceholder = "Nhập tài khoản";
      name = "Tên"; namePlaceholder = "Nhập tên";
      password = "Mật khẩu"; passwordPlaceHolder = "Nhập mật khẩu";
      confirmPassword = "Xác nhận mật khẩu"; confirmPasswordPlaceHolder = "Nhập lại mật khẩu";
      register = "ĐĂNG KÝ NGAY"; or = "Hoặc Đăng ký với";
      haveAccount = "Bạn đã có tài khoản?"; loginHere = "Đăng nhập ngay";
    }
    return {
      createAccount, account, accountPlaceholder, name, namePlaceholder, password, passwordPlaceHolder, confirmPassword, confirmPasswordPlaceHolder,
      register, or, haveAccount, loginHere,
    }
  }, [router.locale]);

  return (
    <div className="auth-form" onKeyDown={(event) => {
      if(event.key === "Enter") { 
        (handleSubmit((values) => handleRegister(values)))()
      }
    }}>
      <Container maxWidth="xl">
        <div className="title">{trans.createAccount}</div>
        {/* <div className="auth-form-item">
          <div className="input-item">
            <AuthInput
              startAdornment={(<InputAdornment position="start">
                <Image width={25} height={25} src="/images/app/account.png" alt="username" />
              </InputAdornment>)}
              autoComplete="username"
              fullWidth
              placeholder={trans.accountPlaceholder}
              {...register("account", { required: true })}
            />
          </div>
        </div> */}
        <div className="auth-form-item">
          {/* <label htmlFor="" className="item-name">{_name}</label> */}
          <div className="input-item">
            <AuthInput
              startAdornment={(<InputAdornment position="start">
                <Image width={25} height={25} src="/images/app/account.png" alt="name" />
              </InputAdornment>)}
              autoComplete="username"
              fullWidth
              placeholder={trans.namePlaceholder}
              {...register("name")}
            />
          </div>
        </div>
        <div className="auth-form-item">
          {/* <label htmlFor="email" className="item-name">Email</label> */}
          <div className="input-item">
            <AuthInput
              startAdornment={<EmailOutlinedIcon sx={{ mr: "8px" }} />}
              autoComplete="email"
              fullWidth
              placeholder="Email (Account)"
              {...register("email", { required: true, validate: isValidEmail })}
            />
            {errors.email?.type === "required" && <div className="auth-error-msg">This field is required!</div>}
            {errors.email?.type === "validate" && <div className="auth-error-msg">Invalid Email</div>}
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
              {...register("password", {
                required: true,
                pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
              })}
            />
            {errors.password?.type === "pattern" && <div className="auth-error-msg">Minimum eight characters, at least one letter, one number and no special characters</div>}
          </div>
        </div>
        <div className="auth-form-item">
          {/* <label htmlFor="" className="item-name"> {_confirmPassword}(*)</label> */}
          <div className="input-item">
            <AuthInput
              startAdornment={(<InputAdornment position="start">
                <Image width={25} height={25} src="/images/app/password.png" alt="confirm-password" />
              </InputAdornment>)}
              type="password"
              autoComplete="new-password"
              fullWidth
              placeholder={trans.confirmPasswordPlaceHolder}
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
            variant="outlined"
            className="btn-submit"
            onClick={handleSubmit((values) => handleRegister(values))}
          >{isLoading ? <CircularProgress style={{ color: "white", width: '30px', height: '30px' }} /> : trans.register} </Button>
        </div>
        <div className="divider">
          <Divider>{trans.or}</Divider>
        </div>
        <div className="auth-login-sso">
          <div id="signup-with-google-button" className="auth-login-with-google auth-login-sso-button" />
          {/* <div className="auth-login-with-apple auth-login-sso-button">
            <Button
              variant="outlined" color="inherit"
            ><AppleIcon /></Button>
          </div> */}
        </div>
        <div className="auth-form-nav">
          <span>{trans.haveAccount} </span>
          <span style={{ cursor: "pointer", color: "#507DD4" }} onClick={onChangeViewLogin}>{trans.loginHere}</span>
        </div>
      </Container>
    </div>
  )
}

export default RegisterForm