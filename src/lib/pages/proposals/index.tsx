import { Flex, Heading } from "@chakra-ui/react";

import { useGovConfig, useMobile, useTierConfig } from "lib/app-provider";
import { NewProposalButton } from "lib/components/button/NewProposalButton";
import PageContainer from "lib/components/PageContainer";
import { CelatoneSeo } from "lib/components/Seo";
import { UserDocsLink } from "lib/components/UserDocsLink";

import { ProposalsTableFull } from "./components/ProposalsTableFull";
import { ProposalsTableLite } from "./components/ProposalsTableLite";

const Proposals = () => {
  useGovConfig({ shouldRedirect: true });
  const isMobile = useMobile();
  const isFullTier = useTierConfig() === "full";

  return (
    <PageContainer>
      <CelatoneSeo pageName="Proposals" />
      <Flex justify="space-between" alignItems="center">
        <Heading as="h5" variant="h5">
          Proposals
        </Heading>
        <Flex gap={4} align="center">
          <UserDocsLink
            href="introduction/overview#recent-proposals"
            isButton
          />
          {!isMobile && <NewProposalButton />}
        </Flex>
      </Flex>
      {isFullTier ? <ProposalsTableFull /> : <ProposalsTableLite />}
    </PageContainer>
  );
};

export default Proposals;
