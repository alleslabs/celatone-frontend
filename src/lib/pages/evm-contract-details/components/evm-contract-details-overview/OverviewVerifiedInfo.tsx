import { Grid, Heading, VStack } from "@chakra-ui/react";
import { LabelText } from "lib/components/LabelText";
import { EvmVerifyInfo } from "lib/services/types";
import { getLicenseTypeLabel } from "lib/utils";
import { capitalize } from "lodash";

interface OverviewVerifiedInfoProps {
  evmVerifyInfo: EvmVerifyInfo;
}

export const OverviewVerifiedInfo = ({
  evmVerifyInfo,
}: OverviewVerifiedInfoProps) => (
  <VStack spacing={4} alignItems="flex-start">
    <Heading as="h6" variant="h6">
      Verified Info
    </Heading>
    <Grid
      gridTemplateColumns={{
        base: "1fr",
        md: "minmax(0, 160px) repeat(4, minmax(0, 240px))",
      }}
      columnGap={6}
      rowGap={4}
    >
      <LabelText label="Language">{evmVerifyInfo.language}</LabelText>
      <LabelText label="Compiler Version">
        {evmVerifyInfo.compilerVersion}
      </LabelText>
      <LabelText label="EVM Version">
        {capitalize(evmVerifyInfo.evmVersion)}
      </LabelText>
      <LabelText label="Optimization Enabled">
        {evmVerifyInfo.optimizer.enabled
          ? `Yes with ${evmVerifyInfo.optimizer.runs} runs`
          : "No"}
      </LabelText>
      <LabelText label="License Type">
        {getLicenseTypeLabel(evmVerifyInfo.license)}
      </LabelText>
    </Grid>
  </VStack>
);
