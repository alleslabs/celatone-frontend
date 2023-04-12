import { Text } from "@chakra-ui/react";

import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Addr, Option } from "lib/types";

export const Proposer = ({ proposer }: { proposer: Option<Addr> }) => {
  const getAddressType = useGetAddressType();

  return proposer ? (
    <ExplorerLink
      type={getAddressType(proposer)}
      value={proposer}
      showCopyOnHover
    />
  ) : (
    <Text color="text.dark">N/A</Text>
  );
};
