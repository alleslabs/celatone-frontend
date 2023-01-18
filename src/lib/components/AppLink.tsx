import { Text } from "@chakra-ui/react";
import type { LinkProps } from "next/link";
import Link from "next/link";
import { useRouter } from "next/router";

export const AppLink = ({
  children,
  ...linkProps
}: Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<HTMLAnchorElement>) => {
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
        <Text color={linkProps.color}>{children}</Text>
      ) : (
        children
      )}
    </Link>
  );
};
