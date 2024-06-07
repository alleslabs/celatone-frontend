import { Grid } from "@chakra-ui/react";

import { useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import type { ModuleData } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import type { ModuleInfoProps } from "./ModuleInfo";

const ModuleInfoBodyPublishedAndRepublished = ({
  moduleData,
}: {
  moduleData: Partial<ModuleData>;
}) => {
  const { isRepublished, recentPublishTransaction, recentPublishProposal } =
    moduleData;
  const labelPrefix = isRepublished ? "Latest Republished" : "Published";

  if (recentPublishTransaction) {
    return (
      <LabelText label={`${labelPrefix} Transaction`}>
        <ExplorerLink
          type="tx_hash"
          value={recentPublishTransaction}
          showCopyOnHover
        />
      </LabelText>
    );
  }

  if (recentPublishProposal) {
    return (
      <LabelText
        label={`${labelPrefix} Proposal ID`}
        helperText1={recentPublishProposal.title}
      >
        <ExplorerLink
          type="proposal_id"
          value={recentPublishProposal.id.toString()}
          showCopyOnHover
        />
      </LabelText>
    );
  }

  return <LabelText label="Created by">Genesis</LabelText>;
};

export const ModuleInfoBody = ({
  moduleData,
}: Omit<ModuleInfoProps, "verificationData">) => {
  const isFullTier = useTierConfig() === "full";
  const {
    address,
    upgradePolicy,
    recentPublishBlockHeight,
    recentPublishBlockTimestamp,
  } = moduleData;

  return (
    <Grid
      gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
      padding={4}
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      gap={6}
    >
      <LabelText label="Upgrade Policy">{upgradePolicy}</LabelText>
      <LabelText label="Published by" helperText1="(Wallet Address)">
        {address ? (
          <ExplorerLink type="user_address" value={address} showCopyOnHover />
        ) : (
          "N/A"
        )}
      </LabelText>
      {isFullTier && (
        <>
          {recentPublishBlockTimestamp && (
            <LabelText
              label="Published Block Height"
              helperText1={formatUTC(recentPublishBlockTimestamp)}
              helperText2={dateFromNow(recentPublishBlockTimestamp)}
            >
              {recentPublishBlockHeight ? (
                <ExplorerLink
                  type="block_height"
                  value={recentPublishBlockHeight.toString()}
                  showCopyOnHover
                />
              ) : (
                "N/A"
              )}
            </LabelText>
          )}
          <ModuleInfoBodyPublishedAndRepublished moduleData={moduleData} />
        </>
      )}
    </Grid>
  );
};
