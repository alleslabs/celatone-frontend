import { Flex, Heading, Image, Text } from "@chakra-ui/react";

import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import type { ICNSNamesResponse } from "lib/services/ns";
import type { HumanAddr, Option, PublicDetail } from "lib/types";

interface AccounHeaderProps {
  publicName: Option<string>;
  publicDetail: Option<PublicDetail>;
  icnsName: Option<ICNSNamesResponse>;
  accountAddress: HumanAddr;
}

export const AccountHeader = ({
  publicName,
  publicDetail,
  icnsName,
  accountAddress,
}: AccounHeaderProps) => {
  const displayName = icnsName?.primary_name || "Account Details";

  return (
    <Flex direction="column" gap={1}>
      <Flex gap={1} minH="36px" align="center">
        {publicDetail?.logo || icnsName?.primary_name ? (
          <Image
            src={
              publicDetail?.logo ??
              "https://celatone-api.alleslabs.dev/images/entities/icns"
            }
            borderRadius="full"
            alt={publicDetail?.name ?? icnsName?.primary_name}
            width={7}
            height={7}
          />
        ) : (
          <CustomIcon name="wallet" boxSize={5} color="secondary.main" />
        )}
        <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
          {publicName ?? displayName}
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
      {icnsName?.primary_name && (
        <Flex
          gap={{ base: 0, md: 2 }}
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
        >
          <Text fontWeight={500} color="text.dark" variant="body2">
            Registered ICNS names:
          </Text>
          <Flex align="center">
            {icnsName.names.map((name) => (
              <Flex
                key={name}
                display="inline-flex"
                align="center"
                direction="row"
                _after={{
                  content: '"/"',
                  fontSize: "14px",
                }}
                _last={{
                  _after: {
                    display: "none",
                  },
                }}
                gap={1}
                mr={1}
              >
                {name === icnsName.primary_name && <PrimaryNameMark />}
                <CopyLink value={name} type="icns_names" withoutIcon />
              </Flex>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
