/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ArrayFieldTemplateProps,
  ErrorSchema,
  Field,
  FieldProps,
  FormContextType,
  IdSchema,
  RJSFSchema,
  StrictRJSFSchema,
  UiSchema,
} from "@rjsf/utils";

import { Button, Flex, Text } from "@chakra-ui/react";
import {
  allowAdditionalItems,
  getTemplate,
  getUiOptions,
  getWidget,
  isCustomWidget,
  isFixedItems,
  ITEMS_KEY,
  optionsList,
  TranslatableString,
} from "@rjsf/utils";
import { CustomIcon } from "lib/components/icon";
import { cloneDeep } from "lodash";
import get from "lodash/get";
import isObject from "lodash/isObject";
import set from "lodash/set";
import { Component } from "react";
import * as uuid from "uuid";

import { isNullFormData } from "../utils";

/** Type used to represent the keyed form data used in the state */
type KeyedFormDataType<T> = { item: T; key: string };

/** Type used for the state of the `ArrayField` component */
type ArrayFieldState<T> = {
  /** The keyed form data elements */
  keyedFormData: KeyedFormDataType<T>[];
  /** Flag indicating whether any of the keyed form data has been updated */
  updatedKeyedFormData: boolean;
};

/** Used to generate a unique ID for an element in a row */
function generateRowId() {
  return uuid.v4();
}

/** Converts the `formData` into `KeyedFormDataType` data, using the `generateRowId()` function to create the key
 *
 * @param formData - The data for the form
 * @returns - The `formData` converted into a `KeyedFormDataType` element
 */
function generateKeyedFormData<T>(formData: T[]): KeyedFormDataType<T>[] {
  return !Array.isArray(formData)
    ? []
    : formData.map((item) => {
        return {
          item,
          key: generateRowId(),
        };
      });
}

/** Converts `KeyedFormDataType` data into the inner `formData`
 *
 * @param keyedFormData - The `KeyedFormDataType` to be converted
 * @returns - The inner `formData` item(s) in the `keyedFormData`
 */
function keyedToPlainFormData<T>(
  keyedFormData: KeyedFormDataType<T> | KeyedFormDataType<T>[]
): T[] {
  if (Array.isArray(keyedFormData)) {
    return keyedFormData.map((keyedItem) => keyedItem.item);
  }
  return [];
}

/** The `ArrayField` component is used to render a field in the schema that is of type `array`. It supports both normal
 * and fixed array, allowing user to add and remove elements from the array data.
 */
class ArrayField<
  T = any,
  S extends StrictRJSFSchema = RJSFSchema,
  F extends FormContextType = any,
