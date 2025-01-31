import { Text } from "@chakra-ui/react";

import { TabIndex } from "lib/pages/evm-contract-details/types";
import type { HexAddr20 } from "lib/types";
import { AppLink } from "../AppLink";

interface VerifiedDetailsProps {
  contractAddress: HexAddr20;
}

export const VerifiedDetails = ({ contractAddress }: VerifiedDetailsProps) => (
  <Text variant="body2" color="text.dark">
    This contract source code is verified with the exact match. You can view its{" "}
    <AppLink href={`/evm-contracts/${contractAddress}/${TabIndex.Contract}`}>
      <Text
        as="span"
        cursor="pointer"
        color="primary.main"
        transition="all 0.25s ease-in-out"
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
      >
        Source Code.
      </Text>
    </AppLink>
  </Text>
);
