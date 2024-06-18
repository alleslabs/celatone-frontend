import { Flex, IconButton, Image, Text } from "@chakra-ui/react";
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
import type { AccountData } from "lib/services/types";
import { useInitiaUsernameByAddress } from "lib/services/username";
import type { BechAddr, HexAddr, Option } from "lib/types";

import { AccountTitle } from "./AccountTitle";

interface AccounHeaderProps {
  accountData: Option<AccountData>;
  accountAddress: BechAddr;
  hexAddress: HexAddr;
}

export const AccountHeader = observer(
  ({ accountData, accountAddress, hexAddress }: AccounHeaderProps) => {
    const move = useMoveConfig({ shouldRedirect: false });
    const { isAccountSaved, getAccountLocalInfo } = useAccountStore();
    const { data } = useInitiaUsernameByAddress(hexAddress, move.enabled);

    const isSaved = isAccountSaved(accountAddress);
    const accountLocalInfo = getAccountLocalInfo(accountAddress);

    const isMobile = useMobile();

    return (
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection={{ base: "column", lg: "row" }}
      >
        <Flex direction="column" gap={2} w={{ base: "full", lg: "auto" }}>
          <Flex gap={4} align="center" minH="36px">
            <AccountTitle
              accountData={accountData}
              accountLocalInfo={accountLocalInfo}
              hexAddress={hexAddress}
            />
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
            {accountLocalInfo?.name && data?.username && (
              <Flex mt={{ base: 1, md: 0 }} alignItems="center">
                <Text fontWeight={500} color="text.dark" variant="body2" mr={2}>
                  Initia Username:
                </Text>
                <Image
                  src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
                  borderRadius="full"
                  width={4}
                  height={4}
                  mr={1}
                />
                <Text variant="body2">{data.username}</Text>
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
