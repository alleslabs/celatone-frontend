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
          showCopyOnHover
          type="tx_hash"
          value={modulePublishInfo.recentPublishTransaction.toUpperCase()}
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
          showCopyOnHover
          type="proposal_id"
          value={modulePublishInfo.recentPublishProposal.id.toString()}
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
      border="1px solid"
      borderColor="gray.700"
      borderRadius={8}
      gap={6}
      gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
      padding={4}
    >
      <LabelText label="Upgrade policy">{upgradePolicy}</LabelText>
      <LabelText helperText1="(Wallet Address)" label="Published by">
        {address ? (
          <ExplorerLink showCopyOnHover type="user_address" value={address} />
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
              label="Published block height"
              label="Published Block Height"
            >
              {modulePublishInfo?.recentPublishBlockHeight ? (
                <ExplorerLink
                  showCopyOnHover
                  type="block_height"
                  value={modulePublishInfo.recentPublishBlockHeight.toString()}
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
