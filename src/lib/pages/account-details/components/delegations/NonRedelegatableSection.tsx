import { Box, Text } from "@chakra-ui/react";

import { NonRedelegatablesTable } from "../tables";
import { useMobile } from "lib/app-provider";
import type { Redelegation } from "lib/pages/account-details/data";
import type { NonRedelegatable } from "lib/pages/account-details/type";

import { NonRedelegatablesMobile } from "./NonRedelegatablesMobile";

interface NonRedelegatableSectionProps {
  redelegations: Redelegation[];
}

export const NonRedelegatableSection = ({
  redelegations,
}: NonRedelegatableSectionProps) => {
  const nonRedelegatables = redelegations
    .reduceRight<NonRedelegatable[]>((prev, redelegation) => {
      if (
        prev.find(
          (value) =>
            value.dstValidator.validatorAddress ===
            redelegation.dstValidator.validatorAddress
        )
      )
        return prev;
      return prev.concat({
        dstValidator: redelegation.dstValidator,
        completionTime: redelegation.completionTime,
      });
    }, [])
    .reverse();
  const isMobile = useMobile();
  return (
    <Box
      px={{ base: 3, md: 6 }}
      py={{ base: 3, md: 4 }}
      bgColor="gray.900"
      border="1px solid"
      borderColor="gray.700"
      borderRadius="8px"
    >
      <Text variant="body2">
        This account cannot redelegate from
        <span style={{ fontWeight: 700 }}>
          {" "}
          these validators to other validators{" "}
        </span>
        until their active redelegations have completed.
      </Text>
      {isMobile ? (
        <NonRedelegatablesMobile nonRedelegatables={nonRedelegatables} />
      ) : (
        <NonRedelegatablesTable nonRedelegatables={nonRedelegatables} />
      )}
    </Box>
  );
};
