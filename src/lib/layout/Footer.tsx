import type { IconProps } from "@chakra-ui/react";
import { Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";

import { trackSocial } from "lib/amplitude";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";

import { InformationFooter } from "./InformationFooter";

interface SocialMenuType {
  icon: IconKeys;
  slug: string;
  url: string;
}

const socialMenu: SocialMenuType[] = [
  {
    icon: "website",
    slug: "website",
    url: "https://initia.xyz",
  },
  {
    icon: "github",
    slug: "github",
    url: "https://github.com/initia-labs",
  },
  {
    icon: "twitter",
    slug: "twitter",
    url: "https://twitter.com/initiaFDN",
  },
  {
    icon: "medium",
    slug: "medium",
    url: "https://medium.com/@initiafdn",
  },
];

const socialSequence = {
  discord: 2,
  github: 1,
  linkedin: 7,
  medium: 5,
  reddit: 6,
  telegram: 4,
  twitter: 3,
  website: 0,
};

const SocialMenuRender = ({
  iconSize,
  isThemed,
}: {
  iconSize: IconProps["boxSize"];
  isThemed?: boolean;
}) => {
  const { theme } = useCelatoneApp();
  const themedSocial: SocialMenuType[] = Object.entries(
    theme.socialMedia ?? {}
  ).reduce<SocialMenuType[]>((acc, curr) => {
    if (curr[0] in socialSequence) {
      acc[socialSequence[curr[0] as keyof typeof socialSequence]] = {
        icon: curr[0] as IconKeys,
        slug: curr[0],
        url: curr[1],
      };
    }
    return acc;
  }, []);
  return (
    <>
      {(isThemed ? themedSocial : socialMenu).map((item) => (
        <Link
          key={`${isThemed ? "themed" : "social"}-${item.slug}`}
          rel="noopener noreferrer"
          target="_blank"
          onClick={() => {
            trackSocial(item.url);
          }}
          href={item.url}
        >
          <Flex
            _hover={{ backgroundColor: "gray.800" }}
            borderRadius="8px"
            transition="all 0.25s ease-in-out"
          >
            <CustomIcon name={item.icon} boxSize={iconSize} color="gray.600" />
          </Flex>
        </Link>
      ))}
    </>
  );
};

const Footer = () => {
  const isMobile = useMobile();
  const { theme } = useCelatoneApp();

  return theme.footer ? (
    <Flex
      align={{ base: "center", md: "end" }}
      as="footer"
      mx={{ md: 1 }}
      px={{ base: 6, md: 12 }}
      py={6}
      background="background.overlay"
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
    >
      <Flex align={{ base: "center", md: "start" }} gap={2} direction="column">
        <Flex align="center" gap={1} direction={{ base: "column", md: "row" }}>
          <Link
            rel="noopener noreferrer"
            target="_blank"
            href={theme.socialMedia?.website ?? ""}
          >
            <Image h={{ base: 6, md: 8 }} mr={2} src={theme.footer.logo} />
          </Link>
          <Flex mt={{ base: 2, md: 0 }}>
            <SocialMenuRender isThemed iconSize={5} />
          </Flex>
        </Flex>
        <Text
          textAlign={{ base: "center", md: "left" }}
          variant="body3"
          color="gray.400"
        >
          {theme.footer.description}
        </Text>
      </Flex>
      {isMobile && <InformationFooter />}
    </Flex>
  ) : (
    <Flex
      align="center"
      as="footer"
      mx={1}
      px={12}
      py={4}
      direction={{ base: "column", md: "row" }}
      justifyContent="center"
    >
      <Flex align="center" gap={1} mb={{ base: 2, md: 0 }} direction="row">
        <SocialMenuRender iconSize={5} />
      </Flex>
      {isMobile && <InformationFooter />}
    </Flex>
  );
};

export default Footer;
