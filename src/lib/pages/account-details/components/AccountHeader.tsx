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
    <Flex direction="column" gap={2}>
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
        <Heading as="h5" variant="h5">
          {publicName ?? displayName}
        </Heading>
      </Flex>
      <Flex gap={2}>
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
        <Flex gap={2} align="center">
          <Text fontWeight={500} color="text.dark" variant="body2">
            Registered ICNS names:
          </Text>
          <Flex gap={1} align="center">
            {icnsName.names.map((name) => (
              <>
                {name === icnsName.primary_name && <PrimaryNameMark />}
                <CopyLink
                  value={name}
                  type="icns_names"
                  withoutIcon
                  _after={{
                    content: '"/"',
                    fontSize: "14px",
                    ml: 1,
                  }}
                  _last={{
                    _after: {
                      display: "none",
                    },
                  }}
                />
              </>
            ))}
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};
