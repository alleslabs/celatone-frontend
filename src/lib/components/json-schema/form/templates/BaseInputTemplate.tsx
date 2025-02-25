/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable complexity */
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
import type {
  BaseInputTemplateProps,
  FormContextType,
  RJSFSchema,
  StrictRJSFSchema,
} from "@rjsf/utils";
import {
  ariaDescribedByIds,
  descriptionId,
  examplesId,
  getInputProps,
  getTemplate,
} from "@rjsf/utils";
import { useCallback } from "react";
import type { ChangeEvent, FocusEvent } from "react";

import { FieldTypeTag } from "./FieldTypeTag";
import { isSchemaTypeString } from "../utils";

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

/** The `BaseInputTemplate` is the template to use to render the basic `<input>` component for the `core` theme.
 * It is used as the template for rendering many of the <input> based widgets that differ by `type` and callbacks only.
 * It can be customized/overridden for other themes or individual implementations as needed.
 *
 * @param props - The `WidgetProps` for this template
 */
export default function BaseInputTemplate<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
>(props: BaseInputTemplateProps<T, S, F>) {
  const {
    id,
    name, // remove this from ...rest
    value,
    label,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    onChange,
    onChangeOverride,
    options,
    required = false,
    schema,
    uiSchema,
    formContext,
    registry,
    rawErrors,
    type,
    hideLabel, // remove this from ...rest
    hideError, // remove this from ...rest
    placeholder,
    ...rest
  } = props;
  const DescriptionFieldTemplate = getTemplate<
    "DescriptionFieldTemplate",
    T,
    S,
    F
  >("DescriptionFieldTemplate", registry, options);

  const { schemaUtils } = registry;
  const displayLabel =
    schemaUtils.getDisplayLabel(schema, uiSchema) &&
    (!!label || !!schema.title);

  // Note: since React 15.2.0 we can't forward unknown element attributes, so we
  // exclude the "options" and "schema" ones here.
  if (!id) {
    // console.log("No id for", props);
    throw new Error(`no id for props ${JSON.stringify(props)}`);
  }
  const inputProps = {
    ...rest,
    ...getInputProps<T, S, F>(schema, type, options),
  };

  let inputValue;
  if (inputProps.type === "number" || inputProps.type === "integer") {
    inputValue = value || value === 0 ? value : "";
  } else {
    inputValue = value === null ? "" : value;
  }

  const handleOnChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) =>
      onChange(target.value === "" ? options.emptyValue : target.value),
    [onChange, options.emptyValue]
  );
  const handleOnBlur = useCallback(
    ({ target }: FocusEvent<HTMLInputElement>) => onBlur(id, target.value),
    [onBlur, id]
  );
  const handleOnFocus = useCallback(
    ({ target }: FocusEvent<HTMLInputElement>) => onFocus(id, target.value),
    [onFocus, id]
  );
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
      className="form-control"
      isDisabled={disabled || readonly}
      isRequired={required && !readonly}
      isReadOnly={readonly}
      isInvalid={rawErrors && rawErrors.length > 0}
    >
      {displayLabel && (
        <Flex gap={2}>
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
            value={inputValue}
            autoFocus={autofocus}
            placeholder={
              placeholder ||
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
            list={schema.examples ? examplesId<T>(id) : undefined}
            onChange={handleOnChange}
            onBlur={handleOnBlur}
            onFocus={handleOnFocus}
            aria-describedby={ariaDescribedByIds<T>(id, !!schema.examples)}
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
      {Array.isArray(schema.examples) && (
        <datalist key={`datalist_${id}`} id={examplesId<T>(id)}>
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
      )}
      {!!schema.description && (
        <Box mt={1}>
          <DescriptionFieldTemplate
            id={descriptionId<T>(id)}
            description={schema.description}
            schema={schema}
            registry={registry}
          />
        </Box>
      )}
    </FormControl>
  );
}
