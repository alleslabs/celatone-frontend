import { Flex, Tag, Text } from "@chakra-ui/react";

import { extractMsgType } from "lib/utils";

interface PoolOtherMsgsProps {
  isIbc: boolean;
  otherMsgs: { [key: string]: number };
}

export const PoolOtherMsgs = ({ isIbc, otherMsgs }: PoolOtherMsgsProps) => {
  const typePaths = Object.keys(otherMsgs);
  return (
    <Flex flexWrap="wrap" gap={2} alignContent="center">
      Total
      {typePaths.map((typePath, index) => {
        const type = extractMsgType(typePath);
        return (
          <Text key={typePath} fontWeight={600}>
            {type}{" "}
            <Tag variant="gray" borderRadius="full">
              {otherMsgs[typePath]}
            </Tag>
            {index + 1 < typePaths.length && ","}
          </Text>
        );
      })}
      {isIbc && (
        <Tag size="sm" variant="secondary">
          IBC
        </Tag>
      )}
    </Flex>
  );
};
