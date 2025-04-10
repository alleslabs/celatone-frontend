import { Text } from "@chakra-ui/react";
import { useChainConfigs } from "lib/app-provider/hooks/useChainConfigs";
import { getFirstQueryParam } from "lib/utils";
import Link from "next/link";
import { useRouter } from "next/router";

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
    : supportedChainIds[0];

  return (
    <Link {...linkProps} href={`/${network}${componentHref}`}>
      {typeof children === "string" ? (
        <Text
          _hover={{ textDecoration: "underline" }}
          color={linkProps.color}
          h="auto"
          variant={{ base: "body3", md: "body2" }}
          w={{ base: "max-content", md: "auto" }}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Link>
  );
};
