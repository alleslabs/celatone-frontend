import { Flex, Text, Icon, Button } from "@chakra-ui/react";
import Link from "next/link";
import { BiUserVoice } from "react-icons/bi";
import { BsMedium, BsGithub, BsTwitter, BsTelegram } from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";

const Footer = () => {
  const socialMenu = [
    {
      url: "https://github.com/alleslabs",
      icon: BsGithub,
      slug: "github",
    },
    {
      url: "https://twitter.com/celatone_",
      icon: BsTwitter,
      slug: "twitter",
    },
    {
      url: "https://medium.com/alles-labs",
      icon: BsMedium,
      slug: "medium",
    },
    {
      url: "https://t.me/celatone",
      icon: BsTelegram,
      slug: "telegram",
    },
  ];
  return (
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
          <Link
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            key={`seocial-${item.slug}`}
          >
            <Button variant="ghost" size="xs">
              <Icon
                as={item.icon}
                width="16px"
                height="16px"
                color="gray.600"
              />
            </Button>
          </Link>
        ))}
        <Link
          href="https://alleslabs.canny.io/celatone"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="xs">
            <Flex gap={1} align="center">
              <Icon
                as={BiUserVoice}
                width="18px"
                height="18px"
                color="gray.600"
              />
              <Text variant="body3" color="gray.600">
                Feedback
              </Text>
            </Flex>
          </Button>
        </Link>
      </Flex>
      <Flex direction="column" alignItems="end" minW="60px">
        <Button
          variant="ghost"
          size="xs"
          sx={{ _hover: { "> div > svg": { opacity: "100" } } }}
        >
          <Link href="https://twitter.com/alleslabs">
            <Flex
              gap={1}
              align="center"
              sx={{ _hover: { "> svg": { opacity: "100" } } }}
            >
              <Icon
                as={IoSparklesSharp}
                width="16px"
                height="16px"
                color="gray.600"
                opacity="0"
                transition="all .25s ease-in-out"
              />
              <Text variant="body3" color="gray.600">
                Made by
              </Text>
              <Text variant="body3" color="primary.main">
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
