import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";
import { Flex, Heading, Text } from "@chakra-ui/react";

import type { ImageVariant } from "./StateImage";
import { StateImage } from "./StateImage";

export interface EmptyStateProps {
  imageVariant?: ImageVariant;
  imageWidth?: ImageProps["width"];
  message: string;
  heading?: string;
  withBorder?: boolean;
  my?: FlexProps["my"];
  py?: FlexProps["py"];
  alignItems?: FlexProps["alignItems"];
  textVariant?: TextProps["variant"];
  hasBorderTop?: boolean;
  children?: React.ReactNode;
}

export const EmptyState = ({
  message,
  imageVariant,
  imageWidth,
  heading,
  withBorder = false,
  my = 12,
  py = 8,
  alignItems = "center",
  textVariant = "body1",
  hasBorderTop = true,
  children,
}: EmptyStateProps) => (
  <Flex
    alignItems={alignItems}
    flexDir="column"
    gap={4}
    width="full"
    py={py}
    my={my}
    direction="column"
    borderY={withBorder ? "1px solid" : undefined}
    borderColor="gray.700"
    borderTopColor={hasBorderTop ? "gray.700" : "transparent"}
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
    {children}
  </Flex>
);
