import { Box, Text, ButtonGroup } from "@chakra-ui/react";

import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { ContractAddr } from "lib/types";
import { jsonPrettify } from "lib/utils";

interface MsgSuggestionProps {
  contractAddress: ContractAddr;
  cmds: [string, string][];
  setMsg: (msg: string) => void;
}

export const MsgSuggestion = ({
  contractAddress,
  cmds,
  setMsg,
}: MsgSuggestionProps) => {
  return (
    <Box>
      {contractAddress && (
        <Text variant="body3" mb={4}>
          Message Suggestions:
        </Text>
      )}
      {cmds.length ? (
        <ButtonGroup
          flexWrap="wrap"
          rowGap={4}
          sx={{
            "> button": {
              marginInlineStart: "0 !important",
              marginInlineEnd: "1",
            },
          }}
        >
          {cmds.sort().map(([cmd, queryMsg]) => (
            <ContractCmdButton
              key={`query-cmd-${cmd}`}
              cmd={cmd}
              onClickCmd={() => {
                AmpTrack(AmpEvent.USE_CMD_EXECUTE);
                setMsg(jsonPrettify(queryMsg));
              }}
            />
          ))}
        </ButtonGroup>
      ) : (
        contractAddress && (
          <Text mt={2} variant="body2" color="text.dark">
            No ExecuteMsgs suggestion available
          </Text>
        )
      )}
    </Box>
  );
};
