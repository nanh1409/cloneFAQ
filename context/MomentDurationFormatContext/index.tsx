import moment from "moment";
import momentDurationFormatSetup from "moment-duration-format";
import { createContext, PropsWithChildren } from "react";

const MomentDurationFormatContext = createContext({});

const MomentDurationFormatProvider = (props: PropsWithChildren<{}>) => {
  momentDurationFormatSetup(moment as any);
  return <MomentDurationFormatContext.Provider value={{}}>
    {props.children}
  </MomentDurationFormatContext.Provider>
}

export default MomentDurationFormatProvider;