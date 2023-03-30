import { Flex, Text, Link } from "@chakra-ui/react";

export const NewReleases = () => {
  return (
    <Flex
      bgColor="violet.darker"
      h="full"
      alignItems="center"
      justifyContent="center"
      position="relative"
      px={4}
    >
      <Flex gap={2}>
        <Text>New Update V.1.0.2 – Osmosis Pool Page Now Available </Text>
        <Link
          href="https://celat.one/releases"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text
            variant="body1"
            _hover={{ color: "lilac.light" }}
            color="lilac.main"
            textDecoration="underline"
            transition="all .25s ease-in-out"
          >
            See Detail
          </Text>
        </Link>
      </Flex>
    </Flex>
  );
};
