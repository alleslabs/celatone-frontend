import type { ButtonProps } from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";
import { CustomIcon } from "lib/components/icon";

type TriggerVariant = "change-module" | "select-module";

const buttonStyles: { [key in TriggerVariant]: ButtonProps } = {
  "change-module": {
    leftIcon: <CustomIcon boxSize={3} name="swap" />,
    variant: "outline-white",
  },
  "select-module": {
    variant: "primary",
  },
};

interface ModuleSelectDrawerTriggerProps {
  buttonText?: string;
  onOpen: () => void;
  triggerVariant: TriggerVariant;
}

export const ModuleSelectDrawerTrigger = ({
  buttonText = "Select module",
  onOpen,
  triggerVariant,
}: ModuleSelectDrawerTriggerProps) => (
  <Button
    {...buttonStyles[triggerVariant]}
    ml={{ md: "auto" }}
    size={{ base: "sm", md: "md" }}
    onClick={() => {
      track(AmpEvent.USE_MODULE_SELECTION_DRAWER, {
        label: buttonText,
      });
      onOpen();
    }}
  >
    {buttonText}
  </Button>
);
