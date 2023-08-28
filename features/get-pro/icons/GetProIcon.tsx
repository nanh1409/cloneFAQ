import { memo, PropsWithoutRef } from "react";
import FreePackIcon from "./FreePackIcon";
import ProPackIcon from "./ProPackIcon";

const GetProIcon = memo((props: PropsWithoutRef<{
  accessLevel?: number;
  fill?: string;
}>) => {
  switch (props.accessLevel) {
    case 2000:
      return <ProPackIcon fill={props.fill} />;
    case 0:
    default:
      return <FreePackIcon />;
  }
});

export default GetProIcon;