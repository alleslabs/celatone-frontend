import type { FtChange, Metadata, ObjectChange } from "@initia/tx-decoder";

import { Divider, Flex, Grid, Stack, Text } from "@chakra-ui/react";
import { Coin } from "@initia/initia.js";
import { useGetAddressType } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { NftImage } from "lib/components/nft/NftImage";
import { TableRow } from "lib/components/table";
import { useMetadata } from "lib/services/nft";
import { zAddr, zHexAddr32 } from "lib/types";

import { BalanceChangesToken } from "./balance-changes-token";

interface BalanceChangesTableRowProps {
  address: string;
  ftChange: FtChange;
  metadata?: Metadata;
  objectChange: ObjectChange;
  templateColumns: string;
}

const BalanceChangeNft = ({
  change,
  id,
  metadata,
}: {
  change: number;
  id: string;
  metadata: Metadata;
}) => {
  const nftMetadata = metadata[id];
  const { data: nft } = useMetadata({
    collectionAddress: zAddr.parse(nftMetadata?.collectionAddress),
    nftAddress: zHexAddr32.parse(id),
    tokenId: nftMetadata?.tokenId,
    uri: nftMetadata?.tokenUri,
  });

  if (!nft) return null;

  const isPositiveAmount = change > 0;
  const formattedAmount = `${isPositiveAmount ? "+" : "-"}${" "}${nft?.name}`;

  return (
    <Flex align="center" gap={1}>
      <AppLink
        href={`/nft-collections/${nftMetadata.collectionAddress}/nft/${id}`}
      >
        <NftImage
          borderRadius="4px"
          height="20px"
          src={nft.image}
          width="20px"
        />
      </AppLink>
      <Text color={isPositiveAmount ? "success.main" : "error.main"}>
        {formattedAmount}
      </Text>
    </Flex>
  );
};

export const BalanceChangesTableRow = ({
  address,
  ftChange,
  metadata,
  objectChange,
  templateColumns,
}: BalanceChangesTableRowProps) => {
  const getAddressType = useGetAddressType();

  const ftChangeEntries = ftChange
    ? Object.entries(ftChange).filter(([, amount]) => amount !== "0")
    : [];
  const objectChangeEntries = objectChange ? Object.entries(objectChange) : [];
  const count = ftChangeEntries.length + objectChangeEntries.length;

  if (!count) return null;
  return (
    <Grid bg="gray.900" rounded={8} templateColumns={templateColumns}>
      <TableRow borderBottom={0} minH={0} p={4}>
        <ExplorerLink
          showCopyOnHover
          textVariant="body2"
          type={getAddressType(address)}
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
          {ftChangeEntries.length > 0 && objectChangeEntries.length > 0 && (
            <Divider borderColor="gray.700" />
          )}
          {metadata &&
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
        </Stack>
      </TableRow>
    </Grid>
  );
};
