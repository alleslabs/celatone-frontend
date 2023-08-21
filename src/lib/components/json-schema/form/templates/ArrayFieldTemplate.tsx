/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import type {
  ArrayFieldTemplateItemType,
  ArrayFieldTemplateProps,
} from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";

import { FieldTypeTag } from "./FieldTypeTag";

export default function ArrayFieldTemplate<T = any, F = any>(
  props: ArrayFieldTemplateProps<T, F>
) {
  const {
    canAdd,
    disabled,
    idSchema,
    uiSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
  } = props;
  const uiOptions = getUiOptions<T, F>(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<
    "ArrayFieldDescriptionTemplate",
    T,
    F
  >("ArrayFieldDescriptionTemplate", registry, uiOptions);
  const ArrayFieldItemTemplate = getTemplate<"ArrayFieldItemTemplate", T, F>(
    "ArrayFieldItemTemplate",
    registry,
    uiOptions
  );
  const ArrayFieldTitleTemplate = getTemplate<"ArrayFieldTitleTemplate", T, F>(
    "ArrayFieldTitleTemplate",
    registry,
    uiOptions
  );
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  return (
    <Box>
      <Flex gap={3}>
        <ArrayFieldTitleTemplate
          idSchema={idSchema}
          title={uiOptions.title || title}
          uiSchema={uiSchema}
          required={required}
          registry={registry}
        />
        <FieldTypeTag type={schema.type} />
      </Flex>

      <ArrayFieldDescriptionTemplate
        idSchema={idSchema}
        description={uiOptions.description || schema.description || ""}
        uiSchema={uiSchema}
        registry={registry}
      />
      {readonly && items.length === 0 ? (
        <Text
          variant="body3"
          fontWeight={700}
          textColor="text.disabled"
          textAlign="center"
          my={2}
          p={4}
          bgColor="gray.700"
          borderRadius="8px"
        >
          Empty
        </Text>
      ) : (
        <Grid
          key={`array-item-list-${idSchema.$id}`}
          my={2}
          gap={4}
          bgColor="gray.800"
          borderRadius="8px"
          p={4}
        >
          {items.map(
            ({ key, ...itemProps }: ArrayFieldTemplateItemType<T, F>) => (
              <GridItem key={key}>
                <ArrayFieldItemTemplate key={key} {...itemProps} />
              </GridItem>
            )
          )}
          {canAdd && !readonly && (
            <GridItem display="flex" justifyContent="center">
              <AddButton
                className="array-item-add"
                onClick={onAddClick}
                disabled={disabled || readonly}
                uiSchema={uiSchema}
              />
            </GridItem>
          )}
        </Grid>
      )}
    </Box>
  );
}
