import { Flex, Heading, Text } from "@chakra-ui/react";

import { BackButton } from "lib/components/button";
import PageContainer from "lib/components/PageContainer";

const NotFoundPage = () => {
  return (
    <PageContainer>
      <BackButton />
      <Flex
        borderY="1px solid"
        borderColor="divider.main"
        justify="center"
        align="center"
        direction="column"
        gap={2}
        py={6}
        mt={6}
      >
        <Heading variant="h1" as="h1" color="text.disabled">
          404
        </Heading>
        <Heading variant="h5" as="h5">
          This page is not found
        </Heading>
        <Text
          color="text.disabled"
          variant="body2"
          fontWeight={500}
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
