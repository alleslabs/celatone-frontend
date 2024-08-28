import { Flex, Grid, Text } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";
import type { MoveVerifyTaskStatus } from "lib/services/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { MyModuleVerificationDetailsStatusBadge } from "./MyModuleVerificationDetailsStatusBadge";

interface MyModuleVerificationDetailsInfoProps {
  chainId: string;
  status: MoveVerifyTaskStatus;
  verifiedAt: Date;
}

export const MyModuleVerificationDetailsInfo = ({
  chainId,
  status,
  verifiedAt,
}: MyModuleVerificationDetailsInfoProps) => (
  <Grid
    gridTemplateColumns="repeat(4, 160px)"
    border="1px"
    borderColor="gray.700"
    rounded={8}
    p={4}
  >
    <LabelText label="Network">{chainId}</LabelText>
    <LabelText label="Status">
      <MyModuleVerificationDetailsStatusBadge status={status} />
    </LabelText>
    {verifiedAt && (
      <LabelText label="Verified at" gridColumn="span 2">
        <Flex direction="column">
          <Text variant="body2" color="text.dark">
            {formatUTC(verifiedAt)}
          </Text>
          <Text variant="body3" color="text.disabled">
            ({dateFromNow(verifiedAt)})
          </Text>
        </Flex>
      </LabelText>
    )}
  </Grid>
);
