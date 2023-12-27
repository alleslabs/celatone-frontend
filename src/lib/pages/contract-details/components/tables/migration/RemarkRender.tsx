import { Flex, Text } from "@chakra-ui/react";
import { capitalize, isUndefined } from "lodash";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ContractMigrationHistory } from "lib/types";

export const RemarkRender = ({
  remark,
}: {
  remark: ContractMigrationHistory["remark"];
}) => {
  const { operation, type, value } = remark;
  if (type === "genesis" || isUndefined(value))
    return <Text variant="body2">Genesis</Text>;

  const isGovernance = type === "governance";
  const prefix = capitalize(operation.split("_").pop());
  const textFormat = isGovernance ? "normal" : "truncate";
  return (
    <Flex
      direction="column"
      sx={{
        "& > p:first-of-type": {
          color: "text.dark",
          fontSize: "12px",
        },
      }}
      mb={{ base: 0, md: "2px" }}
    >
      <p>{isGovernance ? `${prefix} Proposal ID` : `${prefix} Tx`}</p>
      <ExplorerLink
        type={isGovernance ? "proposal_id" : "tx_hash"}
        value={value.toString()}
        showCopyOnHover
        textFormat={textFormat}
      />
    </Flex>
  );
};
