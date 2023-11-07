import { Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { trackInvalidState } from "lib/amplitude";

import { StateImage } from "./StateImage";

interface InvalidStateProps {
  title: string;
}

export const InvalidState = ({ title }: InvalidStateProps) => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) trackInvalidState(title);
  }, [router.isReady, title]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      borderY="1px solid"
      borderColor="gray.700"
      width="full"
      my={6}
      py={6}
    >
      <StateImage imageVariant="not-found" />
      <Heading as="h5" variant="h5" my={2}>
        {title}
      </Heading>
      <Text variant="body2" color="text.dark" textAlign="center">
        Please double-check your input and make sure you have selected the
        correct network.
      </Text>
    </Flex>
  );
};
