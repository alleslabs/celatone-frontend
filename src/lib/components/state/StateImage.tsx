import { Image } from "@chakra-ui/react";

export type ImageVariant = "empty" | "not-found" | "disconnected";

const imageSourceMap: Record<ImageVariant, string> = {
  empty:
    "https://assets.alleslabs.dev/integrations/sei/illustration/search-empty.svg",
  "not-found":
    "https://assets.alleslabs.dev/integrations/sei/illustration/search-not-found.svg",
  disconnected:
    "https://assets.alleslabs.dev/integrations/sei/illustration/disconnected.svg",
};

interface StateImageProps {
  imageVariant: ImageVariant;
}

export const StateImage = ({ imageVariant }: StateImageProps) => (
  <Image
    src={imageSourceMap[imageVariant]}
    alt="result not found"
    width="200px"
  />
);
