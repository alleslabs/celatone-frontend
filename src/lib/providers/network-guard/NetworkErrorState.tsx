import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { FALLBACK_THEME } from "config/theme";

const bullets = [
  "The configuration for your chosen chain hasn't been set up yet.",
  "The network you selected is no longer supported.",
  "It's possible that your link is either deprecated or misspelled.",
];

export const NetworkErrorState = () => {
  const router = useRouter();
  return (
    <Flex
      align="center"
      bg="background.main"
      flexDir="column"
      gap="48px"
      h="100vh"
      justifyContent="center"
    >
      <Image width="300px" alt="Celatone" src={FALLBACK_THEME.branding.logo} />
      <Flex
        align="center"
        flexDir="column"
        sx={{ "& > p": { lineHeight: "22px" } }}
      >
        <Image
          width="152px"
          alt="config_not_found"
          src={FALLBACK_THEME.illustration.searchNotFound}
        />
        <Heading as="h5" mb={1} mt={6} variant="h5" color="text.dark">
          Network Error
        </Heading>
        <Text variant="body2" color="text.dark" fontWeight={500}>
          The network you chose is currently unavailable. Here are a few
          possibilities:
        </Text>
        {bullets.map((bullet) => (
          <Text
            key={bullet}
            alignSelf="start"
            variant="body2"
            color="text.dark"
            fontWeight={500}
          >
            <Text as="span" mx={2} color="text.dark">
              &#x2022;
            </Text>
            {bullet}
          </Text>
        ))}
      </Flex>
      <Button
        variant="outline-primary"
        onClick={() => router.replace("/", undefined)}
      >
        Go to Celatone Homepage
      </Button>
    </Flex>
  );
};
