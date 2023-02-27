import type { LayoutProps } from "@chakra-ui/react";
import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "../icon/CustomIcon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopierProps {
  value: string;
  copyLabel?: string;
  className?: string;
  display?: LayoutProps["display"];
  ml?: string;
}

export const Copier = ({
  value,
  copyLabel,
  className,
  display = "flex",
  ml = "8px",
}: CopierProps) => (
  <CopyTemplate
    value={value}
    copyLabel={copyLabel}
    triggerElement={
      <Flex
        className={className}
        display={display}
        cursor="pointer"
        marginLeft={ml}
        onClick={() => AmpTrack(AmpEvent.USE_COPIER)}
      >
        <CustomIcon name="copy" boxSize="16px" />
      </Flex>
    }
  />
);
