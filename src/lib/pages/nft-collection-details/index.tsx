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
  useInternalNavigate,
  useMobile,
  useTierConfig,
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
import { useNfts } from "lib/services/nft";
import {
  useNftCollectionActivities,
  useNftCollectionByCollectionAddress,
  useNftCollectionMutateEvents,
} from "lib/services/nft-collection";
import { isHexModuleAddress } from "lib/utils";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";

import type { CollectionDetailQueryParams } from "./types";

import { CollectionInfoSection } from "./components/CollectionInfoSection";
import { CollectionSupplies } from "./components/CollectionSupplies";
import { CollectionSuppliesOverview } from "./components/CollectionSuppliesOverview";
import { CollectionSupplyInfo } from "./components/CollectionSupplyInfo";
import { ActivitiesFull, ActivitiesSequencer } from "./components/tables";
import { CollectionMutateEvents } from "./components/tables/CollectionMutateEvents";
import { useCollectionInfos } from "./data";
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

  const { data: collection, isLoading: isCollectionLoading } =
    useNftCollectionByCollectionAddress(collectionAddress);

  const { data: nfts, isLoading: isNftsLoading } = useNfts(
    collectionAddress,
    6,
    0,
    undefined
  );

  const { collectionInfos, isLoading: isCollectionInfosLoading } =
    useCollectionInfos(collectionAddress);

  const { data: activities } = useNftCollectionActivities(
    collectionAddress,
    10,
    0,
    undefined,
    { enabled: isFullTier }
  );
  const { data: mutateEvents } = useNftCollectionMutateEvents(
    collectionAddress,
    10,
    0,
    { enabled: isFullTier }
  );

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
  if (!collection) return <InvalidCollection />;

  const { name, description, uri } = collection;
  const {
    supplies: { maxSupply, totalMinted, currentSupply },
    isUnlimited,
    royalty,
  } = collectionInfos;
  const totalBurned = totalMinted - currentSupply;

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
          { text: "NFT collections", href: "/nft-collections" },
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
              Collection address:
            </Text>
            <Tooltip label="View as Account Address">
              <ExplorerLink
                ampCopierSection="collection-addresss-top"
                fixedHeight={false}
                maxWidth="full"
                textFormat="normal"
                type="contract_address"
                value={collectionAddress}
              />
            </Tooltip>
          </Flex>
          <Flex align="center" gap={1}>
            <Text color="text.dark" variant="body2">
              Type:
            </Text>
            <Badge textTransform="capitalize">
              {isUnlimited ? "Unlimited supply" : "Fixed supply"}
            </Badge>
          </Flex>
        </Flex>
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
          borderStyle="solid"
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
            isDisabled={!activities?.total}
            onClick={handleTabChange(TabIndex.Activities)}
          >
            Activities
          </CustomTab>
          {isFullTier && (
            <CustomTab
              count={mutateEvents?.total}
              isDisabled={!mutateEvents?.total}
              onClick={handleTabChange(TabIndex.MutateEvents)}
            >
              Mutate events
            </CustomTab>
          )}
        </TabList>
        <TabPanels>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <Flex direction="column" gap={10}>
              <CollectionSupplyInfo
                currentSupply={currentSupply}
                maxSupply={maxSupply}
                totalBurned={totalBurned}
                totalMinted={totalMinted}
              />
              <CollectionSuppliesOverview
                isLoading={isNftsLoading}
                nfts={nfts?.items}
                totalCount={currentSupply}
                onViewMore={handleTabChange(TabIndex.Supplies)}
              />
              <CollectionInfoSection
                activities={activities?.total}
                collectionAddress={collectionAddress}
                collectionName={name}
                desc={description}
                mutateEventes={mutateEvents?.total}
                royalty={royalty}
                uri={uri}
                onClickActivities={handleTabChange(TabIndex.Activities)}
                onClickMutateEvents={handleTabChange(TabIndex.MutateEvents)}
              />
            </Flex>
            <UserDocsLink
              title="What does an NFT collection consist of?"
              cta="Read more about NFT collection"
              href="move/nfts/collection-detail"
              title="What does an NFT Collection consist of?"
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <CollectionSupplies
              collectionAddress={collectionAddress}
              totalSupply={currentSupply}
            />
          </TabPanel>
          <TabPanel p={0} pt={{ base: 4, md: 0 }}>
            <TierSwitcher
              full={<ActivitiesFull collectionAddress={collectionAddress} />}
              sequencer={
                <ActivitiesSequencer collectionAddress={collectionAddress} />
              }
            />
          </TabPanel>
          {isFullTier && (
            <TabPanel p={0} pt={{ base: 4, md: 0 }}>
              <CollectionMutateEvents collectionAddress={collectionAddress} />
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
