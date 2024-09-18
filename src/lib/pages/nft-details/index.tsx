/* eslint-disable complexity */
import {
  Divider,
  Flex,
  Image,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile, useTierConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { JsonLink } from "lib/components/JsonLink";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { InvalidState } from "lib/components/state";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { Tooltip } from "lib/components/Tooltip";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import {
  useMetadata,
  useNftByNftAddress,
  useNftMutateEvents,
  useNftTransactions,
} from "lib/services/nft";
import { useCollectionByCollectionAddress } from "lib/services/nft-collection";

import {
  Attributes,
  CollectionInfo,
  DescriptionBox,
  MintInfo,
  NftInfoItem,
  NftMutateEvents,
  Title,
  TxsFull,
  TxsSequencer,
  ViewResourceButton,
} from "./components";
import type { NftDetailQueryParams } from "./types";
import { zNftDetailQueryParams } from "./types";

const InvalidNft = () => <InvalidState title="NFT does not exist" />;

const NftDetailsBody = ({
  collectionAddress,
  nftAddress,
}: NftDetailQueryParams) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();

  const { data: collection, isLoading: isCollectionLoading } =
    useCollectionByCollectionAddress(collectionAddress);

  const { data: nft, isLoading: isNftLoading } = useNftByNftAddress(
    collectionAddress,
    nftAddress
  );

  const { data: transactions } = useNftTransactions(10, 0, nftAddress, {
    enabled: isFullTier,
  });

  const totalTxs = isFullTier && transactions ? transactions?.total : undefined;

  const { data: mutateEvents } = useNftMutateEvents(nftAddress, 10, 0, {
    enabled: isFullTier,
  });
  const { data: metadata } = useMetadata(nft?.uri ?? "");

  if (isCollectionLoading || isNftLoading) return <Loading />;
  if (!collection || !nft) return <InvalidNft />;

  const { name: collectionName, description: collectionDesc } = collection;
  const { tokenId, description, uri, ownerAddress, isBurned } = nft;

  const displayCollectionName =
    collectionName.length > 20
      ? `${collectionName.slice(0, 20)}...`
      : collectionName;

  return (
    <>
      <CelatoneSeo pageName={tokenId ? `NFT – ${tokenId}` : "NFT Details"} />
      <Breadcrumb
        items={[
          { text: "NFT Collections", href: "/nft-collections" },
          {
            text: displayCollectionName,
            href: `/nft-collections/${collectionAddress}`,
          },
          { text: tokenId },
        ]}
      />
      <Flex direction="column" gap={8}>
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 8 }}
          mt={6}
        >
          <Flex
            direction="column"
            gap={6}
            minW={{ md: "360px" }}
            maxW={{ md: "360px" }}
          >
            {isMobile && (
              <Title
                collectionAddress={collectionAddress}
                displayCollectionName={displayCollectionName}
                tokenId={tokenId}
                nftAddress={nftAddress}
                isBurned={isBurned}
              />
            )}
            <div
              style={{
                width: "100%",
                height: "0",
                paddingTop: "100%",
                position: "relative",
              }}
            >
              <Image
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "8px",
                  objectFit: "contain",
                  backgroundPosition: "center",
                }}
                background="gray.900"
                borderRadius="8px"
                src={metadata?.image}
                fallbackSrc={NFT_IMAGE_PLACEHOLDER}
                fallbackStrategy="beforeLoadOrError"
              />
            </div>
            {!isMobile && (
              <>
                <DescriptionBox description={description} />
                <CollectionInfo
                  collectionAddress={collectionAddress}
                  collectionName={collectionName}
                  description={collectionDesc}
                />
              </>
            )}
          </Flex>
          <Flex
            direction="column"
            gap={{ base: 6, md: 12 }}
            w="full"
            overflow="hidden"
          >
            <Flex direction="column" gap={4}>
              <Flex
                justifyContent="space-between"
                align="center"
                direction={{ base: "column", md: "row" }}
              >
                {!isMobile && (
                  <Title
                    collectionAddress={collectionAddress}
                    displayCollectionName={displayCollectionName}
                    tokenId={tokenId}
                    nftAddress={nftAddress}
                    isBurned={isBurned}
                  />
                )}
              </Flex>
              <Flex direction="column" gap={1} w="full">
                {metadata?.name && (
                  <NftInfoItem label="NFT Name">
                    <Text variant="body2" color="text.main">
                      {metadata.name}
                    </Text>
                  </NftInfoItem>
                )}
                <NftInfoItem label="NFT Address">
                  <Tooltip label="View as Account Address">
                    <Flex>
                      <ExplorerLink
                        value={nftAddress}
                        type="user_address"
                        textFormat="normal"
                        maxWidth="full"
                        ampCopierSection="nft-address-nft-detail-top"
                        fixedHeight={false}
                      />
                    </Flex>
                  </Tooltip>
                </NftInfoItem>
                {!isBurned && (
                  <NftInfoItem label="Holder">
                    <ExplorerLink
                      value={ownerAddress}
                      type="user_address"
                      textFormat="normal"
                      maxWidth="full"
                      ampCopierSection="holder-address-nft-detail-top"
                      fixedHeight={false}
                    />
                  </NftInfoItem>
                )}
                <NftInfoItem label="Token URI" isCentered={false}>
                  <JsonLink uri={uri} type="token_uri" />
                </NftInfoItem>
              </Flex>
            </Flex>
            {isMobile && (
              <>
                <DescriptionBox description={description} />
                <ViewResourceButton nftAddress={nftAddress} />
              </>
            )}
            <Flex direction="column" gap={{ base: 8, md: 12 }}>
              <MintInfo nftAddress={nftAddress} />
              {metadata?.attributes && (
                <Attributes
                  attributes={metadata.attributes}
                  nftAddress={nftAddress}
                  tokenId={tokenId}
                />
              )}
            </Flex>
            {isMobile && (
              <>
                <Divider width="100%" color="gray.700" />
                <CollectionInfo
                  collectionAddress={collectionAddress}
                  collectionName={collectionName}
                  description={collectionDesc}
                />
              </>
            )}
          </Flex>
        </Flex>
        <Divider width="100%" color="gray.700" />
        <Tabs
          isLazy
          lazyBehavior="keepMounted"
          onChange={(tab) =>
            track(AmpEvent.USE_SUBTAB, {
              currentTab: !tab ? "transactions" : "mutate-events",
            })
          }
        >
          <TabList
            marginBottom="32px"
            borderBottom="1px solid"
            borderColor="gray.700"
            overflowX="scroll"
          >
            <CustomTab count={totalTxs}>Transactions</CustomTab>
            {isFullTier && (
              <CustomTab
                count={mutateEvents?.total}
                isDisabled={!mutateEvents?.total}
              >
                Mutate Events
              </CustomTab>
            )}
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <TierSwitcher
                full={<TxsFull nftAddress={nftAddress} />}
                sequencer={<TxsSequencer nftAddress={nftAddress} />}
              />
            </TabPanel>
            {isFullTier && (
              <TabPanel p={0}>
                <NftMutateEvents nftAddress={nftAddress} />
              </TabPanel>
            )}
          </TabPanels>
        </Tabs>
        <UserDocsLink
          title="What is a NFT?"
          cta="Read more about NFT"
          href="move/nfts/detail-page"
        />
      </Flex>
    </>
  );
};

const NftDetails = observer(() => {
  useTierConfig({ minTier: "sequencer" });
  const router = useRouter();
  const validated = zNftDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success) track(AmpEvent.TO_NFT_DETAILS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (!validated.success) return <InvalidNft />;
  return (
    <PageContainer>
      <NftDetailsBody {...validated.data} />
    </PageContainer>
  );
});

export default NftDetails;
