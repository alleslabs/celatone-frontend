import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "./CustomIcon";

interface UploadIconProps {
  variant?: "primary" | "muted";
}

const getVariantStyle = (variant: UploadIconProps["variant"]) => {
  switch (variant) {
    case "muted":
      return { bgColor: "pebble.700", color: "text.dark" };
    case "primary":
    default:
      return { bgColor: "lilac.background", color: "lilac.main" };
  }
};

export const UploadIcon = ({ variant = "primary" }: UploadIconProps) => {
  const style = getVariantStyle(variant);
  return (
    <Flex
      align="center"
      justify="center"
      borderRadius="50%"
      w="40px"
      h="40px"
      bgColor={style.bgColor}
    >
      <CustomIcon name="upload" boxSize="24px" color={style.color} />
    </Flex>
  );
};
