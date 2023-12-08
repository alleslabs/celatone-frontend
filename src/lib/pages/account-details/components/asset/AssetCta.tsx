import { Button, Flex } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";
import { UnsupportedTokensModal } from "lib/components/modal";
import { useOpenAssetTab } from "lib/hooks";
import type { Addr, TokenWithValue } from "lib/types";

interface AssetCtaProps {
  unsupportedAssets: TokenWithValue[];
  totalAsset: number;
  address: Addr;
}

export const AssetCta = ({
  unsupportedAssets,
  totalAsset,
  address,
}: AssetCtaProps) => {
  const openAssetTab = useOpenAssetTab();

  return (
    <Flex
      w={{ base: "full", md: "auto" }}
      justify="center"
      mb={{ base: 4, md: 0 }}
    >
      {totalAsset > 0 && (
        <Button
          variant="ghost-gray"
          size="sm"
          rightIcon={<CustomIcon name="launch" boxSize={3} color="text.dark" />}
          onClick={() => {
            trackUseViewJSON("account_details_page_assets");
            openAssetTab(address);
          }}
        >
          View in JSON
        </Button>
      )}
      <UnsupportedTokensModal
        unsupportedAssets={unsupportedAssets}
        address={address}
        addressType="user_address"
      />
    </Flex>
  );
};
