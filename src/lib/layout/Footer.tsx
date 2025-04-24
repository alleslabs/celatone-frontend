/* eslint-disable no-param-reassign */
import type { IconProps } from "@chakra-ui/react";
import type { IconKeys } from "lib/components/icon";

import { Flex, Image, Text } from "@chakra-ui/react";
import { trackSocial } from "lib/amplitude";
import { useCelatoneApp, useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import Link from "next/link";

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
    icon: "x",
    slug: "x",
    url: "https://x.com/initia",
  },
  {
    icon: "medium",
    slug: "medium",
    url: "https://medium.com/@initialabs",
  },
];

const socialSequence = {
  discord: 2,
  github: 1,
  linkedin: 7,
  medium: 5,
  reddit: 6,
  telegram: 4,
  website: 0,
  x: 3,
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
          href={item.url}
          rel="noopener noreferrer"
          target="_blank"
          onClick={() => {
            trackSocial(item.url);
          }}
        >
          <Flex
            _hover={{ backgroundColor: "gray.800" }}
            borderRadius="8px"
            transition="all 0.25s ease-in-out"
          >
            <CustomIcon boxSize={iconSize} color="gray.600" name={item.icon} />
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
      background="background.overlay"
      direction={{ base: "column", md: "row" }}
      justifyContent="space-between"
      mx={{ md: 1 }}
      px={{ base: 6, md: 12 }}
      py={6}
    >
      <Flex align={{ base: "center", md: "start" }} direction="column" gap={2}>
        <Flex align="center" direction={{ base: "column", md: "row" }} gap={1}>
          <Link
            href={theme.socialMedia?.website ?? ""}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Image h={{ base: 6, md: 8 }} mr={2} src={theme.footer.logo} />
          </Link>
          <Flex mt={{ base: 2, md: 0 }}>
            <SocialMenuRender iconSize={5} isThemed />
          </Flex>
        </Flex>
        <Text
          color="gray.400"
          textAlign={{ base: "center", md: "left" }}
          variant="body3"
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
      direction={{ base: "column", md: "row" }}
      justifyContent="center"
      mx={1}
      px={12}
      py={4}
    >
      <Flex align="center" direction="row" gap={1} mb={{ base: 2, md: 0 }}>
        <SocialMenuRender iconSize={5} />
      </Flex>
      {isMobile && <InformationFooter />}
    </Flex>
  );
};

export default Footer;
