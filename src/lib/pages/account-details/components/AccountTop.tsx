import { Flex, Image, Heading, Text } from "@chakra-ui/react";

import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import type { HumanAddr, PublicDetail, PublicInfo } from "lib/types";

interface AccountTopProps {
  accountAddress: HumanAddr;
  publicDetail: PublicDetail | undefined;
  displayName: string;
  publicInfo: PublicInfo | undefined;
}
export const AccountTop = ({
  accountAddress,
  publicDetail,
  displayName,
  publicInfo,
}: AccountTopProps) => {
  return (
    <>
      <Flex direction="column" gap={1} mt={{ base: 2, md: 6 }} mb={6}>
        <Flex gap={1}>
          {publicDetail?.logo && (
            <Image
              src={publicDetail.logo}
              borderRadius="full"
              alt={publicDetail.name}
              width={7}
              height={7}
            />
          )}
          <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
            {displayName}
          </Heading>
        </Flex>
        <Flex
          gap={{ base: 0, md: 2 }}
          mt={{ base: 1, md: 0 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text fontWeight={500} color="text.dark" variant="body2">
            Wallet Address:
          </Text>
          <CopyLink
            value={accountAddress}
            amptrackSection="account_top"
            type="user_address"
          />
        </Flex>
      </Flex>
      {publicInfo?.description && (
        <Flex
          direction="column"
          bg="gray.900"
          maxW="100%"
          borderRadius="8px"
          py={4}
          px={4}
          my={6}
          flex="1"
        >
          <Flex alignItems="center" gap={1} minH="32px">
            <CustomIcon name="website" ml="0" mb="6px" color="gray.600" />
            <Text variant="body2" fontWeight={500} color="text.dark">
              Public Account Description
            </Text>
          </Flex>
          <Text variant="body2" color="text.main" mb="1">
            {publicInfo?.description}
          </Text>
        </Flex>
      )}
    </>
  );
};
