import { authAxios } from "@/lib/axios";

export type OtpPurpose = "ACCOUNT_ACTIVATION" | "PASSWORD_RESET" | "EMAIL_CHANGE";

export type AuthCredentials = {
  email: string;
  password: string;
};

export type LoginResponse = {
  status: "REQUIRES_ACTIVATION" | "SUCCESS" | string;
  email?: string;
  accessToken?: string;
  id?: number;
  firstName?: string;
  lastName?: string;
  role?: string[];
};

export type AuthUser = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  role: string[];
};

export type AuthResponseDto = {
  id: number;
  firstName: string;
  lastName: string;
  role: string[];
  accessToken: string;
};

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

export type ResendOtpPayload = {
  email: string;
  purpose: OtpPurpose;
};

export type OtpRequestPayload = {
  email: string;
  otpCode: number;
};

export type ResetPasswordPayload = {
  email: string;
  newPassword: string;
  retryPassword: string;
};

export { getApiErrorMessage, getApiError, parseErrorResponse, type ErrorResponse } from "./httpError";

export async function signIn(body: AuthCredentials): Promise<LoginResponse> {
  const res = await authAxios.post<LoginResponse>("v1/auth/sign-in", body);
  return res.data;
}

export async function signUp(body: RegisterPayload): Promise<void> {
  await authAxios.post("v1/auth/sign-up", body);
}

export async function resendOtp(body: ResendOtpPayload): Promise<void> {
  await authAxios.post("v1/auth/resend-otp", body);
}

export async function refreshSession(): Promise<AuthResponseDto> {
  const res = await authAxios.post<AuthResponseDto>("v1/auth/refresh");
  return res.data;
}

export async function signOut(): Promise<void> {
  await authAxios.post("v1/auth/sign-out");
}

export async function forgotPassword(email: string): Promise<void> {
  await authAxios.post("v1/auth/forgot-password", null, {
    params: { email },
  });
}

export async function verifyOtp(body: OtpRequestPayload): Promise<AuthResponseDto> {
  const res = await authAxios.post<AuthResponseDto>("v1/auth/verify-otp", body);
  return res.data;
}

export async function resetPassword(body: ResetPasswordPayload): Promise<void> {
  await authAxios.patch("v1/auth/reset-password", body);
}
