import { Flex, Heading, Text, Grid, Switch } from "@chakra-ui/react";
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
      <Grid templateColumns="1fr repeat(3, max(240px))" gap={2} my={8}>
        {/* TODO - Wireup search bar */}
        <InputWithIcon
          placeholder="Search with Proposal ID or Proposal Title"
          onChange={() => {}}
          size="lg"
          value="Value"
        />
        {/* TODO - Add filter by status  */}
        <Flex>Filter by Status</Flex>
        {/* TODO - Add filter by type */}
        <Flex>Filter by Type</Flex>
        <Flex gap={2} alignItems="center" justify="center">
          <Switch size="md" />
          <Text>My Proposals</Text>
        </Flex>
      </Grid>
      {/* TODO - add table */}
      <Text>Table</Text>
    </PageContainer>
  );
});

export default Proposals;
