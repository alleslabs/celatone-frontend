import type { BechAddr, Option } from "lib/types";

import { Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";

export const Proposer = ({
  proposer,
  amptrackSection,
}: {
  proposer: Option<BechAddr>;
  amptrackSection?: string;
}) => {
  const getAddressType = useGetAddressType();
  return proposer ? (
    <ExplorerLink
      ampCopierSection={amptrackSection}
      showCopyOnHover
      textVariant="body2"
      type={getAddressType(proposer)}
      value={proposer}
    />
  ) : (
    <Text color="text.dark" variant="body2">
      N/A
    </Text>
  );
};
