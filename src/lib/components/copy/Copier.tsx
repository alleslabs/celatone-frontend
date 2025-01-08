import type { IconProps, LayoutProps } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { trackUseCopier } from "lib/amplitude";

import { CopyTemplate } from "./CopyTemplate";

interface CopierProps {
  amptrackSection?: string;
  copyLabel?: string;
  display?: LayoutProps["display"];
  ml?: IconProps["ml"];
  type: string;
  value: string;
}

export const Copier = ({
  amptrackSection,
  copyLabel,
  display = "inline",
  ml = 2,
  type,
  value,
}: CopierProps) => (
  <CopyTemplate
    triggerElement={
      <CustomIcon
        id={type}
        className="copier"
        display={display}
        m={0}
        marginLeft={ml}
        name="copy"
        boxSize={3}
        color="gray.600"
        cursor="pointer"
        onClick={() => trackUseCopier(type, amptrackSection)}
      />
    }
    value={value}
    copyLabel={copyLabel}
  />
);
