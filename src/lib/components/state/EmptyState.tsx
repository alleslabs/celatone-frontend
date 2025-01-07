import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";
import { Flex, Heading, Text } from "@chakra-ui/react";

import type { ImageVariant } from "./StateImage";
import { StateImage } from "./StateImage";

export interface EmptyStateProps {
  alignItems?: FlexProps["alignItems"];
  children?: React.ReactNode;
  hasBorderTop?: boolean;
  heading?: string;
  imageVariant?: ImageVariant;
  imageWidth?: ImageProps["width"];
  message?: string;
  my?: FlexProps["my"];
  py?: FlexProps["py"];
  textVariant?: TextProps["variant"];
  withBorder?: boolean;
}

export const EmptyState = ({
  alignItems = "center",
  children,
  hasBorderTop = true,
  heading,
  imageVariant,
  imageWidth,
  message,
  my = 12,
  py = 8,
  textVariant = "body1",
  withBorder = false,
}: EmptyStateProps) => (
  <Flex
    width="full"
    alignItems={alignItems}
    flexDir="column"
    gap={4}
    my={my}
    py={py}
    borderColor="gray.700"
    borderTopColor={hasBorderTop ? "gray.700" : "transparent"}
    borderY={withBorder ? "1px solid" : undefined}
    direction="column"
  >
    {imageVariant && (
      <StateImage imageWidth={imageWidth} imageVariant={imageVariant} />
    )}
    {heading && (
      <Heading as="h5" textAlign="center" variant="h5">
        {heading}
      </Heading>
    )}
    {message && (
      <Text
        textAlign="center"
        variant={textVariant}
        whiteSpace="pre-wrap"
        color="text.dark"
      >
        {message}
      </Text>
    )}
    {children}
  </Flex>
);
