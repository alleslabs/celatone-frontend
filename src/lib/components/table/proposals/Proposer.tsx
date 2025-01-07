import { Text } from "@chakra-ui/react";

import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { BechAddr, Option } from "lib/types";

export const Proposer = ({
  amptrackSection,
  proposer,
}: {
  amptrackSection?: string;
  proposer: Option<BechAddr>;
}) => {
  const getAddressType = useGetAddressType();
  return proposer ? (
    <ExplorerLink
      textVariant="body2"
      type={getAddressType(proposer)}
      value={proposer}
      ampCopierSection={amptrackSection}
      showCopyOnHover
    />
  ) : (
    <Text variant="body2" color="text.dark">
      N/A
    </Text>
  );
};
