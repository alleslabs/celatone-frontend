import { Grid } from "@chakra-ui/react";

import { useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { dateFromNow, formatUTC } from "lib/utils";

import type { ModuleInfoProps } from "./ModuleInfo";

const ModuleInfoBodyPublishedAndRepublished = ({
  transaction,
  proposal,
  isRepublished,
}: Pick<ModuleInfoProps, "transaction" | "proposal" | "isRepublished">) => {
  const labelPrefix = isRepublished ? "Latest Republished" : "Published";

  if (transaction) {
    return (
      <LabelText label={`${labelPrefix} Transaction`}>
        <ExplorerLink type="tx_hash" value={transaction} showCopyOnHover />
      </LabelText>
    );
  }

  if (proposal && proposal.id) {
    return (
      <LabelText
        label={`${labelPrefix} Proposal ID`}
        helperText1={proposal.title}
      >
        <ExplorerLink
          type="proposal_id"
          value={proposal.id.toString()}
          showCopyOnHover
        />
      </LabelText>
    );
  }

  return <LabelText label="Created by">Genesis</LabelText>;
};

export const ModuleInfoBody = ({
  vmAddress,
  upgradePolicy,
  transaction,
  proposal,
  isRepublished,
  blockHeight,
  blockTimestamp,
}: Omit<ModuleInfoProps, "verificationData">) => {
  const isFullTier = useTierConfig() === "full";

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
        <ExplorerLink type="user_address" value={vmAddress} showCopyOnHover />
      </LabelText>
      {isFullTier && (
        <>
          <LabelText
            label="Published Block Height"
            helperText1={formatUTC(blockTimestamp)}
            helperText2={dateFromNow(blockTimestamp)}
          >
            {blockHeight ? (
              <ExplorerLink
                type="block_height"
                value={blockHeight.toString()}
                showCopyOnHover
              />
            ) : (
              "N/A"
            )}
          </LabelText>
          <ModuleInfoBodyPublishedAndRepublished
            transaction={transaction}
            proposal={proposal}
            isRepublished={isRepublished}
          />
        </>
      )}
    </Grid>
  );
};
