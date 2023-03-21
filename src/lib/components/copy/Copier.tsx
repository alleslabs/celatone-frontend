import type { LayoutProps } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopierProps {
  type: string;
  value: string;
  copyLabel?: string;
  display?: LayoutProps["display"];
  ml?: string;
}

export const Copier = ({
  type,
  value,
  copyLabel,
  display = "block",
  ml = "8px",
}: CopierProps) => (
  <CopyTemplate
    value={value}
    copyLabel={copyLabel}
    triggerElement={
      <CustomIcon
        id={type}
        className="copier"
        display={display}
        cursor="pointer"
        marginLeft={ml}
        onClick={() => AmpTrack(AmpEvent.USE_COPIER)}
        name="copy"
        boxSize="12px"
      />
    }
  />
);
