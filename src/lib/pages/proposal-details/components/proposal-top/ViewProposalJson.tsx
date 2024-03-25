import { Button } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useGovConfig, useInitia, useLCDEndpoint } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { openNewTab } from "lib/utils";

interface ViewProposalJsonProps {
  id: number;
}

export const ViewProposalJson = ({ id }: ViewProposalJsonProps) => {
  const endpoint = useLCDEndpoint();
  const config = useGovConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  if (!config.enabled) return null;

  const openLcdPage = () => {
    trackUseViewJSON("Proposal Details");
    openNewTab(
      `${endpoint}/${isInitia ? "initia" : "cosmos"}/gov/${config.version}/proposals/${encodeURIComponent(id)}`
    );
  };

  return (
    <Button
      variant="outline-primary"
      w={{ base: "full", md: "min-content" }}
      minWidth={{ md: "150px" }}
      size={{ base: "sm", md: "md" }}
      rightIcon={<CustomIcon name="launch" />}
      onClick={openLcdPage}
    >
      View in JSON
    </Button>
  );
};
