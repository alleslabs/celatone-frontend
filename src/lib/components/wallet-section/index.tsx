import { Flex } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { useInitiaUsernameByAddress } from "lib/services/username";
import { truncate } from "lib/utils";

import {
  ConnectWalletButton,
  Others,
  WalletConnectComponent,
} from "./WalletConnect";

export const WalletSection = () => {
  const { address, connect, view, walletProvider } = useCurrentChain();
  const { data: initiaUsername } = useInitiaUsernameByAddress(address);

  const onClickConnect: MouseEventHandler = async (e) => {
    track(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    track(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    view(e);
  };

  if (walletProvider.type === "initia-widget") {
    if (address) {
      return (
        <ConnectWalletButton
          variant="ghost-primary"
          buttonText={truncate(initiaUsername?.username ?? address)}
          icon="wallet-solid"
          onClick={onClickOpenView}
        />
      );
    }

    return (
      <ConnectWalletButton
        buttonText="Connect Wallet"
        icon="wallet"
        iconColor="text.main"
        onClick={onClickConnect}
      />
    );
  }

  return (
    <Flex px={0}>
      <WalletConnectComponent
        rejected={<Others buttonText="Reconnect" onClick={onClickConnect} />}
        walletStatus={walletProvider.context.status}
        connected={
          <ConnectWalletButton
            variant="ghost-primary"
            buttonText={truncate(walletProvider.context.username ?? address)}
            icon="wallet-solid"
            onClick={onClickOpenView}
          />
        }
        connecting={<ConnectWalletButton isLoading />}
        disconnect={
          <ConnectWalletButton
            buttonText="Connect Wallet"
            icon="wallet"
            iconColor="text.main"
            onClick={onClickConnect}
          />
        }
        error={<Others buttonText="Change Wallet" onClick={onClickOpenView} />}
        notExist={
          <Others buttonText="Install Wallet" onClick={onClickOpenView} />
        }
      />
    </Flex>
  );
};
