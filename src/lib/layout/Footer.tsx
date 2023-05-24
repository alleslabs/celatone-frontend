import { Flex, Text, Button } from "@chakra-ui/react";
import Link from "next/link";

import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { AmpEvent, AmpTrack, AmpTrackCelatone } from "lib/services/amplitude";

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

const Footer = () => {
  return (
    <Flex
      as="footer"
      align="center"
      justifyContent="space-between"
      px={12}
      py={4}
      mx={1}
      direction={{ base: "column", md: "row" }}
    >
      <Flex direction="row" gap={1} align="center">
        {socialMenu.map((item) => (
          <Link
            key={`social-${item.slug}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => AmpTrackCelatone(item.url)}
          >
            <Button variant="ghost-gray" size="xs" px={1}>
              <CustomIcon name={item.icon} boxSize={5} color="gray.600" />
            </Button>
          </Link>
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
      <Flex
        direction="column"
        alignItems="end"
        minW="60px"
        mt={{ base: 2, md: 0 }}
      >
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
                mr={{ base: 6, md: 0 }}
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
