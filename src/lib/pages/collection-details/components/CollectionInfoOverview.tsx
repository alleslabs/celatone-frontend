import { Flex, Heading, Link, Text } from "@chakra-ui/react";

import { useInternalNavigate, useMobile } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { useCollectionCreator } from "lib/services/collectionService";
import type { HexAddr } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import InfoCard from "./InfoCard";

interface Props {
  collectionAddress: HexAddr;
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
  const { data: collectionCreator, isLoading } =
    useCollectionCreator(collectionAddress);

  const isMobile = useMobile();

  const navigate = useInternalNavigate();

  if (isLoading) return <Loading />;
  if (!collectionCreator) return null;

  const { height, txhash, timestamp, creatorAddress } = collectionCreator;
  const mobileInfoDirection = isMobile ? "column" : "row";
  const mobileInfoGap = isMobile ? 1 : 4;
  return (
    <Flex direction="column">
      <Heading as="h6" variant="h6" fontWeight={600} mb={6}>
        Collection Information
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} mb={{ base: 4, md: 10 }}>
        <Flex
          direction="column"
          justify="space-between"
          gap={6}
          minW={60}
          mb={{ base: 4, md: 0 }}
        >
          <LabelText
            label="Created Block Height"
            helperText1={formatUTC(timestamp)}
            helperText2={dateFromNow(timestamp)}
          >
            <ExplorerLink
              value={String(height)}
              type="block_height"
              showCopyOnHover
              fixedHeight
            />
          </LabelText>
          <LabelText label="Created by" helperText1="(VM Address)">
            <ExplorerLink
              value={creatorAddress}
              type="user_address"
              showCopyOnHover
              fixedHeight
            />
          </LabelText>
          <LabelText label="Created Transaction">
            <ExplorerLink value={txhash} type="tx_hash" showCopyOnHover />
          </LabelText>
        </Flex>
        <Flex
          direction="column"
          gap={4}
          p={{ base: 4, md: 6 }}
          bg="gray.900"
          borderRadius="8px"
          w="full"
        >
          <Flex gap={mobileInfoGap} flexDir={mobileInfoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Collection
            </Text>
            <CopyLink
              value={collectionAddress}
              type="user_address"
              showCopyOnHover
            />
          </Flex>
          <Flex gap={mobileInfoGap} flexDir={mobileInfoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Name
            </Text>
            <Text
              textOverflow="ellipsis"
              variant="body2"
              wordBreak="break-word"
            >
              {collectionName}
            </Text>
          </Flex>
          <Flex gap={mobileInfoGap} flexDir={mobileInfoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Description
            </Text>
            <Text color="text.dark" variant="body2" wordBreak="break-word">
              {desc || "No description was provided by the creator."}
            </Text>
          </Flex>
          <Flex gap={mobileInfoGap} flexDir={mobileInfoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Uri
            </Text>
            <Link
              href={uri}
              target="_blank"
              variant="body2"
              wordBreak="break-all"
            >
              {uri}
            </Link>
          </Flex>

          <Flex gap={mobileInfoGap} flexDir={mobileInfoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Royalty
            </Text>
            <Text variant="body2">{royalty}%</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={{ base: 4, md: 8 }} flexDir={mobileInfoDirection}>
        <InfoCard
          title="Activities"
          icon="list"
          content={activities}
          onClick={() =>
            navigate({
              pathname: `/nft-collections/[collectionAddress]/activities`,
              query: { collectionAddress },
            })
          }
          isDisabled={!activities}
        />
        <InfoCard
          title="Mutate Events"
          icon="migrate"
          content={mutateEventes}
          onClick={() =>
            navigate({
              pathname: `/nft-collections/[collectionAddress]/mutate_events`,
              query: { collectionAddress },
            })
          }
          isDisabled={!mutateEventes}
        />
      </Flex>
    </Flex>
  );
};

export default CollectionInfoOverview;
