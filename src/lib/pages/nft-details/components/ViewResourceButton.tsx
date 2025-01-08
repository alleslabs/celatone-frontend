import { Button } from "@chakra-ui/react";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import type { HexAddr32 } from "lib/types";

interface ViewResourceButtonProps {
  nftAddress: HexAddr32;
}

export const ViewResourceButton = ({ nftAddress }: ViewResourceButtonProps) => {
  const navigate = useInternalNavigate();

  return (
    <Button
      mb={{ base: 4, md: 0 }}
      minW="140px !important"
      size={{ base: "sm", md: "md" }}
      variant="outline-primary"
      w={{ base: "full", md: "auto" }}
      onClick={() => {
        track(AmpEvent.USE_NFT_VIEW_RESOURCE_CTA, {
          amptrackSection: "nft-details",
        });
        navigate({
          pathname: "/accounts/[accountAddress]/[tab]",
          query: {
            accountAddress: nftAddress,
            tab: "resources",
          },
        });
      }}
    >
      View Resource
    </Button>
  );
};
