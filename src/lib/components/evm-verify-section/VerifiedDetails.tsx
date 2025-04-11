import type { HexAddr20 } from "lib/types";

import { Text } from "@chakra-ui/react";
import { TabIndex } from "lib/pages/evm-contract-details/types";

import { AppLink } from "../AppLink";

interface VerifiedDetailsProps {
  contractAddress: HexAddr20;
}

export const VerifiedDetails = ({ contractAddress }: VerifiedDetailsProps) => (
  <Text color="text.dark" variant="body2">
    This contract source code is verified with the exact match. You can view its{" "}
    <AppLink href={`/evm-contracts/${contractAddress}/${TabIndex.Contract}`}>
      <Text
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        as="span"
        color="primary.main"
        cursor="pointer"
        fontWeight={700}
        transition="all 0.25s ease-in-out"
      >
        source code.
      </Text>
    </AppLink>
  </Text>
);
