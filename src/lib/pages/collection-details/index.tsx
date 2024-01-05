import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import { AmpEvent, track, trackUseTab } from "lib/amplitude";
import { useInternalNavigate } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState, InvalidState } from "lib/components/state";
import { Tooltip } from "lib/components/Tooltip";
import {
  useCollectionActivitiesCount,
  useCollectionByCollectionAddress,
  useCollectionMutateEventsCount,
  useCollectionTotalBurnedCount,
} from "lib/services/collectionService";
import { useNftTokenListPagination } from "lib/services/nftService";
import type { HexAddr } from "lib/types";

import Activities from "./components/activities";
import CollectionInfoOverview from "./components/CollectionInfoOverview";
import CollectionSupplyOverview from "./components/CollectionSupplyOverview";
import NftsOverview from "./components/NftsOverview";
import Supplies from "./components/supplies";
import { useCollectionSupplies } from "./data";
import MutateEvents from "./mutate-events";
import { TabIndex, zCollectionDetailQueryParams } from "./types";

const tabHeaderId = "collectionDetailTab";

const CollectionDetailsBody = ({
  collectionAddress,
  tabParam,
}: {
  collectionAddress: HexAddr;
  tabParam: TabIndex;
}) => {
  const { data: collection, isLoading } =
    useCollectionByCollectionAddress(collectionAddress);

  const { data: totalBurnedCount = 0 } =
    useCollectionTotalBurnedCount(collectionAddress);

  const { data: nfts, isLoading: nftLoading } = useNftTokenListPagination(
    collectionAddress,
    6,
    0
  );

  const collectionInfo = useCollectionSupplies(collectionAddress);
  const { data: activitiesCount = 0 } =
    useCollectionActivitiesCount(collectionAddress);
  const { data: mutateEventsCount = 0 } =
    useCollectionMutateEventsCount(collectionAddress);

  const navigate = useInternalNavigate();

  const handleTabChange = useCallback(
    (nextTab: TabIndex) => () => {
      if (nextTab === tabParam) return;
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
    [collectionAddress, navigate, tabParam]
  );

  if (isLoading || !collectionInfo) return <Loading withBorder />;
  if (!collection) return <InvalidState title="Collection does not exist" />;

  const { name, description, uri } = collection;

  const { supplies, isUnlimited, royalty } = collectionInfo;
  const { maxSupply, totalMinted, currentSupply } = supplies;

  return (
    <Box>
      <Breadcrumb
        items={[
          { text: "NFT Collections", href: "/nft-collections" },
          { text: name },
        ]}
      />
      <Flex
        direction={{ base: "column", md: "row" }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Flex direction="column" my={6} gap={1}>
          <Heading as="h5" variant="h5" mb={1}>
            {name}
          </Heading>
          <Flex
            mt={{ base: 2, md: 0 }}
            gap={{ base: 0, md: 2 }}
            direction={{ base: "column", md: "row" }}
            alignItems="center"
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
          w={{ base: "full", md: "auto" }}
          size={{ base: "sm", md: "md" }}
          mb={{ base: 4, md: 0 }}
          onClick={() => {
            navigate({
              pathname: "/accounts/[accountAddress]/[tab]",
              query: { accountAddress: collectionAddress, tab: "resources" },
            });
          }}
        >
          View Resource
        </Button>
      </Flex>
      <Tabs
        index={Object.values(TabIndex).indexOf(tabParam)}
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
              <CollectionSupplyOverview
                totalBurned={totalBurnedCount}
                currentSupply={currentSupply}
                totlaMinted={totalMinted}
                maxSupply={maxSupply}
              />
              <NftsOverview
                nfts={nfts}
                totalCount={currentSupply}
                collectionAddress={collectionAddress}
                isLoading={nftLoading}
              />
              <CollectionInfoOverview
                collectionAddress={collectionAddress}
                collectionName={name}
                desc={description}
                uri={uri}
                activities={activitiesCount}
                mutateEventes={mutateEventsCount}
                royalty={royalty}
              />
            </Flex>
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Supplies
              collectionAddress={collectionAddress}
              totalSupply={currentSupply}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Activities
              collectionAddress={collectionAddress}
              totalActivitiesCount={activitiesCount ?? 0}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <MutateEvents
              totalCount={mutateEventsCount}
              collectionAddress={collectionAddress}
            />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

const CollectionDetails = observer(() => {
  const router = useRouter();
  const validated = zCollectionDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success)
      track(AmpEvent.TO_NFT_COLLECTION_DETAIL, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (!validated.success)
    return (
      <EmptyState
        message="Collection not found."
        imageVariant="not-found"
        withBorder
      />
    );
  const { collectionAddress, tab } = validated.data;

  return (
    <PageContainer>
      <CollectionDetailsBody
        tabParam={tab}
        collectionAddress={collectionAddress}
      />
    </PageContainer>
  );
});

export default CollectionDetails;
