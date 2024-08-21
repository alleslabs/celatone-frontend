import { Flex } from "@chakra-ui/react";

import { SvgIcon } from "./SvgIcon";

interface UploadIconProps {
  variant?: "primary" | "muted";
}

const getVariantStyle = (variant: UploadIconProps["variant"]) => {
  switch (variant) {
    case "muted":
      return { bgColor: "gray.700", color: "text.dark" };
    case "primary":
    default:
      return { bgColor: "primary.background", color: "primary.main" };
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
      <SvgIcon name="upload" boxSize="24px" color={style.color} />
    </Flex>
  );
};
