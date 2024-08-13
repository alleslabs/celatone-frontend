import { Grid } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";
import type { MoveVerifyTaskStatus } from "lib/services/types";

import { MyModuleVerificationDetailsStatusBadge } from "./MyModuleVerificationDetailsStatusBadge";

interface MyModuleVerificationDetailsInfoProps {
  chainId: string;
  status: MoveVerifyTaskStatus;
}

export const MyModuleVerificationDetailsInfo = ({
  chainId,
  status,
}: MyModuleVerificationDetailsInfoProps) => (
  <Grid
    gridTemplateColumns="repeat(3, 160px)"
    border="1px"
    borderColor="gray.700"
    rounded={8}
    p={4}
  >
    <LabelText label="Network">{chainId}</LabelText>
    <LabelText label="Status">
      <MyModuleVerificationDetailsStatusBadge status={status} />
    </LabelText>
    <LabelText label="Verified at" />
  </Grid>
);
