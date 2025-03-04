import { Flex, Stack, Text } from "@chakra-ui/react";
import type { LogDescription } from "ethers";
import type { Nullish } from "lib/types";
import { EvmEventBoxDecoded } from "./evm-event-box-decoded";
import { EvmEventBoxTabs } from "../../types";

interface EvmEventBoxTopicProps {
  topic: string;
  index: number;
}

const EvmEventBoxTopicHex = ({ topic, index }: EvmEventBoxTopicProps) => (
  <Flex gap={2} key={topic} alignItems="center">
    <Text variant="body2" fontFamily="mono">
      [{index}]
    </Text>
    <Text variant="body2" fontFamily="mono">
      {topic}
    </Text>
  </Flex>
);

interface EvmEventBoxTopicsProps {
  tab: EvmEventBoxTabs;
  topics: string[];
  parsedLog: Nullish<LogDescription>;
}

export const EvmEventBoxTopics = ({
  tab,
  topics,
  parsedLog,
}: EvmEventBoxTopicsProps) => (
  <Stack gap={2} wordBreak="break-all" w="full">
    {tab === EvmEventBoxTabs.Hex ? (
      topics.map((topic, index) => (
        <EvmEventBoxTopicHex topic={topic} index={index} />
      ))
    ) : (
      <>
        <EvmEventBoxTopicHex topic={topics[0]} index={0} />
        {topics.length > 1 && (
          <Stack gap={2} p={4} borderRadius={8} bgColor="gray.800">
            {parsedLog &&
              parsedLog.fragment.inputs
                .slice(0, topics.length - 1)
                .map((input, index) => (
                  <EvmEventBoxDecoded
                    key={topics[index]}
                    index={index}
                    input={input}
                    decode={parsedLog.args.slice(0, topics.length - 1)[index]}
                  />
                ))}
          </Stack>
        )}
      </>
    )}
  </Stack>
);
