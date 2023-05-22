import { Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpTrackInvalidState } from "lib/services/amplitude";

import { StateImage } from "./StateImage";

interface InvalidStateProps {
  title: string;
}

export const InvalidState = ({ title }: InvalidStateProps) => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) AmpTrackInvalidState(title);
  }, [router.isReady, title]);

  return (
    <Flex
      direction="column"
      alignItems="center"
      borderY="1px solid"
      borderColor="gray.700"
      width="full"
      my="24px"
      py="24px"
    >
      <StateImage imageVariant="not-found" />
      <Heading as="h5" variant="h5" my="8px">
        {title}
      </Heading>
      <Text
        variant="body2"
        fontWeight="500"
        color="text.dark"
        textAlign="center"
      >
        Please double-check your input and make sure you have selected the
        correct network.
      </Text>
    </Flex>
  );
};
