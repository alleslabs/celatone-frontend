import { Flex, Text } from "@chakra-ui/react";
import { CustomIcon } from "lib/components/icon";

export const getStepStyles = (index: number, currentStep: number) => {
  const baseStyles = {
    alignItems: "center",
    borderRadius: "50%",
    height: "24px",
    justifyContent: "center",
    width: "24px",
  };

  switch (true) {
    case index < currentStep:
      return {
        bgColor: "gray.900",
        borderColor: "text.main",
        content: (
          <Flex {...baseStyles} bg="text.main">
            <CustomIcon boxSize="12px" color="gray.900" name="check" />
          </Flex>
        ),
        textColor: "text.main",
      };
    case index === currentStep:
      return {
        bgColor: "gray.800",
        borderColor: "text.main",
        content: (
          <Flex {...baseStyles} bg="text.main">
            <Text color="gray.900" variant="body3">
              {index + 1}
            </Text>
          </Flex>
        ),
        textColor: "text.main",
      };
    default:
      return {
        bgColor: "gray.900",
        borderColor: "gray.800",
        content: (
          <Flex {...baseStyles} border="1px solid" borderColor="gray.500">
            <Text color="gray.500" variant="body3">
              {index + 1}
            </Text>
          </Flex>
        ),
        textColor: "text.dark",
      };
  }
};
