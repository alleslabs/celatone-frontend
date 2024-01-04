import {
  Badge,
  Box,
  Divider,
  Flex,
  Heading,
  Image,
  Link,
  Stack,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { AppLink } from "lib/components/AppLink";
import { CopyLink } from "lib/components/CopyLink";
import { CustomTab } from "lib/components/CustomTab";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { Metadata } from "lib/services/nft";
import type { HexAddr } from "lib/types";

import Attributes from "./components/Attributes";
import CollectionInfo from "./components/CollectionInfo";
import MintInfo from "./components/MintInfo";
import MutateEvents from "./mutate-events";
import Txs from "./transaction";

interface MobileContainerProps {
  collectionAddress: HexAddr;
  collectionName: string;
  collectionDesc: string;
  nftAddress: HexAddr;
  nftName: string;
  description: string;
  ownerAddress: string;
  uri: string;
  txCount: number;
  mutateEventsCount: number;
  metadata?: Metadata;
}

const MobileContainer = ({
  collectionAddress,
  collectionName,
  collectionDesc,
  nftAddress,
  nftName,
  uri,
  ownerAddress,
  description,
  txCount,
  mutateEventsCount,
  metadata,
}: MobileContainerProps) => {
  return (
    <Box>
      <Stack spacing="24px" w="100%">
        <Flex justify="space-between">
          <Box>
            <AppLink href={`/nft-collections/${collectionAddress}`}>
              <Text color="primary.main" fontSize="16px" fontWeight={700}>
                {collectionName}
              </Text>
            </AppLink>
            <Heading variant="h5" as="h5">
              {nftName}
            </Heading>
          </Box>
        </Flex>

        <Image src={metadata?.image} borderRadius="8px" />
      </Stack>

      <Stack spacing="32px" w="100%" mt="24px">
        <Stack spacing="16px">
          <Stack fontSize="14px">
            <Box>
              <Text color="gray.400" fontWeight={500} whiteSpace="nowrap">
                NFT Address:
              </Text>
              <CopyLink
                value={nftAddress}
                type="user_address"
                showCopyOnHover
              />
            </Box>
            <Box>
              <Text color="gray.400" fontWeight={500} whiteSpace="nowrap">
                Token URI:
              </Text>
              <Link href={uri} target="_blank">
                <Text color="primary.main">{uri}</Text>
              </Link>
            </Box>
            <Box>
              <Text color="gray.400" fontWeight={500}>
                Holder:
              </Text>
              <ExplorerLink
                value={ownerAddress}
                type="user_address"
                showCopyOnHover
              />
            </Box>
          </Stack>

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
        </Stack>
        {metadata?.attributes && (
          <Attributes
            attributes={metadata.attributes}
            nftAddress={nftAddress}
            nftName={nftName}
          />
        )}
        <MintInfo nftAddress={nftAddress} holderAddress={ownerAddress} />

        <CollectionInfo
          collectionAddress={collectionAddress}
          collectionName={collectionName}
          description={collectionDesc}
        />
      </Stack>

      <Divider width="100%" color="gray.700" opacity={1} my="24px" />

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
          <CustomTab>
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
    </Box>
  );
};

export default MobileContainer;
