/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, ButtonGroup, HStack } from "@chakra-ui/react";
import type { ArrayFieldTemplateItemType } from "@rjsf/utils";
import { useMemo } from "react";

export default function ArrayFieldItemTemplate<T = any, F = any>(
  props: ArrayFieldTemplateItemType<T, F>
) {
  const {
    children,
    disabled,
    hasToolbar,
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    index,
    onDropIndexClick,
    onReorderClick,
    readonly,
    uiSchema,
    registry,
  } = props;
  const { MoveDownButton, MoveUpButton, RemoveButton } =
    registry.templates.ButtonTemplates;

  const onRemoveClick = useMemo(
    () => onDropIndexClick(index),
    [index, onDropIndexClick]
  );

  const onArrowUpClick = useMemo(
    () => onReorderClick(index, index - 1),
    [index, onReorderClick]
  );

  const onArrowDownClick = useMemo(
    () => onReorderClick(index, index + 1),
    [index, onReorderClick]
  );

  return (
    <HStack alignItems="center" gap={2}>
      <Box
        w="100%"
        border="1px solid var(--chakra-colors-gray-600)"
        borderRadius="8px"
        p={4}
        sx={{ "> div > div > div": { gap: 2 } }}
      >
        {children}
      </Box>
      {hasToolbar && !readonly && (
        <ButtonGroup isAttached mb={1}>
          {(hasMoveUp || hasMoveDown) && (
            <MoveUpButton
              disabled={disabled || readonly || !hasMoveUp}
              onClick={onArrowUpClick}
              uiSchema={uiSchema}
            />
          )}
          {(hasMoveUp || hasMoveDown) && (
            <MoveDownButton
              disabled={disabled || readonly || !hasMoveDown}
              onClick={onArrowDownClick}
              uiSchema={uiSchema}
            />
          )}
          {hasRemove && (
            <RemoveButton
              disabled={disabled || readonly}
              onClick={onRemoveClick}
              uiSchema={uiSchema}
            />
          )}
        </ButtonGroup>
      )}
    </HStack>
  );
}
