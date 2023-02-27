import { Button } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import type { MouseEventHandler, ReactNode } from "react";

import type { ICONS } from "../icon/CustomIcon";
import { CustomIcon } from "../icon/CustomIcon";
import type { ConnectWalletType } from "lib/types";

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  onClickConnectBtn,
  iconColor = "text.main",
  variant,
}: ConnectWalletType) => {
  return (
    <Button
      w="170px"
      isLoading={isLoading}
      isDisabled={isDisabled}
      onClick={onClickConnectBtn}
      variant={variant}
      gap="1"
    >
      <CustomIcon name="connect" color={iconColor} />
      {buttonText || "Connect"}
    </Button>
  );
};

export const Connected = ({
  buttonText,
  onClick,
  icon,
  variant,
  iconColor,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon?: keyof typeof ICONS;
  variant?: string;
  iconColor?: string;
}) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      onClickConnectBtn={onClick}
      icon={icon}
      iconColor={iconColor}
      variant={variant}
    />
  );
};

export const Disconnected = (props: {
  buttonText: string;
  iconColor: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => <Connected {...props} />;

export const Connecting = () => {
  return <ConnectWalletButton isLoading />;
};

// For Rejected, NotExist or Error
export const Others = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

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
