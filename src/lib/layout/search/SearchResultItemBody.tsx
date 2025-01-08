import { Flex, Text } from "@chakra-ui/react";

import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import type { SearchResult } from "lib/services/searchService";

interface SearchResultItemBodyProps {
  isAccountAddress: boolean;
  result: SearchResult;
}

export const SearchResultItemBody = ({
  isAccountAddress,
  result,
}: SearchResultItemBodyProps) => {
  if (isAccountAddress && !!result.metadata?.initiaUsername)
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
          <Text variant="body2" color="text.disabled">
            – {result.type}
          </Text>
        </Flex>
      </Flex>
    );

  if (isAccountAddress && !!result.metadata?.icns)
    return (
      <Flex direction="column">
        <Flex gap={1}>
          <Flex align="center" gap={1}>
            <PrimaryNameMark />
            <Text variant="body2">
              {result.metadata.icns.icnsNames.primaryName}
            </Text>
          </Flex>
          {result.metadata.icns.searchedName &&
            result.metadata.icns.searchedName !==
              result.metadata.icns.icnsNames.primaryName && (
              <Text
                variant="body2"
                _before={{
                  color: "text.dark",
                  content: '"/"',
                  fontSize: "12px",
                  mr: 1,
                }}
              >
                {result.metadata.icns.searchedName}
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
          <Text variant="body2" color="text.disabled">
            – {result.type}
          </Text>
        </Flex>
      </Flex>
    );

  if (result.type === "NFT Collection Address" || result.type === "NFT Address")
    return (
      <Flex direction="column">
        <Text
          variant="body2"
          color={result.metadata?.nft?.name ? "text.main" : "text.dark"}
        >
          {result.metadata?.nft?.name || "Untitled"}
        </Text>
        <Flex
          gap={{ base: 0, md: 1 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text variant="body2" color="text.dark" wordBreak="break-all">
            ({result.value})
          </Text>
          <Text variant="body2" color="text.disabled">
            – {result.type}
          </Text>
        </Flex>
      </Flex>
    );

  if (
    isAccountAddress ||
    result.type === "Validator Address" ||
    result.type === "Transaction Hash" ||
    result.type === "EVM Transaction Hash" ||
    result.type === "Module Path"
  )
    return (
      <Flex gap={{ base: 0, md: 1 }} direction="column">
        <Text variant="body2" wordBreak="break-all">
          {result.value}
        </Text>
        <Text variant="body2" color="text.disabled">
          – {result.type}
        </Text>
      </Flex>
    );

  return (
    <Flex gap={1}>
      <Text variant="body2" wordBreak="break-all">
        {result.value}
      </Text>
      <Text variant="body2" color="text.disabled">
        – {result.type}
      </Text>
    </Flex>
  );
};
