import type { AccountData } from "lib/services/types";
import type { AccountLocalInfo } from "lib/stores/account";
import type { Nullable, Option } from "lib/types";

import { Flex, Heading, Image, Skeleton } from "@chakra-ui/react";
import { useInitia } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";

export interface InitiaUsernameDataResponse {
  username: Nullable<string>;
}

interface AccountTitleProps {
  accountData: Option<AccountData>;
  accountLocalInfo: Option<AccountLocalInfo>;
  initiaUsernameData: Option<InitiaUsernameDataResponse>;
  isInitiaUsernameDataLoading: boolean;
  isInitiaUsernameDataFetching: boolean;
}

export const AccountTitle = ({
  accountData,
  accountLocalInfo,
  initiaUsernameData,
  isInitiaUsernameDataLoading,
  isInitiaUsernameDataFetching,
}: AccountTitleProps) => {
  const isInitia = useInitia();

  const handleDisplayName = () => {
    if (accountLocalInfo?.name) return accountLocalInfo.name;
    if (accountData?.publicInfo?.name) return accountData?.publicInfo?.name;
    if (accountData?.icns?.primaryName) return accountData?.icns?.primaryName;
    if (isInitia && initiaUsernameData?.username)
      return initiaUsernameData?.username;
    return "Account Details";
  };

  const handleIcon = () => {
    const altText =
      accountData?.projectInfo?.name ?? accountData?.icns?.primaryName;

    if (accountData?.projectInfo?.logo || accountData?.icns?.primaryName)
      return (
        <Image
          alt={altText}
          borderRadius="full"
          height={7}
          src="https://assets.alleslabs.dev/webapp-assets/name-services/icns.png"
          width={7}
        />
      );

    if (isInitia && initiaUsernameData?.username && !accountLocalInfo?.name)
      return (
        <Image
          alt={altText}
          borderRadius="full"
          height={6}
          mr={1}
          src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
          width={6}
        />
      );

    if (accountLocalInfo?.name)
      return <CustomIcon boxSize={5} color="primary.main" name="bookmark" />;
    return <CustomIcon boxSize={5} color="primary.main" name="wallet" />;
  };

  if (isInitiaUsernameDataLoading && isInitiaUsernameDataFetching)
    return (
      <Skeleton
        borderRadius={4}
        endColor="gray.700"
        h={6}
        startColor="gray.500"
        w={32}
      />
    );

  return (
    <Flex align="center" gap={1}>
      {handleIcon()}
      <Heading as="h5" variant={{ base: "h6", md: "h5" }}>
        {handleDisplayName()}
      </Heading>
    </Flex>
  );
};
