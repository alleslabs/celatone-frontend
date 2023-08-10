/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, GridItem } from "@chakra-ui/react";
import type {
  ObjectFieldTemplatePropertyType,
  ObjectFieldTemplateProps,
} from "@rjsf/utils";
import {
  canExpand,
  getSchemaType,
  getTemplate,
  getUiOptions,
} from "@rjsf/utils";

interface ObjectFieldTemplatePropertyTypeWithRequired
  extends ObjectFieldTemplatePropertyType {
  required?: boolean;
}

const ObjectFieldTemplate = <T = any, F = any>(
  props: ObjectFieldTemplateProps<T, F>
) => {
  const {
    description,
    properties,
    disabled,
    readonly,
    uiSchema,
    idSchema,
    schema,
    formData,
    onAddClick,
    registry,
  } = props;
  const uiOptions = getUiOptions(uiSchema);
  const DescriptionFieldTemplate = getTemplate<"DescriptionFieldTemplate">(
    "DescriptionFieldTemplate",
    registry,
    uiOptions
  );
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;

  return (
    <>
      {(uiOptions.description || description) && (
        <DescriptionFieldTemplate
          id={`${idSchema.$id}-description`}
          description={uiOptions.description || description || ""}
          registry={registry}
        />
      )}
      <Grid gap={4} my={2}>
        {properties.map((element, index) => {
          // NOTE: required array field doesn't create an empty array as a default
          const elementType = getSchemaType(element.content.props.schema);
          const elementRequired = (
            element as ObjectFieldTemplatePropertyTypeWithRequired
          ).required;
          if (
            typeof elementType === "string" &&
            elementType === "array" &&
            elementRequired &&
            !(element.name in (formData as Record<string, object>))
          )
            (formData as Record<string, object>)[element.name] = [];

          return element.hidden ? (
            element.content
          ) : (
            <GridItem
              key={`${idSchema.$id}-${element.name}-${index.toString()}`}
            >
              {element.content}
            </GridItem>
          );
        })}
        {canExpand<T, F>(schema, uiSchema, formData) && (
          <GridItem justifySelf="flex-end">
            <AddButton
              className="object-property-expand"
              onClick={onAddClick(schema)}
              disabled={disabled || readonly}
              uiSchema={uiSchema}
            />
          </GridItem>
        )}
      </Grid>
    </>
  );
};

export default ObjectFieldTemplate;
