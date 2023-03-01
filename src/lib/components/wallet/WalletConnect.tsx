import { Button, Icon } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import type { MouseEventHandler, ReactNode } from "react";
import type { IconType } from "react-icons";
import { MdLink } from "react-icons/md";

import type { ConnectWalletType } from "lib/types";

export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  onClickConnectBtn,
  icon,
  variant,
}: ConnectWalletType) => (
  <Button
    w="170px"
    isLoading={isLoading}
    isDisabled={isDisabled}
    onClick={onClickConnectBtn}
    variant={variant}
  >
    <Icon as={icon || MdLink} boxSize="4" mr={2} />
    {buttonText || "Connect"}
  </Button>
);

export const Connected = ({
  buttonText,
  onClick,
  icon,
  variant,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  icon?: IconType;
  variant?: string;
}) => (
  <ConnectWalletButton
    buttonText={buttonText}
    onClickConnectBtn={onClick}
    icon={icon}
    variant={variant}
  />
);

export const Disconnected = (props: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
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
