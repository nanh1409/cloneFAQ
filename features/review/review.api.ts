import AppReview from "../../modules/share/model/appReview";
import { post } from "../../utils/fetcher";

export const apiLoadReviews = async (args: {
    appId: string, 
    keySort?: {
        [key:string] : number
    }
}): Promise<{
    data: AppReview[],
    total: number
} | null> => {
    const { data, error } = await post({ endpoint: "/api-cms/get-reviews", body: args });
    return error ? null : data;
}