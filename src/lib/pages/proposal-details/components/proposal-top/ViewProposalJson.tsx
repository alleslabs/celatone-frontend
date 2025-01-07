import { Button } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useGovConfig, useInitia, useLcdEndpoint } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { ProposalStatus } from "lib/types";
import { openNewTab } from "lib/utils";

interface ViewProposalJsonProps {
  id: number;
  status: ProposalStatus;
}

export const ViewProposalJson = ({ id, status }: ViewProposalJsonProps) => {
  const endpoint = useLcdEndpoint();
  const config = useGovConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  if (!config.enabled) return null;

  const openLcdPage = () => {
    trackUseViewJSON("Proposal Details");
    openNewTab(
      `${endpoint}/${isInitia ? "initia" : "cosmos"}/gov/${config.version}/proposals/${encodeURIComponent(id)}`
    );
  };

  const disabled =
    status === ProposalStatus.DEPOSIT_FAILED ||
    status === ProposalStatus.CANCELLED;
  return (
    <Tooltip
      hidden={!disabled}
      label="Deposit failed and cancelled proposals are pruned from the network"
    >
      <Button
        minWidth={{ md: "150px" }}
        isDisabled={disabled}
        size={{ base: "sm", md: "md" }}
        variant="outline-primary"
        w={{ base: "full", md: "min-content" }}
        onClick={openLcdPage}
        rightIcon={<CustomIcon name="launch" />}
      >
        View in JSON
      </Button>
    </Tooltip>
  );
};
