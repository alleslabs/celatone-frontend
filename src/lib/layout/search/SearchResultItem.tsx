import { Flex, Image } from "@chakra-ui/react";

import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import type {
  ResultMetadata,
  SearchResultType,
} from "lib/services/searchService";
import type { Option } from "lib/types";

import { SearchDisplayResult } from "./SearchDisplayResult";
import { getRouteOptions } from "./utils";

interface ResultItemProps {
  index: number;
  type: SearchResultType;
  value: string;
  cursor: Option<number>;
  metadata: ResultMetadata;
  setCursor: (index: Option<number>) => void;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
  onClose?: () => void;
}

const getIcon = (type: Option<SearchResultType>) => {
  switch (type) {
    case "Account Address":
      return "admin" as IconKeys;
    case "Transaction Hash":
      return "file" as IconKeys;
    case "Code ID":
      return "code" as IconKeys;
    case "Contract Address":
    case "Module Path":
      return "contract-address" as IconKeys;
    case "Block":
      return "block" as IconKeys;
    case "Proposal ID":
      return "proposal" as IconKeys;
    case "Validator Address":
      return "validator" as IconKeys;
    case "Pool ID":
      return "pool" as IconKeys;
    default:
      return "list" as IconKeys;
  }
};

export const SearchResultItem = ({
  index,
  type,
  value,
  cursor,
  metadata,
  setCursor,
  handleSelectResult,
  onClose,
}: ResultItemProps) => {
  const route = getRouteOptions(type)?.pathname;
  const isAccountAddress =
    type === "Account Address" || type === "Contract Address";

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
          onClick={() => {
            handleSelectResult(type, true);
            onClose?.();
          }}
        >
          {isAccountAddress && metadata.initiaUsername?.username ? (
            <Image
              src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
              borderRadius="full"
              width={5}
              height={5}
            />
          ) : (
            <CustomIcon name={getIcon(type)} color="gray.600" />
          )}
          <SearchDisplayResult
            metadata={metadata}
            value={value}
            type={type}
            isAccountAddress={isAccountAddress}
          />
        </Flex>
      )}
    </Flex>
  );
};
