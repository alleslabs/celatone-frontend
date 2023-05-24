import { Text } from "@chakra-ui/react";

import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Addr, Option } from "lib/types";

export const Proposer = ({
  proposer,
  amptrackSection,
}: {
  proposer: Option<Addr>;
  amptrackSection?: string;
}) => {
  const getAddressType = useGetAddressType();
  return proposer ? (
    <ExplorerLink
      type={getAddressType(proposer)}
      value={proposer}
      showCopyOnHover
      ampCopierSection={amptrackSection}
      textVariant={{ base: "body2", md: "body1" }}
    />
  ) : (
    <Text color="text.dark" variant={{ base: "body2", md: "body1" }}>
      N/A
    </Text>
  );
};
