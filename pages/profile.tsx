import Close from "@mui/icons-material/Close";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { Box, Button, Card, Container, Dialog, DialogContent, DialogTitle, Grid, IconButton, TextField, Theme, Tooltip, Typography, useMediaQuery, useTheme } from "@mui/material";
import { makeStyles, styled } from "@mui/styles";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { unwrapResult } from "@reduxjs/toolkit";
import _ from "lodash";
import moment from "moment";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "../app/hooks";
import { wrapper } from "../app/store";
import _AuthInput from "../components/auth/AuthInput";
import AccountIcon from "../components/auth/icons/AccountIcon";
import DOBIcon from "../components/auth/icons/DOBIcon";
import EmailIcon from "../components/auth/icons/EmailIcon";
import PasswordIcon from "../components/auth/icons/PasswordIcon";
import PhoneIcon from "../components/auth/icons/PhoneIcon";
import BadgeCont from "../components/BadgeCont";
import DialogTransitionDown from "../components/DialogTransitionDown";
import Footer from "../components/footer";
import { setAppInfo } from "../features/appInfo/appInfo.slice";
import { apiChangePassword } from "../features/auth/auth.api";
import { setUserInfo, updateUserInfo } from "../features/auth/auth.slice";
import UserAvatar from "../features/common/UserAvatar";
import usePageAuth from "../hooks/usePageAuth";
import usePagePaymentInfo from "../hooks/usePagePaymentInfo";
import useServerAppInfo from "../hooks/useServerAppInfo";
import { LOGIN_FAILED, LOGIN_SUCCESS, LOGIN_WRONG_PASSWORD } from "../modules/share/constraint";
import { UserInfo } from "../modules/share/model/user";
import { encodePassword } from "../utils/encryption";
import { isValidEmail } from "../utils/format";
import { getWebAppProps } from "../utils/getSEOProps";

type UserProfileFormData = Pick<UserInfo, "name" | "email" | "phoneNumber" | "birth">;
type ChangePasswordFormData = { current: string; password: string; confirm: string; };

const Layout = dynamic(() => import("../features/common/Layout"), { ssr: false });

const useStyles = makeStyles((theme: Theme) => ({
  dobInputRoot: {
    border: "1px solid #DAE0EA",
    paddingLeft: "15px", paddingRight: "15px", borderRadius: 10,
    height: "55px",
    "& fieldset": { display: "none" }
  },
  dobPickerButton: { marginRight: "10px", padding: 0 },
  dobInputAdorment: { marginLeft: 0 },
  dobInputMain: {
    height: "auto",
    padding: 0
  }
}));

const AuthInput = styled(_AuthInput)({
  border: "1px solid #DAE0EA",
  borderRadius: 10,
  height: "55px",
  paddingLeft: "15px", paddingRight: "15px"
});

const InputError = styled("div")({
  color: "red", fontSize: "12px", fontStyle: "italic"
});

const ProAccountValid = styled("div")({
  display: "flex", alignItems: "center",
  position: "absolute", left: "10px",
  "& .icon-pro-account": {
    width: "30px", height: "30px",
    display: "flex", alignItems: "center", justifyContent: "center",
    backgroundColor: "#333",
    borderRadius: "100%",
    border: "1px solid #fff",
    zIndex: 1
  },
  "& .pro-account-valid-title": {
    backgroundColor: "#333",
    color: "#fff",
    transform: "translateX(-13px)",
    padding: "2px 16px",
    paddingLeft: "24px",
    fontSize: "14px",
    borderTopRightRadius: "15px",
    borderBottomRightRadius: "15px"
  }
})

