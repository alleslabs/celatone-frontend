import type { MouseEventHandler } from "react";

import type { IconKeys } from "lib/components/icon";

export enum WalletStatus {
  NotInit = "NotInit",
  Loading = "Loading",
  Loaded = "Loaded",
  NotExist = "NotExist",
  Rejected = "Rejected",
}

export interface ConnectWalletType {
  buttonText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  icon?: IconKeys;
  iconColor?: string;
  variant?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}
