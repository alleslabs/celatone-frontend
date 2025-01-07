import { Button } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import type { MouseEventHandler, ReactNode } from "react";

import { CustomIcon } from "../icon";
import type { ConnectWalletType } from "lib/types";

export const ConnectWalletButton = ({
  buttonText,
  icon,
  isDisabled,
  isLoading,
  onClick,
  variant,
}: ConnectWalletType) => (
  <Button
    gap={1}
    isDisabled={isDisabled}
    minH="64px"
    variant={variant}
    w="170px"
    alignContent="center"
    borderRadius={0}
    isLoading={isLoading}
    onClick={onClick}
  >
    <CustomIcon name={icon ?? "wallet"} />
    {buttonText || "Connect"}
  </Button>
);

// For Rejected, NotExist or Error
export const Others = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => (
  <ConnectWalletButton
    isDisabled={false}
    buttonText={buttonText}
    onClick={onClick}
  />
);

export const WalletConnectComponent = ({
  connected,
  connecting,
  disconnect,
  error,
  notExist,
  rejected,
  walletStatus,
}: {
  connected: ReactNode;
  connecting: ReactNode;
  disconnect: ReactNode;
  error: ReactNode;
  notExist: ReactNode;
  rejected: ReactNode;
  walletStatus: WalletStatus;
}) => {
  switch (walletStatus) {
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    default:
      return <>{disconnect}</>;
  }
};
