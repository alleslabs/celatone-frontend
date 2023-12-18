import type { ImageProps } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

import { CURR_THEME } from "env";

export type ImageVariant = "not-found" | "empty" | "disconnected";

const imageSourceMap: Record<ImageVariant, string> = {
  "not-found": CURR_THEME.illustration.searchNotFound,
  empty: CURR_THEME.illustration.searchEmpty,
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
