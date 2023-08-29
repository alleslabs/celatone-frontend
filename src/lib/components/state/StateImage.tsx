import type { ImageProps } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

import { CURR_THEME } from "env";

export type ImageVariant = "empty" | "not-found" | "disconnected";

const imageSourceMap: Record<ImageVariant, string> = {
  empty: CURR_THEME.illustration.searchEmpty,
  "not-found": CURR_THEME.illustration.searchNotFound,
  disconnected: CURR_THEME.illustration.disconnected,
};

interface StateImageProps {
  imageVariant: ImageVariant;
  imageWidth?: ImageProps["width"];
}

export const StateImage = ({
  imageVariant,
  imageWidth = "200px",
}: StateImageProps) => (
  <Image
    src={imageSourceMap[imageVariant]}
    alt="result not found"
    width={imageWidth}
  />
);
