import { Button, Text } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { CustomIcon } from "../icon";
import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";

export const FaucetBtn = () => {
  const navigate = useInternalNavigate();
  const { isTestnet } = useCurrentNetwork();

  const onClick: MouseEventHandler = async (e) => {
    e.preventDefault();
    navigate({
      pathname: "/faucet",
    });
  };

  return isTestnet ? (
    <Button
      gap={2}
      onClick={onClick}
      borderWidth="1px"
      borderColor="pebble.600"
      background="unset"
    >
      <CustomIcon name="faucet" color="gray.600" boxSize="4" />
      <Text color="text.dark" fontWeight={700}>
        Faucet
      </Text>
    </Button>
  ) : null;
};
