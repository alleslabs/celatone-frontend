import { Flex, Text } from "@chakra-ui/react";

import { MobileLabel } from "../mobile/MobileLabel";
import { ValidatorBadge } from "lib/components/ValidatorBadge";
import type { NonRedelegatable } from "lib/pages/account-details/type";
import { dateFromNow, formatUTC } from "lib/utils";

interface NonRedelegatablesMobileProps {
  nonRedelegatables: NonRedelegatable[];
}

export const NonRedelegatablesMobile = ({
  nonRedelegatables,
}: NonRedelegatablesMobileProps) => (
  <Flex>
    {nonRedelegatables.map((nonRedelegatable) => (
      <Flex
        direction="column"
        gap={2}
        w="full"
        borderTop="1px solid"
        borderTopColor="gray.700"
        pt={3}
        my={3}
        key={`nonredelegatable_${nonRedelegatable.dstValidator.validatorAddress}_${nonRedelegatable.dstValidator.moniker}`}
      >
        <MobileLabel label="Cannot Redelegate From" />
        <ValidatorBadge
          validator={nonRedelegatable.dstValidator}
          badgeSize={6}
        />
        <MobileLabel label="Cannot Redelegate Until" />
        <Flex direction="column" color="text.dark">
          <Text variant="body2">
            {formatUTC(nonRedelegatable.completionTime)}
          </Text>
          <Text variant="body3" color="text.disabled">
            {`(${dateFromNow(nonRedelegatable.completionTime)})`}
          </Text>
        </Flex>
      </Flex>
    ))}
  </Flex>
);
