import type { EvmVerifyInfo } from "lib/types";

import { Box, Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { formatUTC } from "lib/utils";

import { EvmVerifyProcessStepIcon } from "./EvmVerifyProcessStepIcon";
import { getProcessSteps } from "./utils";

interface EvmVerifyProcessProps {
  evmVerifyInfo: EvmVerifyInfo;
}

export const EvmVerifyProcess = ({ evmVerifyInfo }: EvmVerifyProcessProps) => {
  const isMobile = useMobile();
  const steps = getProcessSteps(evmVerifyInfo);

  return (
    <Flex direction="column">
      <Text fontWeight={600} variant="body1">
        Verification process
      </Text>
      <Flex direction="column" mt={4}>
        {steps.map((step, index) => (
          <Flex key={step.label} justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              <Flex alignItems="center" direction="column" height="full">
                <EvmVerifyProcessStepIcon state={step.state} />
                {index < steps.length - 1 && (
                  <Box
                    borderColor="gray.400"
                    borderLeft="1px solid"
                    height="full"
                    left="50%"
                  />
                )}
              </Flex>
              <Flex direction="column">
                <Text fontWeight={600} mt="2px" variant="body2">
                  {step.label}
                </Text>
                {isMobile && step.timestamp && (
                  <Text color="gray.500" variant="body2">
                    {formatUTC(step.timestamp)}
                  </Text>
                )}
                <Box height={4} />
              </Flex>
            </Flex>
            <Flex>
              {!isMobile && step.timestamp && (
                <Text color="gray.500" variant="body2">
                  {formatUTC(step.timestamp)}
                </Text>
              )}
              {step.state === "In Progress" && (
                <Text color="success.main" variant="body2">
                  {step.state}
                </Text>
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
