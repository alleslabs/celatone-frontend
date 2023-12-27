import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  Stack,
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
import { EmptyState } from "lib/components/state";
import {
  useCollectionActivitiesCount,
  useCollectionByCollectionAddress,
  useCollectionMutateEventsCount,
  useCollectionTotalBurnedCount,
} from "lib/services/collectionService";
import { useNFTTokenListPagination } from "lib/services/nftService";

import Activities from "./components/activities";
import CollectionInfoOverview from "./components/CollectionInfoOverview";
import CollectionSupplyOverview from "./components/CollectionSupplyOverview";
import NFTsOverview from "./components/NFTsOverview";
import RelatedProposals from "./components/related-proposals";
import Supplies from "./components/supplies";
import { useCollectionSupplies } from "./data";
import MutateEvents from "./mutate-events";
import { TabIndex, zCollectionDetailQueryParams } from "./types";

const tabHeaderId = "collectionDetailTab";

const CollectionDetailsBody = ({
  collectionAddress,
  tabParam,
}: {
  collectionAddress: string;
  tabParam: TabIndex;
}) => {
  const { data: collection, isLoading } =
    useCollectionByCollectionAddress(collectionAddress);

  const { data: totalBurnedCount = 0 } =
    useCollectionTotalBurnedCount(collectionAddress);

  const { data: nfts, isLoading: nftLoading } = useNFTTokenListPagination(
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
        pathname: "/collections/[collectionAddress]/[tab]",
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
  if (!collection) return <EmptyState message="Not found collection" />;

  const { name, description, uri } = collection;

  const { supplies, isUnlimited, royalty } = collectionInfo;
  const { maxSupply, totalMinted, currentSupply } = supplies;

  return (
    <Box>
      <Breadcrumb
        items={[{ text: "NFTs", href: "/collections" }, { text: name }]}
      />
      <Stack my="24px" spacing="4px">
        <Heading as="h5" variant="h5">
          {name}
        </Heading>

        <Flex gap="8px" fontSize="14px" align="center">
          <Text color="gray.400">Collection:</Text>
          <ExplorerLink type="user_address" value={collectionAddress} />
        </Flex>

        <Flex gap="8px" fontSize="14px">
          <Text color="gray.400">Type:</Text>
          <Badge textTransform="capitalize">
            {isUnlimited ? "Unlimited Supply" : "Fixed Supply"}
          </Badge>
        </Flex>
      </Stack>

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
            onClick={handleTabChange(TabIndex.Supplies)}
            isDisabled={!currentSupply}
          >
            Supplies <Badge ml="6px">{currentSupply}</Badge>
          </CustomTab>
          <CustomTab
            onClick={handleTabChange(TabIndex.Activities)}
            isDisabled={!activitiesCount}
          >
            Activities <Badge ml="6px">{activitiesCount}</Badge>
          </CustomTab>
          <CustomTab
            onClick={handleTabChange(TabIndex.RelatedProposals)}
            isDisabled
          >
            Related Proposals <Badge ml="6px">{0}</Badge>
          </CustomTab>
          <CustomTab
            onClick={handleTabChange(TabIndex.MutateEvents)}
            isDisabled={!mutateEventsCount}
          >
            Mutate Events <Badge ml="6px">{mutateEventsCount}</Badge>
          </CustomTab>
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Stack gap="40px">
              <CollectionSupplyOverview
                totalBurned={totalBurnedCount}
                currentSupply={currentSupply}
                totlaMinted={totalMinted}
                maxSupply={maxSupply}
              />
              <Divider width="100%" color="gray.700" />
              <NFTsOverview
                nfts={nfts}
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
            </Stack>
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
            <RelatedProposals />
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
      track(AmpEvent.TO_COLLECTION_DETAIL, { tab: validated.data.tab });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (!validated.success)
    return (
      <EmptyState message="Collection not found." imageVariant="not-found" />
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
