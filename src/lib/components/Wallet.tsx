import type { MouseEventHandler } from "react";

import { AmpEvent, useTrack } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";
import { truncate } from "lib/utils";

import {
  Connected,
  Connecting,
  Disconnected,
  WalletConnectComponent,
  Others,
} from "./wallet/index";

export const WalletSection = () => {
  const { address, connect, openView, status } = useCurrentChain();
  const { track } = useTrack();

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
    <WalletConnectComponent
      walletStatus={status}
      disconnect={
        <Disconnected
          buttonText="Connect"
          onClick={onClickConnect}
          iconColor="text.main"
        />
      }
      connecting={<Connecting />}
      connected={
        <Connected
          buttonText={truncate(address)}
          icon="wallet"
          onClick={onClickOpenView}
          variant="outline-accent"
        />
      }
      rejected={<Others buttonText="Reconnect" onClick={onClickConnect} />}
      error={<Others buttonText="Change Wallet" onClick={onClickOpenView} />}
      notExist={
        <Others buttonText="Install Wallet" onClick={onClickOpenView} />
      }
    />
  );
};
