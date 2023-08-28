const appName = process.env.NEXT_PUBLIC_APP_NAME;
import stateData from "../config/state.json";
import { StateData } from "../types/StateData";

const useStateData = () => {
  return (stateData[appName] || []) as Array<StateData>;
}

export default useStateData;