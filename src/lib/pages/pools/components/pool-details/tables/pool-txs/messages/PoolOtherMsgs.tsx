import { Flex, Tag, Text } from "@chakra-ui/react";

import { extractMsgType } from "lib/utils";

interface PoolOtherMsgsProps {
  otherMsgs: { [key: string]: number };
}

export const PoolOtherMsgs = ({ otherMsgs }: PoolOtherMsgsProps) => {
  const typePaths = Object.keys(otherMsgs);
  return (
    <Flex gap={2} flexWrap="wrap">
      Total
      {typePaths.map((typePath, index) => {
        const type = extractMsgType(typePath);
        return (
          <Text key={typePath} fontWeight={600}>
            {type} <Tag borderRadius="full">{otherMsgs[typePath]}</Tag>
            {index + 1 < typePaths.length && ","}
          </Text>
        );
      })}
    </Flex>
  );
};
