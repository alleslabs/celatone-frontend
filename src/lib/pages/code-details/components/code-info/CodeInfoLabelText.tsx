import { useTierConfig } from "lib/app-provider";
import type { LabelTextProps } from "lib/components/LabelText";
import { LabelText } from "lib/components/LabelText";

export const CodeInfoLabelText = (props: LabelTextProps) => {
  const isFullTier = useTierConfig() === "full";
  return (
    <LabelText
      w={{ base: isFullTier ? "45%" : "full" }}
      maxW={{ md: "fit-content" }}
      {...props}
    />
  );
};
