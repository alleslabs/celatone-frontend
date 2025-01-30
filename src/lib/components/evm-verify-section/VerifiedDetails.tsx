import { Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { TabIndex } from "lib/pages/evm-contract-details/types";
import type { HexAddr20 } from "lib/types";

interface VerifiedDetailsProps {
  contractAddress: HexAddr20;
}

export const VerifiedDetails = ({ contractAddress }: VerifiedDetailsProps) => {
  const navigate = useInternalNavigate();

  const handleNavigate = () =>
    navigate({
      pathname: "/evm-contracts/[contractAddress]/[tab]",
      query: { contractAddress, tab: TabIndex.Contract },
    });

  return (
    <Text variant="body2" color="text.dark">
      This contract source code is verified with the exact match. You can view
      its{" "}
      <Text
        as="span"
        cursor="pointer"
        color="primary.main"
        transition="all 0.25s ease-in-out"
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "primary.light",
        }}
        onClick={handleNavigate}
      >
        Source Code.
      </Text>
    </Text>
  );
};
