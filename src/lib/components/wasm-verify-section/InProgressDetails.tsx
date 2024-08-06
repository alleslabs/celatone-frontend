import { Button, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { WasmVerifyStatusModal } from "lib/components/modal";
import type { BechAddr32, WasmVerifyInfoBase } from "lib/types";

interface InProgressDetailsProps {
  codeId: number;
  codeHash: string;
  verificationInfo: WasmVerifyInfoBase;
  relatedVerifiedCodes: number[];
  contractAddress?: BechAddr32;
}

export const InProgressDetails = ({
  codeId,
  codeHash,
  verificationInfo,
  relatedVerifiedCodes,
  contractAddress,
}: InProgressDetailsProps) => (
  <Flex
    direction={{ base: "column", md: "row" }}
    justifyContent="space-between"
    w="full"
    gap={{ base: 2 }}
    alignItems={{ base: "flex-start", md: "center" }}
  >
    {contractAddress ? (
      <Flex
        alignItems={{ base: "flex-start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={2}
      >
        <CustomIcon name="hourglass" boxSize={4} ml={0} color="gray.400" />
        <Flex>
          <Text variant="body2" color="text.dark">
            This contract is an instance of code ID{" "}
            <Text color="secondary.main" display="inline-flex">
              {codeId}
            </Text>{" "}
            which is currently undergoing verification. This can take several
            hours, depending on the code complexity.
          </Text>
        </Flex>
      </Flex>
    ) : (
      <Text variant="body2" color="text.dark">
        Code verification is in progress and may take several hours depending on
        code complexity.
      </Text>
    )}
    <WasmVerifyStatusModal
      codeHash={codeHash}
      verificationInfo={verificationInfo}
      relatedVerifiedCodes={relatedVerifiedCodes}
      triggerElement={
        <Button variant="ghost-primary" size="sm">
          View Verification Details
        </Button>
      }
    />
  </Flex>
);
