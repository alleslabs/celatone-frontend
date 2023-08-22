import { Flex, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon";
import { Tooltip } from "lib/components/Tooltip";

interface FunctionCardProps {
  isView?: boolean;
  disabled?: boolean;
  visibility?: "public" | "friends" | "script";
}

const getIcon = (visibility: FunctionCardProps["visibility"]) => {
  switch (visibility) {
    case "friends":
      return <CustomIcon name="friends" color="text.dark" boxSize={3} />;
    case "script":
      return <CustomIcon name="code" color="text.dark" boxSize={3} />;
    case "public":
    default:
      return <CustomIcon name="website" color="text.main" boxSize={3} />;
  }
};
export const FunctionCard = ({
  isView = true,
  disabled = false,
  visibility = "public",
}: FunctionCardProps) => {
  return (
    <Flex
      borderRadius={8}
      bgColor={disabled ? "gray.900" : "gray.800"}
      py={2}
      px={3}
      _hover={disabled ? { bg: "gray.900" } : { bg: "gray.700" }}
      transition="all .25s ease-in-out"
      flexDirection="column"
      gap={1}
      cursor={disabled ? "not-allowed" : "pointer"}
      border="1px solid"
      borderColor={disabled ? "gray.700" : "transparent"}
    >
      <Flex gap={1} justifyContent="space-between" w="full">
        <Flex gap={1} alignItems="center">
          <CustomIcon
            name="query"
            color={isView ? "primary.main" : "accent.dark"}
            boxSize={3}
          />
          <Text variant="body3" color={isView ? "primary.main" : "accent.dark"}>
            {isView ? "View" : "Execute"}
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          <Tooltip
            bg="primary.dark"
            label="Only functions with “is_entry: true” and “visibility: public” are able to interacted through Celatone’s module interactions."
          >
            <Flex alignItems="center">
              <CustomIcon name="check" color="success.main" boxSize={3} />
            </Flex>
          </Tooltip>
          <Flex w={1} h={1} bgColor="gray.600" borderRadius="full" />
          <Flex alignItems="center" gap={1}>
            {getIcon(visibility)}
            <Text
              variant="body3"
              color={visibility === "public" ? "text.main" : "text.dark"}
              textTransform="capitalize"
            >
              {visibility}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Text variant="body2">Function Name</Text>
    </Flex>
  );
};
