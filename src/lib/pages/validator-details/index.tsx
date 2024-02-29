import PageContainer from "lib/components/PageContainer";

import { ValidatorTop } from "./components/ValidatorTop";
import { VotingPowerChart } from "./components/VotingPowerChart";

const ValidatorDetails = () => {
  return (
    <>
      <ValidatorTop />
      <PageContainer>
        <VotingPowerChart currency="OSMO" />
      </PageContainer>
    </>
  );
};

export default ValidatorDetails;
