import { useRouter } from 'next/router';
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from '../../app/hooks';
import { setLoginCode } from "../../features/auth/auth.slice";
import { LOGIN_ACCOUNT_IS_USED, LOGIN_ACCOUNT_NOT_EXIST, LOGIN_FAILED, LOGIN_SUCCESS, LOGIN_WRONG_PASSWORD } from '../../modules/share/constraint';
import ForgotPassForm from "./ForgotPassForm";
import LoginForm from './LoginForm';
import LoginSuccess from './LoginSuccess';
import RegisterForm from './RegisterForm';
import RegisterSuccess from './RegisterSuccess';

enum RenderViews {
  NONE,
  LOGIN,
  REGISTER,
  LOGIN_SUCCESS,
  REGISTER_SUCCESS,
  FORGOT_PASS,
}

const AuthView = () => {
  const [view, setView] = useState(RenderViews.NONE);
  const { loginCode, loading: authLoading, user } = useSelector((state) => state.authState)
  const router = useRouter();
  const redirectURI = router.query.redirect_uri as string || "/";
  const defaultAccount = router.query.account as string;
  const { enqueueSnackbar } = useSnackbar();
  // const { data: session } = useSession();
  const dispatch = useDispatch();

  const isViewSuccess = useMemo(() => {
    if (view === RenderViews.LOGIN_SUCCESS || view === RenderViews.REGISTER_SUCCESS) {
      return true
    }
  }, [view]);

  useEffect(() => {
    if (!authLoading && !user) {
      setView(RenderViews.LOGIN);
    } else if (!authLoading && !!user) {
      setView(RenderViews.LOGIN_SUCCESS);
    }
  }, [authLoading]);

  useEffect(() => {
    if (loginCode === LOGIN_SUCCESS) {
      if (view === RenderViews.LOGIN) setView(RenderViews.LOGIN_SUCCESS)
      else if (view === RenderViews.REGISTER) setView(RenderViews.REGISTER_SUCCESS)
      else if (view === RenderViews.FORGOT_PASS) {
        enqueueSnackbar("We have e-mailed your password reset link!", {
          variant: "success", onClose: () => {
            dispatch(setLoginCode(null));
            setView(RenderViews.LOGIN);
          }
        });
        // transform to loginview after s
        dispatch(setLoginCode(null));
        setView(RenderViews.LOGIN);
      }
    }
  }, [loginCode, view])

  useEffect(() => {
    if (loginCode !== null && loginCode !== LOGIN_SUCCESS) {
      let msg = '';
      if (loginCode === LOGIN_FAILED) {
        msg = "Something went wrong, try later!!";
      } else if (loginCode === LOGIN_ACCOUNT_NOT_EXIST || loginCode === LOGIN_WRONG_PASSWORD) {
        msg = "Incorrect account or password!!";
      } else if (loginCode === LOGIN_ACCOUNT_IS_USED) {
        msg = "Account is already!!";
      }
      msg && enqueueSnackbar(msg, { variant: "error", onClose: () => dispatch(setLoginCode(null)) })
    }
  }, [loginCode])

  const sliderTransform = useMemo(() => {
    if (view === RenderViews.LOGIN) {
      return 'translate(-100%)'
    } else if (view === RenderViews.REGISTER) {
      return 'translateX(-200%)'
    } else if (view === RenderViews.FORGOT_PASS) {
      return 'translateX(0)'
    }
  }, [view])

  return (authLoading
    ? <></>
    : <div id="auth-view" style={{ display: 'flex', justifyContent: 'center' }}>
      {(!isViewSuccess && view !== RenderViews.NONE)
        ? <div style={{ maxWidth: '600px', overflow: 'hidden' }}>
          <div style={{
            display: 'flex',
            transform: sliderTransform,
            willChange: 'transform',
            transition: '0.35s'
          }}>
            <ForgotPassForm onClickBack={() => {
              setView(RenderViews.LOGIN)
            }} />
            <LoginForm
              defaultAccount={defaultAccount}
              onChangeViewRegister={() => {
                setView(RenderViews.REGISTER)
              }}
              onClickForgotPassword={() => {
                setView(RenderViews.FORGOT_PASS);
              }}
            />
            <RegisterForm onChangeViewLogin={() => {
              setView(RenderViews.LOGIN)
            }} />
          </div>
        </div>
        :
        <>
          {view === RenderViews.LOGIN_SUCCESS && <LoginSuccess redirectURI={redirectURI} />}
          {view === RenderViews.REGISTER_SUCCESS && <RegisterSuccess redirectURI={redirectURI} />}
        </>
      }
    </div>)
}

export default AuthView