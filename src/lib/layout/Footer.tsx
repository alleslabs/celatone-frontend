import { Flex, Text, Button, Image } from "@chakra-ui/react";
import Link from "next/link";

import { CURR_THEME } from "env";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { AmpEvent, AmpTrack, AmpTrackCelatone } from "lib/services/amplitude";

interface SocialMenuType {
  url: string | undefined;
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
    icon: "reddit-solid",
    slug: "reddit",
  },
  {
    url: CURR_THEME.socialMedia?.linkedin,
    icon: "medium",
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
            <Image src={CURR_THEME.footer?.logo} h={8} mr={2} />
          </Link>
          {themedSocial.map((item) => (
            <>
              {item.url && (
                <Link
                  key={`social-${item.slug}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => AmpTrackCelatone(item.url ?? "")}
                >
                  <Button variant="ghost-gray" size="xs" px={0}>
                    <CustomIcon name={item.icon} boxSize={5} color="gray.600" />
                  </Button>
                </Link>
              )}
            </>
          ))}
        </Flex>
        <Text variant="body3" color="gray.400">
          {CURR_THEME.footer?.description}
        </Text>
      </Flex>
      <Flex direction="row" alignItems="end" minW="60px">
        <Button
          variant="ghost-gray"
          size="xs"
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
        </Button>
        <Link
          href="https://feedback.alleslabs.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => AmpTrack(AmpEvent.FEEDBACK)}
        >
          <Button variant="ghost-gray" size="xs" pl="1" mr="1">
            <Flex gap={1} align="center">
              <CustomIcon name="feedback" color="gray.600" />
              <Text variant="body3" color="text.dark">
                Feedback
              </Text>
            </Flex>
          </Button>
        </Link>
        <Flex direction="row" gap={1} align="center">
          {socialMenu.map((item) => (
            <>
              {item.url && (
                <Link
                  key={`themed-${item.slug}`}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => AmpTrackCelatone(item.url ?? "")}
                >
                  <Button variant="ghost-gray" size="xs" px={0}>
                    <CustomIcon name={item.icon} boxSize={4} color="gray.600" />
                  </Button>
                </Link>
              )}
            </>
          ))}
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
        {socialMenu.map((item) => (
          <>
            {item.url && (
              <Link
                key={`social-${item.slug}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => AmpTrackCelatone(item.url ?? "")}
              >
                <Button variant="ghost-gray" size="xs" px={1}>
                  <CustomIcon name={item.icon} boxSize={5} color="gray.600" />
                </Button>
              </Link>
            )}
          </>
        ))}
        <Link
          href="https://feedback.alleslabs.com"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => AmpTrack(AmpEvent.FEEDBACK)}
        >
          <Button variant="ghost-gray" size="xs">
            <Flex gap={1} align="center">
              <CustomIcon name="feedback" color="gray.600" />
              <Text variant="body3" color="text.dark">
                Feedback
              </Text>
            </Flex>
          </Button>
        </Link>
      </Flex>
      <Flex direction="column" alignItems="end" minW="60px">
        <Button
          variant="ghost-gray"
          size="xs"
          sx={{ _hover: { "> div > svg": { opacity: "100" } } }}
        >
          <Link
            href="https://twitter.com/alleslabs"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => AmpTrack(AmpEvent.ALLESLABS)}
          >
            <Flex
              gap={1}
              align="center"
              sx={{ _hover: { "> div": { opacity: "100" } } }}
            >
              <Flex opacity="0" transition="all .25s ease-in-out">
                <CustomIcon name="alles" />
              </Flex>
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
        </Button>
      </Flex>
    </Flex>
  );
};

export default Footer;
