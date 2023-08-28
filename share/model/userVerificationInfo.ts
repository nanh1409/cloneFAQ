/**
 * User's Verification Info, includes email verification token, expires time, ...
 */
export class UserVerificationInfo {
  _id: string | undefined;
  userId: string | null;
  /**
   * Verification Token, email or phone OTP
   */
  token: string;
  expiredAt: Date;
}