import { Box, Text } from "@chakra-ui/react";

import type { NonRedelegatable, Redelegation } from "lib/types";
import { NonRedelegatablesTable } from "../table";

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
      <NonRedelegatablesTable nonRedelegatables={nonRedelegatables} />
    </Box>
  );
};
