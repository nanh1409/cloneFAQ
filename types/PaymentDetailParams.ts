import { PAYMENT_BANK, PAYMENT_PAYPAL, PAYMENT_VNPAY } from "../modules/share/constraint"

export type PayPalPaymentDetailsParams = {
  status: "success" | "capture_failed";
  serial: string;
  orderTime: string;
  content: string;
  amount: string;
}

export type VNPayPaymentDetailsParams = {
  responseCode: "" | "00" | "01" | "02" | "03" | "04";
  serial: string;
  content: string;
  bankCode: string;
  orderTime: string;
  amount: string;
}

export const mapPaymentType = {
  [PAYMENT_PAYPAL]: "PayPal",
  [PAYMENT_VNPAY]: "VNPay",
  [PAYMENT_BANK]: "Bank Transfer"
}

export const mapVnpRspCodeReturn = {
  "00": "Confirm Success",
  "01": "Checksum Failed",
  "02": "Order Not Found",
  "03": "Invalid Price",
  "04": "Failed"
};