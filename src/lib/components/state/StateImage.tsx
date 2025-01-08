import type { ImageProps } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

import { useCelatoneApp } from "lib/app-provider";

export type ImageVariant = "disconnected" | "empty" | "error" | "not-found";

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
    disconnected: theme.illustration.disconnected,
    empty: theme.illustration.searchEmpty,
    error: theme.illustration.error,
    "not-found": theme.illustration.searchNotFound,
  };
  return (
    <Image
      width={imageWidth}
      alt={`result ${imageVariant}`}
      src={imageSourceMap[imageVariant]}
    />
  );
};
