import { Box, Heading, Text } from "@chakra-ui/react";

import type { GovParams } from "lib/services/proposalService";
import type { Option } from "lib/types";
import { formatSeconds } from "lib/utils";

interface InitialDepositProps {
  govParams: Option<GovParams>;
}

export const InitialDeposit = ({ govParams }: InitialDepositProps) => {
  const minDeposit = govParams?.depositParams.minDeposit;

  return (
    <Box>
      <Heading as="h6" variant="h6" mt={12}>
        Initial Deposit
      </Heading>
      <Text color="text.dark" mt={2} fontWeight={500} variant="body2">
        Minimum deposit required to start{" "}
        {formatSeconds(govParams?.depositParams.maxDepositPeriod)} deposit
        period: {govParams?.depositParams.minInitialDeposit}{" "}
        {minDeposit?.formattedDenom}
      </Text>
      <Text color="text.dark" mt={2} fontWeight={500} variant="body2">
        Minimum deposit required to start{" "}
        {formatSeconds(govParams?.votingParams.votingPeriod)} voting period:{" "}
        {minDeposit?.formattedToken}
      </Text>
    </Box>
  );
};
