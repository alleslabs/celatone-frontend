import { Heading, Text } from "@chakra-ui/react";

import { ButtonCard } from "lib/components/ButtonCard";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";

const Migrate = () => {
  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        MIGRATE CONTRACT
      </Text>
      <Stepper currentStep={1} />
      <Heading as="h4" variant="h4" my="48px">
        Migrate Contract
      </Heading>
      {/* Select Migrate Contract modal */}
      <ButtonCard
        title="Upload new WASM File"
        description="Deploy contract by upload new Wasm file"
        onClick={() => {}}
        mb="16px"
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from stored codes or your saved codes"
        onClick={() => {}}
      />
    </WasmPageContainer>
  );
};

export default Migrate;
