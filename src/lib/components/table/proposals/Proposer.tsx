import type { BechAddr, Option } from "lib/types";

import { Text } from "@chakra-ui/react";
import { useGetAddressType } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";

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
