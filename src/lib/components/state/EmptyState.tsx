import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";
import { Flex, Heading, Text } from "@chakra-ui/react";
import type { ReactElement } from "react";

import type { ImageVariant } from "./StateImage";
import { StateImage } from "./StateImage";

export interface EmptyStateProps {
  imageVariant?: ImageVariant;
  imageWidth?: ImageProps["width"];
  message: string | ReactElement;
  heading?: string;
  withBorder?: boolean;
  my?: FlexProps["my"];
  py?: FlexProps["py"];
  textVariant?: TextProps["variant"];
}

export const EmptyState = ({
  message,
  imageVariant,
  imageWidth,
  heading,
  withBorder = false,
  my = 12,
  py = 8,
  textVariant = "body1",
}: EmptyStateProps) => (
  <Flex
    alignItems="center"
    flexDir="column"
    gap={4}
    width="full"
    py={py}
    my={my}
    direction="column"
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="gray.700"
  >
    {imageVariant && (
      <StateImage imageVariant={imageVariant} imageWidth={imageWidth} />
    )}
    {heading && (
      <Heading as="h5" variant="h5">
        {heading}
      </Heading>
    )}
    <Text
      color="text.dark"
      textAlign="center"
      whiteSpace="pre-wrap"
      variant={textVariant}
    >
      {message}
    </Text>
  </Flex>
);
