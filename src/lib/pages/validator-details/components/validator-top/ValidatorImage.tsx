import type { ImageProps } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";

export const ValidatorImage = (props: ImageProps) => (
  <Image
    borderRadius="50%"
    objectFit="cover"
    src="https://wildlifecoexistence.org/wp-content/uploads/2020/12/Koala-portrait-scaled.jpg"
    {...props}
  />
);
