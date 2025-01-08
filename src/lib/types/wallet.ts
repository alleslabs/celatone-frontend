import type { MouseEventHandler } from "react";

import type { IconKeys } from "lib/components/icon";

export enum WalletStatus {
  Loaded = "Loaded",
  Loading = "Loading",
  NotExist = "NotExist",
  NotInit = "NotInit",
  Rejected = "Rejected",
}

export interface ConnectWalletType {
  buttonText?: string;
  icon?: IconKeys;
  iconColor?: string;
  isDisabled?: boolean;
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: string;
}
