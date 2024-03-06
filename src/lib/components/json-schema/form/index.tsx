/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import {
  Templates as DefaultTemplates,
  Widgets as DefaultWidgets,
  Form,
} from "@rjsf/chakra-ui";
import type { FormProps } from "@rjsf/core";
import type { RJSFSchema, RJSFValidationError } from "@rjsf/utils";
import { createSchemaUtils } from "@rjsf/utils";
import { customizeValidator } from "@rjsf/validator-ajv8";
import isEqual from "lodash/isEqual";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";

import type { JsonDataType } from "lib/types";

import { Fields } from "./fields";
import { Templates } from "./templates";
import { Widgets } from "./widgets";

// NOTE: Set `validateFormats` to false, since some custom format
// e.g. `uint32` causing an unexpected behavior
const v8Validator = customizeValidator({
  ajvOptionsOverrides: { validateFormats: false },
});

function deleteExtraneousOneOfKeys(value: Record<string, unknown>) {
  const actualOneOfOptions = Object.keys(value);

  // check if there are TOO many options selected in the value
  if (actualOneOfOptions.length === 2) {
    console.log("Deleting", actualOneOfOptions[0]);
    delete value[actualOneOfOptions[0]];
  } else if (actualOneOfOptions.length > 2) {
    console.warn("Unexpected number of oneOf options", actualOneOfOptions);
    // TODO: throw an error?
  }
}

/**
 * A helper method to fix a bug in the rjsf library.
 * The bug is that `oneOf` properties will ALWAYS contain the first option.
 * @param formData
 * @param collapsedSchema - the schema that has been collapsed via `createSchemaUtils`
 */
function fixOneOfKeys(
  formData: Record<string, unknown>,
  collapsedSchema: RJSFSchema
) {
  // if the entry is supposed to be a oneof *itself*, then check that it only has one key
  if (collapsedSchema.oneOf) {
    deleteExtraneousOneOfKeys(formData);

    // Now recursively check the keys (though there should only be one)
    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === "object") {
        // Find the schema for the key('s value)
        const valueSchema = collapsedSchema.oneOf
          .filter((i): i is RJSFSchema => typeof i === "object")
          .find((i) => i.required?.length === 1 && i.required[0] === key);

        if (!valueSchema) return;
        fixOneOfKeys(value as Record<string, unknown>, valueSchema);
      }
    }
    return;
  }

  // iterate through each entry in the formData to check if it's oneOf
  for (const [key, value] of Object.entries(formData)) {
    // skip non-objects
    if (!value || typeof value !== "object") continue;

    const valueSchema = collapsedSchema.properties?.[key];
    // Skip those without a valid schema
    if (!valueSchema || typeof valueSchema === "boolean") continue;

    // if the entry is supposed to be a oneof, then check that it only has one key
    if (valueSchema.oneOf) {
      // console.log("Found oneOf", key, value);
      deleteExtraneousOneOfKeys(value as Record<string, unknown>);
    }

    // Since we know that the value is an object, we can recurse
    fixOneOfKeys(value as Record<string, unknown>, valueSchema);
  }
}

export interface JsonSchemaFormProps
  extends Pick<
    Partial<FormProps>,
    "widgets" | "fields" | "templates" | "uiSchema"
  > {
  schema: RJSFSchema;
  formId: string;
  initialFormData?: JsonDataType;
  onSubmit?: (data: JsonDataType) => void;
  /** Onchange callback is with BROKEN data */
  onChange?: (data: JsonDataType, errors: RJSFValidationError[]) => void;
  formContext?: Record<string, unknown>;
}

export const JsonSchemaForm: FC<JsonSchemaFormProps> = ({
  formId,
  schema,
  initialFormData = "",
  onSubmit: propsOnSubmit,
  onChange: propsOnChange,
  widgets,
  fields,
  templates,
  uiSchema,
  formContext,
}) => {
  const [formData, setFormData] = useState<JsonDataType>(initialFormData);

  const collapsedSchema = useMemo(
    () => createSchemaUtils(v8Validator, schema).retrieveSchema(schema),
    [schema]
  );

  const fixOneOfKeysCallback = useCallback(
    (data: Record<string, unknown>) => fixOneOfKeys(data, collapsedSchema),
    [collapsedSchema]
  );

  const onSubmit = (values: Record<string, unknown>) => {
    fixOneOfKeysCallback(values);
    console.log("onSubmit", values);

    propsOnSubmit?.(values);
  };

  const onChange = useCallback(
    (data: JsonDataType, errors: RJSFValidationError[]) => {
      if (data) {
        const values: JsonDataType = structuredClone(data);
        if (typeof values === "object")
          fixOneOfKeysCallback(values as Record<string, unknown>);

        if (!isEqual(formData, values)) {
          setFormData(values);
          propsOnChange?.(values, errors);
        }
      }
    },
    [fixOneOfKeysCallback, formData, propsOnChange]
  );

  useEffect(() => {
    setFormData(initialFormData);

    // validate when initialFormData has changed
    const { errors } = v8Validator.validateFormData(initialFormData, schema);
    propsOnChange?.(initialFormData, errors);
  }, [JSON.stringify(initialFormData)]);

  return (
    <Form
      id={formId}
      formContext={formContext}
      formData={formData}
      schema={schema}
      uiSchema={{
        "ui:submitButtonOptions": {
          norender: true,
        },
        ...uiSchema,
      }}
      widgets={{
        ...DefaultWidgets,
        ...Widgets,
        ...widgets,
      }}
      fields={{
        ...Fields,
        ...fields,
      }}
      templates={{
        ...DefaultTemplates,
        ...Templates,
        ...templates,
      }}
      validator={v8Validator}
      liveValidate={!schema.readOnly}
      showErrorList={false}
      onChange={({ formData: values, errors }) => {
        // log.info(values)
        onChange?.(values, errors);
      }}
      onSubmit={({ formData: values }) => {
        // log.info(values)
        onSubmit(values);
      }}
      onError={() => console.error("errors")}
    />
  );
};
