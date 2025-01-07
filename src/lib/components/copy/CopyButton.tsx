import { Button } from "@chakra-ui/react";
import type { BoxProps, ButtonProps } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, track } from "lib/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopyButtonProps extends ButtonProps {
  amptrackInfo?: string;
  amptrackSection?: string;
  amptrackSubSection?: string;
  buttonText?: string;
  copyLabel?: string;
  hasIcon?: boolean;
  iconGap?: number;
  isDisable?: boolean;
  value: string;
  w?: BoxProps["width"];
}

export const CopyButton = ({
  amptrackInfo,
  amptrackSection,
  amptrackSubSection,
  buttonText = "Copy",
  copyLabel,
  hasIcon = true,
  iconGap,
  isDisable,
  ml,
  size = "sm",
  value,
  variant = "outline-white",
  w,
  ...buttonProps
}: CopyButtonProps) => (
  <CopyTemplate
    isDisabled={isDisable}
    ml={ml}
    triggerElement={
      <Button
        isDisabled={isDisable}
        size={size}
        variant={variant}
        w={w}
        float="right"
        onClick={() =>
          track(AmpEvent.USE_COPY_BUTTON, {
            info: amptrackInfo,
            section: amptrackSection,
            subSection: amptrackSubSection,
          })
        }
        {...buttonProps}
        borderRadius={size === "xs" ? 6 : 8}
      >
        {hasIcon && (
          <CustomIcon
            mr={iconGap}
            name="copy"
            boxSize={size === "xs" ? 3 : 4}
          />
        )}
        {buttonText}
      </Button>
    }
    value={value}
    w={w}
    copyLabel={copyLabel}
  />
);
