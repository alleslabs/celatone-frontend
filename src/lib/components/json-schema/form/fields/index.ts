import BooleanField from "./BooleanField";
import MultiSchemaField from "./MultiSchemaField";
import NullField from "./NullField";

export const Fields = {
  BooleanField,
  OneOfField: MultiSchemaField,
  AnyOfField: MultiSchemaField,
  NullField,
};
