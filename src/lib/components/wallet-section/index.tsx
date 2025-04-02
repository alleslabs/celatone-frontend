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
          onClick={onClickOpenView}
          hasIcon
          variant="ghost-white"
        />
      );
    }

    return (
      <ConnectWalletButton
        buttonText="Connect wallet"
        onClick={onClickConnect}
        variant="white-solid"
      />
    );
  }

  return (
    <Flex px={0}>
      <WalletConnectComponent
        walletStatus={walletProvider.context.status}
        disconnect={
          <ConnectWalletButton
            buttonText="Connect wallet"
            onClick={onClickConnect}
          />
        }
        connecting={<ConnectWalletButton isLoading />}
        connected={
          <ConnectWalletButton
            buttonText={truncate(icnsNames?.primaryName || address)}
            onClick={onClickOpenView}
            hasIcon
            variant="ghost-white"
          />
        }
        rejected={<Others buttonText="Reconnect" onClick={onClickConnect} />}
        error={<Others buttonText="Change wallet" onClick={onClickOpenView} />}
        notExist={
          <Others buttonText="Install wallet" onClick={onClickOpenView} />
        }
      />
    </Flex>
  );
};
