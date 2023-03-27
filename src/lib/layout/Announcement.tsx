import { Flex, Text } from "@chakra-ui/react";
import Link from "next/link";

import { CustomIcon } from "lib/components/icon";

const Announcement = () => {
  return (
    <Flex
      width="100vw"
      height="40px"
      align="center"
      justifyContent="space-between"
      px={6}
      mb={1}
      gap="24px"
      bgColor="violet.darker"
    >
      <Flex />
      <Flex gap={2}>
        <Text>New Update V.1.0.2 – Osmosis Pool Page Now Available </Text>
        <Link
          href="https://celat.one/releases"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text color="lilac.main" textDecoration="underline">
            See Detail
          </Text>
        </Link>
      </Flex>
      <CustomIcon name="close" color="violet.light" />
    </Flex>
  );
};

export default Announcement;
