import { Heading, Text } from "@chakra-ui/react";
import { useState } from "react";

import WasmPageContainer from "lib/components/WasmPageContainer";
import type { ContractAddr } from "lib/types";

interface UpdateAdminProps {
  contractAddr?: ContractAddr;
}

const UpdateAdmin = ({
  contractAddr = "" as ContractAddr,
}: UpdateAdminProps) => {
  const [contractAddress] = useState(contractAddr);

  return (
    <WasmPageContainer>
      <Heading as="h4" variant="h4">
        Update Admin
      </Heading>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        {contractAddress}
      </Text>
    </WasmPageContainer>
  );
};

export default UpdateAdmin;
