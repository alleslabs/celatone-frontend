import type { FlexProps } from "@chakra-ui/react";
import type { ExposedFunction } from "lib/types";

import { Flex, Text } from "@chakra-ui/react";
import { useMobile } from "lib/app-provider";
import { Tooltip } from "lib/components/Tooltip";
import { checkAvailability, getVisibilityIcon } from "lib/utils";

import { DotSeparator } from "../DotSeparator";
import { CustomIcon } from "../icon";

type CardVariant = "common" | "disabled" | "selected" | "readonly";

interface FunctionCardProps {
  variant?: CardVariant;
  isReadOnly?: boolean;
  exposedFn: ExposedFunction;
  onFunctionSelect: (fn: ExposedFunction) => void;
}

interface FunctionCardBodyProps extends FunctionCardProps {
  disabled: boolean;
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
      border="1px solid"
      borderRadius={8}
      flexDirection="column"
      gap={1}
      px={3}
      py={2}
      transition="all .25s ease-in-out"
      w="full"
      onClick={() =>
        disabled || isReadOnly ? null : onFunctionSelect(exposedFn)
      }
      {...cardStyles[disabled ? "disabled" : variant]}
    >
      <Flex gap={1} justifyContent="space-between" w="full">
        <Flex alignItems="center" gap={1}>
          <CustomIcon
            boxSize={3}
            color={isView ? "primary.main" : "secondary.dark"}
            name="query"
          />
          <Text
            color={isView ? "primary.main" : "secondary.dark"}
            variant="body3"
          >
            {isView ? "View" : "Execute"}
          </Text>
        </Flex>
        <Flex alignItems="center" gap={2}>
          {!isView && (
            <>
              <Tooltip label={`is_entry: ${exposedFn.is_entry}`}>
                <Flex pointerEvents="auto" onClick={(e) => e.stopPropagation()}>
                  {disabled ? (
                    <CustomIcon boxSize={3} color="gray.600" name="close" />
                  ) : (
                    <CustomIcon boxSize={3} color="success.main" name="check" />
                  )}
                </Flex>
              </Tooltip>
              <DotSeparator bg="gray.600" />
            </>
          )}
          <Flex alignItems="center" gap={1}>
            <CustomIcon
              boxSize={3}
              color="gray.600"
              name={getVisibilityIcon(visibility)}
            />
            <Text color="text.dark" textTransform="capitalize" variant="body3">
              {visibility}
            </Text>
          </Flex>
        </Flex>
      </Flex>
      <Text color={disabled ? "text.disabled" : "text.main"} variant="body2">
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
      exposedFn={exposedFn}
      isReadOnly={isReadOnly}
      variant={variant}
      onFunctionSelect={onFunctionSelect}
    />
  ) : (
    <Tooltip
      hidden={!disabled}
      label="Only functions with “is_entry: true” are able to interacted through Scan’s module interactions."
    >
      <FunctionCardBody
        disabled={disabled}
        exposedFn={exposedFn}
        isReadOnly={isReadOnly}
        variant={variant}
        onFunctionSelect={onFunctionSelect}
      />
    </Tooltip>
  );
};
