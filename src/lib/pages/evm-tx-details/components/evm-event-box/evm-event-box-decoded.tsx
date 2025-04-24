import type { ParamType } from "ethers";

import { Flex, Grid, Tag, Text } from "@chakra-ui/react";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextReadOnly } from "lib/components/json/TextReadOnly";
import { jsonPrettify } from "lib/utils";

interface EvmEventBoxDecodedProps {
  decode: unknown;
  index?: number;
  input: ParamType;
}

const EvmEventBoxDecodedBody = ({
  baseType,
  decode,
}: Pick<EvmEventBoxDecodedProps, "decode"> & {
  baseType: string;
}) => {
  switch (baseType) {
    case "address":
      return (
        <ExplorerLink
          openNewTab
          textFormat="normal"
          type="user_address"
          value={String(decode)}
        />
      );
    case "array":
      return (
        <Text fontFamily="mono" variant="body2">
          [{String(decode)}]
        </Text>
      );
    case "tuple":
      return <TextReadOnly text={jsonPrettify(JSON.stringify(decode))} />;
    default:
      return (
        <Text fontFamily="mono" variant="body2">
          {String(decode)}
        </Text>
      );
  }
};

export const EvmEventBoxDecoded = ({
  decode,
  index,
  input,
}: EvmEventBoxDecodedProps) => (
  <Grid
    gap={1}
    gridTemplateColumns={{
      base: "1fr",
      md: "minmax(max-content,180px) 1fr",
    }}
    wordBreak="break-all"
  >
    <Flex alignItems="center" gap={2}>
      {index !== undefined && (
        <Text fontFamily="mono" variant="body2">
          [{index + 1}]
        </Text>
      )}
      <Text variant="body2">{input.name}</Text>
      <Tag variant="gray">{input.type}</Tag>
    </Flex>
    <EvmEventBoxDecodedBody baseType={input.baseType} decode={decode} />
  </Grid>
);
