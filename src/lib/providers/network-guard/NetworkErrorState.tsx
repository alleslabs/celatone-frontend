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
      flexDir="column"
      align="center"
      justifyContent="center"
      gap="48px"
      h="100vh"
      bg="background.main"
    >
      <Image src={FALLBACK_THEME.branding.logo} alt="Celatone" width="300px" />
      <Flex
        flexDir="column"
        align="center"
        sx={{ "& > p": { lineHeight: "22px" } }}
      >
        <Image
          src={FALLBACK_THEME.illustration.searchNotFound}
          alt="config_not_found"
          width="152px"
        />
        <Heading as="h5" variant="h5" mt={6} mb={1} color="text.dark">
          Network Error
        </Heading>
        <Text fontWeight={500} color="text.dark" variant="body2">
          The network you chose is currently unavailable. Here are a few
          possibilities:
        </Text>
        {bullets.map((bullet) => (
          <Text
            key={bullet}
            fontWeight={500}
            color="text.dark"
            variant="body2"
            alignSelf="start"
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
