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

import { FieldTypeTag } from "./FieldTypeTag";
import { isNullFormData } from "../utils";

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
    formData,
    canAdd,
    className,
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
          title={uiOptions.title || title}
          required={required}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
        <FieldTypeTag type={schema.type} />
      </Flex>
      <ArrayFieldDescriptionTemplate
        idSchema={idSchema}
        description={uiOptions.description || schema.description}
        schema={schema}
        uiSchema={uiSchema}
        registry={registry}
      />
      {isNullFormData(formData) || (readonly && items.length === 0) ? (
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
          {isNullFormData(formData) ? "NULL" : "Empty"}
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
          {items.length === 0 ? (
            <Text
              textAlign="center"
              variant="body2"
              fontWeight={700}
              color="text.dark"
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
                onClick={onAddClick}
                disabled={disabled || readonly}
                uiSchema={uiSchema}
                registry={registry}
              />
            </GridItem>
          )}
        </Grid>
      )}
    </div>
  );
}
