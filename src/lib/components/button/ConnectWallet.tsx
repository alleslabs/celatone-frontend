import { Button, Icon, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";
import { MdLink } from "react-icons/md";

export const ConnectWalletBtn = () => {
  const { connect } = useWallet();

  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    await connect();
  };

  return (
    <Button variant="outline-primary" gap={2} onClick={onClickConnect}>
      <Text color="violet.light">Connect Wallet</Text>
      <Icon as={MdLink} boxSize={4} color="violet.light" />
    </Button>
  );
};
