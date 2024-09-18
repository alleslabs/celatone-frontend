import { Button } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

interface FaucetButtonProps {
  faucetUrl: string;
}

export const FaucetButton = ({ faucetUrl }: FaucetButtonProps) => (
  <a
    href={faucetUrl}
    target="_blank"
    rel="noopener noreferrer"
    data-peer
    style={{ overflow: "hidden" }}
  >
    <Button
      variant="ghost-gray"
      leftIcon={<CustomIcon name="faucet" />}
      h="full"
      borderRadius={0}
    >
      Faucet
    </Button>
  </a>
);
