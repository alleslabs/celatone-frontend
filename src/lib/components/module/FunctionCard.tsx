import type { FlexProps } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/react";

import { DotSeparator } from "../DotSeparator";
import { CustomIcon } from "../icon";
import { useMobile } from "lib/app-provider";
import { Tooltip } from "lib/components/Tooltip";
import type { ExposedFunction } from "lib/types";
import { checkAvailability, getVisibilityIcon } from "lib/utils";

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
    bgColor: "gray.800",
    _hover: { bg: "gray.700" },
    cursor: "pointer",
    borderColor: "transparent",
  },
  disabled: {
    bgColor: "gray.900",
    _hover: { bg: "gray.900" },
    cursor: "not-allowed",
    borderColor: "gray.700",
  },
  selected: {
    bgColor: "gray.700",
    _hover: { bg: "gray.700" },
    cursor: "pointer",
    borderColor: "gray.600",
  },
  readonly: {
    bgColor: "gray.800",
    borderColor: "transparent",
  },
};

const FunctionCardBody = ({
  variant = "common",
  onFunctionSelect,
  isReadOnly,
  disabled,
  exposedFn,
}: FunctionCardBodyProps) => {
  const { is_view: isView, visibility, name } = exposedFn;

  return (
    <Flex
      w="full"
      borderRadius={8}
      py={2}
      px={3}
      transition="all .25s ease-in-out"
      flexDirection="column"
      gap={1}
      border="1px solid"
      onClick={() =>
        disabled || isReadOnly ? null : onFunctionSelect(exposedFn)
      }
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
                label={`is_entry: ${exposedFn.is_entry}`}
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

export const FunctionCard = ({
  variant = "common",
  exposedFn,
  onFunctionSelect,
  isReadOnly = false,
}: FunctionCardProps) => {
  const isMobile = useMobile();
  const disabled = !checkAvailability(exposedFn);

  return isMobile ? (
    <FunctionCardBody
      variant={variant}
      exposedFn={exposedFn}
      onFunctionSelect={onFunctionSelect}
      isReadOnly={isReadOnly}
      disabled={disabled}
    />
  ) : (
    <Tooltip
      bg="primary.dark"
      label="Only functions with “is_entry: true” are able to interacted through Celatone’s module interactions."
      hidden={!disabled}
    >
      <FunctionCardBody
        variant={variant}
        exposedFn={exposedFn}
        onFunctionSelect={onFunctionSelect}
        isReadOnly={isReadOnly}
        disabled={disabled}
      />
    </Tooltip>
  );
};
