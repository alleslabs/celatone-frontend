import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const AppLink = ({
  children,
  ...linkProps
}: React.ComponentProps<typeof Link>) => {
  const router = useRouter();
  const componentHref = linkProps.href.toString();
  return (
    <Link
      {...linkProps}
      href={
        router.query.network === "mainnet"
          ? `/mainnet${componentHref}`
          : `/testnet${componentHref}`
      }
    >
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
