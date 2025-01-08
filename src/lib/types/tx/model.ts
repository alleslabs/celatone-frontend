import type { ReactNode } from "react";

import type { Nullable } from "../common";

export enum TxStreamPhase {
  BROADCAST = "BROADCAST",
  SUCCEED = "SUCCEED",
  FAILED = "FAILED",
}

export interface TxErrorRendering {
  errorId?: string;
  error: unknown;
}

export interface TxReceipt {
  title: string;
  value?: Nullable<string | number>;
  html?: ReactNode;
}

export interface ReceiptInfo {
  header: string;
  headerIcon?: ReactNode;
  description?: ReactNode;
  errorMsg?: string;
}

export type ActionVariant =
  | "sending"
  | "upload-migrate"
  | "migrate"
  | "rejected"
  | "resend"
  | "update-admin"
  | "proposal"
  | "failed";

export interface TxResultRendering<T = unknown> {
  /**
   * @internal
   * pass to next unary function
   * this property not affect to rendering
   */
  value: T;

  phase: TxStreamPhase;

  /**
   * if this is exists,
   * - the tx is failed
   */
  failedReason?: TxErrorRendering;

  /**
   * if this is exists,
   * - the tx is succeed
   * - but, had errors when make receipts
   */
  receiptErrors?: TxErrorRendering[];

  /**
   * tx receipts
   */
  receipts: TxReceipt[];

  receiptInfo: ReceiptInfo;

  actionVariant?: ActionVariant;
}
