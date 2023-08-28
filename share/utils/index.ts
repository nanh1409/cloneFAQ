import { GEN_CODE_TYPE_NUMBER, GEN_CODE_TYPE_CHAR } from '../constraint';

export const genCode = (maxLength: number, type: number): string => {
    let s = "";
    switch (type) {
        case GEN_CODE_TYPE_NUMBER:
            s = "0123456789";
            break;
        case GEN_CODE_TYPE_CHAR:
            s = "abcdefghijklmnopqrstuvwxyz";
            break;
        default:
            s = "abcdefghijklmnopqrstuvwxyz0123456789";
            break;
    }
    let chars = s.split('');
    let sb: Array<string> = []
    for (let i = 0; i < maxLength; i++) {
        sb.push(chars[getRandomInt(chars.length)]);
    }
    return sb.join('');
}
export const getRandomInt = (max: number) => {
    return Math.floor(Math.random() * Math.floor(max));
}

export const isObject = (arg?: any) => {
    return arg && (JSON.parse(JSON.stringify(arg))).constructor === Object;
}

export function convertToJSONObject(model: any) {
    return JSON.parse(JSON.stringify(model));
}