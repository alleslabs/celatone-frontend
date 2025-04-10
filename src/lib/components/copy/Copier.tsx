import type { IconProps, LayoutProps } from "@chakra-ui/react";

import { trackUseCopier } from "lib/amplitude";

import { CustomIcon } from "../icon";
import { CopyTemplate } from "./CopyTemplate";

interface CopierProps {
  type: string;
  value: string;
  copyLabel?: string;
  display?: LayoutProps["display"];
  ml?: IconProps["ml"];
  amptrackSection?: string;
}

export const Copier = ({
  type,
  value,
  copyLabel,
  display = "inline",
  ml = 2,
  amptrackSection,
}: CopierProps) => (
  <CopyTemplate
    copyLabel={copyLabel}
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
