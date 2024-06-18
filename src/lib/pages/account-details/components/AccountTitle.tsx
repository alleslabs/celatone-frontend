import { Flex, Heading, Image, Skeleton } from "@chakra-ui/react";

import { useMoveConfig } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { AccountData } from "lib/services/types";
import { useInitiaUsernameByAddress } from "lib/services/username";
import type { AccountLocalInfo } from "lib/stores/account";
import type { HexAddr, Option } from "lib/types";

export const AccountTitle = ({
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

    if (move.enabled && data?.username && !accountLocalInfo?.name)
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

    if (accountLocalInfo?.name)
      return <CustomIcon name="bookmark" boxSize={5} color="secondary.main" />;
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
