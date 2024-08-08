import { ButtonGroup, Spinner, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import type { BechAddr32 } from "lib/types";
import { jsonPrettify, libEncode } from "lib/utils";

interface ContractCmdGroupProps {
  isFetching: boolean;
  cmds: [string, string][];
  contractAddress: BechAddr32;
  type: string;
}

export const ContractCmdGroup = ({
  isFetching,
  cmds,
  contractAddress,
  type,
}: ContractCmdGroupProps) => {
  const navigate = useInternalNavigate();

  if (isFetching) {
    return <Spinner size="md" mx={1} />;
  }
  if (cmds.length) {
    return (
      <ButtonGroup
        width="90%"
        flexWrap="wrap"
        rowGap={2}
        sx={{
          "> button": {
            marginInlineStart: "0 !important",
            marginInlineEnd: "1",
          },
        }}
      >
        {cmds.sort().map(([cmd, msg]) => (
          <ContractCmdButton
            key={`${type}-cmd-${cmd}`}
            cmd={cmd}
            onClickCmd={() => {
              navigate({
                pathname: `/interact-contract`,
                query: {
                  selectedType: type,
                  contract: contractAddress,
                  msg: libEncode(jsonPrettify(msg)),
                },
              });
            }}
          />
        ))}
      </ButtonGroup>
    );
  }
  return (
    <Text variant="body2" color="text.dark">
      No messages available
    </Text>
  );
};
