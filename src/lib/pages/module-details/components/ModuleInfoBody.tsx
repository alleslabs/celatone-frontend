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
    ? "Latest republished"
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
        label={`${labelPrefix} Proposal ID`}
        helperText1={modulePublishInfo.recentPublishProposal.title}
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
      padding={4}
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      gap={6}
    >
      <LabelText label="Upgrade policy">{upgradePolicy}</LabelText>
      <LabelText label="Published by" helperText1="(Wallet Address)">
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
              label="Published block height"
              helperText1={formatUTC(
                modulePublishInfo.recentPublishBlockTimestamp
              )}
              helperText2={dateFromNow(
                modulePublishInfo.recentPublishBlockTimestamp
              )}
            >
              {modulePublishInfo?.recentPublishBlockHeight ? (
                <ExplorerLink
                  type="block_height"
                  value={modulePublishInfo.recentPublishBlockHeight.toString()}
                  showCopyOnHover
                />
              ) : (
                <>
                  {modulePublishInfo?.recentPublishBlockHeight === 0
                    ? "Genesis"
                    : "N/A"}
                </>
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
