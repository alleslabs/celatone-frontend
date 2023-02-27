import { Button } from "@chakra-ui/react";
import type { ButtonProps } from "@chakra-ui/react";

import { CustomIcon } from "../icon/CustomIcon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopyButtonProps {
  isDisable?: boolean;
  value: string;
  size?: ButtonProps["size"];
  copyLabel?: string;
}

export const CopyButton = ({
  isDisable,
  value,
  size = "sm",
  copyLabel,
}: CopyButtonProps) => (
  <CopyTemplate
    value={value}
    copyLabel={copyLabel}
    triggerElement={
      <Button
        isDisabled={isDisable}
        variant="outline-info"
        size={size}
        float="right"
        onClick={() => AmpTrack(AmpEvent.USE_COPY_BUTTON)}
        leftIcon={<CustomIcon name="copy" boxSize="4" />}
      >
        Copy
      </Button>
    }
  />
);
