import { Breakpoint, Dialog, DialogProps, Drawer, DrawerProps, useMediaQuery, useTheme } from "@mui/material";
import classNames from "classnames";
import { PropsWithChildren } from "react";

const DrawerDialog = (props: PropsWithChildren<{
  breakpoint?: Breakpoint;
  open?: boolean;
  onClose?: () => void;
  drawerAnchor?: DrawerProps["anchor"];
  dialogTransitionComponent?: DialogProps["TransitionComponent"];
  classes?: {
    container?: string;
  }
}>) => {
  const {
    breakpoint = "lg",
    open,
    onClose,
    drawerAnchor,
    dialogTransitionComponent,
    children,
    classes = {}
  } = props;
  const theme = useTheme();
  const isDrawerMode = useMediaQuery(theme.breakpoints.down(breakpoint));
  return isDrawerMode
    ? <Drawer
      open={open}
      onClose={onClose}
      anchor={drawerAnchor}
      PaperProps={{ className: classNames(classes.container, "drawer") }}
    >
      {children}
    </Drawer>
    : <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{ className: classes.container }}
      TransitionComponent={dialogTransitionComponent}
    >
      {children}
    </Dialog>
}

export default DrawerDialog;