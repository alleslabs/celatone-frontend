import { Button } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import type { MouseEventHandler, ReactNode } from "react";

import type { IconKeys } from "../icon";
import { CustomIcon } from "../icon";
import type { ConnectWalletType } from "lib/types";

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  onClickConnectBtn,
  variant,
  isFullButton = false,
}: ConnectWalletType) => (
  <Button
    w="170px"
    isLoading={isLoading}
    isDisabled={isDisabled}
    onClick={onClickConnectBtn}
    variant={variant}
    gap={1}
    minH="64px"
    borderRadius={isFullButton ? "0" : "inherit"}
  >
    <CustomIcon name="connect" />
    {buttonText || "Connect"}
  </Button>
);

export const Connected = ({
  buttonText,
  onClick,
  icon,
  variant,
  isFullButton,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon?: IconKeys;
  variant?: string;
  isFullButton?: boolean;
}) => (
  <ConnectWalletButton
    buttonText={buttonText}
    onClickConnectBtn={onClick}
    icon={icon}
    variant={variant}
    isFullButton={isFullButton}
  />
);

export const Disconnected = (props: {
  buttonText: string;
  iconColor: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  isFullButton: boolean;
}) => <Connected {...props} />;

export const Connecting = () => <ConnectWalletButton isLoading />;

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
    onClickConnectBtn={onClick}
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
