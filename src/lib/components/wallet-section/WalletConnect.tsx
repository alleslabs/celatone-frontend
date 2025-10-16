import type { ConnectWalletType } from "lib/types";
import type { MouseEventHandler, ReactNode } from "react";

import { Button, Image } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { useAccount } from "wagmi";

import { CustomIcon } from "../icon";

export const ConnectWalletButton = ({
  buttonText,
  hasIcon,
  isDisabled,
  isLoading,
  onClick,
  variant,
}: ConnectWalletType) => {
  const { connector } = useAccount();
  return (
    <Button
      alignContent="center"
      gap={1}
      isDisabled={isDisabled}
      isLoading={isLoading}
      maxH="32px"
      px={hasIcon ? "8px" : "18px"}
      variant={variant}
      onClick={onClick}
    >
      {hasIcon &&
        (connector?.icon ? (
          <Image
            alt="Connected Wallet logo"
            mr={2}
            src={connector?.icon}
            width={5}
          />
        ) : (
          <CustomIcon mr={2} name="wallet" />
        ))}
      {buttonText || "Connect wallet"}
      {hasIcon && <CustomIcon boxSize={3} name="chevron-down" />}
    </Button>
  );
};

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
