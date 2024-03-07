import PageContainer from "lib/components/PageContainer";

import { VotingPowerChart } from "./components/VotingPowerChart";

const ValidatorDetails = () => {
  // const { data } = useValidatorHistoricalPowers(
  //   zValidatorAddr.parse("seivaloper1qnn8rvtlfya3u4qvryqtjnc6gum4ltajvgyjam")
  // );

  return (
    <PageContainer>
      <VotingPowerChart currency="OSMO" />
    </PageContainer>
  );
};

export default ValidatorDetails;
