import type { BoxProps, ButtonProps } from "@chakra-ui/react";

import { Button } from "@chakra-ui/react";
import { AmpEvent, track } from "lib/amplitude";

import { CustomIcon } from "../icon";
import { CopyTemplate } from "./CopyTemplate";

interface CopyButtonProps extends ButtonProps {
  isDisable?: boolean;
  value: string;
  copyLabel?: string;
  hasIcon?: boolean;
  buttonText?: string;
  amptrackSection?: string;
  amptrackSubSection?: string;
  amptrackInfo?: string;
  iconGap?: number;
  w?: BoxProps["width"];
}

export const CopyButton = ({
  isDisable,
  value,
  size = "sm",
  copyLabel,
  hasIcon = true,
  variant = "outline-white",
  buttonText = "Copy",
  amptrackSection,
  amptrackSubSection,
  amptrackInfo,
  ml,
  w,
  iconGap,
  ...buttonProps
}: CopyButtonProps) => (
  <CopyTemplate
    copyLabel={copyLabel}
    isDisabled={isDisable}
    ml={ml}
    triggerElement={
      <Button
        float="right"
        isDisabled={isDisable}
        size={size}
        variant={variant}
        w={w}
        onClick={() =>
          track(AmpEvent.USE_COPY_BUTTON, {
            section: amptrackSection,
            subSection: amptrackSubSection,
            info: amptrackInfo,
          })
        }
        {...buttonProps}
        borderRadius={size === "xs" ? 6 : 8}
      >
        {hasIcon && (
          <CustomIcon
            boxSize={size === "xs" ? 3 : 4}
            mr={iconGap}
            name="copy"
          />
        )}
        {buttonText}
      </Button>
    }
    value={value}
    w={w}
  />
);
