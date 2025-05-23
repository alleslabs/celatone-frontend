import type { IconKeys } from "lib/components/icon";
import type { SearchResultType } from "lib/services/searchService";
import type { Option } from "lib/types";

import { Image } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

const getIcon = (type: Option<SearchResultType>) => {
  switch (type) {
    case "Account address":
      return "admin" as IconKeys;
    case "Block":
      return "block" as IconKeys;
    case "Code ID":
      return "code" as IconKeys;
    case "Contract address":
    case "Module path":
      return "contract-address" as IconKeys;
    case "NFT address":
      return "nft" as IconKeys;
    case "NFT collection address":
      return "collection" as IconKeys;
    case "Pool ID":
      return "pool" as IconKeys;
    case "Proposal ID":
      return "proposal" as IconKeys;
    case "Transaction hash":
      return "file" as IconKeys;
    case "Validator address":
      return "validator" as IconKeys;
    default:
      return "list" as IconKeys;
  }
};

interface SearchResultItemIconProps {
  isIcns: boolean;
  isInitiaUsername: boolean;
  type: SearchResultType;
}

export const SearchResultItemIcon = ({
  isIcns,
  isInitiaUsername,
  type,
}: SearchResultItemIconProps) => {
  if (isInitiaUsername)
    return (
      <Image
        borderRadius="full"
        height={5}
        src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
        width={5}
      />
    );

  if (isIcns)
    return (
      <Image
        borderRadius="full"
        height={5}
        src="https://assets.alleslabs.dev/webapp-assets/name-services/icns.png"
        width={5}
      />
    );

  return <CustomIcon color="gray.600" name={getIcon(type)} />;
};
