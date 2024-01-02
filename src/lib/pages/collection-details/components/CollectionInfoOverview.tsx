import {
  Box,
  Flex,
  Link,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { useCollectionCreator } from "lib/services/collectionService";
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
  royalty: number;
}

const CollectionInfoOverview = ({
  collectionAddress,
  collectionName,
  desc,
  uri,
  activities,
  mutateEventes,
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

  const isMobile = useMobile();

  if (isLoading) return <Loading />;
  if (!collectionCreator) return null;

  const { height, txhash, timestamp, creatorAddress } = collectionCreator;
  const mobileInfoDirection = isMobile ? "column" : "row";
  const mobileInfoGap = isMobile ? "4px" : "16px";
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
          flexDir={isMobile ? "column" : styles.direction}
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
            <ExplorerLink value={txhash} type="tx_hash" />
          </InfoComponent>
        </Flex>

        <Stack
          bg="gray.900"
          borderRadius="8px"
          p={isMobile ? "16px" : "24px"}
          w="100%"
          spacing="24px"
          fontFamily="Manrope"
          overflow="auto"
        >
          <Flex
            fontSize="14px"
            gap={mobileInfoGap}
            flexDir={mobileInfoDirection}
          >
            <Text minW="100px">Collection</Text>
            <ExplorerLink value={collectionAddress} type="user_address" />
          </Flex>

          <Flex
            fontSize="14px"
            gap={mobileInfoGap}
            flexDir={mobileInfoDirection}
          >
            <Text minW="100px">Name</Text>
            <Text textOverflow="ellipsis">{collectionName}</Text>
          </Flex>

          <Flex
            fontSize="14px"
            gap={mobileInfoGap}
            flexDir={mobileInfoDirection}
          >
            <Text minW="100px">Description</Text>
            <Text color="gray.400">{desc}</Text>
          </Flex>

          <Flex
            fontSize="14px"
            gap={mobileInfoGap}
            flexDir={mobileInfoDirection}
          >
            <Text minW="100px">Uri</Text>
            <Link href={uri} target="_blank">
              {uri}
            </Link>
          </Flex>

          <Flex
            fontSize="14px"
            gap={mobileInfoGap}
            flexDir={mobileInfoDirection}
          >
            <Text minW="100px">Royalty</Text>
            <Text>{royalty}%</Text>
          </Flex>
        </Stack>
      </Flex>

      <Flex
        mt="40px"
        gap={isMobile ? "16px" : "32px"}
        flexDir={mobileInfoDirection}
      >
        <AppLink
          href={`/collections/${collectionAddress}/activities`}
          style={{ flex: 1 }}
        >
          <InfoCard title="Activities" content={activities} />
        </AppLink>
        <AppLink
          href={`/collections/${collectionAddress}/mutate_events`}
          style={{ flex: 1 }}
        >
          <InfoCard title="Mutate Events" content={mutateEventes} />
        </AppLink>
      </Flex>
    </Box>
  );
};

export default CollectionInfoOverview;
