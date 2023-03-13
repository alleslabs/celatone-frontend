import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

import type { Mode, Step } from "./types";

export const stepperText: Record<Mode, Record<number, string>> = {
  deploy: { 1: "Upload or Select Code ID", 2: "Instantiate Code" },
  migrate: { 1: "Migrate Options", 2: "Migrate Details" },
};

const StepLabel = ({
  step,
  disabled,
  currentStep,
}: {
  step: Step;
  disabled?: boolean;
  currentStep: Step;
}) => (
  <Flex
    justify="center"
    align="center"
    backgroundColor={disabled ? "text.disabled" : "violet.main"}
    width="24px"
    height="24px"
    borderRadius="50%"
  >
    {currentStep > step ? (
      <CustomIcon name="check" color="text.main" boxSize="3" />
    ) : (
      <Text variant="body3">{step}</Text>
    )}
  </Flex>
);

export const StepperItem = ({
  mode,
  step,
  currentStep,
}: {
  mode: Mode;
  step: Step;
  currentStep: Step;
}) => {
  const disabled = currentStep < step;
  return (
    <Flex
      align="center"
      gap={2}
      sx={{
        ":not(:last-of-type)": { flex: 1 },
        "&:not(:last-of-type)::after": {
          content: '""',
          flex: 1,
          height: "1px",
          backgroundColor: "pebble.600",
          marginInlineEnd: "8px",
        },
      }}
    >
      <StepLabel step={step} disabled={disabled} currentStep={currentStep} />
      <Text
        variant="body2"
        fontWeight={disabled ? 400 : 700}
        color={disabled ? "text.disabled" : "text.main"}
      >
        {stepperText[mode][step]}
      </Text>
    </Flex>
  );
};
