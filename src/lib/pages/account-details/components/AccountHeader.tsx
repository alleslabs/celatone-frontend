import { Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { useMobile, useMoveConfig } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import {
  EditSavedAccountModal,
  RemoveSavedAccountModal,
  SaveNewAccountModal,
} from "lib/components/modal";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import { TotalValue } from "lib/components/TotalValue";
import { useAccountStore } from "lib/providers/store";
import type { AccountData } from "lib/services/account";
import type { BechAddr, HexAddr, Option } from "lib/types";

interface AccounHeaderProps {
  accountData: Option<AccountData>;
  accountAddress: BechAddr;
  hexAddress: HexAddr;
}

export const AccountHeader = observer(
  ({ accountData, accountAddress, hexAddress }: AccounHeaderProps) => {
    const move = useMoveConfig({ shouldRedirect: false });
    const { isAccountSaved, getAccountLocalInfo } = useAccountStore();

    const isSaved = isAccountSaved(accountAddress);
    const accountLocalInfo = getAccountLocalInfo(accountAddress);
    const displayName =
      accountLocalInfo?.name ??
      accountData?.publicInfo?.name ??
      (accountData?.icns?.primaryName || "Account Details");

    const isMobile = useMobile();

    return (
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Flex direction="column" gap={2} w={{ base: "full", lg: "auto" }}>
          <Flex gap={4} align="center" minH="36px">
            <Flex gap={1} align="center">
              {accountData?.projectInfo?.logo ||
              accountData?.icns?.primaryName ? (
                <Image
                  src={
                    accountData?.projectInfo?.logo ??
                    "https://celatone-api.alleslabs.dev/images/entities/icns"
                  }
                  borderRadius="full"
                  alt={
                    accountData?.projectInfo?.name ??
                    accountData?.icns?.primaryName
                  }
                  width={7}
                  height={7}
                />
              ) : (
                <CustomIcon name="wallet" boxSize={5} color="secondary.main" />
              )}
              <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
                {displayName}
              </Heading>
            </Flex>
            {!isMobile && (
              <>
                {isSaved && accountLocalInfo ? (
                  <Flex gap={2}>
                    <EditSavedAccountModal
                      accountLocalInfo={accountLocalInfo}
                      triggerElement={
                        <IconButton
                          variant="ghost-gray-icon"
                          size="sm"
                          icon={<CustomIcon name="edit" boxSize={4} />}
                          aria-label="edit account"
                        />
                      }
                    />
                    <RemoveSavedAccountModal
                      accountLocalInfo={accountLocalInfo}
                      trigger={
                        <IconButton
                          variant="ghost-gray-icon"
                          size="sm"
                          icon={
                            <CustomIcon name="bookmark-solid" boxSize={4} />
                          }
                          aria-label="remove account"
                        />
                      }
                    />
                  </Flex>
                ) : (
                  <SaveNewAccountModal
                    accountAddress={accountAddress}
                    publicName={
                      accountData?.publicInfo?.name ??
                      accountData?.icns?.primaryName
                    }
                    publicDescription={accountData?.publicInfo?.description}
                    buttonProps={{
                      size: "sm",
                      variant: "outline-gray",
                      leftIcon: (
                        <CustomIcon name="bookmark" boxSize={3} mr={0} />
                      ),
                      children: "Save Account",
                    }}
                  />
                )}
              </>
            )}
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
          {accountData?.icns && (
            <Flex gap={2} align="center">
              <Text fontWeight={500} color="text.dark" variant="body2">
                Registered ICNS names:
              </Text>
              <Flex gap={1} align="center">
                {accountData.icns.names.map((name) => (
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
                    {name === accountData.icns?.primaryName && (
                      <PrimaryNameMark />
                    )}
                    <CopyLink value={name} type="icns_names" withoutIcon />
                  </Flex>
                ))}
              </Flex>
            </Flex>
          )}
        </Flex>
        <Flex mt={{ base: 4, lg: 0 }} w={{ base: "full", lg: "auto" }}>
          <TotalValue address={accountAddress} />
        </Flex>
      </Flex>
    );
  }
);
