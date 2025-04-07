import { Flex } from "@chakra-ui/react";

import { useEvmConfig } from "lib/app-provider";
import type { SearchResult } from "lib/services/searchService";
import type { Option } from "lib/types";

import { SearchResultItemBody } from "./SearchResultItemBody";
import { SearchResultItemIcon } from "./SearchResultItemIcon";
import { getRouteOptions } from "./utils";

interface ResultItemProps {
  index: number;
  result: SearchResult;
  cursor: Option<number>;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (result?: SearchResult, isClick?: boolean) => void;
}

export const SearchResultItem = ({
  index,
  result,
  cursor,
  setCursor,
  handleSelectResult,
}: ResultItemProps) => {
  const evm = useEvmConfig({ shouldRedirect: false });
  const route = getRouteOptions(result.type, evm.enabled)?.pathname;
  const isAccountAddress =
    result.type === "Account address" || result.type === "Contract address";

  return (
    <Flex id={`item-${index}`}>
      {route && (
        <Flex
          p={2}
          w="full"
          gap={2}
          alignItems="center"
          borderRadius="8px"
          _hover={{ bg: "gray.700", cursor: "pointer" }}
          cursor="pointer"
          transition="all 0.25s ease-in-out"
          bg={index === cursor ? "gray.700" : undefined}
          onMouseMove={() => index !== cursor && setCursor(index)}
          onClick={() => handleSelectResult(result, true)}
        >
          <SearchResultItemIcon
            type={result.type}
            isInitiaUsername={
              isAccountAddress && !!result.metadata?.initiaUsername
            }
            isIcns={isAccountAddress && !!result.metadata?.icns}
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
