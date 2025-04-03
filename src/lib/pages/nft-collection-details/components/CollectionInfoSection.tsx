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
  collectionAddress: HexAddr32;
  collectionName: string;
  desc: string;
  uri: string;
  activities?: number;
  mutateEventes?: number;
  royalty: number;
  onClickActivities: () => void;
  onClickMutateEvents: () => void;
}

export const CollectionInfoSection = ({
  collectionAddress,
  collectionName,
  desc,
  uri,
  activities,
  mutateEventes,
  royalty,
  onClickActivities,
  onClickMutateEvents,
}: CollectionInfoSectionProps) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();
  const { data: collectionCreator, isLoading } =
    useNftCollectionCreator(collectionAddress);

  if (isLoading) return <Loading />;
  if (!collectionCreator) return null;

  const { height, txhash, timestamp, creatorAddress } = collectionCreator;
  const infoDirection = isMobile ? "column" : "row";
  const infoGap = isMobile ? 1 : 4;
  return (
    <Flex direction="column">
      <Heading as="h6" variant="h6" fontWeight={600} mb={6}>
        Collection information
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
            label="Created block height"
            helperText1={formatUTC(timestamp)}
            helperText2={dateFromNow(timestamp)}
          >
            <ExplorerLink
              value={String(height)}
              type="block_height"
              showCopyOnHover
              fixedHeight
              ampCopierSection="collection-creation-information"
            />
          </LabelText>
          <LabelText label="Created by" helperText1="(VM Address)">
            <ExplorerLink
              value={creatorAddress}
              type="user_address"
              showCopyOnHover
              fixedHeight
              ampCopierSection="collection-creation-information"
            />
          </LabelText>
          <LabelText label="Created transaction">
            <ExplorerLink
              value={txhash.toUpperCase()}
              type="tx_hash"
              showCopyOnHover
              ampCopierSection="collection-creation-information"
            />
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
          <Flex gap={infoGap} flexDir={infoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Collection
            </Text>
            <ExplorerLink
              value={collectionAddress}
              type="user_address"
              textFormat="normal"
              maxWidth="full"
              showCopyOnHover
              ampCopierSection="collection-information"
              fixedHeight={false}
            />
          </Flex>
          <Flex gap={infoGap} flexDir={infoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Name
            </Text>
            <Text
              textOverflow="ellipsis"
              variant="body2"
              wordBreak="break-word"
              color={collectionName.length ? "text.main" : "text.disabled"}
              fontWeight={collectionName.length ? "600" : "300"}
            >
              {collectionName || "Untitled collection"}
            </Text>
          </Flex>
          <Flex gap={infoGap} flexDir={infoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Description
            </Text>
            <Text color="text.dark" variant="body2" wordBreak="break-word">
              {desc || "No description was provided by the creator."}
            </Text>
          </Flex>
          <Flex gap={infoGap} flexDir={infoDirection}>
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

          <Flex gap={infoGap} flexDir={infoDirection}>
            <Text fontWeight={600} minW={24} variant="body2">
              Royalty
            </Text>
            <Text variant="body2">{royalty}%</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex gap={{ base: 4, md: 8 }} flexDir={infoDirection}>
        <InfoCard
          title="Activities"
          icon="list"
          content={activities}
          onClick={onClickActivities}
          isDisabled={activities === 0}
        />
        {isFullTier && (
          <InfoCard
            title="Mutate events"
            icon="migrate"
            content={mutateEventes}
            onClick={onClickMutateEvents}
            isDisabled={mutateEventes === 0}
          />
        )}
      </Flex>
    </Flex>
  );
};
