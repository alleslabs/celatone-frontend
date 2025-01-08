import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { FALLBACK_SUPPORTED_CHAIN_ID } from "env";
import { useChainConfigs } from "lib/app-provider/hooks/useChainConfigs";
import { getFirstQueryParam } from "lib/utils";

export const AppLink = ({
  children,
  ...linkProps
}: React.ComponentProps<typeof Link>) => {
  const router = useRouter();
  const { supportedChainIds } = useChainConfigs();
  const componentHref = linkProps.href.toString();

  const network = supportedChainIds.includes(
    getFirstQueryParam(router.query.network)
  )
    ? router.query.network
    : FALLBACK_SUPPORTED_CHAIN_ID;

  return (
    <Link {...linkProps} href={`/${network}${componentHref}`}>
      {typeof children === "string" ? (
        <Text
          h="auto"
          variant={{ base: "body3", md: "body2" }}
          w={{ base: "max-content", md: "auto" }}
          _hover={{ textDecoration: "underline" }}
          color={linkProps.color}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Link>
  );
};
