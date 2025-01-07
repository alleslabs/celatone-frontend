import { Image } from "@chakra-ui/react";

import type { IconKeys } from "lib/components/icon";
import { CustomIcon } from "lib/components/icon";
import type { SearchResultType } from "lib/services/searchService";
import type { Option } from "lib/types";

const getIcon = (type: Option<SearchResultType>) => {
  switch (type) {
    case "Account Address":
      return "admin" as IconKeys;
    case "Block":
      return "block" as IconKeys;
    case "Code ID":
      return "code" as IconKeys;
    case "Contract Address":
    case "Module Path":
      return "contract-address" as IconKeys;
    case "NFT Address":
      return "nft" as IconKeys;
    case "NFT Collection Address":
      return "collection" as IconKeys;
    case "Pool ID":
      return "pool" as IconKeys;
    case "Proposal ID":
      return "proposal" as IconKeys;
    case "Transaction Hash":
      return "file" as IconKeys;
    case "Validator Address":
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
        width={5}
        height={5}
        src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
        borderRadius="full"
      />
    );

  if (isIcns)
    return (
      <Image
        width={5}
        height={5}
        src="https://assets.alleslabs.dev/webapp-assets/name-services/icns.png"
        borderRadius="full"
      />
    );

  return <CustomIcon name={getIcon(type)} color="gray.600" />;
};
