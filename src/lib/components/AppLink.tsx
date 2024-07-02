import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { FALLBACK_SUPPORTED_CHAIN_ID, SUPPORTED_CHAIN_IDS } from "env";
import { getFirstQueryParam } from "lib/utils";

export const AppLink = ({
  children,
  ...linkProps
}: React.ComponentProps<typeof Link>) => {
  const router = useRouter();
  const componentHref = linkProps.href.toString();

  const network = SUPPORTED_CHAIN_IDS.includes(
    getFirstQueryParam(router.query.network)
  )
    ? router.query.network
    : FALLBACK_SUPPORTED_CHAIN_ID;

  return (
    <Link {...linkProps} href={`/${network}${componentHref}`}>
      {typeof children === "string" ? (
        <Text
          variant={{ base: "body3", md: "body2" }}
          w={{ base: "max-content", md: "auto" }}
          color={linkProps.color}
          h="auto"
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Link>
  );
};
