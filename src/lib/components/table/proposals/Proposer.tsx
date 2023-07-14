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
      textVariant="body2"
    />
  ) : (
    <Text color="text.dark" variant="body2">
      N/A
    </Text>
  );
};
