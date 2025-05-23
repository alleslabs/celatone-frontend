import type { SearchResult } from "lib/services/searchService";
import type { Option } from "lib/types";

import { Flex } from "@chakra-ui/react";
import { useEvmConfig } from "lib/app-provider";

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
    result.type === "Account address" || result.type === "Contract address";

  return (
    <Flex id={`item-${index}`}>
      {route && (
        <Flex
          _hover={{ bg: "gray.700", cursor: "pointer" }}
          alignItems="center"
          bg={index === cursor ? "gray.700" : undefined}
          borderRadius="8px"
          cursor="pointer"
          gap={2}
          p={2}
          transition="all 0.25s ease-in-out"
          w="full"
          onClick={() => handleSelectResult(result, true)}
          onMouseMove={() => index !== cursor && setCursor(index)}
        >
          <SearchResultItemIcon
            isIcns={isAccountAddress && !!result.metadata?.icns}
            isInitiaUsername={
              isAccountAddress && !!result.metadata?.initiaUsername
            }
            type={result.type}
          />
          <SearchResultItemBody
            isAccountAddress={isAccountAddress}
            result={result}
          />
        </Flex>
      )}
    </Flex>
  );
};
