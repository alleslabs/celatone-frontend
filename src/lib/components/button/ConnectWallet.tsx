import { Button } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { CustomIcon } from "../icon";
import { useCurrentChain } from "lib/app-provider";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

export const ConnectWalletBtn = () => {
  const { connect } = useCurrentChain();

  const onClickConnect: MouseEventHandler = async (e) => {
    AmpTrack(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  return (
    <Button variant="outline-primary" gap={2} onClick={onClickConnect}>
      Connect Wallet
      <CustomIcon name="connect" />
    </Button>
  );
};
