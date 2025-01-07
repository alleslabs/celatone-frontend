import { Flex, Grid, Text } from "@chakra-ui/react";

import { LabelText } from "lib/components/LabelText";
import type { MoveVerifyTaskStatus } from "lib/services/types";
import type { Option } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { MyModuleVerificationDetailsStatusBadge } from "./MyModuleVerificationDetailsStatusBadge";

interface MyModuleVerificationDetailsInfoProps {
  chainId: Option<string>;
  status: MoveVerifyTaskStatus;
  verifiedAt: Option<Date>;
}

export const MyModuleVerificationDetailsInfo = ({
  chainId,
  status,
  verifiedAt,
}: MyModuleVerificationDetailsInfoProps) => (
  <Grid
    gridTemplateColumns="repeat(4, 160px)"
    p={4}
    border="1px"
    borderColor="gray.700"
    rounded={8}
  >
    {chainId && <LabelText label="Network">{chainId}</LabelText>}
    <LabelText label="Status">
      <MyModuleVerificationDetailsStatusBadge status={status} />
    </LabelText>
    {verifiedAt && (
      <LabelText gridColumn="span 2" label="Verified at">
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
