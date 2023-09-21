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
  width?: string;
}

export const StateImage = ({
  imageVariant,
  width = "200px",
}: StateImageProps) => (
  <Image
    src={imageSourceMap[imageVariant]}
    alt="result not found"
    width={width}
  />
);
