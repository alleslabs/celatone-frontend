import { Badge, Text, Flex, Heading } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";

import { SaveAccountButton } from "./components/SaveAccountButton";

const SavedAccounts = observer(() => {
  return (
    <PageContainer>
      <Flex alignItems="center" justifyContent="space-between" mb={4}>
        <Flex direction="column">
          <Flex alignItems="center">
            <Heading
              variant="h5"
              as="h5"
              minH="36px"
              display="flex"
              alignItems="center"
            >
              Saved Accounts
            </Heading>
            <Badge variant="primary" ml={2}>
              0
            </Badge>
          </Flex>
          <Text>Your saved accounts will be stored locally</Text>
        </Flex>
        <SaveAccountButton />
      </Flex>
      {/* <InputWithIcon
          placeholder="Search with Code ID or Code Name"
          value={keyword}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setValue("keyword", e.target.value)
          }
          size="lg"
        /> */}
      <EmptyState
        imageVariant="empty"
        message="Account saved using Celatone will display here. Saved accounts are stored locally on your device."
        withBorder
      />
    </PageContainer>
  );
});

export default SavedAccounts;
