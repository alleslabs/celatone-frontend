import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { DotSeparator } from "../DotSeparator";
import { CustomIcon } from "../icon";
import { Tooltip } from "lib/components/Tooltip";
import type { ExposedFunction } from "lib/types";
import { getVisibilityIcon, checkAvailability } from "lib/utils";

type CardVariant = "common" | "disabled" | "selected";

interface FunctionCardProps {
  variant?: CardVariant;
  isSelected?: boolean;
  exposedFn: ExposedFunction;
  onFunctionSelect: (fn: ExposedFunction) => void;
}

const cardStyles: { [key in CardVariant]: FlexProps } = {
  common: {
    bgColor: "gray.800",
    _hover: { bg: "gray.700" },
    cursor: "pointer",
    borderColor: "transparent",
  },
  disabled: {
    bgColor: "gray.900",
    _hover: { bg: "gray.900" },
    cursor: "not-allowed",
    pointerEvents: "none",
    borderColor: "gray.700",
  },
  selected: {
    bgColor: "gray.700",
    _hover: { bg: "gray.700" },
    cursor: "pointer",
    borderColor: "gray.600",
  },
};

export const FunctionCard = ({
  variant = "common",
  exposedFn,
  onFunctionSelect,
}: FunctionCardProps) => {
  const { is_view: isView, visibility, name } = exposedFn;
  const disabled = !checkAvailability(exposedFn);

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
      {...cardStyles[disabled ? "disabled" : variant]}
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
          {!isView && (
            <>
              <Tooltip
                bg="primary.dark"
                label="Only execute functions with “is_entry: true” and “visibility: public” are interactable through Celatone’s module interactions."
              >
                <Flex pointerEvents="auto" onClick={(e) => e.stopPropagation()}>
                  {disabled ? (
                    <CustomIcon name="close" color="gray.600" boxSize={3} />
                  ) : (
                    <CustomIcon name="check" color="success.main" boxSize={3} />
                  )}
                </Flex>
              </Tooltip>
              <DotSeparator bg="gray.600" />
            </>
          )}
          <Flex alignItems="center" gap={1}>
            <CustomIcon
              name={getVisibilityIcon(visibility)}
              color="gray.600"
              boxSize={3}
            />
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
