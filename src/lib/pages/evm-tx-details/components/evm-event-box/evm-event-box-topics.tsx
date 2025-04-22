import type { LogDescription } from "ethers";
import type { Option } from "lib/types";

import { Flex, Stack, Text } from "@chakra-ui/react";

import { EvmEventBoxTabs } from "../../types";
import { EvmEventBoxDecoded } from "./evm-event-box-decoded";

interface EvmEventBoxTopicProps {
  index: number;
  topic: string;
}

const EvmEventBoxTopicHex = ({ index, topic }: EvmEventBoxTopicProps) => (
  <Flex key={topic} alignItems="center" gap={2}>
    <Text fontFamily="mono" variant="body2">
      [{index}]
    </Text>
    <Text fontFamily="mono" variant="body2">
      {topic}
    </Text>
  </Flex>
);

interface EvmEventBoxTopicsProps {
  parsedLog: Option<LogDescription>;
  tab: EvmEventBoxTabs;
  topics: string[];
}

export const EvmEventBoxTopics = ({
  parsedLog,
  tab,
  topics,
}: EvmEventBoxTopicsProps) => (
  <Stack columnGap={2} rowGap={4} w="full" wordBreak="break-all">
    {tab === EvmEventBoxTabs.Hex ? (
      topics.map((topic, index) => (
        <EvmEventBoxTopicHex key={topic} index={index} topic={topic} />
      ))
    ) : (
      <>
        <EvmEventBoxTopicHex index={0} topic={topics[0]} />
        {topics.length > 1 && parsedLog && (
          <Stack
            bgColor="gray.800"
            borderRadius={8}
            columnGap={2}
            p={4}
            rowGap={4}
          >
            {parsedLog.fragment.inputs
              .slice(0, topics.length - 1)
              .map((input, index) => (
                <EvmEventBoxDecoded
                  key={topics[index]}
                  decode={parsedLog.args.slice(0, topics.length - 1)[index]}
                  index={index}
                  input={input}
                />
              ))}
          </Stack>
        )}
      </>
    )}
  </Stack>
);
