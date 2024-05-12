import type { ImageProps } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";

export type ImageVariant = "error" | "not-found" | "empty" | "disconnected";

interface StateImageProps {
  imageVariant: ImageVariant;
  imageWidth?: ImageProps["width"];
}

export const StateImage = ({
  imageVariant,
  imageWidth = "200px",
}: StateImageProps) => {
  const { theme } = useCelatoneApp();
  const imageSourceMap: Record<ImageVariant, string> = {
    error: theme.illustration.error,
    "not-found": theme.illustration.searchNotFound,
    empty: theme.illustration.searchEmpty,
    disconnected: theme.illustration.disconnected,
  };
  return (
    <Image
      src={imageSourceMap[imageVariant]}
      alt={`result ${imageVariant}`}
      width={imageWidth}
    />
  );
};
