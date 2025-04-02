import { Alert, AlertDescription } from "@chakra-ui/react";
import { useCurrentChain } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export const NoVotingPeriodTallyExplanation = () => {
  const { chainId } = useCurrentChain();
  return (
    <>
      The proposal tally information during voting period is unavailable in{" "}
      <span style={{ fontWeight: 700 }}>{chainId}</span>. It will be available
      after voting period ends.
    </>
  );
};

export const NoVotingPeriodTallyAlert = () => (
  <Alert gap={3} variant="warning">
    <CustomIcon boxSize={4} color="warning.main" name="alert-triangle-solid" />
    <AlertDescription>
      <NoVotingPeriodTallyExplanation />
    </AlertDescription>
  </Alert>
);
