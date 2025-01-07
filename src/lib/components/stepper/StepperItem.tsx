import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";

import type { Mode, Step } from "./types";

export const stepperText: Record<Mode, Record<number, string>> = {
  deploy: { 1: "Upload or Select Code ID", 2: "Instantiate Contract" },
  migrate: { 1: "Migrate Options", 2: "Migrate Details" },
};

const StepLabel = ({
  currentStep,
  disabled,
  step,
}: {
  currentStep: Step;
  disabled?: boolean;
  step: Step;
}) => (
  <Flex
    width="24px"
    align="center"
    height="24px"
    justify="center"
    backgroundColor={disabled ? "stepper.disabled.bg" : "stepper.active.bg"}
    borderRadius="50%"
  >
    {currentStep > step ? (
      <CustomIcon
        name="check"
        boxSize={3}
        color={disabled ? "stepper.disabled.color" : "stepper.active.color"}
      />
    ) : (
      <Text
        variant="body3"
        color={disabled ? "stepper.disabled.color" : "stepper.active.color"}
      >
        {step}
      </Text>
    )}
  </Flex>
);

export const StepperItem = ({
  currentStep,
  mode,
  step,
}: {
  currentStep: Step;
  mode: Mode;
  step: Step;
}) => {
  const disabled = currentStep < step;
  return (
    <Flex
      align="center"
      gap={2}
      sx={{
        "&:not(:last-of-type)::after": {
          backgroundColor: "gray.400",
          content: '""',
          flex: 1,
          height: "1px",
          marginInlineEnd: "8px",
        },
        ":not(:last-of-type)": { flex: 1 },
      }}
    >
      <StepLabel currentStep={currentStep} disabled={disabled} step={step} />
      <Text
        variant="body2"
        color={disabled ? "text.dark" : "text.main"}
        fontWeight={disabled ? 400 : 700}
      >
        {stepperText[mode][step]}
      </Text>
    </Flex>
  );
};
