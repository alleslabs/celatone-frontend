import { Flex, Heading, Link, Text } from "@chakra-ui/react";

import { useMobile, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { useNftCollectionCreator } from "lib/services/nft-collection";
import type { HexAddr32 } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { InfoCard } from "./InfoCard";

interface CollectionInfoSectionProps {
  activities?: number;
  collectionAddress: HexAddr32;
  collectionName: string;
  desc: string;
  mutateEventes?: number;
  onClickActivities: () => void;
  onClickMutateEvents: () => void;
  royalty: number;
  uri: string;
}

export const CollectionInfoSection = ({
  activities,
  collectionAddress,
  collectionName,
  desc,
  mutateEventes,
  onClickActivities,
  onClickMutateEvents,
  royalty,
  uri,
}: CollectionInfoSectionProps) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();
  const { data: collectionCreator, isLoading } =
    useNftCollectionCreator(collectionAddress);

  if (isLoading) return <Loading />;
  if (!collectionCreator) return null;

  const { creatorAddress, height, timestamp, txhash } = collectionCreator;
  const infoDirection = isMobile ? "column" : "row";
  const infoGap = isMobile ? 1 : 4;
  return (
    <Flex direction="column">
      <Heading as="h6" mb={6} variant="h6" fontWeight={600}>
        Collection Information
      </Heading>
      <Flex mb={{ base: 4, md: 10 }} direction={{ base: "column", md: "row" }}>
        <Flex
          gap={6}
          justify="space-between"
          mb={{ base: 4, md: 0 }}
          minW={60}
          direction="column"
        >
          <LabelText
            helperText1={formatUTC(timestamp)}
            helperText2={dateFromNow(timestamp)}
            label="Created Block Height"
          >
            <ExplorerLink
              fixedHeight
              type="block_height"
              value={String(height)}
              ampCopierSection="collection-creation-information"
              showCopyOnHover
            />
          </LabelText>
          <LabelText helperText1="(VM Address)" label="Created by">
            <ExplorerLink
              fixedHeight
              type="user_address"
              value={creatorAddress}
              ampCopierSection="collection-creation-information"
              showCopyOnHover
            />
          </LabelText>
          <LabelText label="Created Transaction">
            <ExplorerLink
              type="tx_hash"
              value={txhash.toUpperCase()}
              ampCopierSection="collection-creation-information"
              showCopyOnHover
            />
          </LabelText>
        </Flex>
        <Flex
          bg="gray.900"
          gap={4}
          p={{ base: 4, md: 6 }}
          w="full"
          borderRadius="8px"
          direction="column"
        >
          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text minW={24} variant="body2" fontWeight={600}>
              Collection
            </Text>
            <ExplorerLink
              maxWidth="full"
              fixedHeight={false}
              type="user_address"
              value={collectionAddress}
              ampCopierSection="collection-information"
              showCopyOnHover
              textFormat="normal"
            />
          </Flex>
          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text minW={24} variant="body2" fontWeight={600}>
              Name
            </Text>
            <Text
              variant="body2"
              color={collectionName.length ? "text.main" : "text.disabled"}
              fontWeight={collectionName.length ? "600" : "300"}
              textOverflow="ellipsis"
              wordBreak="break-word"
            >
              {collectionName || "Untitled Collection"}
            </Text>
          </Flex>
          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text minW={24} variant="body2" fontWeight={600}>
              Description
            </Text>
            <Text variant="body2" color="text.dark" wordBreak="break-word">
              {desc || "No description was provided by the creator."}
            </Text>
          </Flex>
          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text minW={24} variant="body2" fontWeight={600}>
              Uri
            </Text>
            <Link
              target="_blank"
              variant="body2"
              wordBreak="break-all"
              href={uri}
            >
              {uri}
            </Link>
          </Flex>

          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text minW={24} variant="body2" fontWeight={600}>
              Royalty
            </Text>
            <Text variant="body2">{royalty}%</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir={infoDirection} gap={{ base: 4, md: 8 }}>
        <InfoCard
          isDisabled={activities === 0}
          title="Activities"
          content={activities}
          icon="list"
          onClick={onClickActivities}
        />
        {isFullTier && (
          <InfoCard
            isDisabled={mutateEventes === 0}
            title="Mutate Events"
            content={mutateEventes}
            icon="migrate"
            onClick={onClickMutateEvents}
          />
        )}
      </Flex>
    </Flex>
  );
};
