import { Flex, Grid } from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { LabelTextProps } from "lib/components/LabelText";
import { LabelText } from "lib/components/LabelText";
import { dateFromNow, formatUTC } from "lib/utils";

import type { ModuleInfoProps } from "./ModuleInfo";

interface ModuleInfoBodyValueProps {
  labelText: Pick<LabelTextProps, "label" | "helperText1" | "helperText2">;
  content: string | JSX.Element;
}

const ModuleInfoBodyValue = ({
  labelText,
  content,
}: ModuleInfoBodyValueProps) => (
  <Flex flexDirection="column" gap={1}>
    <LabelText {...labelText}>{content}</LabelText>
  </Flex>
);

const ModuleInfoBodyPublishedAndRepublished = ({
  transaction,
  proposal,
  isRepublished,
}: Pick<ModuleInfoProps, "transaction" | "proposal" | "isRepublished">) => {
  const labelPrefix = isRepublished ? "Latest Republished" : "Published";

  if (transaction) {
    return (
      <ModuleInfoBodyValue
        labelText={{ label: `${labelPrefix} Transaction` }}
        content={
          <ExplorerLink type="tx_hash" value={transaction} showCopyOnHover />
        }
      />
    );
  }

  if (proposal && proposal.id) {
    return (
      <ModuleInfoBodyValue
        labelText={{
          label: `${labelPrefix} Proposal ID`,
          helperText1: proposal.title,
        }}
        content={
          <ExplorerLink
            type="proposal_id"
            value={proposal.id.toString()}
            showCopyOnHover
          />
        }
      />
    );
  }

  return (
    <ModuleInfoBodyValue
      labelText={{ label: "Created by" }}
      content="Genesis"
    />
  );
};

export const ModuleInfoBody = ({
  address,
  upgradePolicy,
  transaction,
  proposal,
  isRepublished,
  blockHeight,
  blockTimestamp,
}: Omit<ModuleInfoProps, "verificationData">) => (
  <Grid
    gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(4, 1fr)" }}
    padding={4}
    border="1px solid"
    borderColor="gray.700"
    borderRadius={8}
    gap={6}
  >
    <ModuleInfoBodyValue
      labelText={{ label: "Upgrade Policy" }}
      content={upgradePolicy}
    />
    <ModuleInfoBodyValue
      labelText={{ label: "Published by", helperText1: "(Wallet Address)" }}
      content={
        <ExplorerLink type="user_address" value={address} showCopyOnHover />
      }
    />
    <ModuleInfoBodyValue
      labelText={{
        label: "Published Block Height",
        helperText1: formatUTC(blockTimestamp),
        helperText2: `(${dateFromNow(blockTimestamp)})`,
      }}
      content={
        blockHeight ? (
          <ExplorerLink
            type="block_height"
            value={blockHeight.toString()}
            showCopyOnHover
          />
        ) : (
          "N/A"
        )
      }
    />
    <ModuleInfoBodyPublishedAndRepublished
      transaction={transaction}
      proposal={proposal}
      isRepublished={isRepublished}
    />
  </Grid>
);
