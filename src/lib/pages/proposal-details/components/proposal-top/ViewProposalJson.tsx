import { Button } from "@chakra-ui/react";

import { trackUseViewJSON } from "lib/amplitude";
import { useCelatoneApp, useGovConfig, useInitia } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { Tooltip } from "lib/components/Tooltip";
import { ProposalStatus } from "lib/types";
import { openNewTab } from "lib/utils";

interface ViewProposalJsonProps {
  id: number;
  status: ProposalStatus;
}

export const ViewProposalJson = ({ id, status }: ViewProposalJsonProps) => {
  const {
    chainConfig: { rest: restEndpoint },
  } = useCelatoneApp();
  const config = useGovConfig({ shouldRedirect: false });
  const isInitia = useInitia();

  if (!config.enabled) return null;

  const openRestPage = () => {
    trackUseViewJSON("Proposal Details");
    openNewTab(
      `${restEndpoint}/${isInitia ? "initia" : "cosmos"}/gov/${config.version}/proposals/${encodeURIComponent(id)}`
    );
  };

  const disabled =
    status === ProposalStatus.DEPOSIT_FAILED ||
    status === ProposalStatus.CANCELLED;
  return (
    <Tooltip
      label="Deposit failed and cancelled proposals are pruned from the network"
      hidden={!disabled}
    >
      <Button
        variant="outline-primary"
        w={{ base: "full", md: "min-content" }}
        minWidth={{ md: "150px" }}
        size={{ base: "sm", md: "md" }}
        rightIcon={<CustomIcon name="launch" />}
        onClick={openRestPage}
        isDisabled={disabled}
      >
        View in JSON
      </Button>
    </Tooltip>
  );
};
