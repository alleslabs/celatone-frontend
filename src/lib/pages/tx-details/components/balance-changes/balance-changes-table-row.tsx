import type { Metadata } from "@initia/tx-decoder";
import type { LinkType } from "lib/components/ExplorerLink";

import { Divider, Grid, Stack } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TableRow } from "lib/components/table";

import { BalanceChangeEvmNft } from "./balance-changes-evm-nft";
import { BalanceChangeNft } from "./balance-changes-nft";
import { BalanceChangesToken } from "./balance-changes-token";

interface BalanceChangesTableRowProps {
  address: string;
  addressType: Exclude<LinkType, "function_name">;
  ftChangeEntries: [string, string][];
  metadata?: Metadata;
  nftChangeEntries?: [string, [string, string][]][];
  objectChangeEntries?: [string, string][];
  templateColumns: string;
}

export const BalanceChangesTableRow = ({
  address,
  addressType,
  ftChangeEntries,
  metadata,
  nftChangeEntries = [],
  objectChangeEntries = [],
  templateColumns,
}: BalanceChangesTableRowProps) => {
  const totalNftOrObjectCount =
    metadata?.type === "evm"
      ? nftChangeEntries.reduce(
          (acc, [, tokenIdChanges]) => acc + tokenIdChanges.length,
          0
        )
      : objectChangeEntries.length;

  return (
    <Grid bg="gray.900" rounded={8} templateColumns={templateColumns}>
      <TableRow borderBottom={0} minH={0} p={4}>
        <ExplorerLink
          showCopyOnHover
          textVariant="body2"
          type={addressType}
          value={address}
        />
      </TableRow>
      <TableRow borderBottom={0} minH={0} p={4}>
        <Stack w="full">
          {ftChangeEntries.map(([denom, amount], index) => (
            <Stack key={`${address}-${denom}`} gap={3}>
              <BalanceChangesToken coin={new Coin(denom, amount)} />
              {index < ftChangeEntries.length - 1 && (
                <Divider borderColor="gray.700" />
              )}
            </Stack>
          ))}
          {ftChangeEntries.length > 0 && totalNftOrObjectCount > 0 && (
            <Divider borderColor="gray.700" />
          )}
          {metadata &&
            metadata.type === "move" &&
            objectChangeEntries.map(([id, change], index) => (
              <Stack key={`${address}-${id}`} gap={3}>
                <BalanceChangeNft
                  id={id}
                  change={Number(change)}
                  metadata={metadata}
                />
                {index < objectChangeEntries.length - 1 && (
                  <Divider borderColor="gray.700" />
                )}
              </Stack>
            ))}
          {metadata &&
            metadata.type === "evm" &&
            (() => {
              let globalIndex = 0;
              return nftChangeEntries.map(([contractAddress, tokenIdChanges]) =>
                tokenIdChanges.map(([tokenId, change]) => {
                  const currentIndex = globalIndex++;
                  return (
                    <Stack
                      key={`${address}-${contractAddress}-${tokenId}`}
                      gap={3}
                    >
                      <BalanceChangeEvmNft
                        change={Number(change)}
                        contractAddress={contractAddress}
                        metadata={metadata}
                        tokenId={tokenId}
                      />
                      {currentIndex < totalNftOrObjectCount - 1 && (
                        <Divider borderColor="gray.700" />
                      )}
                    </Stack>
                  );
                })
              );
            })()}
        </Stack>
      </TableRow>
    </Grid>
  );
};
