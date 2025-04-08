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
    justify="center"
    align="center"
    backgroundColor={disabled ? "stepper.disabled.bg" : "stepper.active.bg"}
    width="24px"
    height="24px"
    borderRadius="50%"
  >
    {currentStep > step ? (
      <CustomIcon
        name="check"
        color={disabled ? "stepper.disabled.color" : "stepper.active.color"}
        boxSize={3}
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
      <StepLabel step={step} disabled={disabled} currentStep={currentStep} />
      <Text
        variant="body2"
        fontWeight={disabled ? 400 : 700}
        color={disabled ? "text.dark" : "text.main"}
      >
        {stepperText[mode][step]}
      </Text>
    </Flex>
  );
};
