import { Heading, Text } from "@chakra-ui/react";

import { useInternalNavigate } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";

const Deploy = () => {
  const navigate = useInternalNavigate();
  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper currentStep={1} />
      <Heading as="h4" variant="h4" my="48px">
        Select Deploy Option
      </Heading>
      <ButtonCard
        title="Upload new WASM File"
        description="Store a new Wasm file on-chain"
        onClick={() => navigate({ pathname: "/upload" })}
        mb="16px"
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored codes or your saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
      />
    </WasmPageContainer>
  );
};

export default Deploy;
