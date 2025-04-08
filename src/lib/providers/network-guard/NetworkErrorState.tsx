import { Button, Flex, Heading, Image, Text } from "@chakra-ui/react";
import { FALLBACK_THEME } from "config/theme";
import { useRouter } from "next/router";

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
      <Image alt="Scan" src={FALLBACK_THEME.branding.logo} width="300px" />
      <Flex
        align="center"
        flexDir="column"
        sx={{ "& > p": { lineHeight: "22px" } }}
      >
        <Image
          alt="config_not_found"
          src={FALLBACK_THEME.illustration.searchNotFound}
          width="152px"
        />
        <Heading as="h5" color="text.dark" mb={1} mt={6} variant="h5">
          Network error
        </Heading>
        <Text color="text.dark" fontWeight={500} variant="body2">
          The network you chose is currently unavailable. Here are a few
          possibilities:
        </Text>
        {bullets.map((bullet) => (
          <Text
            key={bullet}
            alignSelf="start"
            color="text.dark"
            fontWeight={500}
            variant="body2"
          >
            <Text as="span" color="text.dark" mx={2}>
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
        Go to Homepage
      </Button>
    </Flex>
  );
};
