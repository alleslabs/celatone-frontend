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
import { useNftCollectionByCollectionAddress } from "lib/services/nft-collection";

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
    useNftCollectionByCollectionAddress(collectionAddress);

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

  const { description: collectionDesc, name: collectionName } = collection;
  const { description, isBurned, ownerAddress, tokenId, uri } = nft;

  const displayCollectionName =
    collectionName.length > 20
      ? `${collectionName.slice(0, 20)}...`
      : collectionName;

  return (
    <>
      <CelatoneSeo pageName={tokenId ? `NFT – ${tokenId}` : "NFT Details"} />
      <Breadcrumb
        items={[
          { href: "/nft-collections", text: "NFT Collections" },
          {
            href: `/nft-collections/${collectionAddress}`,
            text: displayCollectionName,
          },
          { text: tokenId },
        ]}
      />
      <Flex gap={8} direction="column">
        <Flex
          gap={{ base: 2, md: 8 }}
          mt={6}
          direction={{ base: "column", md: "row" }}
        >
          <Flex
            gap={6}
            maxW={{ md: "360px" }}
            minW={{ md: "360px" }}
            direction="column"
          >
            {isMobile && (
              <Title
                isBurned={isBurned}
                nftAddress={nftAddress}
                collectionAddress={collectionAddress}
                displayCollectionName={displayCollectionName}
                tokenId={tokenId}
              />
            )}
            <div
              style={{
                height: "0",
                paddingTop: "100%",
                position: "relative",
                width: "100%",
              }}
            >
              <Image
                style={{
                  backgroundPosition: "center",
                  borderRadius: "8px",
                  height: "100%",
                  left: 0,
                  objectFit: "contain",
                  position: "absolute",
                  top: 0,
                  width: "100%",
                }}
                fallbackSrc={NFT_IMAGE_PLACEHOLDER}
                fallbackStrategy="beforeLoadOrError"
                src={metadata?.image}
                background="gray.900"
                borderRadius="8px"
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
            gap={{ base: 6, md: 12 }}
            w="full"
            direction="column"
            overflow="hidden"
          >
            <Flex gap={4} direction="column">
              <Flex
                align="center"
                direction={{ base: "column", md: "row" }}
                justifyContent="space-between"
              >
                {!isMobile && (
                  <Title
                    isBurned={isBurned}
                    nftAddress={nftAddress}
                    collectionAddress={collectionAddress}
                    displayCollectionName={displayCollectionName}
                    tokenId={tokenId}
                  />
                )}
              </Flex>
              <Flex gap={1} w="full" direction="column">
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
                        maxWidth="full"
                        fixedHeight={false}
                        type="user_address"
                        value={nftAddress}
                        ampCopierSection="nft-address-nft-detail-top"
                        textFormat="normal"
                      />
                    </Flex>
                  </Tooltip>
                </NftInfoItem>
                {!isBurned && (
                  <NftInfoItem label="Holder">
                    <ExplorerLink
                      maxWidth="full"
                      fixedHeight={false}
                      type="user_address"
                      value={ownerAddress}
                      ampCopierSection="holder-address-nft-detail-top"
                      textFormat="normal"
                    />
                  </NftInfoItem>
                )}
                <NftInfoItem isCentered={false} label="Token URI">
                  <JsonLink type="token_uri" uri={uri} />
                </NftInfoItem>
              </Flex>
            </Flex>
            {isMobile && (
              <>
                <DescriptionBox description={description} />
                <ViewResourceButton nftAddress={nftAddress} />
              </>
            )}
            <Flex gap={{ base: 8, md: 12 }} direction="column">
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
            borderBottom="1px solid"
            borderColor="gray.700"
            marginBottom="32px"
            overflowX="scroll"
          >
            <CustomTab count={totalTxs}>Transactions</CustomTab>
            {isFullTier && (
              <CustomTab
                isDisabled={!mutateEvents?.total}
                count={mutateEvents?.total}
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
          cta="Read more about NFT"
          title="What is a NFT?"
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
