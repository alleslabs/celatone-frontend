import { Flex, Text } from "@chakra-ui/react";

import type { NonRedelegatable } from "lib/types";
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
    direction="column"
    gap={2}
    w="full"
    minW={0}
    borderTop="1px solid"
    borderTopColor="gray.700"
    pt={3}
    my={3}
  >
    <MobileLabel label="Cannot Redelegate From" />
    <ValidatorBadge validator={nonRedelegatable.dstValidator} />
    <MobileLabel label="Cannot Redelegate Until" />
    <Flex direction="column">
      <Text variant="body2">{formatUTC(nonRedelegatable.completionTime)}</Text>
      <Text variant="body3" color="text.disabled">
        {`(${dateFromNow(nonRedelegatable.completionTime)})`}
      </Text>
    </Flex>
  </Flex>
);
