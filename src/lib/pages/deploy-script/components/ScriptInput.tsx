import type { AbiFormData, ExposedFunction, Option } from "lib/types";

import { chakra, Flex } from "@chakra-ui/react";
import { AbiForm } from "lib/components/move-abi";

const MessageContainer = chakra(Flex, {
  baseStyle: {
    w: "full",
    bg: "gray.900",
    p: "24px 8px",
    borderRadius: "8px",
    fontSize: "14px",
    color: "gray.400",
    justifyContent: "center",
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
