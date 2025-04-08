import type { NonRedelegatable } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { dateFromNow, formatUTC } from "lib/utils";

import { ValidatorBadge } from "../../ValidatorBadge";
import { MobileLabel } from "../MobileLabel";

interface NonRedelegatablesTableMobileCardProps {
  nonRedelegatable: NonRedelegatable;
}

export const NonRedelegatablesTableMobileCard = ({
  nonRedelegatable,
}: NonRedelegatablesTableMobileCardProps) => (
  <Flex
    borderTop="1px solid"
    borderTopColor="gray.700"
    direction="column"
    gap={2}
    minW={0}
    my={3}
    pt={3}
    w="full"
  >
    <MobileLabel label="Cannot redelegate from" />
    <ValidatorBadge validator={nonRedelegatable.dstValidator} />
    <MobileLabel label="Cannot redelegate until" />
    <Flex direction="column">
      <Text variant="body2">{formatUTC(nonRedelegatable.completionTime)}</Text>
      <Text color="text.disabled" variant="body3">
        {`(${dateFromNow(nonRedelegatable.completionTime)})`}
      </Text>
    </Flex>
  </Flex>
);
