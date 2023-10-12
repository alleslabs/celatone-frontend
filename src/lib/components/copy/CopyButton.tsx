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
          leftIcon={
            hasIcon ? (
              // TODO config to style later
              <CustomIcon name="copy" boxSize={size === "xs" ? 3 : 4} />
            ) : undefined
          }
          {...buttonProps}
          borderRadius={size === "xs" ? 6 : 8}
        >
          {buttonText}
        </Button>
      }
    />
  );
};
