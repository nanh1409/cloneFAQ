import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { Box, Button, Container, Tooltip, Typography, useMediaQuery } from "@mui/material";
import { signOut, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "../app/hooks";
import { ROUTER_LOGIN } from "../app/router";
import { wrapper } from "../app/store";
import Footer from "../components/footer";
import { setAppInfo } from "../features/appInfo/appInfo.slice";
import { apiDeleteAccount } from "../features/auth/auth.api";
import { logout } from "../features/auth/auth.slice";
import usePageAuth from '../hooks/usePageAuth';
import useServerAppInfo from "../hooks/useServerAppInfo";
import AppSetting from "../modules/share/model/appSetting";

const Layout = dynamic(() => import("../features/common/Layout"), { ssr: false });

const DeactiveUser = (props: {
    appInfo: AppSetting
}) => {
    usePageAuth();
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const router = useRouter();
    const { token, user, userId, loading } = useSelector((state) => state.authState);
    const buttonGroupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!user && !loading) {
            const { pathname, search, hash } = window.location;
            router.push({
                pathname: `/${ROUTER_LOGIN}`,
                query: {
                    redirect_uri: `${pathname}${search}${hash}`
                }
            })
        }
    }, [loading])

    const isMobileUI = useMediaQuery("(max-width: 767px)");
    const { data: session } = useSession();


    const trans = useMemo(() => {
        let title = "Delete Account"
        let labelDelete = "Remove"
        let labelBackHome = "Back to home"
        let errorDelete = "Delete error"
        let successDelete = "Delete success"
        let sureQuestion = "Do you really want delete your account?"
        let hintDelete = [
            "All your learning progress will be permanently deleted",
            "Your personal information will be deleted",
            "Your premium account will not be refunded",
            "Synchronized data between the app and website will be permanently deleted",
            "Unable to access content that requires login"
        ]
        if (router.locale === "vi") {
            title = "Xoá tài khoản"
            labelDelete = "Xoá"
            labelBackHome = "Trở về trang chủ"
            errorDelete = "Xoá không thành công"
            successDelete = "Xoá thành công"
            sureQuestion = "Bạn có chắc chắn muốn xoá tài khoản không?"
            hintDelete = [
                "Toàn bộ lịch sử học sẽ bị xoá vĩnh viễn",
                "Thông tin cá nhân bị xoá",
                "Tài khoản trả phí sẽ không được hoàn trả nếu bạn quyết định xoá tài khoản",
                "Thông tin đồng bộ giữa app và website sẽ bị xoá vĩnh viễn",
                "Không thể truy cập các nội dung yêu cầu đăng nhập của chúng tôi"
            ]
        }

        return {
            title,
            labelDelete,
            errorDelete,
            successDelete,
            sureQuestion,
            labelBackHome,
            hintDelete
        }
    }, [router.locale])
    const [openTooltip, setOpenTooltip] = useState<boolean>(false);
    const handleDeleteAccount = async () => {
        const data = await apiDeleteAccount(token, userId)
        if (data === "undefined") {
            enqueueSnackbar(trans.errorDelete, { variant: "error" });
        } else {
            enqueueSnackbar(trans.successDelete, { variant: "success" });
            dispatch(logout({ token }));
            if (session) {
                signOut({ redirect: false })
                    .finally(() => {
                        router.replace("/");
                    })
            } else {
                setTimeout(() => {
                    router.replace("/");
                }, 300);
            }
        }
    }

    return !loading && !!user
        ? <Layout title={router.locale === "vi" ? "Xoá tài khoản" : "Delete Account"} backgroundColor="#f2f6fc">
            <Container maxWidth="xl" sx={{ mt: "50px", mb: "50px" }}>
                <Typography textAlign="center" fontWeight={700} fontSize="36px">{trans.title}</Typography>
                <p style={{
                    color: "var(--titleColor)",
                    fontSize: "24px",
                    fontWeight: 500
                }}>{router.locale === "en" ? "If you decide to delete your account :" : "Nếu bạn quyết định xoá tài khoản :"}</p>

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="start"
                    justifyContent="center"
                    gap={2}
                    ml={5}
                >
                    {
                        trans.hintDelete.map(hint => (
                            <div style={{ display: 'flex', alignItems: "center" }}>
                                <LabelImportantIcon fontSize="small" />
                                <p style={{ fontSize: "16px", margin: 0, marginLeft: "10px", lineHeight: "30px" }}>{hint}</p>
                            </div>
                        ))
                    }
                </Box>

                <Box
                    display="flex"
                    gap={4}
                    alignItems="center"
                    justifyContent="center"
                    className="deactive-btn-box"
                    position="relative"
                    sx={{
                        "& .delete-account-confirm-tooltip": {
                            background: "transparent !important",
                            mt: "0 !important",
                            maxWidth: "576px"
                        },
                        "& .delete-account-confirm-popper": {
                        }
                    }}
                >
                    <Tooltip
                        classes={{
                            tooltip: "delete-account-confirm-tooltip"
                        }}
                        PopperProps={{
                            disablePortal: true,
                            className: "delete-account-confirm-popper",
                        }}
                        open={openTooltip}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        title={
                            <Box
                                display="flex"
                                gap={2}
                                alignItems="center"
                                justifyContent="center"
                                flexDirection="column"
                                sx={{
                                    background: "#fff",
                                    borderRadius: "20px",
                                    border: "1px solid #000"
                                }}
                                padding="18px 30px"
                            >
                                <Typography textAlign="center" variant="h6" sx={{ color: "#000" }}>{trans.sureQuestion}</Typography>
                                <Box
                                    display="flex"
                                    gap={4}
                                    alignItems="center"
                                    justifyContent="center"
                                >
                                    <Button variant="contained" color="error" onClick={() => setOpenTooltip(false)}>No</Button>
                                    <Button variant="contained" color="success" onClick={handleDeleteAccount}>Yes</Button>
                                </Box>
                            </Box>
                        }
                    >
                        <Box display="flex" gap="10px" sx={{
                            "@media (max-width: 600px)": {
                                flexDirection: "column"
                            }
                        }}>
                            <Button
                                type="submit"
                                sx={{
                                    mt: { xs: "10px", md: "50px" },
                                    display: { xs: "flex", md: "inline-flex" },
                                    borderRadius: "50px",
                                    bgcolor: "var(--menuBackground) !important",
                                    color: "#fff",
                                    width: "180px", height: "45px", fontSize: "16px", fontWeight: 600
                                }}
                                onClick={() => {
                                    // window.location.replace("/")
                                    router.push("/");
                                }}
                            >
                                {trans.labelBackHome}
                            </Button>
                            <Button
                                type="submit"
                                sx={{
                                    mt: { xs: "10px", md: "50px" },
                                    display: { xs: "flex", md: "inline-flex" },
                                    borderRadius: "50px",
                                    bgcolor: "var(--menuBackground) !important",
                                    color: "#fff",
                                    width: "180px", height: "45px", fontSize: "16px", fontWeight: 600
                                }}
                                onClick={() => setOpenTooltip(!openTooltip)}
                            >
                                {trans.labelDelete}
                            </Button>
                        </Box>
                    </Tooltip>
                </Box>
            </Container>
            <Footer />
        </Layout>
        : <></>
}

export const getServerSideProps = wrapper.getServerSideProps(async ({ store }) => {
    const appInfo = await useServerAppInfo(store);
    if (!appInfo) return { notFound: true };
    return {
        props: {
            appInfo
        }
    }
});

export default DeactiveUser