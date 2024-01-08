import {
  Flex,
  Image,
  Text,
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Divider,
  Button,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useInternalNavigate, useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { Copier } from "lib/components/copy";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState, InvalidState } from "lib/components/state";
import { Tooltip } from "lib/components/Tooltip";
import { NFT_IMAGE_PLACEHOLDER } from "lib/data/image";
import { useCollectionByCollectionAddress } from "lib/services/collectionService";
import {
  useMetadata,
  useNftInfo,
  useNftMutateEventsCount,
  useNftTransactionsCount,
} from "lib/services/nftService";
import type { HexAddr, Option } from "lib/types";

import Attributes from "./components/Attributes";
import CollectionInfo from "./components/CollectionInfo";
import MintInfo from "./components/MintInfo";
import MutateEvents from "./mutate-events";
import Txs from "./transaction";
import { zNftDetailQueryParams } from "./types";

const NftTitle = ({
  collectionAddress,
  displayCollectionName,
  tokenId,
}: {
  collectionAddress: HexAddr;
  displayCollectionName: string;
  tokenId: string;
}) => (
  <Flex direction="column">
    <AppLink href={`/nft-collections/${collectionAddress}`}>
      <Text color="primary.main" fontSize="16px" fontWeight={700}>
        {displayCollectionName}
      </Text>
    </AppLink>
    <Heading variant="h5" as="h5">
      {tokenId}
    </Heading>
  </Flex>
);

const NftInfoItem = ({
  children,
  label,
  isCentered = true,
}: {
  children: ReactNode;
  label: string;
  isCentered?: boolean;
}) => (
  <Flex
    gap={{ base: 1, md: 2 }}
    mb={{ base: 2, md: 0 }}
    direction={{ base: "column", md: "row" }}
    align={{ base: "start", md: isCentered ? "center" : "start" }}
    height={{ md: 6 }}
  >
    <Text variant="body2" color="gray.400" fontWeight={500} whiteSpace="nowrap">
      {label}:
    </Text>
    {children}
  </Flex>
);

const DescriptionBox = ({ description }: { description: Option<string> }) => (
  <Box fontSize="14px" p="16px" borderRadius="8px" backgroundColor="gray.900">
    <Text mb="8px" fontWeight={700}>
      Description
    </Text>
    {description ? (
      <Text>{description}</Text>
    ) : (
      <Text color="text.dark">No description was provided by the creator.</Text>
    )}
  </Box>
);

