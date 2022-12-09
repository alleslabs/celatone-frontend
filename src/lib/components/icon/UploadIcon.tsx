import { Flex, Icon } from "@chakra-ui/react";
import { MdUploadFile } from "react-icons/md";

interface UploadIconProps {
  variant?: "primary" | "muted";
}

const getVariantStyle = (variant: UploadIconProps["variant"]) => {
  switch (variant) {
    case "muted":
      return { bgColor: "divider.main", color: "text.dark" };
    case "primary":
    default:
      return { bgColor: "rgba(244, 143, 177, 0.3)", color: "primary.main" };
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
      <Icon as={MdUploadFile} fontSize="24px" color={style.color} />
    </Flex>
  );
};
