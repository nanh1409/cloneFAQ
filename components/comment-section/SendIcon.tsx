import { SvgIcon, SvgIconProps } from "@mui/material";
import { memo, PropsWithoutRef } from "react";

const SendIcon = memo((props: PropsWithoutRef<SvgIconProps>) => (<SvgIcon {...props}>
  <svg viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.65342 10.5318C6.8972 11.4146 6.18078 12.2523 5.36265 13.209C5.36265 11.6692 5.34939 10.2813 5.38034 8.88934C5.38476 8.7292 5.58819 8.54032 5.74297 8.41303C7.99836 6.63918 10.2582 4.87355 12.518 3.1038C12.6683 2.98883 12.8054 2.86154 12.8983 2.67266C12.7258 2.75478 12.5534 2.8328 12.3809 2.91492C9.62136 4.3069 6.86182 5.69066 4.11555 7.09907C3.74408 7.28795 3.52296 7.26742 3.21782 7.00873C2.32893 6.27373 1.40909 5.56337 0.414062 4.775C5.76951 3.24752 11.0188 1.74878 16.4141 0.208984C14.4196 4.45472 12.4782 8.57727 10.5058 12.7737C9.53733 12.0141 8.63076 11.2996 7.65342 10.5318Z" fill="#AAAFB2" />
  </svg>
</SvgIcon>
))

export default SendIcon;