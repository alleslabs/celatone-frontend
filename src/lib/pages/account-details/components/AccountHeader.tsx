import type { AccountData } from "lib/services/types";
import type { BechAddr, HexAddr, Option } from "lib/types";

import { Flex, IconButton, Image, Text } from "@chakra-ui/react";
import { useEvmConfig, useMobile, useMoveConfig } from "lib/app-provider";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import {
  EditSavedAccountModal,
  RemoveSavedAccountModal,
  SaveNewAccountModal,
} from "lib/components/modal";
import { AccountQrCodeModal } from "lib/components/modal/account";
import { PrimaryNameMark } from "lib/components/PrimaryNameMark";
import { Tooltip } from "lib/components/Tooltip";
import { TotalValue } from "lib/components/TotalValue";
import { useAccountStore } from "lib/providers/store";
import { observer } from "mobx-react-lite";

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
        <Flex direction="column" gap={2} w={{ base: "full", lg: "auto" }}>
          <Flex align="center" gap={4} minH="36px">
            <AccountTitle
              accountData={accountData}
              accountLocalInfo={accountLocalInfo}
              initiaUsernameData={initiaUsernameData}
              isInitiaUsernameDataFetching={isInitiaUsernameDataFetching}
              isInitiaUsernameDataLoading={isInitiaUsernameDataLoading}
            />
            {!isMobile && (
              <>
                {isSaved && accountLocalInfo ? (
                  <Flex gap={2}>
                    <EditSavedAccountModal
                      accountLocalInfo={accountLocalInfo}
                      triggerElement={
                        <IconButton
                          aria-label="edit account"
                          icon={<CustomIcon boxSize={4} name="edit" />}
                          size="sm"
                          variant="ghost-gray-icon"
                        />
                      }
                    />
                    <RemoveSavedAccountModal
                      accountLocalInfo={accountLocalInfo}
                      trigger={
                        <IconButton
                          aria-label="remove account"
                          icon={
                            <CustomIcon boxSize={4} name="bookmark-solid" />
                          }
                          size="sm"
                          variant="ghost-gray-icon"
                        />
                      }
                    />
                  </Flex>
                ) : (
                  <SaveNewAccountModal
                    accountAddress={accountAddress}
                    publicDescription={accountData?.publicInfo?.description}
                    publicName={
                      accountData?.publicInfo?.name ??
                      accountData?.icns?.primaryName
                    }
                    trigger={
                      <Tooltip label="Save account">
                        <IconButton
                          aria-label="save account"
                          icon={<CustomIcon boxSize={4} name="bookmark" />}
                          size="sm"
                          variant="ghost-gray-icon"
                        />
                      </Tooltip>
                    }
                  />
                )}
              </>
            )}
            <AccountQrCodeModal
              accountBechAddr={accountAddress}
              accountHexAddr={showHexAddr ? hexAddress : undefined}
            />
          </Flex>
          <Flex direction="column" gap={1}>
            <Flex
              direction={{ base: "column", md: "row" }}
              gap={{ base: 0, md: 2 }}
              mt={{ base: 1, md: 0 }}
            >
              <Text color="text.dark" fontWeight={500} variant="body2">
                Account address:
              </Text>
              <CopyLink
                amptrackSection="account_top"
                type="user_address"
                value={accountAddress}
              />
            </Flex>
            {showHexAddr && (
              <Flex
                direction={{ base: "column", md: "row" }}
                gap={{ base: 0, md: 2 }}
                mt={{ base: 1, md: 0 }}
              >
                <Text color="text.dark" fontWeight={500} variant="body2">
                  HEX:
                </Text>
                <CopyLink
                  amptrackSection="account_top"
                  type="user_address"
                  value={hexAddress}
                />
              </Flex>
            )}
            {accountLocalInfo?.name && initiaUsernameData?.username && (
              <Flex alignItems="center" mt={{ base: 1, md: 0 }}>
                <Text color="text.dark" fontWeight={500} mr={2} variant="body2">
                  Initia username:
                </Text>
                <Image
                  borderRadius="full"
                  height={4}
                  mr={1}
                  src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
                  width={4}
                />
                <Text variant="body2">{initiaUsernameData.username}</Text>
              </Flex>
            )}
          </Flex>
          {accountData?.icns && (
            <Flex align="center" gap={2}>
              <Text color="text.dark" fontWeight={500} variant="body2">
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
                    direction="row"
                    gap={1}
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
