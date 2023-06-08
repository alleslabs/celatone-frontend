import { Alert, AlertDescription, Button, Flex } from "@chakra-ui/react";

import { useSelectChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { getChainNameByNetwork } from "lib/data";
import { AmpTrackUseAlertCTA } from "lib/services/amplitude";

export const TestnetAlert = () => {
  const selectChain = useSelectChain();
  return (
    <Alert variant="error" alignItems="center" justifyContent="space-between">
      <Flex gap={2} align="center">
        <CustomIcon name="alert-circle-solid" color="error.main" boxSize={4} />
        <AlertDescription>
          You cannot create proposal to whitelist through testnet.
        </AlertDescription>
      </Flex>
      <Button
        size="sm"
        variant="ghost-error"
        onClick={() => {
          AmpTrackUseAlertCTA("proposal_whitelist", "switch_to_mainnet");
          selectChain(getChainNameByNetwork("mainnet"));
        }}
      >
        Switch To Mainnet
      </Button>
    </Alert>
  );
};
