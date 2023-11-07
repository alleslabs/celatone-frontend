import { Flex, Heading, Image, Text } from "@chakra-ui/react";

import { useMoveConfig } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import type { ICNSNamesResponse } from "lib/services/ns";
import type { HexAddr, HumanAddr, Option, PublicDetail } from "lib/types";

import { TotalAccountValue } from "./TotalAccountValue";

interface AccounHeaderProps {
  publicName: Option<string>;
  publicDetail: Option<PublicDetail>;
  icnsName: Option<ICNSNamesResponse>;
  accountAddress: HumanAddr;
  hexAddress: HexAddr;
}

export const AccountHeader = ({
  publicName,
  publicDetail,
  icnsName,
  accountAddress,
  hexAddress,
}: AccounHeaderProps) => {
  const displayName = icnsName?.primary_name || "Account Details";
  const move = useMoveConfig({ shouldRedirect: false });
  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      flexDirection={{ base: "column", lg: "row" }}
    >
      <Flex direction="column" gap={2} w={{ base: "full", lg: "auto" }}>
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
        <Flex direction="column" gap={1}>
          <Flex
            gap={{ base: 0, md: 2 }}
            mt={{ base: 1, md: 0 }}
            direction={{ base: "column", md: "row" }}
          >
            <Text fontWeight={500} color="text.dark" variant="body2">
              Account Address:
            </Text>
            <CopyLink
              value={accountAddress}
              amptrackSection="account_top"
              type="user_address"
            />
          </Flex>
          {move.enabled && (
            <Flex
              gap={{ base: 0, md: 2 }}
              mt={{ base: 1, md: 0 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text fontWeight={500} color="text.dark" variant="body2">
                HEX:
              </Text>
              <CopyLink
                value={hexAddress}
                amptrackSection="account_top"
                type="user_address"
              />
            </Flex>
          )}
        </Flex>
        {icnsName?.primary_name && (
          <Flex gap={2} align="center">
            <Text fontWeight={500} color="text.dark" variant="body2">
              Registered ICNS names:
            </Text>
            <Flex gap={1} align="center">
              {icnsName.names.map((name) => (
                <Flex
                  key={name}
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
                >
                  {name === icnsName.primary_name && <PrimaryNameMark />}
                  <CopyLink value={name} type="icns_names" withoutIcon />
                </Flex>
              ))}
            </Flex>
          </Flex>
        )}
      </Flex>
      <Flex mt={{ base: 4, lg: 0 }} w={{ base: "full", lg: "auto" }}>
        <TotalAccountValue accountAddress={accountAddress} />
      </Flex>
    </Flex>
  );
};
