import type { FlexProps, ImageProps, TextProps } from "@chakra-ui/react";

import { Flex, Heading, Text } from "@chakra-ui/react";

import type { ImageVariant } from "./StateImage";

import { StateImage } from "./StateImage";

export interface EmptyStateProps {
  imageVariant?: ImageVariant;
  imageWidth?: ImageProps["width"];
  message?: string;
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
    alignItems={alignItems}
    borderBottomWidth={withBorder ? "1px" : undefined}
    borderColor="gray.700"
    borderTopColor={hasBorderTop ? "gray.700" : "transparent"}
    borderTopWidth={withBorder ? "1px" : undefined}
    direction="column"
    flexDir="column"
    gap={4}
    my={my}
    py={py}
    width="full"
  >
    {imageVariant && (
      <StateImage imageVariant={imageVariant} imageWidth={imageWidth} />
    )}
    {heading && (
      <Heading as="h5" textAlign="center" variant="h5">
        {heading}
      </Heading>
    )}
    {message && (
      <Text
        color="text.dark"
        textAlign="center"
        variant={textVariant}
        whiteSpace="pre-wrap"
      >
        {message}
      </Text>
    )}
    {children}
  </Flex>
);
