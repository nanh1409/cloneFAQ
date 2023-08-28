import { NOT_PAYMENT } from "../constraint";

export type VNPayConfig = {
  vnp_TmnCode: string;
  vnp_HashSecret: string;
  vnp_RedirectUrl: string;
  vnp_Version: string;
}

export type PayPalConfig = {
  client_id: string;
  client_secret: string;
}
// Other Config

type PaymentConfigData = VNPayConfig | PayPalConfig;

class PaymentConfig {
  _id?: string;
  appId?: string;
  paymentType: number;
  // Live or Sandbox
  isLiveEnv: boolean;
  config: PaymentConfigData;

  constructor(args: Partial<PaymentConfig> = {}) {
    this._id = args._id;
    this.appId = args.appId;
    this.paymentType = args.paymentType ?? NOT_PAYMENT;
    this.isLiveEnv = args.isLiveEnv ?? false;
    this.config = args.config || {} as PaymentConfigData;
  }
}

export default PaymentConfig;