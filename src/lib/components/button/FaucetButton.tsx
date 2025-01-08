import { Button } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface FaucetButtonProps {
  faucetUrl: string;
}

export const FaucetButton = ({ faucetUrl }: FaucetButtonProps) => (
  <a
    style={{ height: "100%", overflow: "hidden" }}
    data-peer
    rel="noopener noreferrer"
    target="_blank"
    href={faucetUrl}
  >
    <Button
      h="full"
      variant="ghost-gray"
      borderRadius={0}
      leftIcon={<CustomIcon name="faucet" />}
    >
      Faucet
    </Button>
  </a>
);
