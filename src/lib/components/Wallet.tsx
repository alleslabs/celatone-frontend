import { Flex } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { truncate } from "lib/utils";

import {
  Connected,
  Connecting,
  Disconnected,
  Others,
  WalletConnectComponent,
} from "./wallet/index";

export const WalletSection = () => {
  const { address, connect, openView, status } = useCurrentChain();

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    track(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    track(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    openView();
  };

  return (
    <Flex px={0}>
      <WalletConnectComponent
        walletStatus={status}
        disconnect={
          <Disconnected
            buttonText="Connect Wallet"
            onClick={onClickConnect}
            iconColor="text.main"
            icon="wallet"
          />
        }
        connecting={<Connecting />}
        connected={
          <Connected
            buttonText={truncate(address)}
            icon="wallet-solid"
            onClick={onClickOpenView}
            variant="ghost-accent"
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
