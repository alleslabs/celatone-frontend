import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopyButtonProps extends ButtonProps {
  isDisable?: boolean;
  value: string;
  copyLabel?: string;
  hasIcon?: boolean;
  buttonText?: string;
  amptrackSection?: string;
}

export const CopyButton = ({
  isDisable,
  value,
  size = "sm",
  copyLabel,
  hasIcon = true,
  variant = "outline-info",
  buttonText = "Copy",
  amptrackSection,
  ...buttonProps
}: CopyButtonProps) => (
  <CopyTemplate
    value={value}
    copyLabel={copyLabel}
    triggerElement={
      <Button
        isDisabled={isDisable}
        variant={variant}
        size={size}
        float="right"
        onClick={() =>
          AmpTrack(AmpEvent.USE_COPY_BUTTON, { section: amptrackSection })
        }
        leftIcon={
          hasIcon ? (
            <CustomIcon
              name="copy"
              color={isDisable ? "honeydew.darker" : "honeydew.main"}
              boxSize="4"
            />
          ) : undefined
        }
        {...buttonProps}
      >
        {buttonText}
      </Button>
    }
  />
);
