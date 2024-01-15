import { Button } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import type { HexAddr32 } from "lib/types";

interface ViewResourceButtonProps {
  nftAddress: HexAddr32;
}

export const ViewResourceButton = ({ nftAddress }: ViewResourceButtonProps) => {
  const navigate = useInternalNavigate();

  return (
    <Button
      variant="outline-primary"
      w={{ base: "full", md: "auto" }}
      size={{ base: "sm", md: "md" }}
      mb={{ base: 4, md: 0 }}
      onClick={() =>
        navigate({
          pathname: "/accounts/[accountAddress]/[tab]",
          query: {
            accountAddress: nftAddress,
            tab: "resources",
          },
        })
      }
    >
      View Resource
    </Button>
  );
};
