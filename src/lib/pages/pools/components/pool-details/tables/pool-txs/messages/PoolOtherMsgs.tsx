import { Flex, Tag, Text } from "@chakra-ui/react";

import { extractMsgType } from "lib/utils";

interface PoolOtherMsgsProps {
  otherMsgs: { [key: string]: number };
  isIbc: boolean;
}

export const PoolOtherMsgs = ({ otherMsgs, isIbc }: PoolOtherMsgsProps) => {
  const typePaths = Object.keys(otherMsgs);
  return (
    <Flex gap={2} flexWrap="wrap" alignContent="center">
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
        <Tag variant="secondary" size="sm">
          IBC
        </Tag>
      )}
    </Flex>
  );
};
