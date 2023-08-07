/* eslint-disable */
import type { FieldProps, RJSFSchema } from "@rjsf/utils";
import {
  ERRORS_KEY,
  deepEquals,
  getUiOptions,
  getWidget,
  guessType,
} from "@rjsf/utils";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import omit from "lodash/omit";
import unset from "lodash/unset";
import { Component } from "react";

/** Type used for the state of the `AnyOfField` component */
type AnyOfFieldState = {
  /** The currently selected option */
  selectedOptionIndex: number;
};

/**
 * Replacement from react-jsonschema-form. Ensures fields are named correctly
 * The `AnyOfField` component is used to render a field in the schema that is an `anyOf`, `allOf`
 * or `oneOf`. It tracks the currently selected option and cleans up any irrelevant data in
 * `formData`.
 *
 * @param props - The `FieldProps` for this template
 */
class MultiSchemaField<T extends object = any, F = any> extends Component<
  FieldProps<T, F>,
  AnyOfFieldState
> {
  /** Constructs an `AnyOfField` with the given `props` to initialize the initially selected option in state
   *
   * @param props - The `FieldProps` for this template
   */
  constructor(props: FieldProps<T, F>) {
    super(props);

    const { formData, options } = this.props;

    this.state = {
      selectedOptionIndex: this.getMatchingOption(0, formData, options),
    };
  }

  /**
   * React lifecycle methos that is called when the props and/or state for this component is
   * updated. It recomputes the currently selected option based on the overall `formData`
   *
   * @param prevProps - The previous `FieldProps` for this template
   * @param prevState - The previous `AnyOfFieldState` for this template
   */
  componentDidUpdate(
    prevProps: Readonly<FieldProps<T, F>>,
    prevState: Readonly<AnyOfFieldState>
  ) {
    const { formData, options, idSchema } = this.props;
    const { selectedOptionIndex } = this.state;
    if (
      !deepEquals(formData, prevProps.formData) &&
      idSchema.$id === prevProps.idSchema.$id
    ) {
      const matchingOption = this.getMatchingOption(
        selectedOptionIndex,
        formData,
        options
      );

      if (!prevState || matchingOption === selectedOptionIndex) {
        return;
      }

      this.setState({
        selectedOptionIndex: matchingOption,
      });
    }
  }

  /**
   * Determines the best matching option for the given `formData` and `options`.
   *
   * @param formData - The new formData
   * @param options - The list of options to choose from
   * @return - The index of the `option` that best matches the `formData`
   */
  getMatchingOption(
    selectedOption: number,
    formData: T,
    options: RJSFSchema[]
  ) {
    const {
      registry: { schemaUtils },
    } = this.props;

    const option = schemaUtils.getMatchingOption(formData, options);
    if (option !== 0) {
      return option;
    }
    // If the form data matches none of the options, use the currently selected
    // option, assuming it's available; otherwise use the first option
    return selectedOption || 0;
  }

  /**
   *  Callback handler to remember what the currently selected option is. In addition to that the
   * `formData` is updated to remove properties that are not part of the newly selected option
   * schema, and then the updated data is passed to the `onChange` handler.
   *
   * @param option -
   */
  onOptionChange = (selectedOption: any) => {
    const selectedOptionIndex = parseInt(selectedOption, 10);
    // console.log("I HAVE SELECTED", selectedOptionIndex)
    const { formData, onChange, options, registry } = this.props;
    const { schemaUtils } = registry;
    const newOption = schemaUtils.retrieveSchema(
      options[selectedOptionIndex],
      formData
    );

    // If the new option is of type object and the current data is an object,
    // discard properties added using the old option.
    let newFormData: T | undefined;
    if (
      guessType(formData) === "object" &&
      (newOption.type === "object" || newOption.properties)
    ) {
      newFormData = { ...formData };

      const optionsToDiscard = options.slice();
      // Remove the newly selected option from the list of options to discard
      optionsToDiscard.splice(selectedOptionIndex, 1);
      // console.log("OPTIONS TO DISCARD", optionsToDiscard)

      // Discard any data added using other options
      for (const option of optionsToDiscard) {
        if (option.properties) {
          for (const key in option.properties) {
            if (key in newFormData) {
              // console.log("UNSET", newFormData, key)
              unset(newFormData, key);
            }
          }
        }
      }
    }

    // Call getDefaultFormState to make sure defaults are populated on change.
    const defaultFormState = schemaUtils.getDefaultFormState(
      options[selectedOptionIndex],
      newFormData
    ) as T;
    // console.log("DEFAULT FORM STATE", defaultFormState)
    onChange(defaultFormState);

    this.setState({
      selectedOptionIndex,
    });
  };

  /**
   * Renders the `AnyOfField` selector along with a `SchemaField` for the value of the `formData`
   */
  render() {
    const {
      name,
      disabled = false,
      baseType,
      errorSchema = {},
      formContext,
      idSchema,
      onBlur,
      onFocus,
      options,
      registry,
      uiSchema,
      schema,
    } = this.props;

    const { widgets, fields, schemaUtils } = registry;
    const { SchemaField } = fields;
    const { selectedOptionIndex } = this.state;
    const {
      widget = "select",
      placeholder,
      autofocus,
      autocomplete,
      title = schema.title,
      ...uiOptions
    } = getUiOptions<T, F>(uiSchema);
    const Widget = getWidget<T>({ type: "number" }, widget, widgets);
    const rawErrors = get(errorSchema, ERRORS_KEY, []);
    const fieldErrorSchema = omit(errorSchema, [ERRORS_KEY]);
    const displayLabel = schemaUtils.getDisplayLabel<F>(schema, uiSchema);

    const selectedOption = options[selectedOptionIndex] || null;
    let optionSchema;
    if (selectedOption) {
      // If the subschema doesn't declare a type, infer the type from the
      // parent schema
      optionSchema = selectedOption.type
        ? selectedOption
        : { ...selectedOption, type: baseType };
    }

    // if the second option's type is "null" it's probably a rust optional.
    // This means that the nonnull value should use the name as the option name
    const enumOptions = options.map((option: RJSFSchema, index: number) => {
      let optionTitle = option.title;

      // Rust optional case
      if (option.required?.length && option.required.length > 0) {
        // there is one option available, so we can use  its title
        if (option.required.length === 1) {
          optionTitle = option.required[0];
        }
      }
      if (option.type === "string" && option.enum?.length === 1) {
        optionTitle = option.enum[0]?.toString();
      }
      // Rust optional case
      else if (option.type === "null") {
        optionTitle = `No ${name}`;
      }
      // Here we do the second part of the above, because the non optional
      else if (
        options.length === 2 &&
        options.some((opt: RJSFSchema) => opt.type === "null")
      ) {
        optionTitle = name;
      }

      return {
        label: optionTitle || `Option ${index + 1}`,
        value: index,
      };
    });

    return (
      <div className="panel panel-default panel-body">
        <div className="form-group">
          <Widget
            id={`${idSchema.$id}${
              schema.oneOf ? "__oneof_select" : "__anyof_select"
            }`}
            schema={{ type: "number", default: 0 }}
            onChange={this.onOptionChange}
            onBlur={onBlur}
            onFocus={onFocus}
            disabled={disabled || isEmpty(enumOptions)}
            multiple={false}
            rawErrors={rawErrors}
            errorSchema={fieldErrorSchema}
            value={selectedOptionIndex >= 0 ? selectedOptionIndex : undefined}
            options={{ enumOptions, ...uiOptions }}
            registry={registry}
            formContext={formContext}
            placeholder={placeholder}
            autocomplete={autocomplete}
            autofocus={autofocus}
            label={title ?? name}
            hideLabel={!displayLabel}
          />
        </div>
        {selectedOption !== null && (
          <SchemaField {...this.props} schema={optionSchema} />
        )}
      </div>
    );
  }
}

export default MultiSchemaField;
