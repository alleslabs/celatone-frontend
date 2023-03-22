import { Flex, Heading, Text, Switch } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { NewProposalButton } from "lib/components/button/NewProposalButton";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

const Proposals = observer(() => {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROPOSALS);
  }, [router.isReady]);

  return (
    <PageContainer>
      <Flex justify="space-between">
        <Heading as="h5" variant="h5">
          Proposals
        </Heading>
        <NewProposalButton />
      </Flex>
      <Flex direction="column" my={8} gap={8}>
        <Flex justify="space-between">
          {/* TODO - Wireup search bar */}
          <InputWithIcon
            placeholder="Search with Proposal ID or Proposal Title"
            onChange={() => {}}
            size="lg"
            value="Value"
          />
          <Flex gap={2} alignItems="center" justify="center" minW="200px">
            <Switch size="md" />
            <Text>My Proposals</Text>
          </Flex>
        </Flex>
        <Flex gap={2}>
          {/* TODO - Add filter by status  */}
          <Flex>Filter by Status</Flex>
          {/* TODO - Add filter by type */}
          <Flex>Filter by Type</Flex>
        </Flex>
      </Flex>
      {/* TODO - add table */}
      <Text>Table</Text>
    </PageContainer>
  );
});

export default Proposals;
