import ArrayField from "./ArrayField";
import BooleanField from "./BooleanField";
import MultiSchemaField from "./MultiSchemaField";
import NullField from "./NullField";

export const Fields = {
  ArrayField,
  BooleanField,
  OneOfField: MultiSchemaField,
  AnyOfField: MultiSchemaField,
  NullField,
};
