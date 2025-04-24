import type { LabelTextProps } from "lib/components/LabelText";

import { useTierConfig } from "lib/app-provider";
import { LabelText } from "lib/components/LabelText";

export const CodeInfoLabelText = (props: LabelTextProps) => {
  const { isFullTier } = useTierConfig();
  return (
    <LabelText
      maxW={{ md: "fit-content" }}
      w={{ base: isFullTier ? "45%" : "full" }}
      {...props}
    />
  );
};
