import fs from "fs";
import path from "path";
import { StateData } from "../types/StateData";
const useServerStateData = (appName: string): Array<StateData> => {
  return JSON.parse(fs.readFileSync(path.join(
    process.cwd(),
    "config",
    "state.json"
  )) as any || {})[appName] ?? []
}

export default useServerStateData;