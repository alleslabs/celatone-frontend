/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  Text,
} from "@chakra-ui/react";
// import { fromBase64, fromUtf8, toBase64, toUtf8 } from "@cosmjs/encoding";
import type { WidgetProps } from "@rjsf/utils";
import { getInputProps, getTemplate, getUiOptions } from "@rjsf/utils";
import type { ChangeEvent, FocusEvent } from "react";

import { isSchemaTypeString } from "../utils";

import { FieldTypeTag } from "./FieldTypeTag";

// const PLACEHOLDERS = {
//   addr: "cosmos1...",
//   code_id: "1",
//   contract: "cosmos1...",
// };

// const renderRightAddOn = <T = any, F = any>(
//   value: WidgetProps<T, F>["value"],
//   label: WidgetProps<T, F>["label"],
//   schema: WidgetProps<T, F>["schema"],
//   onChange: WidgetProps<T, F>["onChange"],
//   formContext: WidgetProps<T, F>["formContext"]
// ) => {
//   // console.log(formContext, "formContext");
//   if (schema.description?.includes("Binary is a wrapper around Vec<u8>")) {
//     return (
//       <HStack>
//         <Button size="sm" onClick={() => onChange(toBase64(toUtf8(value)))}>
//           base64
//         </Button>
//         <Button
//           size="sm"
//           onClick={() => onChange(fromUtf8(fromBase64(value)))}
//           textDecoration="line-through"
//         >
//           base64
//         </Button>
//       </HStack>
//     );
//   }
//   if (
//     label.includes("addr") &&
//     formContext &&
//     typeof formContext === "object" &&
//     "address" in formContext
//   ) {
//     return (
//       <Button size="sm" onClick={() => onChange(formContext.address)}>
//         Me
//       </Button>
//     );
//   }
//   return null;
// };

const getBaseInputPlaceholder = (
  value: any,
  readonly: boolean,
  required: boolean,
  isString: boolean
) => {
  if (isString && value === "") return "Empty string";
  if (required) return "";
  return `${readonly ? "" : "Left blank to send as "}null`;
};

const BaseInputTemplate = <T = any, F = any>(props: WidgetProps<T, F>) => {
  const {
    id,
    type,
    value,
    label,
    schema,
    uiSchema,
    onChange,
    onBlur,
    onFocus,
    options,
    required = false,
    readonly,
    rawErrors,
    autofocus,
    // placeholder,
    disabled,
    // formContext,
    registry,
  } = props;
  const inputProps = getInputProps<T, F>(schema, type, options);

  const uiOptions = getUiOptions<T, F>(uiSchema);
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    F
  >("DescriptionFieldTemplate", registry, uiOptions);

  const { schemaUtils } = registry;
  const displayLabel =
    schemaUtils.getDisplayLabel(schema, uiSchema) &&
    (!!label || !!schema.title);

  const handleOnChange = ({ target }: ChangeEvent<HTMLInputElement>) =>
    onChange(target.value === "" ? options.emptyValue : target.value);
  const handleOnBlur = ({ target }: FocusEvent<HTMLInputElement>) =>
    onBlur(id, target.value);
  const handleOnFocus = ({ target }: FocusEvent<HTMLInputElement>) =>
    onFocus(id, target.value);

  // const rightAddon = renderRightAddOn(
  //   value,
  //   label,
  //   schema,
  //   onChange,
  //   formContext
  // );

  const isStringType = isSchemaTypeString(schema.type);

  return (
    <FormControl
      isDisabled={disabled || readonly}
      isRequired={required && !readonly}
      isReadOnly={readonly}
      isInvalid={rawErrors && rawErrors.length > 0}
    >
      {displayLabel && (
        <Flex>
          <FormLabel
            htmlFor={id}
            id={`${id}-label`}
            fontSize="12px"
            fontWeight={700}
            marginInlineEnd={1}
            _disabled={{
              color: "text.main",
            }}
          >
            {label}
          </FormLabel>
          <FieldTypeTag type={schema.type} format={schema.format} />
        </Flex>
      )}
      <Flex direction="column" gap={2} mb={4}>
        <InputGroup>
          <Input
            id={id}
            name={id}
            value={value || value === 0 ? value : ""}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            autoFocus={autofocus}
            placeholder={
              getBaseInputPlaceholder(
                value,
                readonly ?? false,
                required,
                isStringType
              )
              // placeholder || Object.entries(PLACEHOLDERS).find(([key]) =>
              //   label.includes(key)
              // )?.[1]
            }
            {...inputProps}
            list={schema.examples ? `examples_${id}` : undefined}
            _disabled={{
              color: "text.main",
              cursor: "not-allowed",
              _hover: {
                borderColor: "gray.700",
              },
              _active: {
                border: "1px solid var(--chakra-colors-gray-700)",
              },
            }}
          />
          {/* {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>} */}
        </InputGroup>
        {!readonly && isStringType && (
          <Checkbox
            pl={2}
            isChecked={value === ""}
            onChange={(e) => {
              if (e.target.checked) onChange("" as T);
              else onChange(undefined as T);
            }}
          >
            <Text variant="body3">Send as empty string</Text>
          </Checkbox>
        )}
      </Flex>
      {Array.isArray(schema.examples) ? (
        <datalist id={`examples_${id}`}>
          {(schema.examples as string[])
            .concat(
              schema.default && !schema.examples.includes(schema.default)
                ? ([schema.default] as string[])
                : []
            )
            .map((example: any) => {
              return (
                <option key={example} value={example} aria-label={example} />
              );
            })}
        </datalist>
      ) : null}
      {!!schema.description && (
        <Box mt={1}>
          <DescriptionFieldTemplate
            id={`${id}-description`}
            description={schema.description}
            registry={registry}
          />
        </Box>
      )}
    </FormControl>
  );
};

export default BaseInputTemplate;
