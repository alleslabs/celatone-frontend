import type { MouseEventHandler } from "react";

import { Flex } from "@chakra-ui/react";
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
          hasIcon
          variant="ghost-white"
          onClick={onClickOpenView}
        />
      );
    }

    return (
      <ConnectWalletButton
        buttonText="Connect wallet"
        variant="white-solid"
        onClick={onClickConnect}
      />
    );
  }

  return (
    <Flex px={0}>
      <WalletConnectComponent
        connected={
          <ConnectWalletButton
            buttonText={truncate(icnsNames?.primaryName || address)}
            hasIcon
            variant="ghost-white"
            onClick={onClickOpenView}
          />
        }
        connecting={<ConnectWalletButton isLoading />}
        disconnect={
          <ConnectWalletButton
            buttonText="Connect wallet"
            onClick={onClickConnect}
          />
        }
        error={<Others buttonText="Change wallet" onClick={onClickOpenView} />}
        notExist={
          <Others buttonText="Install wallet" onClick={onClickOpenView} />
        }
        rejected={<Others buttonText="Reconnect" onClick={onClickConnect} />}
        walletStatus={walletProvider.context.status}
      />
    </Flex>
  );
};
