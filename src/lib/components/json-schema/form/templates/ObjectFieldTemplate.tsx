/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, GridItem, Text } from "@chakra-ui/react";
import type { ObjectFieldTemplateProps } from "@rjsf/utils";
import { canExpand, getTemplate, getUiOptions } from "@rjsf/utils";

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
        {properties.length > 0 ? (
          properties.map((element, index) =>
            element.hidden ? (
              element.content
            ) : (
              <GridItem
                key={`${idSchema.$id}-${element.name}-${index.toString()}`}
              >
                {element.content}
              </GridItem>
            )
          )
        ) : (
          <Text
            variant="body3"
            fontWeight={700}
            textColor="text.disabled"
            textAlign="center"
            p={4}
            bgColor="gray.700"
            borderRadius="8px"
          >
            object with no properties
          </Text>
        )}
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
