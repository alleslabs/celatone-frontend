import {
  Flex,
  Heading,
  IconButton,
  Image,
  Skeleton,
  Text,
} from "@chakra-ui/react";
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
import { useInitiaUsernameByAddress } from "lib/services/username";
import type { AccountLocalInfo } from "lib/stores/account";
import type { BechAddr, HexAddr, Option } from "lib/types";

interface AccounHeaderProps {
  accountData: Option<AccountData>;
  accountAddress: BechAddr;
  hexAddress: HexAddr;
}

const AccountTitle = ({
  accountData,
  accountLocalInfo,
  hexAddress,
}: {
  accountData: Option<AccountData>;
  accountLocalInfo: Option<AccountLocalInfo>;
  hexAddress: HexAddr;
}) => {
  const move = useMoveConfig({ shouldRedirect: false });
  const { data, isLoading, isFetching } = useInitiaUsernameByAddress(
    hexAddress,
    move.enabled
  );

  const handleDisplayName = () => {
    if (accountLocalInfo?.name) return accountLocalInfo.name;
    if (accountData?.publicInfo?.name) return accountData?.publicInfo?.name;
    if (accountData?.icns?.primaryName) return accountData?.icns?.primaryName;
    if (move.enabled && data?.username) return data?.username;
    return "Account Details";
  };

  const handleIcon = () => {
    const altText =
      accountData?.projectInfo?.name ?? accountData?.icns?.primaryName;

    if (accountData?.projectInfo?.logo || accountData?.icns?.primaryName)
      return (
        <Image
          src="https://assets.alleslabs.dev/webapp-assets/name-services/icns.png"
          borderRadius="full"
          alt={altText}
          width={7}
          height={7}
        />
      );

    if (move.enabled && data?.username)
      return (
        <Image
          src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
          borderRadius="full"
          alt={altText}
          width={6}
          height={6}
          mr={1}
        />
      );

    return <CustomIcon name="wallet" boxSize={5} color="secondary.main" />;
  };

  if (isLoading && isFetching)
    return (
      <Skeleton
        h={6}
        w={32}
        borderRadius={4}
        startColor="gray.500"
        endColor="gray.700"
      />
    );

  return (
    <Flex gap={1} align="center">
      {handleIcon()}
      <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
        {handleDisplayName()}
      </Heading>
    </Flex>
  );
};

export const AccountHeader = observer(
  ({ accountData, accountAddress, hexAddress }: AccounHeaderProps) => {
    const move = useMoveConfig({ shouldRedirect: false });
    const { isAccountSaved, getAccountLocalInfo } = useAccountStore();

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
