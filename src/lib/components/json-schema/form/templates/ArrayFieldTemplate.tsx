/* eslint-disable @typescript-eslint/no-explicit-any */
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import type {
  ArrayFieldTemplateItemType,
  ArrayFieldTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import { getTemplate, getUiOptions } from "@rjsf/utils";

import { isNullFormData } from "../utils";

import { FieldTypeTag } from "./FieldTypeTag";

/** The `ArrayFieldTemplate` component is the template used to render all items in an array.
 *
 * @param props - The `ArrayFieldTemplateItemType` props for the component
 */
export default function ArrayFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ArrayFieldTemplateProps<T, S, F>) {
  const {
    canAdd,
    className,
    disabled,
    formData,
    idSchema,
    items,
    onAddClick,
    readonly,
    registry,
    required,
    schema,
    title,
    uiSchema,
  } = props;
  const uiOptions = getUiOptions<T, S, F>(uiSchema);
  const ArrayFieldDescriptionTemplate = getTemplate<
    "ArrayFieldDescriptionTemplate",
    T,
    S,
    F
  >("ArrayFieldDescriptionTemplate", registry, uiOptions);
  const ArrayFieldItemTemplate = getTemplate<"ArrayFieldItemTemplate", T, S, F>(
    "ArrayFieldItemTemplate",
    registry,
    uiOptions
  );
  const ArrayFieldTitleTemplate = getTemplate<
    "ArrayFieldTitleTemplate",
    T,
    S,
    F
  >("ArrayFieldTitleTemplate", registry, uiOptions);
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  return (
    <div className={className}>
      <Flex gap={3}>
        <ArrayFieldTitleTemplate
          idSchema={idSchema}
          registry={registry}
          required={required}
          schema={schema}
          title={uiOptions.title || title}
          uiSchema={uiSchema}
        />
        <FieldTypeTag type={schema.type} />
      </Flex>
      <ArrayFieldDescriptionTemplate
        idSchema={idSchema}
        registry={registry}
        schema={schema}
        uiSchema={uiSchema}
        description={uiOptions.description || schema.description}
      />
      {isNullFormData(formData) || (readonly && items.length === 0) ? (
        <Text
          my={2}
          p={4}
          textAlign="center"
          variant="body3"
          bgColor="gray.700"
          borderRadius="8px"
          fontWeight={700}
          textColor="text.disabled"
        >
          {isNullFormData(formData) ? "NULL" : "Empty"}
        </Text>
      ) : (
        <Grid
          key={`array-item-list-${idSchema.$id}`}
          gap={4}
          my={2}
          p={4}
          bgColor="gray.800"
          borderRadius="8px"
        >
          {items.length === 0 ? (
            <Text
              textAlign="center"
              variant="body2"
              color="text.dark"
              fontWeight={700}
            >
              Empty array
            </Text>
          ) : (
            items.map(
              ({ key, ...itemProps }: ArrayFieldTemplateItemType<T, S, F>) => (
                <GridItem key={key}>
                  <ArrayFieldItemTemplate key={key} {...itemProps} />
                </GridItem>
              )
            )
          )}
          {canAdd && !readonly && (
            <GridItem display="flex" justifyContent="center">
              <AddButton
                className="array-item-add"
                disabled={disabled || readonly}
                registry={registry}
                uiSchema={uiSchema}
                onClick={onAddClick}
              />
            </GridItem>
          )}
        </Grid>
      )}
    </div>
  );
}
