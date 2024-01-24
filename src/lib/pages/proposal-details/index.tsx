import { useRouter } from "next/router";

import PageContainer from "lib/components/PageContainer";
import { InvalidState } from "lib/components/state";

import { ProposalDetailBody } from "./components/ProposalDetailsBody";
import { ProposalTop } from "./components/ProposalTop";
import type { ProposalDetailsQueryParams } from "./type";
import { zProposalDetailsQueryParams } from "./type";

const ProposalDetailsBody = ({
  id,
  tab,
  voteTab,
}: ProposalDetailsQueryParams) => {
  // TODO Mock up
  if (id === 999) return <InvalidState title="Proposal does not exist" />;
  return (
    <>
      <ProposalTop id={id} />
      <ProposalDetailBody id={id} tab={tab} voteTab={voteTab} />
    </>
  );
};
export const ProposalDetails = () => {
  const router = useRouter();

  const validated = zProposalDetailsQueryParams.safeParse(router.query);

  return (
    <PageContainer>
      {!validated.success ? (
        <InvalidState title="Proposal does not euuuxist" />
      ) : (
        <ProposalDetailsBody {...validated.data} />
      )}
    </PageContainer>
  );
};
