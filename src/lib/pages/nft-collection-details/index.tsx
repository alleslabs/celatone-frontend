import {
  Badge,
  Button,
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import {
  useEvmConfig,
  useInternalNavigate,
  useMobile,
  useMoveConfig,
  useTierConfig,
  useValidateAddress,
} from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { Tooltip } from "lib/components/Tooltip";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import { useNfts, useNftsSequencer } from "lib/services/nft";
import {
  useNftCollectionActivities,
  useNftCollectionMutateEvents,
} from "lib/services/nft-collection";
import { zHexAddr32 } from "lib/types";
import { zBechAddr32 } from "lib/types";
import { isHexModuleAddress } from "lib/utils";
import { extractNftDescription } from "lib/utils/nftDescription";
import { isUndefined } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import type { CollectionDetailQueryParams } from "./types";

import { CollectionInfoSection } from "./components/CollectionInfoSection";
import { CollectionSuppliesFull } from "./components/CollectionSuppliesFull";
import { CollectionSuppliesOverview } from "./components/CollectionSuppliesOverview";
import { CollectionSuppliesSequencer } from "./components/CollectionSuppliesSequencer";
import { CollectionSupplyInfo } from "./components/CollectionSupplyInfo";
import { ActivitiesFull, ActivitiesSequencer } from "./components/tables";
import { CollectionMutateEvents } from "./components/tables/CollectionMutateEvents";
import { useNftCollectionData } from "./data";
import { TabIndex, zCollectionDetailQueryParams } from "./types";
const InvalidCollection = () => (
  <InvalidState title="Collection does not exist" />
);

const tabHeaderId = "collectionDetailTab";

const CollectionDetailsBody = ({
  collectionAddress,
  tab,
}: CollectionDetailQueryParams) => {
  const isMobile = useMobile();
  const navigate = useInternalNavigate();
  const { isFullTier } = useTierConfig();
  const { enabled: isMoveEnabled } = useMoveConfig({ shouldRedirect: false });
  const { enabled: isEvmEnabled } = useEvmConfig({ shouldRedirect: false });
  const formatAddresses = useFormatAddresses();

  const formattedAddresses = formatAddresses(collectionAddress);
  const collectionAddressBech = zBechAddr32.parse(formattedAddresses.address);
  const collectionAddressHex = zHexAddr32.parse(formattedAddresses.hex);

  const {
    collection,
    collectionInfos,
    isLoading: isCollectionDataLoading,
  } = useNftCollectionData(collectionAddressBech, collectionAddressHex);

  const { data: nftsFull, isFetching: isNftsLoadingFull } = useNfts(
    collectionAddressHex,
    6,
    0
  );

  const { data: nftsSequencer, isFetching: isNftsLoadingSequencer } =
    useNftsSequencer(collectionAddressHex, 6, true);

  const nfts = isFullTier ? nftsFull?.items : nftsSequencer;
  const isNftsLoading = isFullTier ? isNftsLoadingFull : isNftsLoadingSequencer;

  // Enable when isFullTier is true
  const { data: activities } = useNftCollectionActivities(
    collectionAddressHex,
    10,
    0,
    undefined,
    { enabled: isFullTier }
  );

  // Enable when isFullTier is true
  const { data: mutateEvents } = useNftCollectionMutateEvents(
    collectionAddressHex,
    10,
    0,
    { enabled: isFullTier }
  );

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        options: {
          shallow: true,
        },
        pathname: "/nft-collections/[collectionAddress]/[tab]",
        query: {
          collectionAddress,
          tab: nextTab,
        },
      });
    },
    [collectionAddress, navigate, tab]
  );

  if (isCollectionDataLoading) return <Loading withBorder />;
  if (isUndefined(collection) || isUndefined(collectionInfos))
    return <ErrorFetching dataName="collection information" />;
  if (collection === null) return <InvalidCollection />;

  const { name, uri } = collection;
  const collectionDesc = extractNftDescription(collection.description);
  const {
    isUnlimited,
    royalty,
    supplies: { currentSupply, maxSupply, totalBurned, totalMinted },
  } = collectionInfos;

  const displayCollectionName =
    name.length > 20 ? `${name.slice(0, 20)}...` : name;

  const getCollectionName = () => {
    if (!name.length) return "Untitled collection";
    return isMobile ? displayCollectionName : name;
  };

  return (
    <>
      <CelatoneSeo
        pageName={
          name.length > 0
            ? `Collection – ${name.length > 20 ? displayCollectionName : name}`
            : "NFT collection detail"
        }
      />
      <Breadcrumb
        items={[
          { href: "/nft-collections", text: "NFT collections" },
          {
            text: getCollectionName(),
          },
        ]}
      />
      <Flex
        alignItems={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        w="full"
      >
        <Flex
          direction="column"
          gap={1}
          maxW="full"
          minW={{ md: "680px" }}
          my={6}
          overflow="hidden"
        >
          <Heading
            className="ellipsis"
            as="h5"
            color={name.length ? "text.main" : "text.disabled"}
            fontWeight={name.length ? "600" : "300"}
            mb={1}
            variant="h5"
          >
            {name.length ? name : "Untitled collection"}
          </Heading>
          <Flex
            alignItems={{ base: "start", md: "center" }}
            direction={{ base: "column", md: "row" }}
            gap={{ base: 0, md: 2 }}
            mt={{ base: 2, md: 0 }}
          >
            <Text color="text.dark" variant="body2">
              {isMoveEnabled ? "Collection address:" : "Collection contract:"}
            </Text>
            <Tooltip
              label={
                isMoveEnabled
                  ? "View as Account Address"
                  : "View as Contract Address"
              }
            >
              <ExplorerLink
                ampCopierSection="collection-addresss-top"
                maxWidth="full"
                textFormat="normal"
                type="contract_address"
                value={
                  isEvmEnabled ? collectionAddressHex : collectionAddressBech
                }
              />
            </Tooltip>
          </Flex>
          {isMoveEnabled && (
            <Flex align="center" gap={1}>
              <Text color="text.dark" variant="body2">
                Type:
              </Text>
              <Badge textTransform="capitalize">
                {isUnlimited ? "Unlimited supply" : "Fixed supply"}
              </Badge>
            </Flex>
          )}
        </Flex>
        {isMoveEnabled && (
          <Button
            mb={{ base: 4, md: 0 }}
            minW="140px !important"
            size={{ base: "sm", md: "md" }}
            variant="outline-primary"
            w={{ base: "full", md: "auto" }}
            onClick={() => {
              track(AmpEvent.USE_NFT_VIEW_RESOURCE_CTA, {
                amptrackSection: "nft-collection-details",
              });
              navigate({
                pathname: "/accounts/[accountAddress]/[tab]",
                query: {
                  accountAddress: collectionAddress,
                  tab: "resources",
                },
              });
            }}
          >
            View resource
          </Button>
        )}
      </Flex>
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          id={tabHeaderId}
          borderBottomWidth="1px"
          borderColor="gray.700"
          overflowX="scroll"
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
            Overview
          </CustomTab>
          <CustomTab
            count={currentSupply}
            isDisabled={!currentSupply}
            onClick={handleTabChange(TabIndex.Supplies)}
          >
            Supplies
          </CustomTab>
          <CustomTab
            count={activities?.total}
            hidden={!isMoveEnabled}
            isDisabled={(!activities?.total && isFullTier) || !isMoveEnabled}
            onClick={handleTabChange(TabIndex.Activities)}
          >
            Activities
          </CustomTab>
          <CustomTab
            count={mutateEvents?.total}
            hidden={!isFullTier}
            isDisabled={!mutateEvents?.total}
            onClick={handleTabChange(TabIndex.MutateEvents)}
          >
            Mutate events
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Flex direction="column" gap={10} pt={6}>
              <CollectionSupplyInfo
                currentSupply={currentSupply}
                maxSupply={maxSupply}
                totalBurned={totalBurned}
                totalMinted={totalMinted}
              />
              <CollectionSuppliesOverview
                isLoading={isNftsLoading}
                nfts={nfts}
                totalCount={currentSupply}
                onViewMore={handleTabChange(TabIndex.Supplies)}
              />
              <CollectionInfoSection
                activities={activities?.total}
                collectionAddressBech={collectionAddressBech}
                collectionAddressHex={collectionAddressHex}
                collectionName={name}
                description={collectionDesc}
                mutateEventes={mutateEvents?.total}
                royalty={royalty}
                uri={uri}
                onClickActivities={handleTabChange(TabIndex.Activities)}
                onClickMutateEvents={handleTabChange(TabIndex.MutateEvents)}
              />
            </Flex>
            <UserDocsLink
              cta="Read more about NFT collection"
              href="move/nfts/collection-detail"
              title="What does an NFT collection consist of?"
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <TierSwitcher
              full={
                <CollectionSuppliesFull
                  collectionAddressHex={collectionAddressHex}
                  totalSupply={currentSupply}
                />
              }
              sequencer={
                <CollectionSuppliesSequencer
                  collectionAddress={collectionAddressHex}
                />
              }
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <TierSwitcher
              full={<ActivitiesFull collectionAddress={collectionAddressHex} />}
              sequencer={
                <ActivitiesSequencer collectionAddress={collectionAddressHex} />
              }
            />
          </TabPanel>
          {isFullTier && (
            <TabPanel p={0} pt={{ base: 4, md: 0 }}>
              <CollectionMutateEvents
                collectionAddress={collectionAddressHex}
              />
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </>
  );
};

const CollectionDetails = () => {
  useTierConfig({ minTier: "sequencer" });
  const router = useRouter();
  const { isSomeValidAddress } = useValidateAddress();
  const validated = zCollectionDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_NFT_COLLECTION_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (
    !validated.success ||
    (!isSomeValidAddress(validated.data.collectionAddress) &&
      !isHexModuleAddress(validated.data.collectionAddress))
  )
    return <InvalidCollection />;

  return (
    <PageContainer>
      <CollectionDetailsBody {...validated.data} />
    </PageContainer>
  );
};

export default CollectionDetails;
