import type { EvmVerifyInfo } from "lib/types";

import { Grid, Heading, VStack } from "@chakra-ui/react";
import { LabelText } from "lib/components/LabelText";
import { getLicenseTypeLabel } from "lib/utils";
import { capitalize } from "lodash";

import { Optimizer } from "./Optimizer";

interface OverviewVerifiedInfoProps {
  evmVerifyInfo: EvmVerifyInfo;
}

export const OverviewVerifiedInfo = ({
  evmVerifyInfo,
}: OverviewVerifiedInfoProps) => (
  <VStack alignItems="flex-start" spacing={4}>
    <Heading as="h6" variant="h6">
      Verified info
    </Heading>
    <Grid
      columnGap={6}
      gridTemplateColumns={{
        base: "1fr",
        md: "minmax(0, 160px) repeat(4, minmax(0, 240px))",
      }}
      rowGap={4}
    >
      <LabelText label="Language">{evmVerifyInfo.language}</LabelText>
      <LabelText label="Compiler version">
        {evmVerifyInfo.compilerVersion}
      </LabelText>
      <LabelText label="EVM version">
        {capitalize(evmVerifyInfo.evmVersion)}
      </LabelText>
      <Optimizer evmVerifyInfo={evmVerifyInfo} />
      <LabelText label="License type">
        {getLicenseTypeLabel(evmVerifyInfo.license)}
      </LabelText>
    </Grid>
  </VStack>
);
