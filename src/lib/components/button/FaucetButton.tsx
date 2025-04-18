import { Button } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface FaucetButtonProps {
  faucetUrl: string;
}

export const FaucetButton = ({ faucetUrl }: FaucetButtonProps) => (
  <a
    style={{ height: "100%", overflow: "hidden" }}
    data-peer
    href={faucetUrl}
    rel="noopener noreferrer"
    target="_blank"
  >
    <Button
      borderRadius={0}
      h="full"
      leftIcon={<CustomIcon name="faucet" />}
      variant="ghost-gray"
    >
      Faucet
    </Button>
  </a>
);
