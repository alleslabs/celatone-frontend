import type { SystemStyleObject } from "@chakra-ui/react";
import type { Log } from "@cosmjs/stargate/build/logs";
import type { Option } from "lib/types";
import type { ReactNode } from "react";

import { Flex, Text } from "@chakra-ui/react";
import { DividerWithArrow } from "lib/components/DividerWithArrow";
import plur from "plur";
import { memo } from "react";

import { EventBox } from "../tx-message/EventBox";

interface DecodeMessageBodyProps {
  children: ReactNode;
  compact: boolean;
  isExpand?: boolean;
  log: Option<Log>;
  sx?: SystemStyleObject;
}

export const DecodeMessageBody = memo(
  ({ children, compact, isExpand, log, sx }: DecodeMessageBodyProps) => {
    if (compact) return null;
    return (
      <Flex
        direction="column"
        gap={4}
        height={isExpand ? "full" : 0}
        overflow="visible"
        pl={8}
        sx={sx}
        transition="all 0.25s ease-in-out"
      >
        <Flex
          direction="column"
          gap={{ base: 4, md: 3 }}
          pt={4}
          sx={{
            "> div": {
              alignItems: "flex-start",
            },
            "> div > *:first-child": {
              color: "text.dark",
              fontWeight: 500,
              minW: "180px",
              mr: 4,
              w: "180px",
            },
            w: "full",
          }}
        >
          {children}
        </Flex>
        {log && (
          <>
            <DividerWithArrow />
            <Text color="text.dark" fontWeight={500} variant="body2">
              {plur("Event log", log.events.length)}
            </Text>
            <Flex direction="column" gap={3} w="full">
              {log.events.map((event, idx) => (
                <EventBox
                  key={
                    idx.toString() +
                    event.type +
                    JSON.stringify(event.attributes)
                  }
                  event={event}
                  msgIndex={idx}
                />
              ))}
            </Flex>
          </>
        )}
      </Flex>
    );
  }
);
