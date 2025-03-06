import { Flex, Grid, Tag, Text } from "@chakra-ui/react";
import type { ParamType } from "ethers";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { jsonPrettify } from "lib/utils";

interface EvmEventBoxDecodedProps {
  index?: number;
  input: ParamType;
  decode: unknown;
}

const EvmEventBoxDecodedBody = ({
  decode,
  baseType,
}: Pick<EvmEventBoxDecodedProps, "decode"> & {
  baseType: string;
}) => {
  switch (baseType) {
    case "address":
      return (
        <ExplorerLink
          value={String(decode)}
          type="user_address"
          openNewTab
          textFormat="normal"
        />
      );
    case "tuple":
      return <TextReadOnly text={jsonPrettify(JSON.stringify(decode))} />;
    case "array":
      return (
        <Text variant="body2" fontFamily="mono">
          [{String(decode)}]
        </Text>
      );
    default:
      return (
        <Text variant="body2" fontFamily="mono">
          {String(decode)}
        </Text>
      );
  }
};

export const EvmEventBoxDecoded = ({
  index,
  input,
  decode,
}: EvmEventBoxDecodedProps) => (
  <Grid
    gap={1}
    gridTemplateColumns={{
      base: "1fr",
      md: "minmax(max-content,180px) 1fr",
    }}
    wordBreak="break-all"
  >
    <Flex gap={2} alignItems="center">
      {index !== undefined && (
        <Text variant="body2" fontFamily="mono">
          [{index + 1}]
        </Text>
      )}
      <Text variant="body2">{input.name}</Text>
      <Tag variant="gray">{input.type}</Tag>
    </Flex>
    <EvmEventBoxDecodedBody decode={decode} baseType={input.baseType} />
  </Grid>
);
