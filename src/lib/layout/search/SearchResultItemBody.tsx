import type { SearchResult } from "lib/services/searchService";

import { Flex, Text } from "@chakra-ui/react";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";

interface SearchResultItemBodyProps {
  result: SearchResult;
  isAccountAddress: boolean;
}

export const SearchResultItemBody = ({
  result,
  isAccountAddress,
}: SearchResultItemBodyProps) => {
  if (isAccountAddress && !!result.metadata?.initiaUsername)
    return (
      <Flex direction="column">
        <Text variant="body2">{result.metadata.initiaUsername}</Text>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 1 }}
        >
          <Text color="text.dark" variant="body2" wordBreak="break-all">
            ({result.value})
          </Text>
          <Text color="text.disabled" variant="body2">
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
                _before={{
                  content: '"/"',
                  fontSize: "12px",
                  color: "text.dark",
                  mr: 1,
                }}
                variant="body2"
              >
                {result.metadata.icns.searchedName}
              </Text>
            )}
        </Flex>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 1 }}
        >
          <Text color="text.dark" variant="body2" wordBreak="break-all">
            ({result.value})
          </Text>
          <Text color="text.disabled" variant="body2">
            – {result.type}
          </Text>
        </Flex>
      </Flex>
    );

  if (result.type === "NFT Collection Address" || result.type === "NFT Address")
    return (
      <Flex direction="column">
        <Text
          color={result.metadata?.nft?.name ? "text.main" : "text.dark"}
          variant="body2"
        >
          {result.metadata?.nft?.name || "Untitled"}
        </Text>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 0, md: 1 }}
        >
          <Text color="text.dark" variant="body2" wordBreak="break-all">
            ({result.value})
          </Text>
          <Text color="text.disabled" variant="body2">
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
      <Flex direction="column" gap={{ base: 0, md: 1 }}>
        <Text variant="body2" wordBreak="break-all">
          {result.value}
        </Text>
        <Text color="text.disabled" variant="body2">
          – {result.type}
        </Text>
      </Flex>
    );

  return (
    <Flex gap={1}>
      <Text variant="body2" wordBreak="break-all">
        {result.value}
      </Text>
      <Text color="text.disabled" variant="body2">
        – {result.type}
      </Text>
    </Flex>
  );
};
