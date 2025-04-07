import { Image } from "@chakra-ui/react";

import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import type { SearchResultType } from "lib/services/searchService";
import type { Option } from "lib/types";

const getIcon = (type: Option<SearchResultType>) => {
  switch (type) {
    case "Account address":
      return "admin" as IconKeys;
    case "Transaction hash":
      return "file" as IconKeys;
    case "Code ID":
      return "code" as IconKeys;
    case "Contract address":
    case "Module path":
      return "contract-address" as IconKeys;
    case "Block":
      return "block" as IconKeys;
    case "Proposal ID":
      return "proposal" as IconKeys;
    case "Validator address":
      return "validator" as IconKeys;
    case "Pool ID":
      return "pool" as IconKeys;
    case "NFT address":
      return "nft" as IconKeys;
    case "NFT collection address":
      return "collection" as IconKeys;
    default:
      return "list" as IconKeys;
  }
};

interface SearchResultItemIconProps {
  type: SearchResultType;
  isInitiaUsername: boolean;
  isIcns: boolean;
}

export const SearchResultItemIcon = ({
  type,
  isInitiaUsername,
  isIcns,
}: SearchResultItemIconProps) => {
  if (isInitiaUsername)
    return (
      <Image
        src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
        borderRadius="full"
        width={5}
        height={5}
      />
    );

  if (isIcns)
    return (
      <Image
        src="https://assets.alleslabs.dev/webapp-assets/name-services/icns.png"
        borderRadius="full"
        width={5}
        height={5}
      />
    );

  return <CustomIcon name={getIcon(type)} color="gray.600" />;
};
