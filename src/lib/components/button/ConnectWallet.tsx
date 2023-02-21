import { Button, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

import { CustomIcon } from "../icon/CustomIcon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

export const ConnectWalletBtn = () => {
  const { connect } = useWallet();

  const onClickConnect: MouseEventHandler = async (e) => {
    AmpTrack(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  return (
    <Button variant="outline-primary" gap={2} onClick={onClickConnect}>
      <Text color="violet.light">Connect Wallet</Text>
      <CustomIcon name="connect" viewBox="0 -4 16 16" color="violet.light" />
    </Button>
  );
};