const ProfilePage = () => {
  const app = useSelector((state) => state.appInfos.appInfo);
  const user = useSelector((state) => state.authState.user);
  const userId = useSelector((state) => state.authState.userId);
  const authLoading = useSelector((state) => state.authState.loading);
  const token = useSelector((state) => state.authState.token);
  const accountPayment = useSelector((state) => state.paymentState.accountPayment);
  const dispatch = useDispatch();

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [isCopiedAccount, setCopiedAccount] = useState(false);
  const passwordRef = useRef<string>("");

  const router = useRouter();

  usePageAuth({ noCache: true, unAuthorizedRedirect: "/" });
  usePagePaymentInfo({ appName: app?.appName });

  const classes = useStyles();
  const theme = useTheme();
  const isDownMD = useMediaQuery(theme.breakpoints.down("md"));
  const { enqueueSnackbar } = useSnackbar();

  const { register, handleSubmit, control, formState: { errors }, setValue } = useForm<UserProfileFormData>();
  const { register: pRegister, handleSubmit: pHandleSubmit, formState: { errors: pErrors }, watch, reset } = useForm<ChangePasswordFormData>();
  passwordRef.current = watch("password", "");

  const trans = useMemo(() => {
    let profile = "Profile";
    let placeholderDOB = "Your Date of Birth", placeholderPhone = "Your Phone", placeholderEmail = "Your Email";
    let updateLabel = "Update", updateSuccess = "Successfully updated", updateError = "Something went wrong!";
    let changePassword = "Change Password",
      createPassword = "Create your Password",
      placeholderCurrentPass = "Current Password",
      placeholderNewPass = "New Password",
      placeholderConfirmPass = "Confirm Password",
      wrongPassword = "Wrong Password";
    let userAccountLabel = "Account", tooltipCopyAccount = "Copy account to clipboard", tooltipCopiedAccount = "Copied!";
    if (router.locale === "vi") {
      profile = "Thông tin cá nhân";
      placeholderDOB = "Ngày sinh"; placeholderPhone = "Số điện thoại"; placeholderEmail = "Địa chỉ Email"
      updateLabel = "Cập nhật"; updateSuccess = "Cập nhật thành công"; updateError = "Có lỗi xảy ra!"
      changePassword = "Đổi mật khẩu"; createPassword = "Tạo mật khẩu";
      placeholderCurrentPass = "Mật khẩu hiện tại"; placeholderNewPass: "Mật khẩu mới"; placeholderConfirmPass = "Nhập lại mật khẩu";
      wrongPassword = "Sai mật khẩu";
      userAccountLabel = "Tài khoản";
      tooltipCopyAccount = "Sao chép tài khoản vào bộ nhớ đệm";
      tooltipCopiedAccount = "Đã sao chép";
    }
    return {
      profile,
      placeholderDOB, placeholderPhone, placeholderEmail,
      updateLabel, updateSuccess, updateError,
      changePassword, createPassword, placeholderCurrentPass, placeholderNewPass, placeholderConfirmPass,
      wrongPassword,
      userAccountLabel,
      tooltipCopyAccount,
      tooltipCopiedAccount
    }
  }, [router.locale]);

  useEffect(() => {
    setValue("name", user?.name ?? "Anonymous");
    setValue("email", user?.email);
    setValue("birth", user?.birth || null);
    setValue("phoneNumber", user?.phoneNumber);
  }, [user?._id]);

  const handleSubmitProfile = (data: UserProfileFormData) => {
    const updates = _.pickBy(data, (value, key) => {
      if (key === "birth") return !!user[key] !== !!value;
      return user[key] !== value
    });
    if (_.isEmpty(updates)) {
      enqueueSnackbar(trans.updateSuccess, { variant: "success", autoHideDuration: 1000 });
    } else {
      dispatch(updateUserInfo({ token, ...updates }))
        .then(unwrapResult)
        .then((success) => {
          if (success) enqueueSnackbar(trans.updateSuccess, { variant: "success", autoHideDuration: 1000 });
          else enqueueSnackbar(trans.updateError, { variant: "error", autoHideDuration: 1000 });
        });
    }
  }

  const handleCloseChangePassword = () => {
    reset();
    setOpenChangePassword(false);
  }

  const handleSubmitChangePassword = (data: ChangePasswordFormData) => {
    const oldPassword = data.current ? encodePassword(user.account, data.current) : "";
    const newPassword = encodePassword(user.account, data.password);

    apiChangePassword({ token, oldPassword, newPassword })
      .then(({ loginCode } = { loginCode: LOGIN_FAILED }) => {
        if (loginCode === LOGIN_SUCCESS) {
          const newUser: UserInfo & { syncedPass?: boolean; } = { ...user } as any;
          newUser.syncedPass = true;
          dispatch(setUserInfo(newUser));
          handleCloseChangePassword();
          enqueueSnackbar(trans.updateSuccess, { variant: "success" });
        } else if (loginCode === LOGIN_WRONG_PASSWORD) {
          enqueueSnackbar(trans.wrongPassword, { variant: "error" })
        } else {
          enqueueSnackbar(trans.updateError, { variant: "error" });
        }
      })
      .catch((_) => {
        enqueueSnackbar(trans.updateError, { variant: "error" });
      })
  }

  const handleCopyAccount = async () => {
    if (!user) return;
    if ("clipboard" in navigator) {
      await navigator.clipboard.writeText(user.account);
    } else {
      document.execCommand("copy", true, user.account);
    }
    setCopiedAccount(true);
  }

  return <Layout
    {...getWebAppProps(app)}
    title={`${app.title ?? ""} | Profile`}
    backgroundColor="#f2f6fc"
  >
    <Container maxWidth="xl" sx={{ mt: "50px", mb: "50px" }}>
      <Typography textAlign="center" fontWeight={700} fontSize="36px">{trans.profile}</Typography>
      <Card elevation={0} sx={{ borderRadius: "15px", p: { md: "55px", xs: "20px" }, mt: "40px", position: "relative" }}>
        <Box
          display="flex"
          gap={4}
          flexDirection={isDownMD ? "column" : "row"}
          alignItems={isDownMD ? "center" : "flex-start"}
        >
          <Box>
            <UserAvatar url={user?.avatar} sx={{
              color: "#ccc",
              boxShadow: "0px 4px 15px rgba(44, 80, 172, 0.25)",
              border: "4px solid #fff"
            }} size={isDownMD ? 120 : 199} />
            <Typography textAlign="center" fontSize={16} fontWeight={500} mt="20px">{user?.name || "Anonymous"}</Typography>
          </Box>

          {!authLoading && <Box sx={{
            "& .user-account-info": {
              marginBottom: "10px"
            }
          }}>
            {!!user && <div className="user-account-info">
              <b>{trans.userAccountLabel}: </b>
              {user.account}
              <Tooltip title={isCopiedAccount ? trans.tooltipCopiedAccount : trans.tooltipCopyAccount} placement="top" arrow>
                <IconButton size="small" onClick={handleCopyAccount}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>}
            <form onSubmit={handleSubmit(handleSubmitProfile)}>
              <Grid container columnSpacing="20px" rowSpacing="15px">
                <Grid item xs={12} md={!!user ? 6 : 12}>
                  <AuthInput
                    readOnly={!user}
                    defaultValue={user?.name ?? "Anonymous"}
                    fullWidth
                    autoComplete="off"
                    startAdornment={<Box component="span" display="inline-flex" mr="12px"><AccountIcon /></Box>}
                    {...register("name")}
                  />
                </Grid>

                {!!user && <>
                  <Grid item xs={12} md={6}>
                    <AuthInput
                      placeholder={trans.placeholderEmail}
                      defaultValue={user?.email}
                      fullWidth
                      autoComplete="email"
                      startAdornment={<Box component="span" display="inline-flex" mr="12px">
                        <BadgeCont variant="dot" color="warning" hidden={!!user?.email}>
                          <EmailIcon />
                        </BadgeCont>
                      </Box>}
                      {...register("email", { validate: isValidEmail })}
                    />
                    {errors.email?.type === "validate" && <InputError>Invalid Email</InputError>}
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <Controller
                        control={control}
                        name="birth"
                        defaultValue={user?.birth || null}
                        rules={{ validate: (value) => _.isNil(value) || moment(value).isValid() }}
                        render={({ field, fieldState: { error } }) =>
                          <DesktopDatePicker
                            inputFormat="DD/MM/YYYY"
                            value={moment(field.value)}
                            onChange={(date) => { field.onChange(date?.valueOf()); }}
                            OpenPickerButtonProps={{ className: classes.dobPickerButton }}
                            InputAdornmentProps={{ className: classes.dobInputAdorment }}
                            components={{ OpenPickerIcon: DOBIcon }}
                            renderInput={(props) =>
                              <>
                                <TextField
                                  {...props}
                                  placeholder={trans.placeholderDOB}
                                  fullWidth
                                  InputProps={{
                                    classes: {
                                      root: classes.dobInputRoot,
                                      input: classes.dobInputMain
                                    },
                                    startAdornment: props.InputProps.endAdornment
                                  }}
                                />
                                {error?.type === "validate" && <InputError>Invalid Date</InputError>}
                              </>}
                          />
                        }
                      />
                    </LocalizationProvider>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <AuthInput
                      type="tel"
                      placeholder={trans.placeholderPhone}
                      defaultValue={user?.phoneNumber}
                      fullWidth
                      autoComplete="phone"
                      startAdornment={<Box component="span" display="inline-flex" mr="12px"><PhoneIcon /></Box>}
                      {...register("phoneNumber")}
                    />
                  </Grid>
                </>}
              </Grid>

              {!!user && <>
                <Button
                  variant="outlined"
                  sx={{
                    bgcolor: "#f1f4f8",
                    borderRadius: "10px",
                    borderColor: "#D5DDE7 !important",
                    color: "#333 !important",
                    mt: "15px"
                  }}
                  onClick={() => setOpenChangePassword(true)}
                >
                  {user.syncedPass ? trans.changePassword : trans.createPassword}
                </Button>


                <Button
                  type="submit"
                  sx={{
                    mt: { xs: "10px", md: "auto" },
                    display: { xs: "flex", md: "inline-flex" },
                    position: { xs: "relative", md: "absolute" },
                    bottom: { xs: "auto", md: "40px" },
                    right: { xs: "auto", md: "60px" },
                    borderRadius: "50px",
                    bgcolor: "var(--menuBackground) !important",
                    color: "var(--menuTextColor) !important",
                    width: "180px", height: "45px", fontSize: "16px", fontWeight: 600
                  }}
                >
                  {trans.updateLabel}
                </Button>
              </>}
            </form>
          </Box>}
        </Box>
        {accountPayment?.userId === userId && !accountPayment?.isExpired && <ProAccountValid>
          <span className="icon-pro-account">
            <img src="/images/get-pro/pro-account-profile.png" alt="pro-account-profile" />
          </span>
          <span className="pro-account-valid-title">
            GET PRO is valid until {moment(accountPayment?.expireDate).format("MMMM DD, YYYY")}
          </span>
        </ProAccountValid>}
      </Card>
    </Container>
    {/* Change Password */}
    <Dialog
      open={openChangePassword}
      onClose={handleCloseChangePassword}
      fullWidth
      TransitionComponent={DialogTransitionDown}
      PaperProps={{ sx: { borderRadius: "15px" } }}
    >
      <DialogTitle sx={{ textAlign: "center", position: "relative", mt: "20px", fontSize: "22px", fontWeight: 600 }}>
        {user?.syncedPass ? trans.changePassword : trans.createPassword}
        <IconButton
          sx={{
            position: "absolute",
            bgcolor: "#fff",
            boxShadow: "0px 3px 10px #E1E6F1",
            right: "10px", top: "-10px"
          }}
          onClick={handleCloseChangePassword}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <form onSubmit={pHandleSubmit(handleSubmitChangePassword)} autoComplete="off">
          <Grid container spacing={2}>
            {user?.syncedPass && <Grid item xs={12}>
              <AuthInput
                startAdornment={<Box display="inline-flex" mr={1}><PasswordIcon /></Box>}
                fullWidth
                type="password"
                placeholder={trans.placeholderCurrentPass}
                autoComplete="off"
                {...pRegister("current")}
              />
            </Grid>}

            <Grid item xs={12}>
              <AuthInput
                startAdornment={<Box display="inline-flex" mr={1}><PasswordIcon /></Box>}
                fullWidth
                type="password"
                placeholder={trans.placeholderNewPass}
                autoComplete="current-password"
                {...pRegister("password", {
                  required: true,
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
                })}
              />
              {pErrors.password?.type === "pattern" && <InputError>Minimum eight characters, at least one letter, one number and no special characters</InputError>}
            </Grid>

            <Grid item xs={12}>
              <AuthInput
                startAdornment={<Box display="inline-flex" mr={1}><PasswordIcon /></Box>}
                fullWidth
                type="password"
                placeholder={trans.placeholderConfirmPass}
                autoComplete="off"
                {...pRegister("confirm", {
                  required: true,
                  validate: (value) => value === passwordRef.current || "Pasword mismatch",
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
                })}
              />
              {pErrors.confirm?.type === "pattern" && <InputError>Minimum eight characters, at least one letter, one number and no special characters</InputError>}
              {pErrors.confirm?.type === "validate" && <InputError>Password mismatch!!</InputError>}
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="center" mt="38px" mb="42px">
            <Button type="submit" sx={{
              width: "180px", height: "45px",
              bgcolor: "var(--menuBackground) !important",
              color: "var(--menuTextColor) !important",
              fontSize: "16px", fontWeight: 600,
              borderRadius: 6
            }}>{trans.updateLabel}</Button>
          </Box>
        </form>
      </DialogContent>
    </Dialog>
    <Footer />
  </Layout>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }) => {
  const appInfo = await useServerAppInfo(store);
  return {
    props: {}
  }
});

export default ProfilePage;