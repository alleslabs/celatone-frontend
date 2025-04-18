import type { HexAddr32 } from "lib/types";

import { Flex, Heading, Link, Text } from "@chakra-ui/react";
import { useMobile, useTierConfig } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { LabelText } from "lib/components/LabelText";
import { Loading } from "lib/components/Loading";
import { useNftCollectionCreator } from "lib/services/nft-collection";
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
      <Heading as="h6" fontWeight={600} mb={6} variant="h6">
        Collection information
      </Heading>
      <Flex direction={{ base: "column", md: "row" }} mb={{ base: 4, md: 10 }}>
        <Flex
          direction="column"
          gap={6}
          justify="space-between"
          mb={{ base: 4, md: 0 }}
          minW={60}
        >
          <LabelText
            helperText1={formatUTC(timestamp)}
            helperText2={dateFromNow(timestamp)}
            label="Created block height"
          >
            <ExplorerLink
              ampCopierSection="collection-creation-information"
              fixedHeight
              showCopyOnHover
              type="block_height"
              value={String(height)}
            />
          </LabelText>
          <LabelText helperText1="(VM Address)" label="Created by">
            <ExplorerLink
              ampCopierSection="collection-creation-information"
              fixedHeight
              showCopyOnHover
              type="user_address"
              value={creatorAddress}
            />
          </LabelText>
          <LabelText label="Created transaction">
            <ExplorerLink
              ampCopierSection="collection-creation-information"
              showCopyOnHover
              type="tx_hash"
              value={txhash.toUpperCase()}
            />
          </LabelText>
        </Flex>
        <Flex
          bg="gray.900"
          borderRadius="8px"
          direction="column"
          gap={4}
          p={{ base: 4, md: 6 }}
          w="full"
        >
          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text fontWeight={600} minW={24} variant="body2">
              Collection
            </Text>
            <ExplorerLink
              ampCopierSection="collection-information"
              fixedHeight={false}
              maxWidth="full"
              showCopyOnHover
              textFormat="normal"
              type="user_address"
              value={collectionAddress}
            />
          </Flex>
          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text fontWeight={600} minW={24} variant="body2">
              Name
            </Text>
            <Text
              color={collectionName.length ? "text.main" : "text.disabled"}
              fontWeight={collectionName.length ? "600" : "300"}
              textOverflow="ellipsis"
              variant="body2"
              wordBreak="break-word"
            >
              {collectionName || "Untitled collection"}
            </Text>
          </Flex>
          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text fontWeight={600} minW={24} variant="body2">
              Description
            </Text>
            <Text color="text.dark" variant="body2" wordBreak="break-word">
              {desc || "No description was provided by the creator."}
            </Text>
          </Flex>
          <Flex flexDir={infoDirection} gap={infoGap}>
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

          <Flex flexDir={infoDirection} gap={infoGap}>
            <Text fontWeight={600} minW={24} variant="body2">
              Royalty
            </Text>
            <Text variant="body2">{royalty}%</Text>
          </Flex>
        </Flex>
      </Flex>
      <Flex flexDir={infoDirection} gap={{ base: 4, md: 8 }}>
        <InfoCard
          content={activities}
          icon="list"
          isDisabled={activities === 0}
          title="Activities"
          onClick={onClickActivities}
        />
        {isFullTier && (
          <InfoCard
            content={mutateEventes}
            icon="migrate"
            isDisabled={mutateEventes === 0}
            title="Mutate events"
            onClick={onClickMutateEvents}
          />
        )}
      </Flex>
    </Flex>
  );
};
