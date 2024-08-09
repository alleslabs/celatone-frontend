import { Flex, Text } from "@chakra-ui/react";

import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import type { SearchResult } from "lib/services/searchService";

interface SearchResultItemBodyProps {
  result: SearchResult;
  isAccountAddress: boolean;
}

export const SearchResultItemBody = ({
  result,
  isAccountAddress,
}: SearchResultItemBodyProps) => {
  if (isAccountAddress && result.metadata?.type === "initiaUsername")
    return (
      <Flex direction="column">
        <Text variant="body2">{result.metadata.initiaUsername}</Text>
        <Flex
          gap={{ base: 0, md: 1 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text variant="body2" color="text.dark" wordBreak="break-all">
            ({result.value})
          </Text>
          <Text
            variant="body2"
            fontWeight={{ base: "auto", md: 500 }}
            color="text.disabled"
          >
            – {result.type}
          </Text>
        </Flex>
      </Flex>
    );

  if (isAccountAddress && result.metadata?.type === "icns")
    return (
      <Flex direction="column">
        <Flex gap={1}>
          <Flex gap={1} align="center">
            <PrimaryNameMark />
            <Text variant="body2">{result.metadata.icnsNames.primaryName}</Text>
          </Flex>
          {result.metadata.searchedName &&
            result.metadata.searchedName !==
              result.metadata.icnsNames.primaryName && (
              <Text
                variant="body2"
                _before={{
                  content: '"/"',
                  fontSize: "12px",
                  color: "text.dark",
                  mr: 1,
                }}
              >
                {result.metadata.searchedName}
              </Text>
            )}
        </Flex>
        <Flex
          gap={{ base: 0, md: 1 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text variant="body2" color="text.dark" wordBreak="break-all">
            ({result.value})
          </Text>
          <Text
            variant="body2"
            fontWeight={{ base: "auto", md: 500 }}
            color="text.disabled"
          >
            – {result.type}
          </Text>
        </Flex>
      </Flex>
    );

  if (
    isAccountAddress ||
    result.type === "NFT Address" ||
    result.type === "NFT Collection Address" ||
    result.type === "Validator Address" ||
    result.type === "Transaction Hash" ||
    result.type === "Module Path"
  )
    return (
      <Flex gap={{ base: 0, md: 1 }} direction="column">
        <Text variant="body2" wordBreak="break-all">
          {result.value}
        </Text>
        <Text
          variant="body2"
          fontWeight={{ base: "auto", md: 500 }}
          color="text.disabled"
        >
          – {result.type}
        </Text>
      </Flex>
    );

  return (
    <Flex gap={1}>
      <Text variant="body2" wordBreak="break-all">
        {result.value}
      </Text>
      <Text
        variant="body2"
        fontWeight={{ base: "auto", md: 500 }}
        color="text.disabled"
      >
        – {result.type}
      </Text>
    </Flex>
  );
};
