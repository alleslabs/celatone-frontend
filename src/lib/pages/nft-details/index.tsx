import {
  Divider,
  Flex,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { useMobile, useMoveConfig, useTierConfig } from "lib/app-provider";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CopyLink } from "lib/components/CopyLink";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import { NftImage } from "lib/components/nft/NftImage";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { InvalidState } from "lib/components/state";
import { TierSwitcher } from "lib/components/TierSwitcher";
import { Tooltip } from "lib/components/Tooltip";
import { UserDocsLink } from "lib/components/UserDocsLink";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data";
import { useFormatAddresses } from "lib/hooks/useFormatAddresses";
import {
  useNftByTokenId,
  useNftGlyphImage,
  useNftMetadata,
  useNftMutateEvents,
  useNftTransactions,
} from "lib/services/nft";
import { useNftCollectionByCollectionAddress } from "lib/services/nft-collection";
import { zHexAddr32 } from "lib/types";
import { zBechAddr32 } from "lib/types";
import { truncate } from "lib/utils";
import { extractNftDescription } from "lib/utils/nftDescription";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import type { NftDetailQueryParams } from "./types";

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
import { zNftDetailQueryParams } from "./types";

const InvalidNft = () => <InvalidState title="NFT does not exist" />;

const NftDetailsBody = ({
  collectionAddress,
  tokenId,
}: NftDetailQueryParams) => {
  const isMobile = useMobile();
  const { isFullTier } = useTierConfig();
  const { enabled: isMoveEnabled } = useMoveConfig({ shouldRedirect: false });
  const formatAddresses = useFormatAddresses();

  const formattedAddresses = formatAddresses(collectionAddress);
  const collectionAddressBech = zBechAddr32.parse(formattedAddresses.address);
  const collectionAddressHex = zHexAddr32.parse(formattedAddresses.hex);

  const { data: collection, isLoading: isCollectionLoading } =
    useNftCollectionByCollectionAddress(collectionAddressHex);

  const { data: nft, isLoading: isNftLoading } = useNftByTokenId(
    collectionAddressHex,
    collectionAddressBech,
    tokenId
  );

  // Note: NFT Address is only available in Move VM
  const nftAddress = isMoveEnabled ? zHexAddr32.parse(tokenId) : undefined;

  // Note: NFT Txs total count and Mutate Events are enabled only if Move and full tier are enabled
  const { data: transactions } = useNftTransactions(nftAddress, 10, 0, {
    enabled: isFullTier && !!nftAddress,
  });
  const totalTxs = isFullTier && transactions ? transactions?.total : undefined;

  const { data: mutateEvents } = useNftMutateEvents(nftAddress, 10, 0, {
    enabled: isFullTier && !!nftAddress,
  });

  const { data: metadata } = useNftMetadata(nft);
  const nftImage = useNftGlyphImage(nft);

  if (isCollectionLoading || isNftLoading) return <Loading />;
  if (!collection || !nft) return <InvalidNft />;

  const { name: collectionName } = collection;
  const { isBurned, ownerAddress, uri } = nft;
  const description = extractNftDescription(
    nft.description || metadata?.description || ""
  );
  const collectionDesc = extractNftDescription(collection.description);

  const displayCollectionName =
    collectionName.length > 20
      ? `${collectionName.slice(0, 20)}...`
      : collectionName;

  return (
    <>
      <CelatoneSeo pageName={tokenId ? `NFT – ${tokenId}` : "NFT Details"} />
      <Breadcrumb
        items={[
          { href: "/nft-collections", text: "NFT collections" },
          {
            href: `/nft-collections/${collectionAddress}`,
            text: displayCollectionName,
          },
          { text: truncate(tokenId) },
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
            maxW={{ md: "360px" }}
            minW={{ md: "360px" }}
          >
            {isMobile && (
              <Title
                collectionAddress={collectionAddress}
                displayCollectionName={displayCollectionName}
                isBurned={isBurned}
                nftAddress={nftAddress}
                tokenId={nft.tokenId}
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
              <NftImage
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
                background="gray.900"
                borderRadius="8px"
                fallbackSrc={NFT_IMAGE_PLACEHOLDER}
                fallbackStrategy="beforeLoadOrError"
                src={nftImage}
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
            overflow="hidden"
            w="full"
          >
            <Flex direction="column" gap={4}>
              <Flex
                align="center"
                direction={{ base: "column", md: "row" }}
                justifyContent="space-between"
              >
                {!isMobile && (
                  <Title
                    collectionAddress={collectionAddress}
                    displayCollectionName={displayCollectionName}
                    isBurned={isBurned}
                    nftAddress={nftAddress}
                    nftName={metadata?.name}
                    tokenId={nft.tokenId}
                  />
                )}
              </Flex>
              <Flex direction="column" gap={1} w="full">
                {metadata?.name && (
                  <NftInfoItem label="NFT Name">
                    <Text color="text.main" variant="body2">
                      {metadata.name}
                    </Text>
                  </NftInfoItem>
                )}
                {nftAddress ? (
                  <NftInfoItem label="NFT Address">
                    <Tooltip label="View as Account Address">
                      <Flex>
                        <ExplorerLink
                          ampCopierSection="nft-address-nft-detail-top"
                          maxWidth="full"
                          textFormat="normal"
                          type="user_address"
                          value={nftAddress}
                        />
                      </Flex>
                    </Tooltip>
                  </NftInfoItem>
                ) : (
                  <NftInfoItem isCentered={false} label="NFT Token ID">
                    <Text
                      color="text.main"
                      variant="body2"
                      wordBreak="break-all"
                    >
                      {tokenId}
                    </Text>
                  </NftInfoItem>
                )}
                {!isBurned && (
                  <NftInfoItem label="Holder">
                    <ExplorerLink
                      ampCopierSection="holder-address-nft-detail-top"
                      maxWidth="full"
                      textFormat="normal"
                      type="user_address"
                      value={ownerAddress}
                    />
                  </NftInfoItem>
                )}
                <NftInfoItem isCentered={false} label="Token URI">
                  <CopyLink type="token_uri" value={uri} />
                </NftInfoItem>
              </Flex>
            </Flex>
            {isMobile && (
              <>
                <DescriptionBox description={description} />
                {nftAddress && <ViewResourceButton nftAddress={nftAddress} />}
              </>
            )}
            <Flex direction="column" gap={{ base: 8, md: 12 }}>
              {nftAddress && <MintInfo nftAddress={nftAddress} />}
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
                <Divider color="gray.700" width="100%" />
                <CollectionInfo
                  collectionAddress={collectionAddress}
                  collectionName={collectionName}
                  description={collectionDesc}
                />
              </>
            )}
          </Flex>
        </Flex>
        {/* Support only Move VM and full tier */}
        {nftAddress && (
          <>
            <Divider color="gray.700" width="100%" />
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
                borderBottomWidth="1px"
                borderColor="gray.700"
                marginBottom="32px"
                overflowX="scroll"
              >
                <CustomTab count={totalTxs}>Transactions</CustomTab>
                <CustomTab
                  count={mutateEvents?.total}
                  hidden={!isFullTier}
                  isDisabled={!mutateEvents?.total}
                >
                  Mutate Events
                </CustomTab>
              </TabList>
              <TabPanels>
                <TabPanel p={0}>
                  <TierSwitcher
                    full={<TxsFull nftAddress={nftAddress} />}
                    sequencer={<TxsSequencer nftAddress={nftAddress} />}
                  />
                </TabPanel>
                <TabPanel p={0}>
                  <NftMutateEvents nftAddress={nftAddress} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
        <UserDocsLink
          cta="Read more about NFT"
          href="move/nfts/detail-page"
          title="What is a NFT?"
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
