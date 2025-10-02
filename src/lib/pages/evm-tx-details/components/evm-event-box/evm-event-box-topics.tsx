import type { LogDescription } from "ethers";
import type { Option } from "lib/types";

import { Flex, Stack, Text } from "@chakra-ui/react";
import { EvmBoxDecoded } from "lib/components/EvmBoxDecoded";
import { EvmEventBoxTabs } from "lib/types";

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
  isVerified: boolean;
  parsedLog: Option<LogDescription>;
  tab: EvmEventBoxTabs;
  topics: string[];
}

export const EvmEventBoxTopics = ({
  isVerified,
  parsedLog,
  tab,
  topics,
}: EvmEventBoxTopicsProps) => (
  <Stack columnGap={2} rowGap={2} w="full" wordBreak="break-all">
    {tab === EvmEventBoxTabs.Raw ? (
      topics.map((topic, index) => (
        <EvmEventBoxTopicHex key={topic} index={index} topic={topic} />
      ))
    ) : (
      <>
        {isVerified && topics.length > 0 ? (
          <EvmEventBoxTopicHex index={0} topic={topics[0]} />
        ) : (
          topics.map((topic, index) => (
            <EvmEventBoxTopicHex key={topic} index={index} topic={topic} />
          ))
        )}
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
                <EvmBoxDecoded
                  key={topics[index]}
                  decode={parsedLog.args.slice(0, topics.length - 1)[index]}
                  index={index + 1}
                  input={input}
                />
              ))}
          </Stack>
        )}
      </>
    )}
  </Stack>
);
