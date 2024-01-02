import {
  Flex,
  Image,
  Stack,
  Text,
  Box,
  Button,
  Heading,
  Tabs,
  TabList,
  Badge,
  TabPanels,
  TabPanel,
  Divider,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useMobile } from "lib/app-provider";
import { AppLink } from "lib/components/AppLink";
import { Breadcrumb } from "lib/components/Breadcrumb";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";
import { useCollectionByCollectionAddress } from "lib/services/collectionService";
import {
  useMetadata,
  useNFTInfo,
  useNFTMutateEventsCount,
  useNFTTransactionsCount,
} from "lib/services/nftService";
import type { HexAddr } from "lib/types";
import { getFirstQueryParam, truncate } from "lib/utils";

import Attributes from "./components/Attributes";
import CollectionInfo from "./components/CollectionInfo";
import MintInfo from "./components/MintInfo";
import MobileContainer from "./MobileContainer";
import MutateEvents from "./mutate-events";
import Txs from "./transaction";

const NFTDetail = () => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_NFT_DETAIL);
  }, [router.isReady]);

  const collectionAddress = getFirstQueryParam(
    router.query.collectionAddress
  ) as HexAddr;
  const nftAddress = getFirstQueryParam(router.query.nftAddress) as HexAddr;

  const { data: collection, isLoading: collectionLoading } =
    useCollectionByCollectionAddress(collectionAddress);
  const { data: nft, isLoading: nftLoading } = useNFTInfo(
    collectionAddress,
    nftAddress
  );
  const { data: txCount = 0 } = useNFTTransactionsCount(nftAddress);
  const { data: mutateEventsCount = 0 } = useNFTMutateEventsCount(nftAddress);
  const { data: metadata } = useMetadata(nft?.uri ?? "");
  const isMobile = useMobile();

  if (collectionLoading || nftLoading) return <Loading />;
  if (!collection || !nft)
    return <EmptyState message="NFT not found" imageVariant="not-found" />;

  const { name: collectionName, description: collectionDesc } = collection;
  const { tokenId, description, uri, ownerAddress } = nft;
  const nftName = metadata?.name ?? tokenId;

  return (
    <PageContainer>
      <Breadcrumb
        items={[
          { text: "NFTs", href: "/collections" },
          { text: collectionName, href: `/collections/${collectionAddress}` },
          { text: nftName },
        ]}
      />
      {isMobile ? (
        <MobileContainer
          collectionAddress={collectionAddress}
          collectionName={collectionName}
          collectionDesc={collectionDesc}
          description={description ?? ""}
          txCount={txCount}
          mutateEventsCount={mutateEventsCount}
          nftAddress={nftAddress}
          nftName={nftName}
          ownerAddress={ownerAddress}
          uri={uri}
          metadata={metadata}
        />
      ) : (
        <Stack spacing="32px">
          <Flex mt="24px" gap="32px">
            <Stack spacing="24px" maxW="360px">
              <Image
                src={metadata?.image}
                minW="360px"
                h="360px"
                borderRadius="8px"
              />
              <Box
                fontSize="14px"
                p="16px"
                borderRadius="8px"
                backgroundColor="gray.900"
              >
                <Text mb="8px" fontWeight={700}>
                  Description
                </Text>
                <Text>{description}</Text>
              </Box>

              <CollectionInfo
                collectionAddress={collectionAddress}
                collectionName={collectionName}
                description={collectionDesc}
              />
            </Stack>
            <Stack spacing="32px" w="100%">
              <Stack spacing="16px">
                <Flex justify="space-between">
                  <Box>
                    <AppLink href={`/collections/${collectionAddress}`}>
                      <Text
                        color="primary.main"
                        fontSize="16px"
                        fontWeight={700}
                      >
                        {collectionName}
                      </Text>
                    </AppLink>
                    <Heading variant="h5" as="h5">
                      {nftName}
                    </Heading>
                  </Box>
                  <Button
                    backgroundColor="transparent"
                    textColor="primary.main"
                    border="1px solid"
                    borderColor="primary.main"
                    _hover={{ background: "transparent" }}
                  >
                    <Flex gap="8px" align="center">
                      <CustomIcon name="download" /> Download NFT
                    </Flex>
                  </Button>
                </Flex>
                <Box fontSize="14px">
                  <Flex gap="8px">
                    <Text color="gray.400" fontWeight={500} whiteSpace="nowrap">
                      NFT Address:
                    </Text>
                    <ExplorerLink value={nftAddress} type="user_address" />
                  </Flex>
                  <Flex gap="8px">
                    <Text color="gray.400" fontWeight={500} whiteSpace="nowrap">
                      Token URI:
                    </Text>
                    <Link href={uri} target="_blank">
                      <Text color="primary.main">
                        {truncate(uri, [20, 20])}
                      </Text>
                    </Link>
                  </Flex>
                  <Flex gap="8px">
                    <Text color="gray.400" fontWeight={500}>
                      Holder:
                    </Text>
                    <ExplorerLink value={ownerAddress} type="user_address" />
                  </Flex>
                </Box>
              </Stack>
              <MintInfo nftAddress={nftAddress} holderAddress={ownerAddress} />
              {metadata?.attributes && (
                <Attributes
                  attributes={metadata.attributes}
                  nftAddress={nftAddress}
                  nftName={nftName}
                />
              )}
            </Stack>
          </Flex>

          <Divider width="100%" color="gray.700" />

          <Tabs isLazy lazyBehavior="keepMounted">
            <TabList
              marginBottom="32px"
              borderBottom="1px solid"
              borderColor="gray.700"
              overflowX="scroll"
            >
              <CustomTab>
                <Flex align="center" gap="6px">
                  <Text>Transactions</Text>
                  <Badge>{txCount}</Badge>
                </Flex>
              </CustomTab>
              <CustomTab isDisabled={!mutateEventsCount}>
                <Flex align="center" gap="6px">
                  <Text>Mutate Events</Text>
                  <Badge>{mutateEventsCount}</Badge>
                </Flex>
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
        </Stack>
      )}
    </PageContainer>
  );
};

export default NFTDetail;