const NftDetailsBody = ({
  collectionAddress,
  nftAddress,
}: {
  collectionAddress: HexAddr;
  nftAddress: HexAddr;
}) => {
  const navigate = useInternalNavigate();
  const { data: collection, isLoading: collectionLoading } =
    useCollectionByCollectionAddress(collectionAddress);
  const { data: nft, isLoading: nftLoading } = useNftInfo(
    collectionAddress,
    nftAddress
  );
  const { data: txCount = 0 } = useNftTransactionsCount(nftAddress);
  const { data: mutateEventsCount = 0 } = useNftMutateEventsCount(nftAddress);
  const { data: metadata } = useMetadata(nft?.uri ?? "");
  const isMobile = useMobile();

  if (collectionLoading || nftLoading) return <Loading />;
  if (!collection || !nft) return <InvalidState title="NFT does not exist" />;

  const { name: collectionName, description: collectionDesc } = collection;
  const { tokenId, description, uri, ownerAddress } = nft;

  const imageSize = "360px";

  let displayCollectionName = "";
  if (collectionName.length > 20) {
    displayCollectionName = `${collectionName.slice(0, 20)}...`;
  } else displayCollectionName = collectionName;
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
          mt={6}
          gap={{ base: 2, md: 8 }}
          direction={{ base: "column", md: "row" }}
        >
          <Flex direction="column" gap={6} maxW={{ md: "360px" }}>
            {isMobile && (
              <NftTitle
                collectionAddress={collectionAddress}
                displayCollectionName={displayCollectionName}
                tokenId={tokenId}
              />
            )}
            {metadata?.image ? (
              <Image
                minW={imageSize}
                minH={imageSize}
                borderRadius="8px"
                src={metadata.image}
              />
            ) : (
              <Image
                minW={imageSize}
                minH={imageSize}
                borderRadius="8px"
                src={NFT_IMAGE_PLACEHOLDER}
              />
            )}
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
          <Flex direction="column" gap={{ base: 6, md: 12 }} w="full">
            <Flex direction="column" gap={4}>
              <Flex
                justifyContent="space-between"
                align="center"
                direction={{ base: "column", md: "row" }}
              >
                {!isMobile && (
                  <>
                    <NftTitle
                      collectionAddress={collectionAddress}
                      displayCollectionName={displayCollectionName}
                      tokenId={tokenId}
                    />
                    <Button
                      variant="outline-primary"
                      w={{ base: "full", md: "auto" }}
                      size={{ base: "sm", md: "md" }}
                      mb={{ base: 4, md: 0 }}
                      onClick={() => {
                        navigate({
                          pathname: "/accounts/[accountAddress]/[tab]",
                          query: {
                            accountAddress: nftAddress,
                            tab: "resources",
                          },
                        });
                      }}
                    >
                      View Resource
                    </Button>
                  </>
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
                      />
                    </Flex>
                  </Tooltip>
                </NftInfoItem>
                <NftInfoItem label="Holder">
                  <ExplorerLink
                    value={ownerAddress}
                    type="user_address"
                    textFormat="normal"
                    maxWidth="full"
                  />
                </NftInfoItem>
                <NftInfoItem label="Token URI" isCentered={false}>
                  <Flex display="inline">
                    <Link href={uri} target="_blank">
                      <Text
                        display="inline-flex"
                        color="primary.dark"
                        variant="body2"
                        fontWeight={500}
                        wordBreak="break-all"
                        _hover={{
                          textDecoration: "underline",
                          textDecorationColor: "secondary.light",
                          "& > p": { color: "secondary.light" },
                        }}
                      >
                        {uri}
                      </Text>
                      <Copier
                        display={{ base: "none", md: "inline-flex" }}
                        type="token_uri"
                        value={uri}
                        copyLabel="Token URI Copied!"
                        ml={{ base: 1, md: 2 }}
                      />
                    </Link>
                  </Flex>
                </NftInfoItem>
              </Flex>
            </Flex>
            {isMobile && (
              <>
                <DescriptionBox description={description} />
                <Button
                  variant="outline-primary"
                  w={{ base: "full", md: "auto" }}
                  size={{ base: "sm", md: "md" }}
                  mb={{ base: 4, md: 0 }}
                  onClick={() => {
                    navigate({
                      pathname: "/accounts/[accountAddress]/[tab]",
                      query: {
                        accountAddress: nftAddress,
                        tab: "resources",
                      },
                    });
                  }}
                >
                  View Resource
                </Button>
              </>
            )}
            <Flex direction="column" gap={{ base: 8, md: 12 }}>
              <MintInfo nftAddress={nftAddress} holderAddress={ownerAddress} />
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
        <Tabs isLazy lazyBehavior="keepMounted">
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
              <Txs txCount={txCount} nftAddress={nftAddress} />
            </TabPanel>
            <TabPanel p={0}>
              <MutateEvents
                totalCount={mutateEventsCount}
                nftAddress={nftAddress}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </>
  );
};

const NftDetails = observer(() => {
  const router = useRouter();
  const validated = zNftDetailQueryParams.safeParse(router.query);

  useEffect(() => {
    if (router.isReady && validated.success) track(AmpEvent.TO_NFT_DETAIL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  if (!validated.success)
    return <EmptyState message="NFT not found." imageVariant="not-found" />;

  const { collectionAddress, nftAddress } = validated.data;
  return (
    <PageContainer>
      <NftDetailsBody
        collectionAddress={collectionAddress}
        nftAddress={nftAddress}
      />
    </PageContainer>
  );
});

export default NftDetails;
