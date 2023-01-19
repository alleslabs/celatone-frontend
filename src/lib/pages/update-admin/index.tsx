import { Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import WasmPageContainer from "lib/components/WasmPageContainer";
import { useValidateAddress } from "lib/hooks";
import { getFirstQueryParam } from "lib/utils";

const UpdateAdmin = () => {
  const router = useRouter();
  const { validateContractAddress } = useValidateAddress();

  const contractAddressParam = getFirstQueryParam(router.query.contract);

  const [contractAddress] = useState(
    !validateContractAddress(contractAddressParam)
      ? contractAddressParam
      : undefined
  );

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
