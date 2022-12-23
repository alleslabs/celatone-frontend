import { Badge, Button, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { BackButton } from "lib/components/button/BackButton";
import { LabelText } from "lib/components/LabelText";
import PageContainer from "lib/components/PageContainer";
import { getFirstQueryParam } from "lib/utils";

const CodeDetails = () => {
  const router = useRouter();
  const codeId = getFirstQueryParam(router.query.codeId);

  /**
   * @todos  Wireup page with data hook and component functionality/logic
   */
  return (
    <PageContainer>
      <BackButton />
      {/* Code ID and CTAs Section */}
      {/* TODO: Wireup CTAs logic and render ExplorerLink for Code ID */}
      <Flex align="center" justify="space-between" mt={6}>
        <Flex direction="column" gap={1}>
          <Heading as="h5" variant="h5">
            {codeId}
          </Heading>
          <Flex gap={2}>
            <Text fontWeight={500} color="text.dark" variant="body2">
              Code ID
            </Text>
          </Flex>
        </Flex>
        <Flex gap={4}>
          <Button variant="outline-primary">Instantiate</Button>
        </Flex>
      </Flex>
      <Divider borderColor="divider.main" my={12} />
      {/* Code Information Section */}
      {/* TODO: Use real data to render LabelText */}
      <Heading as="h6" variant="h6" mb={6}>
        Code Information
      </Heading>
      <Flex justify="space-between" mb={12}>
        <LabelText label="Network">phoenix-1</LabelText>
      </Flex>
      {/* TODO: Wireup badge count, Create table component and wireup with real data */}
      <Flex mb={6} align="center">
        <Heading as="h6" variant="h6">
          Contract Instances
        </Heading>
        <Badge ml={2} variant="primary">
          19
        </Badge>
      </Flex>
      <Heading color="error.main" as="h5" variant="h5">
        Table Goes Hereeee
      </Heading>
    </PageContainer>
  );
};

export default CodeDetails;
