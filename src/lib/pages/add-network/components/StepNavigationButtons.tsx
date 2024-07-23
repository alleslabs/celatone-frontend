import { Box, Button, Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "lib/components/icon";

interface StepNavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
}

export const StepNavigationButtons = ({
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
}: StepNavigationButtonsProps) => (
  <Box
    w="full"
    minH="70px"
    background="background.main"
    bottom="0"
    borderTop="1px solid"
    borderColor="gray.700"
    position="sticky"
    zIndex={2}
    id="footer-cta"
  >
    <Flex
      w={640}
      h="full"
      mx="auto"
      direction="column"
      align="center"
      py={4}
      gap={2}
    >
      <Flex align="center" justify="space-between" w="full">
        <Button minW="128px" onClick={prevStep} isDisabled={currentStep === 0}>
          Previous
        </Button>
        <Button
          minW="128px"
          pr={1}
          onClick={nextStep}
          rightIcon={<CustomIcon name="chevron-right" />}
          isDisabled={currentStep === totalSteps - 1}
        >
          Next
        </Button>
      </Flex>
      <Text variant="body2" color="text.dark" textAlign="center">
        The custom Minitia you add on Initiascan will only be stored locally on
        your device.
      </Text>
    </Flex>
  </Box>
);
