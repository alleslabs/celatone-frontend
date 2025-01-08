import { ButtonGroup, Spinner, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import type { BechAddr32 } from "lib/types";
import { jsonPrettify, libEncode } from "lib/utils";

interface ContractCmdGroupProps {
  cmds: [string, string][];
  contractAddress: BechAddr32;
  isFetching: boolean;
  type: string;
}

export const ContractCmdGroup = ({
  cmds,
  contractAddress,
  isFetching,
  type,
}: ContractCmdGroupProps) => {
  const navigate = useInternalNavigate();

  if (isFetching) {
    return <Spinner mx={1} size="md" />;
  }
  if (cmds.length) {
    return (
      <ButtonGroup
        width="90%"
        flexWrap="wrap"
        sx={{
          "> button": {
            marginInlineEnd: "1",
            marginInlineStart: "0 !important",
          },
        }}
        rowGap={2}
      >
        {cmds.sort().map(([cmd, msg]) => (
          <ContractCmdButton
            key={`${type}-cmd-${cmd}`}
            cmd={cmd}
            onClickCmd={() => {
              navigate({
                pathname: `/interact-contract`,
                query: {
                  contract: contractAddress,
                  msg: libEncode(jsonPrettify(msg)),
                  selectedType: type,
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
