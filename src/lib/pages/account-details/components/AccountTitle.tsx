import { Flex, Heading, Image, Skeleton } from "@chakra-ui/react";

import { useInitia } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { AccountData } from "lib/services/types";
import type { AccountLocalInfo } from "lib/stores/account";
import type { Option } from "lib/types";

export interface InitiaUsernameDataResponse {
  username: null | string;
}

interface AccountTitleProps {
  accountData: Option<AccountData>;
  accountLocalInfo: Option<AccountLocalInfo>;
  initiaUsernameData: Option<InitiaUsernameDataResponse>;
  isInitiaUsernameDataFetching: boolean;
  isInitiaUsernameDataLoading: boolean;
}

export const AccountTitle = ({
  accountData,
  accountLocalInfo,
  initiaUsernameData,
  isInitiaUsernameDataFetching,
  isInitiaUsernameDataLoading,
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
          width={7}
          alt={altText}
          height={7}
          src="https://assets.alleslabs.dev/webapp-assets/name-services/icns.png"
          borderRadius="full"
        />
      );

    if (isInitia && initiaUsernameData?.username && !accountLocalInfo?.name)
      return (
        <Image
          width={6}
          alt={altText}
          height={6}
          mr={1}
          src="https://assets.alleslabs.dev/webapp-assets/name-services/initia-username.svg"
          borderRadius="full"
        />
      );

    if (accountLocalInfo?.name)
      return <CustomIcon name="bookmark" boxSize={5} color="primary.main" />;
    return <CustomIcon name="wallet" boxSize={5} color="primary.main" />;
  };

  if (isInitiaUsernameDataLoading && isInitiaUsernameDataFetching)
    return (
      <Skeleton
        h={6}
        w={32}
        borderRadius={4}
        endColor="gray.700"
        startColor="gray.500"
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
