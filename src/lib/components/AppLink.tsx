import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { SUPPORTED_CHAIN_IDS } from "env";
import { getFirstQueryParam } from "lib/utils";

export const AppLink = ({
  children,
  ...linkProps
}: React.ComponentProps<typeof Link>) => {
  const router = useRouter();
  const componentHref = linkProps.href.toString();

  const defaultChainId = SUPPORTED_CHAIN_IDS[0] ?? "";
  const network = SUPPORTED_CHAIN_IDS.includes(
    getFirstQueryParam(router.query.network)
  )
    ? router.query.network
    : defaultChainId;

  return (
    <Link {...linkProps} href={`/${network}${componentHref}`}>
      {typeof children === "string" ? (
        <Text variant="body2" color={linkProps.color}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Link>
  );
};
