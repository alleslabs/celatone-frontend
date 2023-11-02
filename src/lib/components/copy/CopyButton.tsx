import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, useTrack } from "lib/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopyButtonProps extends ButtonProps {
  isDisable?: boolean;
  value: string;
  copyLabel?: string;
  hasIcon?: boolean;
  buttonText?: string;
  amptrackSection?: string;
  iconGap?: number;
}

export const CopyButton = ({
  isDisable,
  value,
  size = "sm",
  copyLabel,
  hasIcon = true,
  variant = "outline-accent",
  buttonText = "Copy",
  amptrackSection,
  ml,
  iconGap,
  ...buttonProps
}: CopyButtonProps) => {
  const { track } = useTrack();

  return (
    <CopyTemplate
      value={value}
      copyLabel={copyLabel}
      isDisabled={isDisable}
      ml={ml}
      triggerElement={
        <Button
          isDisabled={isDisable}
          variant={variant}
          size={size}
          float="right"
          onClick={() =>
            track(AmpEvent.USE_COPY_BUTTON, { section: amptrackSection })
          }
          {...buttonProps}
          borderRadius={size === "xs" ? 6 : 8}
        >
          {hasIcon && (
            <CustomIcon
              name="copy"
              boxSize={size === "xs" ? 3 : 4}
              mr={iconGap}
            />
          )}
          {buttonText}
        </Button>
      }
    />
  );
};
