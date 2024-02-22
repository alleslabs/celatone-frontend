import PageContainer from "lib/components/PageContainer";

import { VotingPowerChart } from "./components/VotingPowerChart";

const ValidatorDetails = () => {
  return (
    <PageContainer>
      <VotingPowerChart currency="OSMO" />
    </PageContainer>
  );
};

export default ValidatorDetails;
