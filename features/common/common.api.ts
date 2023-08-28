import { get } from "../../utils/fetcher";

export const apiGetGeoInfo = async (): Promise<{ country: string; ip: string; }> => {
  const { data, error } = await get({ endpoint: "/api/geo" });
  return error ? { country: "", ip: "" } : data;
}