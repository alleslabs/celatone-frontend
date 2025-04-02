import { Button } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import type { MouseEventHandler, ReactNode } from "react";

import type { ConnectWalletType } from "lib/types";
import { CustomIcon } from "../icon";

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  onClick,
  variant,
  hasIcon,
}: ConnectWalletType) => (
  <Button
    isLoading={isLoading}
    isDisabled={isDisabled}
    onClick={onClick}
    variant={variant}
    gap={1}
    alignContent="center"
    maxH="32px"
    px={hasIcon ? "8px" : "18px"}
  >
    {hasIcon && <CustomIcon name="wallet" mr={2} />}
    {buttonText || "Connect wallet"}
    {hasIcon && <CustomIcon name="chevron-down" boxSize={3} />}
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
    buttonText={buttonText}
    isDisabled={false}
    onClick={onClick}
  />
);

export const WalletConnectComponent = ({
  walletStatus,
  disconnect,
  connecting,
  connected,
  rejected,
  error,
  notExist,
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connecting: ReactNode;
  connected: ReactNode;
  rejected: ReactNode;
  error: ReactNode;
  notExist: ReactNode;
}) => {
  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
