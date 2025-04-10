import type { Remark, RemarkOperation } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { capitalize, isUndefined } from "lodash";

// NOTE: change operation to prefix?
interface RemarkRenderProps extends Remark {
  operation?: RemarkOperation;
}

export const RemarkRender = ({ operation, type, value }: RemarkRenderProps) => {
  if (type === "genesis" || isUndefined(value))
    return <Text variant="body2">Genesis</Text>;

  const prefix = operation ? capitalize(operation.split("_").pop()) : "Through";

  const isGovernance = type === "governance";
  const textFormat = isGovernance ? "normal" : "truncate";
  return (
    <Flex
      direction="column"
      mb={{ base: 0, md: "2px" }}
      sx={{
        "& > p:first-of-type": {
          color: "text.dark",
          fontSize: "12px",
        },
      }}
    >
      <p>{isGovernance ? `${prefix} Proposal ID` : `${prefix} Tx`}</p>
      <ExplorerLink
        showCopyOnHover
        textFormat={textFormat}
        type={isGovernance ? "proposal_id" : "tx_hash"}
        value={value.toString()}
      />
    </Flex>
  );
};
