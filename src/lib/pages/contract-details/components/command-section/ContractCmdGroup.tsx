import type { BechAddr32 } from "lib/types";

import { ButtonGroup, Spinner, Text } from "@chakra-ui/react";
import { useInternalNavigate } from "lib/app-provider";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { jsonPrettify, libEncode } from "lib/utils";

interface ContractCmdGroupProps {
  isFetching: boolean;
  cmds: [string, string][];
  contractAddress: BechAddr32;
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
        flexWrap="wrap"
        rowGap={2}
        sx={{
          "> button": {
            marginInlineEnd: "1",
            marginInlineStart: "0 !important",
          },
        }}
        width="90%"
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
    <Text color="text.dark" variant="body2">
      No messages available
    </Text>
  );
};
