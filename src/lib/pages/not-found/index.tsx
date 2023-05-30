import { Flex, Heading, Text, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { CURR_THEME } from "env";
import { BackButton } from "lib/components/button";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

const NotFoundPage = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_NOT_FOUND);
  }, [router.isReady]);

  return (
    <PageContainer>
      <BackButton />
      <Flex
        borderY="1px solid"
        borderColor="gray.700"
        justify="center"
        align="center"
        direction="column"
        gap={2}
        py={12}
        mt={6}
      >
        <Image
          src={CURR_THEME.illustration.error}
          alt="page not found"
          width="404px"
        />
        <Heading variant="h5" as="h5" color="text.main" mt={8}>
          This page is not found
        </Heading>
        <Text
          color="text.dark"
          variant="body2"
          textAlign="center"
          lineHeight="24px"
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
