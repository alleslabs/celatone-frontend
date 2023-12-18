import {
  Box,
  Flex,
  Link,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useCollectionCreator } from "lib/services/nftService";
import { formatUTC } from "lib/utils";

import InfoCard from "./InfoCard";

const InfoComponent = ({
  title,
  children,
}: PropsWithChildren<{ title: string }>) => (
  <Stack spacing="24px">
    <Stack spacing="4px">
      <Text fontSize="12px" fontWeight={600} color="gray.400">
        {title}
      </Text>
      {children}
    </Stack>
  </Stack>
);

interface Props {
  collectionAddress: string;
  collectionName: string;
  desc: string;
  uri: string;
  activities: number;
  mutateEventes: number;
  uniqueHolders: number;
  royalty: number;
}

const CollectionInfoOverview = ({
  collectionAddress,
  collectionName,
  desc,
  uri,
  activities,
  mutateEventes,
  uniqueHolders,
  royalty,
}: Props) => {
  const styles = useBreakpointValue({
    xl: { wrap: "nowrap", gap: 100, direction: "column" },
    lg: { wrap: "wrap", gap: 32, direction: "row" },
    base: { wrap: "wrap", gap: 32, direction: "row" },
    md: { wrap: "wrap", gap: 32, direction: "row" },
    xs: { wrap: "wrap", gap: 32, direction: "row" },
    fallback: { wrap: "wrap", gap: 32, direction: "row" },
  }) as { wrap: "wrap" | "nowrap"; gap: number; direction: "row" | "column" };

  const { data: collectionCreator, isLoading } =
    useCollectionCreator(collectionAddress);
  const formatAddress = useFormatAddresses();

  if (isLoading) return <Loading />;
  if (!collectionCreator) return null;

  const { collectionTransactions, vmAddressByCreator } = collectionCreator;
  const [createdInfo] = collectionTransactions;
  const { hash, block } = createdInfo.transaction;
  const { timestamp, height } = block;

  const { vmAddress: creator } = vmAddressByCreator;
  const { address: creatorAddress } = formatAddress(creator);

  return (
    <Box>
      <Text fontSize="18px" fontWeight={600} mb="24px">
        Collection Infomation
      </Text>

      <Flex gap={`${styles.gap}px`} flexWrap={styles.wrap}>
        <Flex
          justify="space-between"
          fontFamily="Manrope"
          gap="24px"
          direction={styles.direction}
        >
          <InfoComponent title="Created Block Height">
            <ExplorerLink value={String(height)} type="block_height" />
            <Text fontSize="12px" color="gray.400">
              {formatUTC(new Date(timestamp))}
            </Text>
          </InfoComponent>

          <InfoComponent title="Created by">
            <ExplorerLink value={creatorAddress} type="user_address" />
            <Text fontSize="12px" color="gray.400">
              (Wallet Address)
            </Text>
          </InfoComponent>

          <InfoComponent title="Created Transaction">
            <ExplorerLink value={hash.replace("\\x", "")} type="tx_hash" />
          </InfoComponent>
        </Flex>

        <Stack
          bg="gray.900"
          borderRadius="8px"
          p="24px"
          w="100%"
          spacing="24px"
          fontFamily="Manrope"
          overflow="auto"
        >
          <Flex gap="16px" fontSize="14px" align="center">
            <Text minW="100px">Collection</Text>
            <ExplorerLink value={collectionAddress} type="user_address" />
          </Flex>

          <Flex gap="16px" fontSize="14px">
            <Text minW="100px">Name</Text>
            <Text textOverflow="ellipsis">{collectionName}</Text>
          </Flex>

          <Flex gap="16px" fontSize="14px">
            <Text minW="100px">Description</Text>
            <Text color="gray.400">{desc}</Text>
          </Flex>

          <Flex gap="16px" fontSize="14px">
            <Text minW="100px">Uri</Text>
            <Link href={uri} target="_blank">
              {uri}
            </Link>
          </Flex>

          <Flex gap="16px" fontSize="14px">
            <Text minW="100px">Royalty</Text>
            <Text>{royalty}%</Text>
          </Flex>
        </Stack>
      </Flex>

      <Flex gap="32px" mt="40px">
        <InfoCard title="Activities" content={activities} />
        <InfoCard title="Mutate Events" content={mutateEventes} />
        <InfoCard title="Unique Holders" content={uniqueHolders} />
      </Flex>
    </Box>
  );
};

export default CollectionInfoOverview;
