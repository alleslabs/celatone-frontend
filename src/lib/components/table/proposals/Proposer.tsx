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
    />
  ) : (
    <Text color="text.dark">N/A</Text>
  );
};
