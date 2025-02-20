import { Box, Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import type { EvmVerifyInfo } from "lib/types";
import { getProcessSteps } from "./utils";
import { formatUTC } from "lib/utils";
import { EvmVerifyProcessStepIcon } from "./EvmVerifyProcessStepIcon";

interface EvmVerifyProcessProps {
  evmVerifyInfo: EvmVerifyInfo;
}

export const EvmVerifyProcess = ({ evmVerifyInfo }: EvmVerifyProcessProps) => {
  const isMobile = useMobile();
  const steps = getProcessSteps(evmVerifyInfo);

  return (
    <Flex direction="column">
      <Text fontWeight={600} variant="body1">
        Verification Process
      </Text>
      <Flex direction="column" mt={4}>
        {steps.map((step, index) => (
          <Flex key={step.label} justifyContent="space-between">
            <Flex gap={2} alignItems="center">
              <Flex direction="column" alignItems="center" height="full">
                <EvmVerifyProcessStepIcon state={step.state} />
                {index < steps.length - 1 && (
                  <Box
                    left="50%"
                    height="full"
                    borderLeft="1px solid"
                    borderColor="gray.400"
                  />
                )}
              </Flex>
              <Flex direction="column">
                <Text variant="body2" fontWeight={600} mt="2px">
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
                <Text variant="body2" color="success.main">
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
