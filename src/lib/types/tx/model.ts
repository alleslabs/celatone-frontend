import type { ReactNode } from "react";

import type { Nullable } from "../common";

export enum TxStreamPhase {
  BROADCAST = "BROADCAST",
  FAILED = "FAILED",
  SUCCEED = "SUCCEED",
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

export interface ReceiptInfo {
  description?: ReactNode;
  errorMsg?: string;
  header: string;
  headerIcon?: ReactNode;
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

export interface TxResultRendering<T = unknown> {
  actionVariant?: ActionVariant;

  /**
   * if this is exists,
   * - the tx is failed
   */
  failedReason?: TxErrorRendering;

  phase: TxStreamPhase;

  /**
   * if this is exists,
   * - the tx is succeed
   * - but, had errors when make receipts
   */
  receiptErrors?: TxErrorRendering[];

  receiptInfo: ReceiptInfo;

  /**
   * tx receipts
   */
  receipts: TxReceipt[];

  /**
   * @internal
   * pass to next unary function
   * this property not affect to rendering
   */
  value: T;
}
