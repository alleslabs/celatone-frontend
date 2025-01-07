import { Box, Flex, Text } from "@chakra-ui/react";

import { useMobile } from "lib/app-provider";
import type { WasmVerifyInfoBase } from "lib/types";
import { formatUTC } from "lib/utils";

import { getProcessSteps } from "./utils";
import { WasmVerifyProcessStepIcon } from "./WasmVerifyProcessStepIcon";

interface WasmVerifyProcessProps {
  verificationInfo: WasmVerifyInfoBase;
}

export const WasmVerifyProcess = ({
  verificationInfo,
}: WasmVerifyProcessProps) => {
  const isMobile = useMobile();
  const steps = getProcessSteps(verificationInfo);
  return (
    <Flex direction="column">
      <Text variant="body1" fontWeight={600}>
        Verification Process
      </Text>
      <Flex mt={4} direction="column">
        {steps.map((step, index) => (
          <Flex key={step.label} justifyContent="space-between">
            <Flex alignItems="center" gap={2}>
              <Flex alignItems="center" height="full" direction="column">
                <WasmVerifyProcessStepIcon state={step.state} />
                {index < steps.length - 1 && (
                  <Box
                    height="full"
                    left="50%"
                    borderColor="gray.400"
                    borderLeft="1px solid"
                  />
                )}
              </Flex>
              <Flex direction="column">
                <Text mt="2px" variant="body2" fontWeight={600}>
                  {step.label}
                </Text>
                {isMobile && step.timestamp && (
                  <Text variant="body2" color="gray.500">
                    {formatUTC(step.timestamp)}
                  </Text>
                )}
                {step.errorMsg && (
                  <Text variant="body3" color="error.main">
                    {step.errorMsg}
                  </Text>
                )}
                <Box height={4} />
              </Flex>
            </Flex>
            <Flex>
              {!isMobile && step.timestamp && (
                <Text variant="body2" color="gray.500">
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
