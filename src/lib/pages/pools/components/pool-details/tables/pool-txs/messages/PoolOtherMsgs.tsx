import { Flex, Tag, Text } from "@chakra-ui/react";
import { extractMsgType } from "lib/utils";

interface PoolOtherMsgsProps {
  otherMsgs: { [key: string]: number };
  isIbc: boolean;
}

export const PoolOtherMsgs = ({ otherMsgs, isIbc }: PoolOtherMsgsProps) => {
  const typePaths = Object.keys(otherMsgs);
  return (
    <Flex alignContent="center" flexWrap="wrap" gap={2}>
      Total
      {typePaths.map((typePath, index) => {
        const type = extractMsgType(typePath);
        return (
          <Text key={typePath} fontWeight={600}>
            {type}{" "}
            <Tag borderRadius="full" variant="gray">
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
