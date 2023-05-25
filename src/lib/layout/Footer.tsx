import { Flex, Text, Image, Button } from "@chakra-ui/react";
import Link from "next/link";

import { CURR_THEME } from "env";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { AmpEvent, AmpTrack, AmpTrackSocial } from "lib/services/amplitude";

interface SocialMenuType {
  url?: string;
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

const themedSocial: SocialMenuType[] = [
  {
    url: CURR_THEME.socialMedia?.github,
    icon: "github",
    slug: "github",
  },
  {
    url: CURR_THEME.socialMedia?.discord,
    icon: "discord",
    slug: "discord",
  },
  {
    url: CURR_THEME.socialMedia?.twitter,
    icon: "twitter",
    slug: "twitter",
  },
  {
    url: CURR_THEME.socialMedia?.telegram,
    icon: "telegram",
    slug: "telegram",
  },
  {
    url: CURR_THEME.socialMedia?.medium,
    icon: "medium",
    slug: "medium",
  },
  {
    url: CURR_THEME.socialMedia?.reddit,
    icon: "reddit",
    slug: "reddit",
  },
  {
    url: CURR_THEME.socialMedia?.linkedin,
    icon: "linkedin",
    slug: "linkedin",
  },
];

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
      <Flex direction="column" gap={2} align="start">
        <Flex direction="row" gap={1} align="center">
          <Link
            href={CURR_THEME.socialMedia?.website ?? ""}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={isThemed.logo} h={8} mr={2} />
          </Link>
          {themedSocial.map(
            (item) =>
              item.url !== undefined && (
                <Button
                  variant="ghost"
                  size="xs"
                  key={`social-${item.slug}`}
                  gap={1}
                  px={0}
                  onClick={() => AmpTrackSocial(item.url ?? "")}
                >
                  <CustomIcon name={item.icon} boxSize={5} color="gray.600" />
                </Button>
              )
          )}
        </Flex>
        <Text variant="body3" color="gray.400">
          {isThemed.description}
        </Text>
      </Flex>
      <Flex direction="row" alignItems="end" minW="60px">
        <Flex
          gap={1}
          align="center"
          sx={{ _hover: { "> div > svg": { opacity: "100" } } }}
        >
          <Link
            href="https://celat.one/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => AmpTrack(AmpEvent.ALLESLABS)}
          >
            <Flex
              gap={1}
              mr={1}
              align="center"
              sx={{ _hover: { "> div": { opacity: "100" } } }}
            >
              <Flex opacity="0" transition="all .25s ease-in-out">
                <CustomIcon name="celatone" />
              </Flex>
              <Text variant="body3" color="text.dark">
                Powered by
              </Text>
              <Text
                variant="body3"
                color="lilac.main"
                transition="all .25s ease-in-out"
                _hover={{ color: "lilac.light" }}
              >
                Celatone
              </Text>
            </Flex>
          </Link>
        </Flex>
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
            mr={1}
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
        <Flex direction="row" gap={1} align="center">
          {socialMenu.map(
            (item) =>
              item.url && (
                <Button
                  variant="ghost"
                  size="xs"
                  key={`themed-${item.slug}`}
                  gap={1}
                  px={0}
                  onClick={() => AmpTrackSocial(item.url ?? "")}
                >
                  <CustomIcon name={item.icon} boxSize={4} color="gray.600" />
                </Button>
              )
          )}
        </Flex>
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
        {socialMenu.map(
          (item) =>
            item.url && (
              <Button
                variant="ghost"
                size="xs"
                gap={1}
                px={0}
                key={`social-${item.slug}`}
                onClick={() => AmpTrackSocial(item.url ?? "")}
              >
                <CustomIcon name={item.icon} boxSize={5} color="gray.600" />
              </Button>
            )
        )}
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
            mr={1}
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
      </Flex>
      <Flex direction="column" alignItems="end" minW="60px">
        <Link
          href="https://twitter.com/alleslabs"
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
              name="alles"
              opacity={0}
              transition="opacity .25s ease-in-out"
            />
            <Text variant="body3" color="text.dark">
              Made by
            </Text>
            <Text
              variant="body3"
              color="secondary.main"
              transition="all .25s ease-in-out"
              _hover={{ color: "secondary.light" }}
            >
              Alles Labs
            </Text>
          </Flex>
        </Link>
      </Flex>
    </Flex>
  );
};

export default Footer;
