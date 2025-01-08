import { Flex, Heading, Image, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { AmpEvent, track } from "lib/amplitude";
import { useCelatoneApp } from "lib/app-provider";
import { BackButton } from "lib/components/button";
import PageContainer from "lib/components/PageContainer";

const NotFoundPage = () => {
  const router = useRouter();
  const { theme } = useCelatoneApp();

  useEffect(() => {
    if (router.isReady) track(AmpEvent.TO_NOT_FOUND);
  }, [router.isReady]);

  return (
    <PageContainer>
      <BackButton />
      <Flex
        align="center"
        gap={2}
        justify="center"
        mt={6}
        py={12}
        borderColor="gray.700"
        borderY="1px solid"
        direction="column"
      >
        <Image
          width="404px"
          alt="page not found"
          src={theme.illustration["404"]}
        />
        <Heading as="h5" mt={8} variant="h5" color="text.main">
          This page is not found
        </Heading>
        <Text
          lineHeight="24px"
          textAlign="center"
          variant="body2"
          color="text.dark"
        >
          Sorry, we couldn’t find the page you are looking for.
          <br />
          Please ensure the spelling or make sure you have selected the correct
          network.
        </Text>
      </Flex>
    </PageContainer>
  );
};

export default NotFoundPage;
