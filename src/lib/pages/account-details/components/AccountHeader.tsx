import { Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import { useEvmConfig, useMobile, useMoveConfig } from "lib/app-provider";
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
import type { BechAddr, HexAddr, Option } from "lib/types";

import type { InitiaUsernameDataResponse } from "./AccountTitle";
import { AccountTitle } from "./AccountTitle";

interface AccounHeaderProps {
  accountAddress: BechAddr;
  accountData: Option<AccountData>;
  hexAddress: HexAddr;
  initiaUsernameData: Option<InitiaUsernameDataResponse>;
  isInitiaUsernameDataFetching: boolean;
  isInitiaUsernameDataLoading: boolean;
}

export const AccountHeader = observer(
  ({
    accountAddress,
    accountData,
    hexAddress,
    initiaUsernameData,
    isInitiaUsernameDataFetching,
    isInitiaUsernameDataLoading,
  }: AccounHeaderProps) => {
    const isMobile = useMobile();
    const move = useMoveConfig({ shouldRedirect: false });
    const evm = useEvmConfig({ shouldRedirect: false });

    const { getAccountLocalInfo, isAccountSaved } = useAccountStore();
    const isSaved = isAccountSaved(accountAddress);
    const accountLocalInfo = getAccountLocalInfo(accountAddress);

    const showHexAddr = move.enabled || evm.enabled;
    return (
      <Flex
        alignItems="center"
        flexDirection={{ base: "column", lg: "row" }}
        justifyContent="space-between"
      >
        <Flex gap={2} w={{ base: "full", lg: "auto" }} direction="column">
          <Flex align="center" gap={4} minH="36px">
            <AccountTitle
              initiaUsernameData={initiaUsernameData}
              isInitiaUsernameDataFetching={isInitiaUsernameDataFetching}
              accountData={accountData}
              accountLocalInfo={accountLocalInfo}
              isInitiaUsernameDataLoading={isInitiaUsernameDataLoading}
            />
            {!isMobile && (
              <>
                {isSaved && accountLocalInfo ? (
                  <Flex gap={2}>
                    <EditSavedAccountModal
                      triggerElement={
                        <IconButton
                          aria-label="edit account"
                          size="sm"
                          variant="ghost-gray-icon"
                          icon={<CustomIcon name="edit" boxSize={4} />}
                        />
                      }
                      accountLocalInfo={accountLocalInfo}
                    />
                    <RemoveSavedAccountModal
                      trigger={
                        <IconButton
                          aria-label="remove account"
                          size="sm"
                          variant="ghost-gray-icon"
                          icon={
                            <CustomIcon name="bookmark-solid" boxSize={4} />
                          }
                        />
                      }
                      accountLocalInfo={accountLocalInfo}
                    />
                  </Flex>
                ) : (
                  <SaveNewAccountModal
                    publicName={
                      accountData?.publicInfo?.name ??
                      accountData?.icns?.primaryName
                    }
                    accountAddress={accountAddress}
                    buttonProps={{
                      children: "Save Account",
                      leftIcon: (
                        <CustomIcon mr={0} name="bookmark" boxSize={3} />
                      ),
                      size: "sm",
                      variant: "outline-gray",
                    }}
                    publicDescription={accountData?.publicInfo?.description}
                  />
                )}
              </>
            )}
          </Flex>
          <Flex gap={1} direction="column">
            <Flex
              gap={{ base: 0, md: 2 }}
              mt={{ base: 1, md: 0 }}
              direction={{ base: "column", md: "row" }}
            >
              <Text variant="body2" color="text.dark" fontWeight={500}>
                Account Address:
              </Text>
              <CopyLink
                type="user_address"
                value={accountAddress}
                amptrackSection="account_top"
              />
            </Flex>
            {showHexAddr && (
              <Flex
                gap={{ base: 0, md: 2 }}
                mt={{ base: 1, md: 0 }}
                direction={{ base: "column", md: "row" }}
              >
                <Text variant="body2" color="text.dark" fontWeight={500}>
                  HEX:
                </Text>
                <CopyLink
                  type="user_address"
                  value={hexAddress}
                  amptrackSection="account_top"
                />
              </Flex>
            )}
            {accountLocalInfo?.name && initiaUsernameData?.username && (
              <Flex alignItems="center" mt={{ base: 1, md: 0 }}>
                <Text mr={2} variant="body2" color="text.dark" fontWeight={500}>
                  Initia Username:
                </Text>
                <Image
                  width={4}
                  height={4}
                  mr={1}
                  src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
                  borderRadius="full"
                />
                <Text variant="body2">{initiaUsernameData.username}</Text>
              </Flex>
            )}
          </Flex>
          {accountData?.icns && (
            <Flex align="center" gap={2}>
              <Text variant="body2" color="text.dark" fontWeight={500}>
                Registered ICNS names:
              </Text>
              <Flex align="center" gap={1}>
                {accountData.icns.names.map((name) => (
                  <Flex
                    key={name}
                    _after={{
                      content: '"/"',
                      fontSize: "14px",
                    }}
                    _last={{
                      _after: {
                        display: "none",
                      },
                    }}
                    align="center"
                    gap={1}
                    direction="row"
                  >
                    {name === accountData.icns?.primaryName && (
                      <PrimaryNameMark />
                    )}
                    <CopyLink type="icns_names" value={name} withoutIcon />
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
