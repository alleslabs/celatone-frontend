import type { IconProps } from "@chakra-ui/react";
import { Flex, Image, Text } from "@chakra-ui/react";
import Link from "next/link";

import { trackSocial } from "lib/amplitude";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";

import { InformationFooter } from "./InformationFooter";

interface SocialMenuType {
  url: string;
  icon: IconKeys;
  slug: string;
}

const socialMenu: SocialMenuType[] = [
  {
    url: "https://initia.xyz/",
    icon: "website",
    slug: "website",
  },
  {
    url: "https://github.com/initia-labs",
    icon: "github",
    slug: "github",
  },
  {
    url: "https://twitter.com/initiaFDN",
    icon: "twitter",
    slug: "twitter",
  },
  {
    url: "https://medium.com/@initiafdn",
    icon: "medium",
    slug: "medium",
  },
];

const socialSequence = {
  website: 0,
  github: 1,
  discord: 2,
  twitter: 3,
  telegram: 4,
  medium: 5,
  reddit: 6,
  linkedin: 7,
};

const SocialMenuRender = ({
  isThemed,
  iconSize,
}: {
  isThemed?: boolean;
  iconSize: IconProps["boxSize"];
}) => {
  const { theme } = useCelatoneApp();
  const themedSocial: SocialMenuType[] = Object.entries(
    theme.socialMedia ?? {}
  ).reduce<SocialMenuType[]>((acc, curr) => {
    if (curr[0] in socialSequence) {
      acc[socialSequence[curr[0] as keyof typeof socialSequence]] = {
        url: curr[1],
        icon: curr[0] as IconKeys,
        slug: curr[0],
      };
    }
    return acc;
  }, []);
  return (
    <>
      {(isThemed ? themedSocial : socialMenu).map((item) => (
        <Link
          key={`${isThemed ? "themed" : "social"}-${item.slug}`}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => {
            trackSocial(item.url);
          }}
        >
          <Flex
            borderRadius="8px"
            transition="all 0.25s ease-in-out"
            _hover={{ backgroundColor: "gray.800" }}
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
      as="footer"
      direction={{ base: "column", md: "row" }}
      align={{ base: "center", md: "end" }}
      justifyContent="space-between"
      px={{ base: 6, md: 12 }}
      py={6}
      mx={{ md: 1 }}
      background="background.overlay"
    >
      <Flex direction="column" gap={2} align={{ base: "center", md: "start" }}>
        <Flex direction={{ base: "column", md: "row" }} gap={1} align="center">
          <Link
            href={theme.socialMedia?.website ?? ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={theme.footer.logo} h={{ base: 6, md: 8 }} mr={2} />
          </Link>
          <Flex mt={{ base: 2, md: 0 }}>
            <SocialMenuRender isThemed iconSize={5} />
          </Flex>
        </Flex>
        <Text
          variant="body3"
          color="gray.400"
          textAlign={{ base: "center", md: "left" }}
        >
          {theme.footer.description}
        </Text>
      </Flex>
      {isMobile && <InformationFooter />}
    </Flex>
  ) : (
    <Flex
      as="footer"
      align="center"
      justifyContent="center"
      px={12}
      py={4}
      mx={1}
      direction={{ base: "column", md: "row" }}
    >
      <Flex direction="row" gap={1} align="center" mb={{ base: 2, md: 0 }}>
        <SocialMenuRender iconSize={5} />
      </Flex>
      {isMobile && <InformationFooter />}
    </Flex>
  );
};

export default Footer;
