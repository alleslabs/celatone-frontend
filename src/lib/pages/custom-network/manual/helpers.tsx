import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

export const getStepStyles = (index: number, currentStep: number) => {
  const baseStyles = {
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    alignItems: "center",
    justifyContent: "center",
  };

  switch (true) {
    case index < currentStep:
      return {
        bgColor: "gray.900",
        borderColor: "text.main",
        textColor: "text.main",
        content: (
          <Flex {...baseStyles} bg="text.main">
            <CustomIcon boxSize="12px" color="gray.900" name="check" />
          </Flex>
        ),
      };
    case index === currentStep:
      return {
        bgColor: "gray.800",
        borderColor: "text.main",
        textColor: "text.main",
        content: (
          <Flex {...baseStyles} bg="text.main">
            <Text color="gray.900" variant="body3">
              {index + 1}
            </Text>
          </Flex>
        ),
      };
    default:
      return {
        bgColor: "gray.900",
        borderColor: "gray.800",
        textColor: "text.dark",
        content: (
          <Flex {...baseStyles} border="1px solid" borderColor="gray.500">
            <Text color="gray.500" variant="body3">
              {index + 1}
            </Text>
          </Flex>
        ),
      };
  }
};
