import { useRouter } from "next/router";

import PageContainer from "lib/components/PageContainer";
import { EmptyState } from "lib/components/state";

import { ProposalDetailBody } from "./components/ProposalDetailsBody";
import { ProposalTop } from "./components/ProposalTop";

export const ProposalDetail = () => {
  const router = useRouter();
  const proposalId = parseInt(router.query.id as string, 10);
  if (!proposalId) return <EmptyState message="not found" />;
  return (
    <PageContainer>
      <ProposalTop id={proposalId} />
      <ProposalDetailBody id={proposalId} />
    </PageContainer>
  );
};
