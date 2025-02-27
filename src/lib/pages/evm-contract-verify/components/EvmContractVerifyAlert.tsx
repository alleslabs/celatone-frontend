import { Alert, AlertDescription, Flex } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";
import { EvmVerifyOptions } from "lib/types";

interface EvmContractVerifyAlertProps {
  option: EvmVerifyOptions;
}

export const EvmContractVerifyAlert = ({
  option,
}: EvmContractVerifyAlertProps) => {
  switch (option) {
    case EvmVerifyOptions.SolidityUploadFiles:
    case EvmVerifyOptions.SolidityContractCode:
      return (
        <Alert variant="primary">
          <Flex gap={2}>
            <CustomIcon name="info-circle-solid" boxSize={4} />
            <AlertDescription>
              When verifying with the <strong>Upload Files</strong> and{" "}
              <strong>Contract Code</strong> method, we only expose configurable
              settings such as the optimizer, EVM target version, and libraries.{" "}
              <strong>
                All other settings are kept at their default values.
              </strong>{" "}
              If you require more customization, consider using the Standard
              JSON Input, Hardhat, or Foundry verification methods.
            </AlertDescription>
          </Flex>
        </Alert>
      );
    case EvmVerifyOptions.VyperUploadFile:
    case EvmVerifyOptions.VyperContractCode:
      return (
        <Alert variant="primary">
          <Flex gap={2}>
            <CustomIcon name="info-circle-solid" boxSize={4} />
            <AlertDescription>
              When verifying with the <strong>Upload File</strong> and{" "}
              <strong>Contract Code</strong> method, we only expose configurable
              settings such as the EVM target version.{" "}
              <strong>
                All other settings are kept at their default values.
              </strong>{" "}
              If you require more customization, consider using the Standard
              JSON Input verification methods.
            </AlertDescription>
          </Flex>
        </Alert>
      );
    default:
      return null;
  }
};
