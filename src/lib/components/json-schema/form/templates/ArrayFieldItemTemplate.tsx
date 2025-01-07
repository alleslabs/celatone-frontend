/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, ButtonGroup, HStack } from "@chakra-ui/react";
import type {
  ArrayFieldTemplateItemType,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";

/** The `ArrayFieldItemTemplate` component is the template used to render an items of an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldItemTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldTemplateItemType<T, S, F>) {
  const {
    children,
    className,
    disabled,
    hasCopy,
    hasMoveDown,
    hasMoveUp,
    hasRemove,
    hasToolbar,
    index,
    onCopyIndexClick,
    onDropIndexClick,
    onReorderClick,
    readonly,
    registry,
    uiSchema,
  } = props;
  const { CopyButton, MoveDownButton, MoveUpButton, RemoveButton } =
    registry.templates.ButtonTemplates;

  return (
    <HStack className={className} alignItems="center" gap={2}>
      <Box
        p={4}
        w="100%"
        border="1px solid var(--chakra-colors-gray-600)"
        borderRadius="8px"
      >
        {children}
      </Box>
      {hasToolbar && !readonly && (
        <ButtonGroup isAttached mb={1}>
          {(hasMoveUp || hasMoveDown) && (
            <MoveUpButton
              disabled={disabled || readonly || !hasMoveUp}
              registry={registry}
              uiSchema={uiSchema}
              onClick={onReorderClick(index, index - 1)}
            />
          )}
          {(hasMoveUp || hasMoveDown) && (
            <MoveDownButton
              disabled={disabled || readonly || !hasMoveDown}
              registry={registry}
              uiSchema={uiSchema}
              onClick={onReorderClick(index, index + 1)}
            />
          )}
          {hasCopy && (
            <CopyButton
              disabled={disabled || readonly}
              registry={registry}
              uiSchema={uiSchema}
              onClick={onCopyIndexClick(index)}
            />
          )}
          {hasRemove && (
            <RemoveButton
              disabled={disabled || readonly}
              registry={registry}
              uiSchema={uiSchema}
              onClick={onDropIndexClick(index)}
            />
          )}
        </ButtonGroup>
      )}
    </HStack>
  );
}
