/* eslint-disable */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  Form,
  Templates as DefaultTemplates,
  Widgets as DefaultWidgets,
} from "@rjsf/chakra-ui";
import type { FormProps } from "@rjsf/core";
import type { RJSFSchema } from "@rjsf/utils";
import { createSchemaUtils, type GenericObjectType } from "@rjsf/utils";
import v8Validator from "@rjsf/validator-ajv8";
import isEqual from "lodash/isEqual";
import { FC, useEffect } from "react";
import { useCallback, useMemo, useState } from "react";

import JsonReadOnly from "../../json/JsonReadOnly";
import { jsonPrettify } from "lib/utils";

import contractSchema from "./contract_schema.json";
import { Fields } from "./fields";
import { Templates } from "./templates";
import { Widgets } from "./widgets";

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
  // console.log(collapsedSchema);

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
      console.log("Found oneOf", key, value);
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
  initialFormData?: Record<string, unknown>;
  onSubmit?: (data: Record<string, unknown>) => void;
  /** Onchange callback is with BROKEN data */
  onChange?: (data: Record<string, unknown>) => void;
  formContext?: Record<string, unknown>;
}

export const JsonSchemaForm: FC<JsonSchemaFormProps> = ({
  formId,
  schema,
  initialFormData = {},
  onSubmit: propsOnSubmit,
  onChange: propsOnChange,
  widgets,
  fields,
  templates,
  uiSchema,
  formContext,
}) => {
  const [formData, setFormData] =
    useState<Record<string, unknown>>(initialFormData);

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
    (data: Record<string, unknown>) => {
      const values = { ...data };
      if (data) {
        fixOneOfKeysCallback(values);
        if (!isEqual(formData, values)) {
          setFormData(values);
          propsOnChange?.(values);
        }
      }
    },
    [fixOneOfKeysCallback, formData, propsOnChange]
  );

  useEffect(
    () => setFormData(initialFormData),
    [JSON.stringify(initialFormData)]
  );

  return (
    <Box w="full">
      <Form
        id={formId}
        formContext={formContext}
        formData={formData}
        schema={schema}
        // we use no validate because the schemas are too complicated to be auto validated
        // noValidate
        uiSchema={{
          "ui:submitButtonOptions": {
            norender: true,
          },
          "ui:form": {
            width: "100%",
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
        onChange={({ formData: values }) => {
          // log.info(values)
          onChange?.(values);
        }}
        onSubmit={({ formData: values }) => {
          // log.info(values)
          onSubmit(values);
        }}
        onError={() => console.error("errors")}
      />
    </Box>
  );
};

export const DummyJsonSchema = () => {
  // TODO: remove mock data
  const toast = useToast({ containerStyle: { width: "fit-content" } });
  const { oneOf: msgs, definitions } = contractSchema.execute;

  // const schema = contractSchema.execute as GenericObjectType;

  return (
    <Accordion allowToggle>
      {msgs.map((msg, index) => (
        <AccordionItem key={index.toString() + msg.required[0]} mb={4}>
          <h2>
            <AccordionButton p={2}>
              <Box w="full">
                <Heading variant="h5" textAlign="left">
                  {msg.required[0]}
                </Heading>
                <Text variant="body2" textAlign="left">
                  {msg.description}
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <JsonSchemaForm
              formId="execute"
              schema={
                {
                  $schema: contractSchema.execute.$schema,
                  ...msg,
                  definitions,
                  description: undefined,
                } as GenericObjectType
              }
              onSubmit={(data) =>
                toast({
                  title: "Form Data",
                  description: (
                    <Box w={256}>
                      <JsonReadOnly text={jsonPrettify(JSON.stringify(data))} />
                    </Box>
                  ),
                  status: "success",
                  isClosable: true,
                })
              }
              onChange={(data) => console.log("data", data)}
            />
          </AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
    // <JsonSchemaForm
    //   formId="execute"
    //   schema={schema}
    //   onSubmit={(data) =>
    //     toast({
    //       title: "Form Data",
    //       description: (
    //         <Box w={256}>
    //           <JsonReadOnly text={jsonPrettify(JSON.stringify(data))} />
    //         </Box>
    //       ),
    //       status: "success",
    //       isClosable: true,
    //     })
    //   }
    //   onChange={(data) => {
    //     console.log("data", data);
    //   }}
    // />
  );
};
