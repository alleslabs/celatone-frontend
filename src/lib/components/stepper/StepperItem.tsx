import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { CURR_THEME } from "env";

import type { Mode, Step } from "./types";

export const stepperText: Record<Mode, Record<number, string>> = {
  deploy: { 1: "Upload or Select Code ID", 2: "Instantiate Contract" },
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
    backgroundColor={
      disabled ? CURR_THEME.stepper.disabled.bg : CURR_THEME.stepper.active.bg
    }
    width="24px"
    height="24px"
    borderRadius="50%"
  >
    {currentStep > step ? (
      <CustomIcon
        name="check"
        color={
          disabled
            ? CURR_THEME.stepper.disabled.color
            : CURR_THEME.stepper.active.color
        }
        boxSize={3}
      />
    ) : (
      <Text
        variant="body3"
        color={
          disabled
            ? CURR_THEME.stepper.disabled.color
            : CURR_THEME.stepper.active.color
        }
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
