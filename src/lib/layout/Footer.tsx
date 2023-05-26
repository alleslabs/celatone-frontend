import type { IconProps } from "@chakra-ui/react";
import { Flex, Text, Image } from "@chakra-ui/react";
import Link from "next/link";

import { CURR_THEME } from "env";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { AmpEvent, AmpTrack, AmpTrackSocial } from "lib/services/amplitude";

interface SocialMenuType {
  url: string;
  icon: IconKeys;
  slug: string;
}

const socialMenu: SocialMenuType[] = [
  {
    url: "https://github.com/alleslabs",
    icon: "github",
    slug: "github",
  },
  {
    url: "https://twitter.com/celatone_",
    icon: "twitter",
    slug: "twitter",
  },
  {
    url: "https://blog.alleslabs.com",
    icon: "medium",
    slug: "medium",
  },
  {
    url: "https://t.me/celatone_announcements",
    icon: "telegram",
    slug: "telegram",
  },
];

const socialSequence = {
  github: 0,
  discord: 1,
  twitter: 2,
  telegram: 3,
  medium: 4,
  reddit: 5,
  linkedin: 6,
};

const themedSocial: SocialMenuType[] = Object.entries(
  CURR_THEME.socialMedia ?? {}
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

const SocialMenuRender = ({
  isThemed,
  iconSize,
}: {
  isThemed?: boolean;
  iconSize: IconProps["boxSize"];
}) => (
  <>
    {(isThemed ? themedSocial : socialMenu).map((item) => (
      <Link
        key={`${isThemed ? "themed" : "social"}-${item.slug}`}
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          AmpTrackSocial(item.url);
        }}
      >
        <Flex
          borderRadius="8px"
          transition="all .25s ease-in-out"
          _hover={{ backgroundColor: "gray.800" }}
        >
          <CustomIcon name={item.icon} boxSize={iconSize} color="gray.600" />
        </Flex>
      </Link>
    ))}
  </>
);

const AllesFeedback = () => (
  <Link
    href="https://feedback.alleslabs.com"
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => AmpTrack(AmpEvent.FEEDBACK)}
  >
    <Flex
      gap={1}
      pr={2}
      pl={1}
      borderRadius={8}
      align="center"
      _hover={{ background: "gray.800" }}
      transition="all .25s ease-in-out"
    >
      <CustomIcon name="feedback" color="gray.600" />
      <Text variant="body3" color="text.dark">
        Feedback
      </Text>
    </Flex>
  </Link>
);

const IconLink = ({
  href,
  icon,
  text1,
  text2,
}: {
  href: string;
  icon: IconKeys;
  text1: string;
  text2: string;
}) => (
  <Link
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    onClick={() => AmpTrack(AmpEvent.ALLESLABS)}
  >
    <Flex
      gap={1}
      align="center"
      _hover={{
        "& svg": {
          opacity: 1,
        },
      }}
    >
      <CustomIcon
        name={icon}
        opacity={0}
        transition="opacity .25s ease-in-out"
      />
      <Text variant="body3" color="text.dark">
        {text1}
        <Text
          as="span"
          ml={1}
          color="secondary.main"
          transition="all .25s ease-in-out"
          _hover={{ color: "secondary.light" }}
        >
          {text2}
        </Text>
      </Text>
    </Flex>
  </Link>
);

const Footer = () => {
  const isThemed = CURR_THEME.footer;

  return isThemed ? (
    <Flex
      as="footer"
      align="end"
      justifyContent="space-between"
      px={12}
      py={6}
      mx={1}
      background="background.overlay"
    >
      <Flex direction="column" gap={2}>
        <Flex direction="row" gap={1} align="center">
          <Link
            href={CURR_THEME.socialMedia?.website ?? ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={isThemed.logo} h={8} mr={2} />
          </Link>
          <SocialMenuRender isThemed iconSize={5} />
        </Flex>
        <Text variant="body3" color="gray.400">
          {isThemed.description}
        </Text>
      </Flex>
      <Flex align="end" justifyContent="flex-end" gap={1}>
        <IconLink
          href="https://celat.one/"
          icon="celatone"
          text1="Powered by"
          text2="Celatone"
        />
        <AllesFeedback />
        <SocialMenuRender iconSize={4} />
      </Flex>
    </Flex>
  ) : (
    <Flex
      as="footer"
      align="center"
      justifyContent="space-between"
      px={12}
      py={4}
      mx={1}
    >
      <Flex direction="row" gap={1} align="center">
        <SocialMenuRender iconSize={5} />
        <AllesFeedback />
      </Flex>
      <IconLink
        href="https://twitter.com/alleslabs"
        icon="alles"
        text1="Made by"
        text2="Alles Labs"
      />
    </Flex>
  );
};

export default Footer;
