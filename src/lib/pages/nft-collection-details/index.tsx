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
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { Tooltip } from "lib/components/Tooltip";
import { UserDocsLink } from "lib/components/UserDocsLink";
import {
  useCollectionActivitiesCount,
  useCollectionByCollectionAddress,
  useCollectionMutateEventsCount,
  useCollectionTotalBurnedCount,
  useNfts,
} from "lib/services/nft";
import { isHexModuleAddress } from "lib/utils";

import { CollectionInfoSection } from "./components/CollectionInfoSection";
import { CollectionSupplies } from "./components/CollectionSupplies";
import { CollectionSuppliesOverview } from "./components/CollectionSuppliesOverview";
import { CollectionSupplyInfo } from "./components/CollectionSupplyInfo";
import { Activities } from "./components/tables";
import { CollectionMutateEvents } from "./components/tables/CollectionMutateEvents";
import { useCollectionInfos } from "./data";
import type { CollectionDetailQueryParams } from "./types";
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

  const { data: collection, isLoading: isCollectionLoading } =
    useCollectionByCollectionAddress(collectionAddress);
  const { data: totalBurnedCount = 0 } =
    useCollectionTotalBurnedCount(collectionAddress);
  const { data: nfts, isLoading: isNftLoading } = useNfts(
    collectionAddress,
    6,
    0
  );

  const { collectionInfos, isLoading: isCollectionInfosLoading } =
    useCollectionInfos(collectionAddress);
  const { data: activitiesCount = 0 } =
    useCollectionActivitiesCount(collectionAddress);
  const { data: mutateEventsCount = 0 } =
    useCollectionMutateEventsCount(collectionAddress);

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tab) return;
      trackUseTab(nextTab);
      navigate({
        pathname: "/nft-collections/[collectionAddress]/[tab]",
        query: {
          collectionAddress,
          tab: nextTab,
        },
        options: {
          shallow: true,
        },
      });
    },
    [collectionAddress, navigate, tab]
  );

  if (isCollectionLoading || isCollectionInfosLoading)
    return <Loading withBorder />;
  if (!collection || !collectionInfos)
    return <ErrorFetching dataName="collection information" />;
  if (!collection.data) return <InvalidCollection />;

  const { name, description, uri } = collection.data;
  const {
    supplies: { maxSupply, totalMinted, currentSupply },
    isUnlimited,
    royalty,
  } = collectionInfos;

  const displayCollectionName =
    name.length > 20 ? `${name.slice(0, 20)}...` : name;

  return (
    <>
      <Breadcrumb
        items={[
          { text: "NFT Collections", href: "/nft-collections" },
          { text: isMobile ? displayCollectionName : name },
        ]}
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems={{ base: "start", md: "center" }}
        w="full"
      >
        <Flex
          direction="column"
          my={6}
          gap={1}
          overflow="hidden"
          minW={{ md: "680px" }}
          maxW="full"
        >
          <Heading as="h5" variant="h5" mb={1} className="ellipsis">
            {name}
          </Heading>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
            alignItems={{ base: "start", md: "center" }}
          >
            <Text color="text.dark" variant="body2">
              Collection:
            </Text>
            <Tooltip label="View as Account Address">
              <Flex>
                <ExplorerLink
                  value={collectionAddress}
                  type="user_address"
                  textFormat="normal"
                  maxWidth="full"
                  fixedHeight={false}
                  ampCopierSection="collection-addresss-top"
                />
              </Flex>
            </Tooltip>
          </Flex>
          <Flex gap={1} align="center">
            <Text color="text.dark" variant="body2">
              Type:
            </Text>
            <Badge textTransform="capitalize">
              {isUnlimited ? "Unlimited Supply" : "Fixed Supply"}
            </Badge>
          </Flex>
        </Flex>
        <Button
          variant="outline-primary"
          minW="140px !important"
          w={{ base: "full", md: "auto" }}
          size={{ base: "sm", md: "md" }}
          mb={{ base: 4, md: 0 }}
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
          View Resource
        </Button>
      </Flex>
      <Tabs
        index={Object.values(TabIndex).indexOf(tab)}
        isLazy
        lazyBehavior="keepMounted"
      >
        <TabList
          borderBottom="1px solid"
          borderColor="gray.700"
          overflowX="scroll"
          id={tabHeaderId}
        >
          <CustomTab onClick={handleTabChange(TabIndex.Overview)}>
            Overview
          </CustomTab>
          <CustomTab
            count={currentSupply}
            onClick={handleTabChange(TabIndex.Supplies)}
            isDisabled={!currentSupply}
          >
            Supplies
          </CustomTab>
          <CustomTab
            count={activitiesCount}
            onClick={handleTabChange(TabIndex.Activities)}
            isDisabled={!activitiesCount}
          >
            Activities
          </CustomTab>
          <CustomTab
            count={mutateEventsCount}
            onClick={handleTabChange(TabIndex.MutateEvents)}
            isDisabled={!mutateEventsCount}
          >
            Mutate Events
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Flex direction="column" gap={10}>
              <CollectionSupplyInfo
                totalBurned={totalBurnedCount}
                totalMinted={totalMinted}
                currentSupply={currentSupply}
                maxSupply={maxSupply}
              />
              <CollectionSuppliesOverview
                totalCount={currentSupply}
                nfts={nfts}
                isLoading={isNftLoading}
                onViewMore={handleTabChange(TabIndex.Supplies)}
              />
              <CollectionInfoSection
                collectionAddress={collectionAddress}
                collectionName={name}
                desc={description}
                uri={uri}
                activities={activitiesCount}
                mutateEventes={mutateEventsCount}
                royalty={royalty}
                onClickActivities={handleTabChange(TabIndex.Activities)}
                onClickMutateEvents={handleTabChange(TabIndex.MutateEvents)}
              />
            </Flex>
            <UserDocsLink
              title="What does an NFT Collection consist of?"
              cta="Read more about NFT Collection"
              href="move/nfts/collection-detail"
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <CollectionSupplies
              collectionAddress={collectionAddress}
              totalSupply={currentSupply}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Activities
              collectionAddress={collectionAddress}
              totalCount={activitiesCount ?? 0}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <CollectionMutateEvents
              totalCount={mutateEventsCount}
              collectionAddress={collectionAddress}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

const CollectionDetails = () => {
  const router = useRouter();
  const validated = zCollectionDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_NFT_COLLECTION_DETAILS, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (
    !validated.success ||
    !isHexModuleAddress(validated.data.collectionAddress)
  )
    return <InvalidCollection />;

  return (
    <PageContainer>
      <CollectionDetailsBody {...validated.data} />
    </PageContainer>
  );
};

export default CollectionDetails;
