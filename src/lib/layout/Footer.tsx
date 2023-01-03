import { Flex, Text, Icon } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import { IoLogoGithub, IoLogoTwitter } from "react-icons/io";

const Footer = () => {
  return (
    <Flex>
      <Flex
        as="footer"
        width="full"
        align="end"
        justifyContent="space-between"
        p={12}
        mx={1}
        backgroundColor="gray.900"
      >
        <Flex direction="column" gap={2}>
          <Link href="/">
            <Image
              src="/celatone-logo.svg"
              alt="Celatone"
              width={100}
              height={4}
            />
          </Link>
          <Text variant="body3" color="text.dark">
            Deploy, explore, interact, and organize CosmWasm contracts with ease
            using Celatone. <br />
            Our tool makes it easy to interact with smart contracts on various
            networks.
          </Text>
        </Flex>
        <Flex direction="column" gap={2} alignItems="end">
          <Flex gap={4}>
            <Link href="https://github.com/alleslabs" target="_blank">
              <Icon
                as={IoLogoGithub}
                width="24px"
                height="24px"
                color="gray.600"
                transition="all .2s"
                _hover={{ color: "gray.500" }}
                cursor="pointer"
              />
            </Link>
            <Link href="https://twitter.com/celatone_" target="_blank">
              <Icon
                as={IoLogoTwitter}
                width="24px"
                height="24px"
                color="gray.600"
                transition="all .2s"
                _hover={{ color: "gray.500" }}
                cursor="pointer"
              />
            </Link>
          </Flex>
          <Flex gap={1}>
            <Text variant="body3">Made by </Text>
            <Link href="/">
              <Text variant="body3" color="primary.main">
                Alles Labs
              </Text>
            </Link>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
