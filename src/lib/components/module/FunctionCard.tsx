import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { DotSeparator } from "../DotSeparator";
import { CustomIcon } from "../icon";
import { useMobile } from "lib/app-provider";
import { Tooltip } from "lib/components/Tooltip";
import type { ExposedFunction } from "lib/types";
import { checkAvailability, getVisibilityIcon } from "lib/utils";

type CardVariant = "common" | "disabled" | "readonly" | "selected";

interface FunctionCardBodyProps extends FunctionCardProps {
  disabled: boolean;
}

interface FunctionCardProps {
  exposedFn: ExposedFunction;
  isReadOnly?: boolean;
  onFunctionSelect: (fn: ExposedFunction) => void;
  variant?: CardVariant;
}

const cardStyles: { [key in CardVariant]: FlexProps } = {
  common: {
    _hover: { bg: "gray.700" },
    bgColor: "gray.800",
    borderColor: "transparent",
    cursor: "pointer",
  },
  disabled: {
    _hover: { bg: "gray.900" },
    bgColor: "gray.900",
    borderColor: "gray.700",
    cursor: "not-allowed",
  },
  readonly: {
    bgColor: "gray.800",
    borderColor: "transparent",
  },
  selected: {
    _hover: { bg: "gray.700" },
    bgColor: "gray.700",
    borderColor: "gray.600",
    cursor: "pointer",
  },
};

const FunctionCardBody = ({
  disabled,
  exposedFn,
  isReadOnly,
  onFunctionSelect,
  variant = "common",
}: FunctionCardBodyProps) => {
  const { is_view: isView, name, visibility } = exposedFn;

  return (
    <Flex
      gap={1}
      px={3}
      py={2}
      w="full"
      border="1px solid"
      borderRadius={8}
      flexDirection="column"
      onClick={() =>
        disabled || isReadOnly ? null : onFunctionSelect(exposedFn)
      }
      transition="all .25s ease-in-out"
      {...cardStyles[disabled ? "disabled" : variant]}
    >
      <Flex gap={1} w="full" justifyContent="space-between">
        <Flex alignItems="center" gap={1}>
          <CustomIcon
            name="query"
            boxSize={3}
            color={isView ? "primary.main" : "secondary.dark"}
          />
          <Text
            variant="body3"
            color={isView ? "primary.main" : "secondary.dark"}
          >
            {isView ? "View" : "Execute"}
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          {!isView && (
            <>
              <Tooltip label={`is_entry: ${exposedFn.is_entry}`}>
                <Flex onClick={(e) => e.stopPropagation()} pointerEvents="auto">
                  {disabled ? (
                    <CustomIcon name="close" boxSize={3} color="gray.600" />
                  ) : (
                    <CustomIcon name="check" boxSize={3} color="success.main" />
                  )}
                </Flex>
              </Tooltip>
              <DotSeparator bg="gray.600" />
            </>
          )}
          <Flex alignItems="center" gap={1}>
            <CustomIcon
              name={getVisibilityIcon(visibility)}
              boxSize={3}
              color="gray.600"
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

export const FunctionCard = ({
  exposedFn,
  isReadOnly = false,
  onFunctionSelect,
  variant = "common",
}: FunctionCardProps) => {
  const isMobile = useMobile();
  const disabled = !checkAvailability(exposedFn);

  return isMobile ? (
    <FunctionCardBody
      disabled={disabled}
      isReadOnly={isReadOnly}
      variant={variant}
      exposedFn={exposedFn}
      onFunctionSelect={onFunctionSelect}
    />
  ) : (
    <Tooltip
      hidden={!disabled}
      label="Only functions with “is_entry: true” are able to interacted through Celatone’s module interactions."
    >
      <FunctionCardBody
        disabled={disabled}
        isReadOnly={isReadOnly}
        variant={variant}
        exposedFn={exposedFn}
        onFunctionSelect={onFunctionSelect}
      />
    </Tooltip>
  );
};
