/* eslint-disable @typescript-eslint/no-explicit-any */
import { Grid, GridItem, Text } from "@chakra-ui/react";
import type {
  FormContextType,
  ObjectFieldTemplateProps,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import {
  canExpand,
  descriptionId,
  getTemplate,
  getUiOptions,
} from "@rjsf/utils";
import { Fragment } from "react";

/** The `ObjectFieldTemplate` is the template to use to render all the inner properties of an object along with the
 * title and description if available. If the object is expandable, then an `AddButton` is also rendered after all
 * the properties.
 *
 * @param props - The `ObjectFieldTemplateProps` for this component
 */
export default function ObjectFieldTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: ObjectFieldTemplateProps<T, S, F>) {
  const {
    description,
    disabled,
    formData,
    idSchema,
    onAddClick,
    properties,
    readonly,
    registry,
    schema,
    uiSchema,
  } = props;
  const options = getUiOptions<T, S, F>(uiSchema);
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, options);
  // Button templates are not overridden in the uiSchema
  const {
    ButtonTemplates: { AddButton },
  } = registry.templates;
  return (
    <fieldset id={idSchema.$id}>
      {description && (
        <DescriptionFieldTemplate
          id={descriptionId<T>(idSchema)}
          description={description}
          schema={schema}
          uiSchema={uiSchema}
          registry={registry}
        />
      )}
      <Grid gap={4} my={2}>
        {properties.length > 0 ? (
          properties.map((element, index) =>
            element.hidden ? (
              <Fragment
                key={`${idSchema.$id}-${element.name}-${index.toString()}`}
              >
                {element.content}
              </Fragment>
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
        {canExpand<T, S, F>(schema, uiSchema, formData) && (
          <GridItem justifySelf="flex-end">
            <AddButton
              className="object-property-expand"
              onClick={onAddClick(schema)}
              disabled={disabled || readonly}
              uiSchema={uiSchema}
              registry={registry}
            />
          </GridItem>
        )}
      </Grid>
    </fieldset>
  );
}
