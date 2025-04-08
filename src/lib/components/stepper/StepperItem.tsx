import { Flex, Text } from "@chakra-ui/react";

import type { Mode, Step } from "./types";

import { CustomIcon } from "../icon";

export const stepperText: Record<Mode, Record<number, string>> = {
  deploy: { 1: "Upload or select code ID", 2: "Instantiate contract" },
  migrate: { 1: "Migrate options", 2: "Migrate details" },
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
    align="center"
    backgroundColor={disabled ? "stepper.disabled.bg" : "stepper.active.bg"}
    borderRadius="50%"
    height="24px"
    justify="center"
    width="24px"
  >
    {currentStep > step ? (
      <CustomIcon
        boxSize={3}
        color={disabled ? "stepper.disabled.color" : "stepper.active.color"}
        name="check"
      />
    ) : (
      <Text
        color={disabled ? "stepper.disabled.color" : "stepper.active.color"}
        variant="body3"
      >
        {step}
      </Text>
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
          backgroundColor: "gray.400",
          marginInlineEnd: "8px",
        },
      }}
    >
      <StepLabel currentStep={currentStep} disabled={disabled} step={step} />
      <Text
        color={disabled ? "text.dark" : "text.main"}
        fontWeight={disabled ? 400 : 700}
        variant="body2"
      >
        {stepperText[mode][step]}
      </Text>
    </Flex>
  );
};
