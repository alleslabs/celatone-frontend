import { Button, Flex, Icon, Text } from "@chakra-ui/react";
import { FiChevronLeft } from "react-icons/fi";

import type { ContractAddr, Option } from "lib/types";

interface MigrateContractProps {
  isAdmin: boolean;
  contractAddress: ContractAddr;
  codeId: Option<number>;
  handleBack: () => void;
}

export const MigrateContract = ({
  isAdmin,
  contractAddress,
  codeId,
  handleBack,
}: MigrateContractProps) => {
  return (
    <>
      <Text>{isAdmin}</Text>
      <Text>{contractAddress}</Text>
      <Text>{codeId}</Text>
      <Flex justify="space-between" w="100%" mt="32px">
        <Button
          size="md"
          variant="outline-gray"
          w="128px"
          leftIcon={
            <Icon as={FiChevronLeft} color="text.dark" fontSize="18px" />
          }
          onClick={handleBack}
        >
          Back
        </Button>
        {/* <Button
          size="md"
          variant="primary"
          w="128px"
          disabled={!estimatedFee || !wasmFile || descStatus.state === "error"}
          onClick={proceed}
        >
          Upload
        </Button> */}
      </Flex>
    </>
  );
};
