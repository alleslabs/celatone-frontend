import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { truncate } from "lib/utils";

import {
  Connected,
  Connecting,
  Disconnected,
  WalletConnectComponent,
  Others,
} from "./wallet/index";

export const WalletSection = () => {
  const walletManager = useWallet();
  const { address } = useWallet();
  const { connect, openView, walletStatus } = walletManager;

  // Events
  const onClickConnect: MouseEventHandler = async (e) => {
    AmpTrack(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    AmpTrack(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    openView();
  };

  return (
    <WalletConnectComponent
      walletStatus={walletStatus}
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
          variant="outline-info"
          iconColor="honeydew.main"
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
