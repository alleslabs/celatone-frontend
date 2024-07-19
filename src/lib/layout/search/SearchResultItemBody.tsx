import { Flex, Text } from "@chakra-ui/react";

import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";

interface SearchResultItemBodyProps {
  metadata: ResultMetadata;
  value: string;
  type: SearchResultType;
  isAccountAddress: boolean;
}

export const SearchResultItemBody = ({
  metadata,
  value,
  type,
  isAccountAddress,
}: SearchResultItemBodyProps) => {
  const normalizedIcnsValue = value.endsWith(`.${metadata.icns.bech32Prefix}`)
    ? value
    : `${value}.${metadata.icns.bech32Prefix}`;

  if (isAccountAddress && metadata.initiaUsername.address)
    return (
      <Flex direction="column">
        <Text variant="body2">{metadata.initiaUsername.username}</Text>
        <Flex
          gap={{ base: 0, md: 1 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text variant="body2" color="text.dark" wordBreak="break-all">
            {metadata.initiaUsername.username
              ? `(${metadata.initiaUsername.address})`
              : metadata.initiaUsername.address}
          </Text>
          <Text
            variant="body2"
            fontWeight={{ base: "auto", md: 500 }}
            color="text.disabled"
          >
            – {type}
          </Text>
        </Flex>
      </Flex>
    );

  if (isAccountAddress && metadata.icns.icnsNames?.primaryName)
    return (
      <Flex direction="column">
        <Flex gap={1}>
          <Flex gap={1} align="center">
            <PrimaryNameMark />
            <Text variant="body2">{metadata.icns.icnsNames.primaryName}</Text>
          </Flex>
          {value !== metadata.icns.address &&
            normalizedIcnsValue !== metadata.icns.icnsNames?.primaryName && (
              <Text
                variant="body2"
                _before={{
                  content: '"/"',
                  fontSize: "12px",
                  color: "text.dark",
                  mr: 1,
                }}
              >
                {normalizedIcnsValue}
              </Text>
            )}
        </Flex>
        <Flex
          gap={{ base: 0, md: 1 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text variant="body2" color="text.dark" wordBreak="break-all">
            {metadata.icns.icnsNames.primaryName
              ? `(${metadata.icns.address})`
              : metadata.icns.address}
          </Text>
          <Text
            variant="body2"
            fontWeight={{ base: "auto", md: 500 }}
            color="text.disabled"
          >
            – {type}
          </Text>
        </Flex>
      </Flex>
    );

  if (
    isAccountAddress ||
    type === "NFT Collection Address" ||
    type === "Validator Address" ||
    type === "Transaction Hash" ||
    type === "Module Path"
  )
    return (
      <Flex gap={{ base: 0, md: 1 }} direction={{ base: "column", md: "row" }}>
        <Text variant="body2" wordBreak="break-all">
          {value}
        </Text>
        <Text
          variant="body2"
          fontWeight={{ base: "auto", md: 500 }}
          color="text.disabled"
        >
          – {type}
        </Text>
      </Flex>
    );

  return (
    <Flex gap={1}>
      <Text variant="body2" wordBreak="break-all">
        {value}
      </Text>
      <Text
        variant="body2"
        fontWeight={{ base: "auto", md: 500 }}
        color="text.disabled"
      >
        – {type}
      </Text>
    </Flex>
  );
};
