import { Flex } from "@chakra-ui/react";

import { useEvmConfig } from "lib/app-provider";
import type { SearchResult } from "lib/services/searchService";
import type { Option } from "lib/types";

import { SearchResultItemBody } from "./SearchResultItemBody";
import { SearchResultItemIcon } from "./SearchResultItemIcon";
import { getRouteOptions } from "./utils";

interface ResultItemProps {
  cursor: Option<number>;
  handleSelectResult: (result?: SearchResult, isClick?: boolean) => void;
  index: number;
  result: SearchResult;
  setCursor: (index: Option<number>) => void;
}

export const SearchResultItem = ({
  cursor,
  handleSelectResult,
  index,
  result,
  setCursor,
}: ResultItemProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const route = getRouteOptions(result.type, evm.enabled)?.pathname;
  const isAccountAddress =
    result.type === "Account Address" || result.type === "Contract Address";

  return (
    <Flex id={`item-${index}`}>
      {route && (
        <Flex
          alignItems="center"
          bg={index === cursor ? "gray.700" : undefined}
          gap={2}
          p={2}
          w="full"
          _hover={{ bg: "gray.700", cursor: "pointer" }}
          borderRadius="8px"
          cursor="pointer"
          onClick={() => handleSelectResult(result, true)}
          onMouseMove={() => index !== cursor && setCursor(index)}
          transition="all 0.25s ease-in-out"
        >
          <SearchResultItemIcon
            isIcns={isAccountAddress && !!result.metadata?.icns}
            isInitiaUsername={
              isAccountAddress && !!result.metadata?.initiaUsername
            }
            type={result.type}
          />
          <SearchResultItemBody
            result={result}
            isAccountAddress={isAccountAddress}
          />
        </Flex>
      )}
    </Flex>
  );
};
