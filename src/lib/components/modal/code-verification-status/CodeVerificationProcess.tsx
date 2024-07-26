/* eslint-disable sonarjs/no-duplicate-string */
import { Box, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

const steps = [
  {
    label: "Getting Source Code",
    timestamp: "Apr 19, 2024, 14:58:34 PM (GMT+7)",
    status: "Failed",
    errorMsg: "Wasm file name is invalid",
  },
  {
    label: "Compiling Source Code",
    timestamp: "Apr 19, 2024, 14:58:34 PM (GMT+7)",
    status: "Completed",
  },
  { label: "Comparing The Code Hash", status: "In Progress" },
  { label: "Verification Completed", status: "Pending" },
];

const ProcessIcon = ({ status }: { status: string }) => {
  switch (status) {
    case "Failed":
      return <CustomIcon name="close-circle-solid" color="error.main" />;
    case "Completed":
      return <CustomIcon name="check-circle-solid" color="primary.main" />;
    case "In Progress":
      return (
        <Flex
          m={1}
          w="16px"
          minW="16px"
          h="16px"
          minH="16px"
          background="gray.800"
          borderRadius="100%"
          border="1px solid"
          borderColor="primary.main"
        />
      );
    case "Pending":
    default:
      return (
        <Box
          m={1}
          w="16px"
          minW="16px"
          h="16px"
          minH="16px"
          background="gray.800"
          borderRadius="100%"
          border="1px solid"
          borderColor="gray.700"
        />
      );
  }
};
export const CodeVerificationProcess = () => {
  return (
    <Flex direction="column">
      <Text fontWeight={600} variant="body1">
        Verification Process
      </Text>
      <Flex direction="column" mt={4} gap={4}>
        {steps.map((step, index) => (
          <Flex key={step.label} justifyContent="space-between">
            <Flex alignItems={step.errorMsg ? "start" : "center"} gap={2}>
              <Flex position="relative">
                <ProcessIcon status={step.status} />
                {index < steps.length - 1 && (
                  <Box
                    position="absolute"
                    left="50%"
                    top="100%"
                    transform="translateX(-50%)"
                    height={step.errorMsg ? 8 : 4}
                    borderLeft="1px solid"
                    borderColor="gray.400"
                  />
                )}
              </Flex>
              <Flex direction="column">
                <Text variant="body2" fontWeight={600}>
                  {step.label}
                </Text>
                {step.errorMsg && (
                  <Text variant="body3" color="error.main">
                    {step.errorMsg}
                  </Text>
                )}
              </Flex>
            </Flex>
            <Flex>
              {step.timestamp && (
                <Text color="gray.500" variant="body2">
                  {step.timestamp}
                </Text>
              )}
              {step.status === "In Progress" && (
                <Text variant="body2" color="success.main">
                  {step.status}
                </Text>
              )}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