> extends Component<FieldProps<T[], S, F>, ArrayFieldState<T>> {
  /** Returns the appropriate title for an item by getting first the title from the schema.items, then falling back to
   * the description from the schema.items, and finally the string "Item"
   */
  get itemTitle() {
    const { registry, schema } = this.props;
    const { translateString } = registry;
    return get(
      schema,
      [ITEMS_KEY, "title"],
      get(
        schema,
        [ITEMS_KEY, "description"],
        translateString(TranslatableString.ArrayItemTitle)
      )
    );
  }

  /** Constructs an `ArrayField` from the `props`, generating the initial keyed data from the `formData`
   *
   * @param props - The `FieldProps` for this template
   */
  constructor(props: FieldProps<T[], S, F>) {
    super(props);
    const { formData = [] } = props;
    const keyedFormData = generateKeyedFormData<T>(formData);
    this.state = {
      keyedFormData,
      updatedKeyedFormData: false,
    };
  }

  /** React lifecycle method that is called when the props are about to change allowing the state to be updated. It
   * regenerates the keyed form data and returns it
   *
   * @param nextProps - The next set of props data
   * @param prevState - The previous set of state data
   */
  static getDerivedStateFromProps<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any,
  >(
    nextProps: Readonly<FieldProps<T[], S, F>>,
    prevState: Readonly<ArrayFieldState<T>>
  ) {
    // Don't call getDerivedStateFromProps if keyed formdata was just updated.
    if (prevState.updatedKeyedFormData) {
      return {
        updatedKeyedFormData: false,
      };
    }
    const nextFormData = Array.isArray(nextProps.formData)
      ? nextProps.formData
      : [];
    const previousKeyedFormData = prevState.keyedFormData || [];
    const newKeyedFormData =
      nextFormData.length === previousKeyedFormData.length
        ? previousKeyedFormData.map((previousKeyedFormDatum, index) => {
            return {
              item: nextFormData[index],
              key: previousKeyedFormDatum.key,
            };
          })
        : generateKeyedFormData<T>(nextFormData);
    return {
      keyedFormData: newKeyedFormData,
    };
  }

  /** Determines whether more items can be added to the array. If the uiSchema indicates the array doesn't allow adding
   * then false is returned. Otherwise, if the schema indicates that there are a maximum number of items and the
   * `formData` matches that value, then false is returned, otherwise true is returned.
   *
   * @param formItems - The list of items in the form
   * @returns - True if the item is addable otherwise false
   */
  canAddItem(formItems: any[]) {
    const { registry, schema, uiSchema } = this.props;
    let { addable } = getUiOptions<T[], S, F>(
      uiSchema,
      registry.globalUiOptions
    );
    if (addable !== false) {
      // if ui:options.addable was not explicitly set to false, we can add
      // another item if we have not exceeded maxItems yet
      if (schema.maxItems !== undefined) {
        addable = formItems.length < schema.maxItems;
      } else {
        addable = true;
      }
    }
    return addable;
  }

  /** Returns the default form information for an item based on the schema for that item. Deals with the possibility
   * that the schema is fixed and allows additional items.
   */
  getNewFormDataRow = (): T => {
    const { registry, schema } = this.props;
    const { schemaUtils } = registry;
    let itemSchema = schema.items as S;
    if (isFixedItems(schema) && allowAdditionalItems(schema)) {
      itemSchema = schema.additionalItems as S;
    }
    // Cast this as a T to work around schema utils being for T[] caused by the FieldProps<T[], S, F> call on the class
    return schemaUtils.getDefaultFormState(itemSchema) as unknown as T;
  };

  /** Callback handler for when the user clicks on the add or add at index buttons. Creates a new row of keyed form data
   * either at the end of the list (when index is not specified) or inserted at the `index` when it is, adding it into
   * the state, and then returning `onChange()` with the plain form data converted from the keyed data
   *
   * @param event - The event for the click
   * @param [index] - The optional index at which to add the new data
   */
  handleAddClick = (event: MouseEvent, index?: number) => {
    if (event) {
      event.preventDefault();
    }

    const { errorSchema, onChange } = this.props;
    const { keyedFormData } = this.state;
    // refs #195: revalidate to ensure properly reindexing errors
    let newErrorSchema: ErrorSchema<T>;
    if (errorSchema) {
      newErrorSchema = {};
      Object.keys(errorSchema).forEach((_, idx) => {
        if (index === undefined || idx < index) {
          set(newErrorSchema, [idx], errorSchema[idx]);
        } else if (idx >= index) {
          set(newErrorSchema, [idx + 1], errorSchema[idx]);
        }
      });
    }

    const newKeyedFormDataRow: KeyedFormDataType<T> = {
      item: this.getNewFormDataRow(),
      key: generateRowId(),
    };
    const newKeyedFormData = [...keyedFormData];
    if (index !== undefined) {
      newKeyedFormData.splice(index, 0, newKeyedFormDataRow);
    } else {
      newKeyedFormData.push(newKeyedFormDataRow);
    }
    this.setState(
      {
        keyedFormData: newKeyedFormData,
        updatedKeyedFormData: true,
      },
      () =>
        onChange(
          keyedToPlainFormData(newKeyedFormData),
          newErrorSchema as ErrorSchema<T[]>
        )
    );
  };

  /** Determines whether the item described in the schema is always required, which is determined by whether any item
   * may be null.
   *
   * @param itemSchema - The schema for the item
   * @return - True if the item schema type does not contain the "null" type
   */
  isItemRequired(itemSchema: S) {
    if (Array.isArray(itemSchema.type)) {
      // While we don't yet support composite/nullable jsonschema types, it's
      // future-proof to check for requirement against these.
      return !itemSchema.type.includes("null");
    }
    // All non-null array item types are inherently required by design
    return itemSchema.type !== "null";
  }

  /** Callback handler for when the user clicks on the add button. Creates a new row of keyed form data at the end of
   * the list, adding it into the state, and then returning `onChange()` with the plain form data converted from the
   * keyed data
   *
   * @param event - The event for the click
   */
  onAddClick = (event: MouseEvent) => {
    this.handleAddClick(event);
  };

  /** Callback handler for when the user clicks on the add button on an existing array element. Creates a new row of
   * keyed form data inserted at the `index`, adding it into the state, and then returning `onChange()` with the plain
   * form data converted from the keyed data
   *
   * @param index - The index at which the add button is clicked
   */
  onAddIndexClick = (index: number) => {
    return (event: MouseEvent) => {
      this.handleAddClick(event, index);
    };
  };

  /** Callback handler used to deal with changing the value of the data in the array at the `index`. Calls the
   * `onChange` callback with the updated form data
   *
   * @param index - The index of the item being changed
   */
  onChangeForIndex = (index: number) => {
    return (value: any, newErrorSchema?: ErrorSchema<T>, id?: string) => {
      const { errorSchema, formData, onChange } = this.props;
      const arrayData = Array.isArray(formData) ? formData : [];
      const newFormData = arrayData.map((item: T, i: number) => {
        // We need to treat undefined items as nulls to have validation.
        // See https://github.com/tdegrunt/jsonschema/issues/206
        const jsonValue = typeof value === "undefined" ? null : value;
        return index === i ? jsonValue : item;
      });
      onChange(
        newFormData,
        errorSchema && {
          ...errorSchema,
          [index]: newErrorSchema,
        },
        id
      );
    };
  };

  /** Callback handler for when the user clicks on the copy button on an existing array element. Clones the row of
   * keyed form data at the `index` into the next position in the state, and then returning `onChange()` with the plain
   * form data converted from the keyed data
   *
   * @param index - The index at which the copy button is clicked
   */
  onCopyIndexClick = (index: number) => {
    return (event: MouseEvent) => {
      if (event) {
        event.preventDefault();
      }

      const { errorSchema, onChange } = this.props;
      const { keyedFormData } = this.state;
      // refs #195: revalidate to ensure properly reindexing errors
      let newErrorSchema: ErrorSchema<T>;
      if (errorSchema) {
        newErrorSchema = {};
        Object.keys(errorSchema).forEach((_, idx) => {
          if (idx <= index) {
            set(newErrorSchema, [idx], errorSchema[idx]);
          } else {
            set(newErrorSchema, [idx + 1], errorSchema[idx]);
          }
        });
      }

      const newKeyedFormDataRow: KeyedFormDataType<T> = {
        item: cloneDeep(keyedFormData[index].item),
        key: generateRowId(),
      };
      const newKeyedFormData = [...keyedFormData];
      if (index !== undefined) {
        newKeyedFormData.splice(index + 1, 0, newKeyedFormDataRow);
      } else {
        newKeyedFormData.push(newKeyedFormDataRow);
      }
      this.setState(
        {
          keyedFormData: newKeyedFormData,
          updatedKeyedFormData: true,
        },
        () =>
          onChange(
            keyedToPlainFormData(newKeyedFormData),
            newErrorSchema as ErrorSchema<T[]>
          )
      );
    };
  };

  /** Callback handler for when the user clicks on the remove button on an existing array element. Removes the row of
   * keyed form data at the `index` in the state, and then returning `onChange()` with the plain form data converted
   * from the keyed data
   *
   * @param index - The index at which the remove button is clicked
   */
  onDropIndexClick = (index: number) => {
    return (event: MouseEvent) => {
      if (event) {
        event.preventDefault();
      }
      const { errorSchema, onChange } = this.props;
      const { keyedFormData } = this.state;
      // refs #195: revalidate to ensure properly reindexing errors
      let newErrorSchema: ErrorSchema<T>;
      if (errorSchema) {
        newErrorSchema = {};
        Object.keys(errorSchema).forEach((_, idx) => {
          if (idx < index) {
            set(newErrorSchema, [idx], errorSchema[idx]);
          } else if (idx > index) {
            set(newErrorSchema, [idx - 1], errorSchema[idx]);
          }
        });
      }
      const newKeyedFormData = keyedFormData.filter((_, i) => i !== index);
      this.setState(
        {
          keyedFormData: newKeyedFormData,
          updatedKeyedFormData: true,
        },
        () =>
          onChange(
            keyedToPlainFormData(newKeyedFormData),
            newErrorSchema as ErrorSchema<T[]>
          )
      );
    };
  };

  /** Callback handler for when the user clicks on one of the move item buttons on an existing array element. Moves the
   * row of keyed form data at the `index` to the `newIndex` in the state, and then returning `onChange()` with the
   * plain form data converted from the keyed data
   *
   * @param index - The index of the item to move
   * @param newIndex - The index to where the item is to be moved
   */
  onReorderClick = (index: number, newIndex: number) => {
    return (event: React.MouseEvent<HTMLButtonElement>) => {
      if (event) {
        event.preventDefault();
        event.currentTarget.blur();
      }
      const { errorSchema, onChange } = this.props;
      let newErrorSchema: ErrorSchema<T>;
      if (errorSchema) {
        newErrorSchema = {};
        Object.keys(errorSchema).forEach((_, idx) => {
          if (idx === index) {
            set(newErrorSchema, [newIndex], errorSchema[index]);
          } else if (idx === newIndex) {
            set(newErrorSchema, [index], errorSchema[newIndex]);
          } else {
            set(newErrorSchema, [idx], errorSchema[idx]);
          }
        });
      }

      const { keyedFormData } = this.state;
      function reOrderArray() {
        // Copy item
        const newKeyedFormData = keyedFormData.slice();

        // Moves item from index to newIndex
        newKeyedFormData.splice(index, 1);
        newKeyedFormData.splice(newIndex, 0, keyedFormData[index]);

        return newKeyedFormData;
      }
      const newKeyedFormData = reOrderArray();
      this.setState(
        {
          keyedFormData: newKeyedFormData,
        },
        () =>
          onChange(
            keyedToPlainFormData(newKeyedFormData),
            newErrorSchema as ErrorSchema<T[]>
          )
      );
    };
  };

  /** Callback handler used to change the value for a checkbox */
  onSelectChange = (value: any) => {
    const { idSchema, onChange } = this.props;
    onChange(value, undefined, idSchema && idSchema.$id);
  };

  /** Renders the `ArrayField` depending on the specific needs of the schema and uischema elements
   */
  render() {
    const { idSchema, registry, schema, uiSchema } = this.props;
    const { schemaUtils, translateString } = registry;
    if (!(ITEMS_KEY in schema)) {
      const uiOptions = getUiOptions<T[], S, F>(uiSchema);
      const UnsupportedFieldTemplate = getTemplate<
        "UnsupportedFieldTemplate",
        T[],
        S,
        F
      >("UnsupportedFieldTemplate", registry, uiOptions);

      return (
        <UnsupportedFieldTemplate
          idSchema={idSchema}
          reason={translateString(TranslatableString.MissingItems)}
          registry={registry}
          schema={schema}
        />
      );
    }
    if (schemaUtils.isMultiSelect(schema)) {
      // If array has enum or uniqueItems set to true, call renderMultiSelect() to render the default multiselect widget or a custom widget, if specified.
      return this.renderMultiSelect();
    }
    if (isCustomWidget<T[], S, F>(uiSchema)) {
      return this.renderCustomWidget();
    }
    if (isFixedItems(schema)) {
      return this.renderFixedArray();
    }
    if (schemaUtils.isFilesArray(schema, uiSchema)) {
      return this.renderFiles();
    }
    return this.renderNormalArray();
  }

  /** Renders the individual array item using a `SchemaField` along with the additional properties required to be send
   * back to the `ArrayFieldItemTemplate`.
   *
   * @param props - The props for the individual array item to be rendered
   */
  renderArrayFieldItem(props: {
    autofocus?: boolean;
    canAdd: boolean;
    canMoveDown: boolean;
    canMoveUp: boolean;
    canRemove?: boolean;
    index: number;
    itemData: T[];
    itemErrorSchema?: ErrorSchema<T[]>;
    itemIdSchema: IdSchema<T[]>;
    itemSchema: S;
    itemUiSchema: UiSchema<T[], S, F>;
    key: string;
    name: string;
    onBlur: FieldProps<T[], S, F>["onBlur"];
    onFocus: FieldProps<T[], S, F>["onFocus"];
    rawErrors?: string[];
    title: string | undefined;
    totalItems: number;
  }) {
    const {
      autofocus,
      canAdd,
      canMoveDown,
      canMoveUp,
      canRemove = true,
      index,
      itemData,
      itemErrorSchema,
      itemIdSchema,
      itemSchema,
      itemUiSchema,
      key,
      name,
      onBlur,
      onFocus,
      rawErrors,
      title,
      totalItems,
    } = props;
    const {
      disabled,
      formContext,
      hideError,
      idPrefix,
      idSeparator,
      readonly,
      registry,
      uiSchema,
    } = this.props;
    const {
      fields: { ArraySchemaField, SchemaField },
      globalUiOptions,
    } = registry;
    const ItemSchemaField = ArraySchemaField || SchemaField;
    const {
      copyable = false,
      orderable = true,
      removable = true,
    } = getUiOptions<T[], S, F>(uiSchema, globalUiOptions);
    const has: { [key: string]: boolean } = {
      copy: copyable && canAdd,
      moveDown: orderable && canMoveDown,
      moveUp: orderable && canMoveUp,
      remove: removable && canRemove,
      toolbar: false,
    };
    has.toolbar = Object.keys(has).some((k: keyof typeof has) => has[k]);

    return {
      canAdd,
      children: (
        <ItemSchemaField
          autofocus={autofocus}
          disabled={disabled}
          errorSchema={itemErrorSchema}
          formContext={formContext}
          formData={itemData}
          hideError={hideError}
          idPrefix={idPrefix}
          idSchema={itemIdSchema}
          idSeparator={idSeparator}
          index={index}
          name={name}
          rawErrors={rawErrors}
          readonly={readonly}
          registry={registry}
          required={this.isItemRequired(itemSchema)}
          schema={itemSchema}
          title={title}
          uiSchema={itemUiSchema}
          onBlur={onBlur}
          onChange={this.onChangeForIndex(index)}
          onFocus={onFocus}
        />
      ),
      className: "array-item",
      disabled,
      hasCopy: has.copy,
      hasMoveDown: has.moveDown,
      hasMoveUp: has.moveUp,
      hasRemove: has.remove,
      hasToolbar: has.toolbar,
      index,
      key,
      onAddIndexClick: this.onAddIndexClick,
      onCopyIndexClick: this.onCopyIndexClick,
      onDropIndexClick: this.onDropIndexClick,
      onReorderClick: this.onReorderClick,
      readonly,
      registry,
      schema: itemSchema,
      totalItems,
      uiSchema: itemUiSchema,
    };
  }

  /** Renders an array using the custom widget provided by the user in the `uiSchema`
   */
  renderCustomWidget() {
    const {
      autofocus = false,
      disabled = false,
      formData: items = [],
      hideError,
      idSchema,
      name,
      onBlur,
      onFocus,
      placeholder,
      rawErrors,
      readonly = false,
      registry,
      required = false,
      schema,
      uiSchema,
    } = this.props;
    const { formContext, globalUiOptions, schemaUtils, widgets } = registry;
    const {
      title: uiTitle,
      widget,
      ...options
    } = getUiOptions<T[], S, F>(uiSchema, globalUiOptions);
    const Widget = getWidget<T[], S, F>(schema, widget, widgets);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(
      schema,
      uiSchema,
      globalUiOptions
    );
    return (
      <Widget
        id={idSchema.$id}
        autofocus={autofocus}
        disabled={disabled}
        formContext={formContext}
        hideError={hideError}
        hideLabel={!displayLabel}
        label={label}
        multiple
        name={name}
        options={options}
        placeholder={placeholder}
        rawErrors={rawErrors}
        readonly={readonly}
        registry={registry}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        value={items}
        onBlur={onBlur}
        onChange={this.onSelectChange}
        onFocus={onFocus}
      />
    );
  }

  /** Renders an array of files using the `FileWidget`
   */
  renderFiles() {
    const {
      autofocus = false,
      disabled = false,
      formData: items = [],
      idSchema,
      name,
      onBlur,
      onFocus,
      rawErrors,
      readonly = false,
      registry,
      required = false,
      schema,
      uiSchema,
    } = this.props;
    const { formContext, globalUiOptions, schemaUtils, widgets } = registry;
    const {
      title: uiTitle,
      widget = "files",
      ...options
    } = getUiOptions<T[], S, F>(uiSchema, globalUiOptions);
    const Widget = getWidget<T[], S, F>(schema, widget, widgets);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(
      schema,
      uiSchema,
      globalUiOptions
    );
    return (
      <Widget
        id={idSchema.$id}
        autofocus={autofocus}
        disabled={disabled}
        formContext={formContext}
        hideLabel={!displayLabel}
        label={label}
        multiple
        name={name}
        options={options}
        rawErrors={rawErrors}
        readonly={readonly}
        registry={registry}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        value={items}
        onBlur={onBlur}
        onChange={this.onSelectChange}
        onFocus={onFocus}
      />
    );
  }

  /** Renders an array that has a maximum limit of items
   */
  renderFixedArray() {
    const {
      autofocus = false,
      disabled = false,
      errorSchema,
      formData = [],
      idPrefix,
      idSchema,
      idSeparator = "_",
      name,
      onBlur,
      onFocus,
      rawErrors,
      readonly = false,
      registry,
      required = false,
      schema,
      title,
      uiSchema = {},
    } = this.props;
    const { keyedFormData } = this.state;
    let { formData: items = [] } = this.props;
    const fieldTitle = schema.title || title || name;
    const uiOptions = getUiOptions<T[], S, F>(uiSchema);
    const { formContext, schemaUtils } = registry;
    const schemaItems: S[] = isObject(schema.items)
      ? (schema.items as S[])
      : ([] as S[]);
    const itemSchemas = schemaItems.map((item: S, index: number) =>
      schemaUtils.retrieveSchema(item, formData[index] as unknown as T[])
    );
    const additionalSchema = isObject(schema.additionalItems)
      ? schemaUtils.retrieveSchema(schema.additionalItems as S, formData)
      : null;

    if (!items || items.length < itemSchemas.length) {
      // to make sure at least all fixed items are generated
      items = items || [];
      items = items.concat(new Array(itemSchemas.length - items.length));
    }

    // These are the props passed into the render function
    const canAdd = this.canAddItem(items) && !!additionalSchema;
    const arrayProps: ArrayFieldTemplateProps<T[], S, F> = {
      canAdd,
      className: "field field-array field-array-fixed-items",
      disabled,
      errorSchema,
      formContext,
      formData,
      idSchema,
      items: keyedFormData.map((keyedItem, index) => {
        const { item, key } = keyedItem;
        // While we are actually dealing with a single item of type T, the types require a T[], so cast
        const itemCast = item as unknown as T[];
        const additional = index >= itemSchemas.length;
        const itemSchema =
          (additional && isObject(schema.additionalItems)
            ? schemaUtils.retrieveSchema(schema.additionalItems as S, itemCast)
            : itemSchemas[index]) || {};
        const itemIdPrefix = idSchema.$id + idSeparator + index;
        const itemIdSchema = schemaUtils.toIdSchema(
          itemSchema,
          itemIdPrefix,
          itemCast,
          idPrefix,
          idSeparator
        );
        const itemUiSchema = additional
          ? uiSchema.additionalItems || {}
          : Array.isArray(uiSchema.items)
            ? uiSchema.items[index]
            : uiSchema.items || {};
        const itemErrorSchema = errorSchema
          ? (errorSchema[index] as ErrorSchema<T[]>)
          : undefined;

        return this.renderArrayFieldItem({
          autofocus: autofocus && index === 0,
          canAdd,
          canMoveDown: additional && index < items.length - 1,
          canMoveUp: index >= itemSchemas.length + 1,
          canRemove: additional,
          index,
          itemData: itemCast,
          itemErrorSchema,
          itemIdSchema,
          itemSchema,
          itemUiSchema,
          key,
          name: name && `${name}-${index}`,
          onBlur,
          onFocus,
          rawErrors,
          title: fieldTitle ? `${fieldTitle}-${index + 1}` : undefined,
          totalItems: keyedFormData.length,
        });
      }),
      onAddClick: this.onAddClick,
      rawErrors,
      readonly,
      registry,
      required,
      schema,
      title: fieldTitle,
      uiSchema,
    };

    const Template = getTemplate<"ArrayFieldTemplate", T[], S, F>(
      "ArrayFieldTemplate",
      registry,
      uiOptions
    );
    return <Template {...arrayProps} />;
  }

  /** Renders an array as a set of checkboxes
   */
  renderMultiSelect() {
    const {
      autofocus = false,
      disabled = false,
      formData: items = [],
      idSchema,
      name,
      onBlur,
      onFocus,
      placeholder,
      rawErrors,
      readonly = false,
      registry,
      required = false,
      schema,
      uiSchema,
    } = this.props;
    const { formContext, globalUiOptions, schemaUtils, widgets } = registry;
    const itemsSchema = schemaUtils.retrieveSchema(schema.items as S, items);
    const enumOptions = optionsList(itemsSchema);
    const {
      title: uiTitle,
      widget = "select",
      ...options
    } = getUiOptions<T[], S, F>(uiSchema, globalUiOptions);
    const Widget = getWidget<T[], S, F>(schema, widget, widgets);
    const label = uiTitle ?? schema.title ?? name;
    const displayLabel = schemaUtils.getDisplayLabel(
      schema,
      uiSchema,
      globalUiOptions
    );
    return (
      <Widget
        id={idSchema.$id}
        autofocus={autofocus}
        disabled={disabled}
        formContext={formContext}
        hideLabel={!displayLabel}
        label={label}
        multiple
        name={name}
        options={{ ...options, enumOptions }}
        placeholder={placeholder}
        rawErrors={rawErrors}
        readonly={readonly}
        registry={registry}
        required={required}
        schema={schema}
        uiSchema={uiSchema}
        value={items}
        onBlur={onBlur}
        onChange={this.onSelectChange}
        onFocus={onFocus}
      />
    );
  }

  /** Renders a normal array without any limitations of length
   */
  renderNormalArray() {
    const {
      autofocus = false,
      disabled = false,
      errorSchema,
      formData: rawFormData,
      idPrefix,
      idSchema,
      idSeparator = "_",
      name,
      onBlur,
      onChange,
      onFocus,
      rawErrors,
      readonly = false,
      registry,
      required = false,
      schema,
      title: titleProp,
      uiSchema = {},
    } = this.props;

    const { keyedFormData } = this.state;
    const fieldTitle = schema.title || titleProp || name;
    const { formContext, schemaUtils } = registry;
    const uiOptions = getUiOptions<T[], S, F>(uiSchema);
    const schemaItems: S = isObject(schema.items)
      ? (schema.items as S)
      : ({} as S);
    const itemsSchema: S = schemaUtils.retrieveSchema(schemaItems);
    const formData = keyedToPlainFormData(keyedFormData);
    const canAdd = this.canAddItem(formData);
    const arrayProps: ArrayFieldTemplateProps<T[], S, F> = {
      canAdd,
      className: `field field-array field-array-of-${itemsSchema.type}`,
      disabled,
      formContext,
      formData: rawFormData,
      idSchema,
      items: keyedFormData.map((keyedItem, index) => {
        const { item, key } = keyedItem;
        // While we are actually dealing with a single item of type T, the types require a T[], so cast
        const itemCast = item as unknown as T[];
        const itemSchema = schemaUtils.retrieveSchema(schemaItems, itemCast);
        const itemErrorSchema = errorSchema
          ? (errorSchema[index] as ErrorSchema<T[]>)
          : undefined;
        const itemIdPrefix = idSchema.$id + idSeparator + index;
        const itemIdSchema = schemaUtils.toIdSchema(
          itemSchema,
          itemIdPrefix,
          itemCast,
          idPrefix,
          idSeparator
        );
        return this.renderArrayFieldItem({
          autofocus: autofocus && index === 0,
          canAdd,
          canMoveDown: index < formData.length - 1,
          canMoveUp: index > 0,
          index,
          itemData: itemCast,
          itemErrorSchema,
          itemIdSchema,
          itemSchema,
          itemUiSchema: uiSchema.items,
          key,
          name: name && `${name}-${index}`,
          onBlur,
          onFocus,
          rawErrors,
          title: fieldTitle ? `${fieldTitle}-${index + 1}` : undefined,
          totalItems: keyedFormData.length,
        });
      }),
      onAddClick: this.onAddClick,
      rawErrors,
      readonly,
      registry,
      required,
      schema,
      title: fieldTitle,
      uiSchema,
    };

    const Template = getTemplate<"ArrayFieldTemplate", T[], S, F>(
      "ArrayFieldTemplate",
      registry,
      uiOptions
    );
    return (
      <Flex direction="column">
        <Template {...arrayProps} />
        {!readonly &&
          (isNullFormData(rawFormData) ? (
            <Button
              fontSize="12px"
              leftIcon={<CustomIcon boxSize={3} name="plus" />}
              variant="outline-primary"
              onClick={() => onChange([])}
            >
              Create an empty array
            </Button>
          ) : (
            <Button
              alignSelf="start"
              height="fit-content"
              py={0}
              size="sm"
              variant="outline"
              onClick={() => onChange(null as any)}
            >
              <Flex alignItems="center" gap={1} h="fit-content">
                <CustomIcon boxSize={3} color="error.main" name="delete" />
                <Text color="error.main">Delete array</Text>
              </Flex>
            </Button>
          ))}
      </Flex>
    );
  }
}

/** `ArrayField` is `React.ComponentType<FieldProps<T[], F>>` (necessarily) but the `registry` requires things to be a
 * `Field` which is defined as `React.ComponentType<FieldProps<T, F>>`, so cast it to make `registry` happy.
 */
export default ArrayField as unknown as Field;
