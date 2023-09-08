import { Flex, Heading, Text } from "@chakra-ui/react";

import ActionPageContainer from "lib/components/ActionPageContainer";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";

import { Footer } from "./components/Footer";

export const Script = () => {
  const DEPLOY_SCRIPT_TEXT = {
    header: "Script",
    description: `Upload .mv files to deploy one-time use Script which execute messages.`,
    connectWallet: "You need to connect wallet to proceed this action",
  };
  return (
    <>
      <ActionPageContainer>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mb={16}
        >
          <Heading as="h4" variant="h4">
            {DEPLOY_SCRIPT_TEXT.header}
          </Heading>
          <Text color="text.dark" pt={4}>
            {DEPLOY_SCRIPT_TEXT.description}
          </Text>
          <ConnectWalletAlert
            subtitle={DEPLOY_SCRIPT_TEXT.connectWallet}
            mt={12}
          />
          <Flex flexDirection="column" w="full" mt={12}>
            <Heading as="h6" variant="h6" fontWeight={600}>
              Upload .mv files(s)
            </Heading>
            <Flex
              bg="gray.900"
              border="1px solid"
              borderColor="gray.700"
              borderRadius={8}
              p={4}
              gap={4}
              mt={6}
              flexDirection="column"
            >
              {/* UPLOAD CARD */}
              add upload card here
              <Flex justifyContent="space-between" w="full">
                <Text variant="body2" color="text.dark">
                  Function Name
                </Text>
                <Text variant="body2" color="text.dark">
                  -
                </Text>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDirection="column" w="full" mt={12}>
            <Heading as="h6" variant="h6" fontWeight={600}>
              Script Input
            </Heading>
            <Flex
              bg="gray.900"
              borderRadius={8}
              py={6}
              gap={4}
              alignItems="center"
              mt={6}
              flexDirection="column"
            >
              {/* UPLOAD CARD */}
              <Text variant="body2" color="text.dark">
                Your uploading file does not require any script input.
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ActionPageContainer>
      <Footer isLoading={false} />
    </>
  );
};
