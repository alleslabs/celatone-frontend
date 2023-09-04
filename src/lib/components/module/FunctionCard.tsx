import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { DotSeparator } from "../DotSeparator";
import { CustomIcon } from "../icon";
import { Tooltip } from "lib/components/Tooltip";
import type { ExposedFunction, Visibility } from "lib/types";

interface FunctionCardProps {
  exposedFn: ExposedFunction;
  onFunctionSelect: (fn: ExposedFunction) => void;
}

const getIcon = (visibility: Visibility) => {
  switch (visibility) {
    case "friend":
      return <CustomIcon name="friends" color="gray.600" boxSize={3} />;
    case "script":
      return <CustomIcon name="code" color="gray.600" boxSize={3} />;
    case "public":
    default:
      return <CustomIcon name="website" color="gray.600" boxSize={3} />;
  }
};

const disabledStyle: { [key in `${boolean}`]: FlexProps } = {
  true: {
    bgColor: "gray.900",
    _hover: { bg: "gray.900" },
    cursor: "not-allowed",
    pointerEvents: "none",
    borderColor: "gray.700",
  },
  false: {
    bgColor: "gray.800",
    _hover: { bg: "gray.700" },
    cursor: "pointer",
    borderColor: "transparent",
  },
};

export const FunctionCard = ({
  exposedFn,
  onFunctionSelect,
}: FunctionCardProps) => {
  const { is_entry: isEntry, is_view: isView, visibility, name } = exposedFn;
  const disabled = !isEntry || visibility !== "public";

  return (
    <Flex
      borderRadius={8}
      py={2}
      px={3}
      transition="all .25s ease-in-out"
      flexDirection="column"
      gap={1}
      border="1px solid"
      onClick={() => onFunctionSelect(exposedFn)}
      {...disabledStyle[String(disabled) as `${boolean}`]}
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
          {!disabled && (
            <>
              <Tooltip
                bg="primary.dark"
                label="Only functions with “is_entry: true” and “visibility: public” are interactable through Celatone’s module interactions."
              >
                <Flex>
                  <CustomIcon name="check" color="success.main" boxSize={3} />
                </Flex>
              </Tooltip>
              <DotSeparator bg="gray.600" />
            </>
          )}
          <Flex alignItems="center" gap={1}>
            {getIcon(visibility)}
            <Text variant="body3" color="text.dark" textTransform="capitalize">
              {visibility}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Text variant="body2" color={disabled ? "text.disabled" : "text.main"}>
        {name}
      </Text>
    </Flex>
  );
};
