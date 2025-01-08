/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-param-reassign */
/* eslint-disable no-continue */
/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
import Form, {
  Templates as DefaultTemplates,
  Widgets as DefaultWidgets,
} from "@rjsf/chakra-ui";
import type { FormProps } from "@rjsf/core";
import type { RJSFSchema, RJSFValidationError } from "@rjsf/utils";
import { customizeValidator } from "@rjsf/validator-ajv8";
import { isUndefined } from "lodash";
import type { FC } from "react";
import { useEffect, useMemo, useState } from "react";

import type { JsonDataType } from "lib/types";

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
      formContext={formContext}
      formData={formData}
      schema={fixedSchema}
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
      noValidate
      showErrorList={false}
      onChange={({ formData: values, errors }) => {
        setFormData(values);
        propsOnChange?.(values, errors);
      }}
      onSubmit={({ formData: values }) => {
        // console.log("onSubmit", values);
        propsOnSubmit?.(values);
      }}
      // onError={() => console.error("errors")}
      experimental_defaultFormStateBehavior={{
        // Assign value to formData when only default is set
        emptyObjectFields: "skipEmptyDefaults",
      }}
    />
  );
};
