import { chakra, Flex } from "@chakra-ui/react";

import { AbiForm } from "lib/components/abi";
import type { AbiFormData, ExposedFunction, Option } from "lib/types";

const MessageContainer = chakra(Flex, {
  baseStyle: {
    bg: "gray.900",
    borderRadius: "8px",
    color: "gray.400",
    fontSize: "14px",
    justifyContent: "center",
    p: "24px 8px",
    w: "full",
  },
});

interface ScriptInputProps {
  fn: Option<ExposedFunction>;
  initialData: AbiFormData;
  propsOnChange?: (data: AbiFormData) => void;
  propsOnErrors?: (errors: [string, string][]) => void;
}

export const ScriptInput = ({
  fn,
  initialData,
  propsOnChange,
  propsOnErrors,
}: ScriptInputProps) => {
  if (!fn)
    return (
      <MessageContainer>
        Your script input will display here after uploading .mv file.
      </MessageContainer>
    );

  return fn.generic_type_params.length || fn.params.length ? (
    <AbiForm
      fn={fn}
      initialData={initialData}
      propsOnChange={propsOnChange}
      propsOnErrors={propsOnErrors}
    />
  ) : (
    <MessageContainer>
      Your uploaded script file does not require any input.
    </MessageContainer>
  );
};
