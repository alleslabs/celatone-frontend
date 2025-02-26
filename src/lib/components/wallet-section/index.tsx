import { Flex } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain, useInitia } from "lib/app-provider";
import { useIcnsNamesByAddressRest } from "lib/services/name";
import { useInitiaUsernameByAddress } from "lib/services/username";
import { truncate } from "lib/utils";

import {
  ConnectWalletButton,
  Others,
  WalletConnectComponent,
} from "./WalletConnect";

export const WalletSection = () => {
  const { address, connect, view, walletProvider } = useCurrentChain();
  const isInitia = useInitia();
  const { data: initiaUsername } = useInitiaUsernameByAddress(
    address,
    isInitia
  );
  const { data: icnsNames } = useIcnsNamesByAddressRest(address, !isInitia);

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
          buttonText={truncate(initiaUsername?.username || address)}
          icon="wallet-solid"
          onClick={onClickOpenView}
          variant="ghost-primary"
        />
      );
    }

    return (
      <ConnectWalletButton
        buttonText="Connect Wallet"
        onClick={onClickConnect}
        iconColor="text.main"
        icon="wallet"
      />
    );
  }

  return (
    <Flex px={0}>
      <WalletConnectComponent
        walletStatus={walletProvider.context.status}
        disconnect={
          <ConnectWalletButton
            buttonText="Connect Wallet"
            onClick={onClickConnect}
            iconColor="text.main"
            icon="wallet"
          />
        }
        connecting={<ConnectWalletButton isLoading />}
        connected={
          <ConnectWalletButton
            buttonText={truncate(icnsNames?.primaryName || address)}
            icon="wallet-solid"
            onClick={onClickOpenView}
            variant="ghost-primary"
          />
        }
        rejected={<Others buttonText="Reconnect" onClick={onClickConnect} />}
        error={<Others buttonText="Change Wallet" onClick={onClickOpenView} />}
        notExist={
          <Others buttonText="Install Wallet" onClick={onClickOpenView} />
        }
      />
    </Flex>
  );
};
