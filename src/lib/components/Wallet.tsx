import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";

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
    e.preventDefault();
    await connect();
  };

  const onClickOpenView: MouseEventHandler = (e) => {
    e.preventDefault();
    openView();
  };

  return (
    <WalletConnectComponent
      walletStatus={walletStatus}
      disconnect={
        <Disconnected buttonText="Connect" onClick={onClickConnect} />
      }
      connecting={<Connecting />}
      connected={
        <Connected
          buttonText={truncate(address)}
          icon={MdOutlineAccountBalanceWallet}
          onClick={onClickOpenView}
          variant="outline-info"
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
