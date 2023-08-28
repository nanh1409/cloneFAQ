import { UserInfo } from "../../modules/share/model/user";
import { get, getEndpoint, post } from "../../utils/fetcher"
import ObjectId from "bson-objectid";
import { LOGIN_FAILED } from "../../modules/share/constraint";

export const apiRegisterUserId = async () => {
  // const { data, error } = await post({ endpoint: "/api/users/register-id" });
  // return {
  //   error,
  //   userId: error ? '' : data?.userId
  // }

  return Promise.resolve({ userId: ObjectId(new Date().getTime()).toHexString() });
}

export const apiLogin = async (args: any): Promise<UserInfo> => {
  const { data, error } = await post({ endpoint: "/api/login", body: { ...args } })
  return error ? null : data;
}

export const apiRegister = async (args: any) => {
  const { data, error } = await post({ endpoint: "/api/register", body: { ...args } })
  return error ? null : data;
}

export const apiLogout = async (token: string) => {
  const { data, error } = await post({ endpoint: "/api/logout", body: {}, customHeaders: { "x-access-token": token } })
  return error ? null : data;
}

export const apiGetUserByToken = async (token: string, updateLoginTime?: boolean, noCache?: boolean): Promise<UserInfo & { syncedPass?: boolean; }> => {
  const { data, error } = await post({
    endpoint: "/api/get-user-from-token", customHeaders: {
      "x-access-token": token
    },
    body: { updateLoginTime, noCache }
  });
  return error ? null : data
}

export type ForgotAppPasswordArgs = {
  appName?: string;
  email: string;
  clientUrl: string;
  key?: string;
}
export const apiRequestResetPassword = async (args: ForgotAppPasswordArgs): Promise<number> => {
  const { data, error } = await post({ endpoint: "/api/forgot-app-password", body: args });
  return error ? LOGIN_FAILED : (data?.loginCode ?? LOGIN_FAILED)
}

export const apiGetResetPasswordTokenStatus = async (token: string, local?: boolean): Promise<{ userId: string; account: string } | null> => {
  const { data, error } = await get({
    endpoint: getEndpoint("/api/forgot-app-password/token-status", local), customHeaders: {
      "x-access-token": token
    },
  });
  return error ? null : data;
}

export const apiResetPassword = async (args: {
  token: string;
  password: string;
}): Promise<number> => {
  const { data, error } = await post({
    endpoint: "/api/reset-app-password", body: { password: args.password }, customHeaders: {
      "x-access-token": args.token
    }
  });
  return error ? LOGIN_FAILED : (data?.loginCode ?? LOGIN_FAILED)
}

// TODO: secret or token between srv to srv
export const apiLoginWithGoogle = async (args: {
  email: string;
  account: string;
  name: string;
  avatar?: string;
  appLogin?: boolean;
  appName?: string;
  localRegisterTime?: number;
}): Promise<UserInfo> => {
  const { data, error } = await post({ endpoint: getEndpoint("/api/login-register-with-google", true), body: args });
  return error ? { loginCode: LOGIN_FAILED } : data;
}

export const apiUpdateUserInfo = async (args: {
  token: string;
} & Partial<Pick<UserInfo, "name" | "birth" | "email" | "phoneNumber">>) => {
  const { token, ...updates } = args;
  const { data } = await post({
    endpoint: "/api/update-user-info-new", body: updates, customHeaders: {
      "x-access-token": token
    }
  });
  return !!data?.success
}

export const apiChangePassword = async (args: {
  token: string;
  oldPassword: string;
  newPassword: string;
}): Promise<{ loginCode: number; }> => {
  const { token, ...body } = args;
  const { data, error } = await post({
    endpoint: "/api/users/change-password", body, customHeaders: {
      "x-access-token": token
    }
  });
  return error ? { loginCode: LOGIN_FAILED } : data;
}

export const apiDeleteAccount = async (token: string, userId: string): Promise<string> => {
  const { data, error } = await post({
    endpoint: "/api/users/v2/deactive-user", customHeaders: {
      "x-access-token": token
    },
    body: { userId }
  });
  return error ? null : data
}