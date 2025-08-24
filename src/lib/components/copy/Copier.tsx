import type { IconProps, LayoutProps } from "@chakra-ui/react";

import { trackUseCopier } from "lib/amplitude";

import { CustomIcon } from "../icon";
import { CopyTemplate } from "./CopyTemplate";

interface CopierProps {
  amptrackSection?: string;
  copyLabel?: string;
  display?: LayoutProps["display"];
  hoverLabel?: string;
  ml?: IconProps["ml"];
  type: string;
  value: string;
}

export const Copier = ({
  amptrackSection,
  copyLabel,
  display = "inline",
  hoverLabel,
  ml = 2,
  type,
  value,
}: CopierProps) => (
  <CopyTemplate
    copyLabel={copyLabel}
    hoverLabel={hoverLabel}
    triggerElement={
      <CustomIcon
        id={type}
        className="copier"
        boxSize={3}
        color="gray.600"
        cursor="pointer"
        display={display}
        m={0}
        marginLeft={ml}
        name="copy"
        onClick={() => trackUseCopier(type, amptrackSection)}
      />
    }
    value={value}
  />
);
