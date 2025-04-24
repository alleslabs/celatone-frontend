import type { ReactNode } from "react";

import type { Nullable } from "../common";

export enum TxStreamPhase {
  BROADCAST = "BROADCAST",
  FAILED = "FAILED",
  SUCCEED = "SUCCEED",
}

export interface TxErrorRendering {
  error: unknown;
  errorId?: string;
}

export interface TxReceipt {
  html?: ReactNode;
  title: string;
  value?: Nullable<number | string>;
}

export interface ReceiptInfo {
  description?: ReactNode;
  errorMsg?: string;
  header: string;
  headerIcon?: ReactNode;
}

export type ActionVariant =
  | "failed"
  | "migrate"
  | "proposal"
  | "rejected"
  | "resend"
  | "sending"
  | "update-admin"
  | "upload-migrate";

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
