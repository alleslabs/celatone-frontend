import { Grid } from "@chakra-ui/react";

import { useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { dateFromNow, formatUTC } from "lib/utils";

import type { ModuleInfoProps } from "./ModuleInfo";

const ModuleInfoBodyPublishedAndRepublished = ({
  modulePublishInfo,
}: Pick<ModuleInfoProps, "modulePublishInfo">) => {
  const labelPrefix = modulePublishInfo?.isRepublished
    ? "Latest Republished"
    : "Published";

  if (modulePublishInfo?.recentPublishTransaction) {
    return (
      <LabelText label={`${labelPrefix} Transaction`}>
        <ExplorerLink
          type="tx_hash"
          value={modulePublishInfo.recentPublishTransaction.toUpperCase()}
          showCopyOnHover
        />
      </LabelText>
    );
  }

  if (modulePublishInfo?.recentPublishProposal) {
    return (
      <LabelText
        helperText1={modulePublishInfo.recentPublishProposal.title}
        label={`${labelPrefix} Proposal ID`}
      >
        <ExplorerLink
          type="proposal_id"
          value={modulePublishInfo.recentPublishProposal.id.toString()}
          showCopyOnHover
        />
      </LabelText>
    );
  }

  return <LabelText label="Created by">Genesis</LabelText>;
};

export const ModuleInfoBody = ({
  indexedModule,
  modulePublishInfo,
}: Pick<ModuleInfoProps, "indexedModule" | "modulePublishInfo">) => {
  const { isFullTier } = useTierConfig();
  const { address, upgradePolicy } = indexedModule;

  return (
    <Grid
      gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
      gap={6}
      padding={4}
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
    >
      <LabelText label="Upgrade Policy">{upgradePolicy}</LabelText>
      <LabelText helperText1="(Wallet Address)" label="Published by">
        {address ? (
          <ExplorerLink type="user_address" value={address} showCopyOnHover />
        ) : (
          "N/A"
        )}
      </LabelText>
      {isFullTier && (
        <>
          {modulePublishInfo?.recentPublishBlockTimestamp && (
            <LabelText
              helperText1={formatUTC(
                modulePublishInfo.recentPublishBlockTimestamp
              )}
              helperText2={dateFromNow(
                modulePublishInfo.recentPublishBlockTimestamp
              )}
              label="Published Block Height"
            >
              {modulePublishInfo?.recentPublishBlockHeight ? (
                <ExplorerLink
                  type="block_height"
                  value={modulePublishInfo.recentPublishBlockHeight.toString()}
                  showCopyOnHover
                />
              ) : (
                "N/A"
              )}
            </LabelText>
          )}
          <ModuleInfoBodyPublishedAndRepublished
            modulePublishInfo={modulePublishInfo}
          />
        </>
      )}
    </Grid>
  );
};
