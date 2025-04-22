/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */

import type { FormProps } from "@rjsf/core";
import type { RJSFSchema, RJSFValidationError } from "@rjsf/utils";
import type { JsonDataType } from "lib/types";
import type { FC } from "react";

import Form, {
  Templates as DefaultTemplates,
  Widgets as DefaultWidgets,
} from "@rjsf/chakra-ui";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { isUndefined } from "lodash";
import { useEffect, useMemo, useState } from "react";

import { Fields } from "./fields";
import { Templates } from "./templates";
import { Widgets } from "./widgets";

// NOTE: Set `validateFormats` to false, since some custom format
// e.g. `uint32` causing an unexpected behavior
const v8Validator = customizeValidator({
  ajvOptionsOverrides: { validateFormats: false },
});

function fixSchema(schema: RJSFSchema) {
  if (schema.type === "object" && isUndefined(schema.properties))
    schema.properties = {};

  Object.values(schema).forEach((value) => {
    if (typeof value === "object") fixSchema(value);
  });
}

export interface JsonSchemaFormProps
  extends Pick<
    Partial<FormProps>,
    "fields" | "templates" | "uiSchema" | "widgets"
  > {
  formContext?: Record<string, unknown>;
  formId: string;
  initialFormData?: JsonDataType;
  /** Onchange callback is with BROKEN data */
  onChange?: (data: JsonDataType, errors: RJSFValidationError[]) => void;
  onSubmit?: (data: JsonDataType) => void;
  schema: RJSFSchema;
}

export const JsonSchemaForm: FC<JsonSchemaFormProps> = ({
  fields,
  formContext,
  formId,
  initialFormData = "",
  onChange: propsOnChange,
  onSubmit: propsOnSubmit,
  schema,
  templates,
  uiSchema,
  widgets,
}) => {
  const fixedSchema = useMemo(() => {
    fixSchema(schema);
    return schema;
  }, [schema]);
  const [formData, setFormData] = useState<JsonDataType>(initialFormData);

  useEffect(() => {
    setFormData(initialFormData);

    // validate when initialFormData has changed
    const { errors } = v8Validator.validateFormData(initialFormData, schema);
    propsOnChange?.(initialFormData, errors);
  }, [JSON.stringify(initialFormData)]);

  return (
    <Form
      id={formId}
      // onError={() => console.error("errors")}
      experimental_defaultFormStateBehavior={{
        // Assign value to formData when only default is set
        emptyObjectFields: "skipEmptyDefaults",
      }}
      fields={{
        ...Fields,
        ...fields,
      }}
      formContext={formContext}
      formData={formData}
      liveValidate={!schema.readOnly}
      noValidate
      schema={fixedSchema}
      showErrorList={false}
      templates={{
        ...DefaultTemplates,
        ...Templates,
        ...templates,
      }}
      uiSchema={{
        "ui:submitButtonOptions": {
          norender: true,
        },
        ...uiSchema,
      }}
      validator={v8Validator}
      widgets={{
        ...DefaultWidgets,
        ...Widgets,
        ...widgets,
      }}
      onChange={({ errors, formData: values }) => {
        setFormData(values);
        propsOnChange?.(values, errors);
      }}
      onSubmit={({ formData: values }) => {
        // console.log("onSubmit", values);
        propsOnSubmit?.(values);
      }}
    />
  );
};
