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
import { useMobile } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { JsonLink } from "lib/components/JsonLink";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { ErrorFetching, InvalidState } from "lib/components/state";
import { Tooltip } from "lib/components/Tooltip";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import {
  useCollectionByCollectionAddress,
  useMetadata,
  useNftByNftAddress,
  useNftMutateEventsCount,
  useNftTransactionsCount,
} from "lib/services/nft";

import {
  Attributes,
  CollectionInfo,
  DescriptionBox,
  MintInfo,
  NftInfoItem,
  NftMutateEvents,
  Title,
  Txs,
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

  const { data: collection, isLoading: isCollectionLoading } =
    useCollectionByCollectionAddress(collectionAddress);
  const { data: nft, isLoading: isNftLoading } = useNftByNftAddress(
    collectionAddress,
    nftAddress
  );
  const { data: txCount = 0 } = useNftTransactionsCount(nftAddress);
  const { data: mutateEventsCount = 0 } = useNftMutateEventsCount(nftAddress);
  const { data: metadata } = useMetadata(nft?.data?.uri ?? "");

  if (isCollectionLoading || isNftLoading) return <Loading />;
  if (!collection || !nft) return <ErrorFetching dataName="NFT information" />;
  if (!collection.data || !nft.data) return <InvalidNft />;

  const { name: collectionName, description: collectionDesc } = collection.data;
  const { tokenId, description, uri, ownerAddress, isBurned } = nft.data;

  const displayCollectionName =
    collectionName.length > 20
      ? `${collectionName.slice(0, 20)}...`
      : collectionName;

  return (
    <>
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
          <Flex direction="column" gap={6} maxW={{ md: "360px" }}>
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
                  objectFit: "cover",
                  backgroundPosition: "center",
                }}
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
            <CustomTab count={txCount}>Transactions</CustomTab>
            <CustomTab
              count={mutateEventsCount}
              isDisabled={!mutateEventsCount}
            >
              Mutate Events
            </CustomTab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <Txs nftAddress={nftAddress} totalData={txCount} />
            </TabPanel>
            <TabPanel p={0}>
              <NftMutateEvents
                nftAddress={nftAddress}
                totalData={mutateEventsCount}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
        <UserDocsLink
          title="What is a NFT?"
          cta="View more about NFT"
          href="move/nft/detail-page"
        />
      </Flex>
    </>
  );
};

const NftDetails = observer(() => {
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
