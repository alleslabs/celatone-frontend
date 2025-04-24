import type { MouseEventHandler } from "react";

export enum WalletStatus {
  Loaded = "Loaded",
  Loading = "Loading",
  NotExist = "NotExist",
  NotInit = "NotInit",
  Rejected = "Rejected",
}

export interface ConnectWalletType {
  buttonText?: string;
  hasIcon?: boolean;
  iconColor?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: string;
}
