import { Flex } from "@chakra-ui/react";

import { CustomIcon } from "./CustomIcon";
import { SvgIcon } from "./SvgIcon";

interface UploadIconProps {
  variant?: "muted" | "primary";
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
      h="40px"
      justify="center"
      w="40px"
      bgColor={style.bgColor}
      borderRadius="50%"
    >
      <SvgIcon name="upload" boxSize="24px" color={style.color} />
    </Flex>
  );
};

export const UploadFolderIcon = ({ variant = "primary" }: UploadIconProps) => {
  const style = getVariantStyle(variant);
  return (
    <Flex
      align="center"
      h="40px"
      justify="center"
      w="40px"
      bgColor={style.bgColor}
      borderRadius="50%"
    >
      <CustomIcon name="folder" boxSize={4} color={style.color} />
    </Flex>
  );
};
