import { CopyIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import type { ButtonProps, TooltipProps } from "@chakra-ui/react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopyButtonProps extends ButtonProps {
  isDisable?: boolean;
  value: string;
  copyLabel?: string;
  hasIcon?: boolean;
  buttonText?: string;
  tooltipBgColor?: TooltipProps["bgColor"];
}

export const CopyButton = ({
  isDisable,
  value,
  size = "sm",
  copyLabel,
  hasIcon = true,
  variant = "outline-info",
  buttonText = "Copy",
  tooltipBgColor,
  ...buttonProps
}: CopyButtonProps) => (
  <CopyTemplate
    value={value}
    copyLabel={copyLabel}
    tooltipBgColor={tooltipBgColor}
    triggerElement={
      <Button
        isDisabled={isDisable}
        variant={variant}
        size={size}
        float="right"
        onClick={() => AmpTrack(AmpEvent.USE_COPY_BUTTON)}
        leftIcon={hasIcon ? <CopyIcon boxSize="4" /> : undefined}
        {...buttonProps}
      >
        {buttonText}
      </Button>
    }
  />
);
