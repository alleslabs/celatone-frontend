import { Input } from "@chakra-ui/react";
import { useState } from "react";

import type { ArgFieldWidgetProps } from "./types";

export const UintNumberInput = ({ onChange, value }: ArgFieldWidgetProps) => {
  const [fieldValue, setFieldValue] = useState(String(value));

  return (
    <Input
      placeholder={" "}
      size="md"
      value={fieldValue}
      onChange={(e) => {
        setFieldValue(e.target.value);
        onChange(Number(e.target.value));
      }}
    />
  );
};
