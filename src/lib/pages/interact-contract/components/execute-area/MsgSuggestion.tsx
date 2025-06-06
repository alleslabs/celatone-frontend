import type { BechAddr32 } from "lib/types";

import { Box, ButtonGroup, Text } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { ContractCmdButton } from "lib/components/ContractCmdButton";
import { jsonPrettify } from "lib/utils";

interface MsgSuggestionProps {
  cmds: [string, string][];
  contractAddress: BechAddr32;
  setMsg: (msg: string) => void;
}

export const MsgSuggestion = ({
  cmds,
  contractAddress,
  setMsg,
}: MsgSuggestionProps) => (
  <Box mb={8}>
    {contractAddress && (
      <Text mb={2} variant="body3">
        Message Suggestions:
      </Text>
    )}
    {cmds.length ? (
      <ButtonGroup
        flexWrap="wrap"
        rowGap={4}
        sx={{
          "> button": {
            marginInlineEnd: "1",
            marginInlineStart: "0 !important",
          },
        }}
      >
        {cmds.sort().map(([cmd, queryMsg]) => (
          <ContractCmdButton
            key={`query-cmd-${cmd}`}
            cmd={cmd}
            onClickCmd={() => {
              track(AmpEvent.USE_CMD_EXECUTE);
              setMsg(jsonPrettify(queryMsg));
            }}
          />
        ))}
      </ButtonGroup>
    ) : (
      contractAddress && (
        <Text color="text.dark" mt={2} variant="body2">
          No ExecuteMsgs suggestion available
        </Text>
      )
    )}
  </Box>
);
