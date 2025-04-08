import type { MouseEventHandler } from "react";

import { Button } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useCurrentChain } from "lib/app-provider";

import { CustomIcon } from "../icon";

export const ConnectWalletBtn = () => {
  const { connect } = useCurrentChain();

  const onClickConnect: MouseEventHandler = async (e) => {
    track(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  return (
    <Button gap={2} variant="outline-primary" onClick={onClickConnect}>
      Connect wallet
      <CustomIcon name="connect" />
    </Button>
  );
};
